import { startTracking, stopTracking } from "../DeliveryPartnerTracker";
import { useEffect } from "react";

export default function DeliveryPartnerControls({ orderId }) {
  useEffect(() => {
    return () => stopTracking(); // cleanup on unmount
  }, []);

  return (
    <div>
      <button className="btn btn-primary" onClick={() => startTracking(orderId)}>
        Start sharing my location
      </button>
      <button  className="btn btn-primary" onClick={() => stopTracking()}>
        Stop sharing
      </button>
    </div>
  );
}