import { ref, set } from "firebase/database";
import { db } from "../../Firebase/firebase";

export const PICKUP = { lat: 30.6950, lng: 76.7450 };


export function startDummyDelivery(orderId,destination, durationMs= 80000) {
    if (!destination || !destination.lat || !destination.lng) {
    console.error("startDummyDelivery: invalid destination", destination);
    return null;
  }

      console.log("startDummyDelivery CALLED with:", orderId, destination);

    const startTime = Date.now();
    const interval = setInterval(()=> {
    console.log("Writing new position...");
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / durationMs, 1);

    const lat = PICKUP.lat + (destination.lat - PICKUP.lat) * progress;
    const lng = PICKUP.lng + (destination.lng - PICKUP.lng) * progress;
         set(ref(db, `deliveryPartners/${orderId}`), {
            lat,
            lng,
            heading: 0,
            updatedAt: Date.now(),
            status: progress >= 1 ? "delivered" : "in_transit",
            progress,
            totalDurationSec: durationMs / 1000, 
            });

            if (progress >= 1) {
            clearInterval(interval);
            }
    },1000);
    return interval;
}