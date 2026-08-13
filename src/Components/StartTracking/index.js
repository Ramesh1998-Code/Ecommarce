// deliveryPartnerTracker.js
import { ref, set } from "firebase/database";
import { db } from "../../Firebase/firebase";

export function startTracking(orderId) {
  if (!navigator.geolocation) return;

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude, heading } = position.coords;
      set(ref(db, `deliveryPartners/${orderId}`), {
        lat: latitude,
        lng: longitude,
        heading: heading || 0,
        updatedAt: Date.now(),
      });
    },
    (err) => console.error("GPS error:", err),
    { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
  );

  return watchId;
}