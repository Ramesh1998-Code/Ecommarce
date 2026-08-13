// deliveryPartnerTracker.js
import { ref, set } from "firebase/database";
import { db } from "../../Firebase/firebase";

let watchId = null;
let lastUpdate = 0;

export function startTracking(orderId) {
  if (!navigator.geolocation) {
    console.log("Geolocation not supported by this browser");
    return;
  }

  watchId = navigator.geolocation.watchPosition(
    (position) => {
      // Throttle writes to every 3 seconds to avoid spamming Firebase
      const now = Date.now();
      if (now - lastUpdate < 3000) return;
      lastUpdate = now;

      const { latitude, longitude, heading } = position.coords;
      console.log("Pushing location:", latitude, longitude);

      set(ref(db, `deliveryPartners/${orderId}`), {
        lat: latitude,
        lng: longitude,
        heading: heading || 0,
        updatedAt: now,
      });
    },
    (err) => console.error("GPS error:", err),
    { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
  );
}

export function stopTracking() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
}