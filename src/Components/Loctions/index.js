import { useState, useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet default marker icon (broken in webpack/vite builds)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ─── Types ────────────────────────────────────────────────────────────────────
// LocationData: { lat: number, lng: number, address: string }

// ─── Reverse geocode via OpenStreetMap Nominatim (free, no API key) ───────────
async function reverseGeocode(lat, lng) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
  );
  const data = await res.json();
  return data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

// ─── Inner map click handler (must live inside MapContainer) ─────────────────
function MapClickHandler({ onMapClick }) {
  useMapEvents({ click: (e) => onMapClick(e.latlng.lat, e.latlng.lng) });
  return null;
}

// ─── Status indicator dot ─────────────────────────────────────────────────────
function StatusDot({ type }) {
  const colors = { idle: "#bbb", ok: "#1D9E75", error: "#E24B4A", loading: "#378ADD" };
  return (
    <span style={{
      display: "inline-block",
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: colors[type] || colors.idle,
      flexShrink: 0,
      animation: type === "loading" ? "locpulse 1s infinite" : "none",
    }} />
  );
}

// ─── GPS Icon ─────────────────────────────────────────────────────────────────
function GpsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="3"/>
      <line x1="8" y1="1" x2="8" y2="4"/>
      <line x1="8" y1="12" x2="8" y2="15"/>
      <line x1="1" y1="8" x2="4" y2="8"/>
      <line x1="12" y1="8" x2="15" y2="8"/>
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LocationPicker({
  defaultCenter = { lat: 28.6139, lng: 77.209 }, // New Delhi
  mapHeight = 280,
  onLocationChange,
  placeholder = "Allow location or click on map…",
  setLocation
}) {
  const [position, setPosition] = useState(null);       // { lat, lng }
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState({ type: "idle", msg: "Waiting for location…" });
  const [gpsLoading, setGpsLoading] = useState(false);
  const mapRef = useRef(null);

  // Pulse keyframe injected once
  useEffect(() => {
    const id = "loc-pulse-style";
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id;
      s.textContent = "@keyframes locpulse{0%,100%{opacity:1}50%{opacity:0.3}}";
      document.head.appendChild(s);
    }
  }, []);

  const applyLocation = useCallback(async (lat, lng, source) => {
    setPosition({ lat, lng });
    setStatus({ type: "loading", msg: "Fetching address…" });

    // Pan map to new position
    if (mapRef.current) mapRef.current.setView([lat, lng], 14);

    try {
      const addr = await reverseGeocode(lat, lng);
      setAddress(addr);
      setStatus({
        type: "ok",
        msg: source === "gps" ? "Location detected via GPS" : "Location selected from map",
      });
      onLocationChange?.({ lat, lng, address: addr });
    } catch {
      const fallback = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      setAddress(fallback);
      setStatus({ type: "error", msg: "Could not fetch address name" });
      onLocationChange?.({ lat, lng, address: fallback });
    }
  }, [onLocationChange]);

  function handleGPS() {
    if (!navigator.geolocation) {
      setStatus({ type: "error", msg: "Geolocation not supported in this browser" });
      return;
    }
    setGpsLoading(true);
    setStatus({ type: "loading", msg: "Requesting GPS permission…" });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        applyLocation(pos.coords.latitude, pos.coords.longitude, "gps");
      },
      (err) => {
        setGpsLoading(false);
        const msgs = [
          "",
          "Permission denied — please allow location access",
          "Position unavailable",
          "Location request timed out",
        ];
        setStatus({ type: "error", msg: msgs[err.code] || "Location error" });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }

  function handleMapClick(lat, lng) {
    applyLocation(lat, lng, "map");
  }

  setLocation(address)

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 815 }}>
      <div style={{
        background: "#fff",
        border: "0.5px solid #e0e0e0",
        borderRadius: 12,
        overflow: "hidden",
      }}>

        {/* ── Top controls ── */}
        <div style={{ padding: 16 }}>
          <div style={{
            fontSize: 12,
            fontWeight: 500,
            color: "#888",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}>
            Delivery address
          </div>

          {/* Address input + GPS button */}
          <div style={{ display: "flex", gap: 8 }}>
            <input
              readOnly
              value={address}
              placeholder={placeholder}
              onClick={()=> {navigator.clipboard.writeText(address);
                alert("Copied!");
              }}
              style={{
                flex: 1,
                padding: "10px 12px",
                fontSize: 14,
                borderRadius: 8,
                border: "0.5px solid #ddd",
                background: "#f8f8f8",
                color: "#111",
                outline: "none",
                cursor: "default",
              }}
            />
            <button
              onClick={handleGPS}
              disabled={gpsLoading}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 14px",
                borderRadius: 8,
                border: "0.5px solid #ddd",
                background: "#fff",
                color: "#111",
                fontSize: 13,
                fontWeight: 500,
                cursor: gpsLoading ? "wait" : "pointer",
                opacity: gpsLoading ? 0.6 : 1,
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "background 0.15s",
              }}
              onMouseEnter={e => { if (!gpsLoading) e.currentTarget.style.background = "#f5f5f5"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}
            >
              <GpsIcon />
              {gpsLoading ? "Detecting…" : "Use my location"}
            </button>
          </div>

          {/* Lat / Lng display */}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {["Lat", "Lng"].map((label, i) => (
              <div key={label} style={{
                flex: 1,
                padding: "7px 10px",
                borderRadius: 6,
                border: "0.5px solid #e8e8e8",
                background: "#f8f8f8",
                fontSize: 12,
                color: "#888",
              }}>
                {label}{" "}
                <span style={{ fontWeight: 500, color: "#111", fontSize: 13 }}>
                  {position ? (i === 0 ? position.lat : position.lng).toFixed(5) : "—"}
                </span>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 12, color: "#aaa", marginTop: 8 }}>
            Or click anywhere on the map to pick a location
          </div>
        </div>

        {/* ── Map ── */}
        <div style={{ height: mapHeight, borderTop: "0.5px solid #e0e0e0" }}>
          <MapContainer
            center={[defaultCenter.lat, defaultCenter.lng]}
            zoom={12}
            style={{ width: "100%", height: "100%" }}
            ref={mapRef}
            zoomControl
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler onMapClick={handleMapClick} />
            {position && <Marker position={[position.lat, position.lng]} />}
          </MapContainer>
        </div>

        {/* ── Status bar ── */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 16px",
          background: "#f8f8f8",
          borderTop: "0.5px solid #e0e0e0",
          fontSize: 12,
          color: "#888",
          minHeight: 34,
        }}>
          <StatusDot type={status.type} />
          <span>{status.msg}</span>
        </div>
      </div>
    </div>
  );
}