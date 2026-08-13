import { startTracking, stopTracking } from "../DeliveryPartnerTracker";
import { useEffect } from "react";

export default function DeliveryPartnerControls({ orderId }) {
  useEffect(() => {
    return () => stopTracking(); // cleanup on unmount
  }, []);

  return (
    <div>
      <button onClick={() => startTracking(orderId)}>
        Start sharing my location
      </button>
      <button onClick={() => stopTracking()}>
        Stop sharing
      </button>
    </div>
  );
}