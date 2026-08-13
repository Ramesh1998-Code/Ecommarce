// LiveTrackingMap.jsx
import { useEffect, useState, useRef } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { ref, onValue } from "firebase/database";
import { db } from "../../Firebase/firebase";

const containerStyle = { width: "100%", height: "500px" };

export default function LiveTrackingMap({ orderId }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyA71lvLQ-op2tgBVdF5Al3f_V8ASGS_n1k",
  });

  const [displayPos, setDisplayPos] = useState(null);
  const targetPos = useRef(null);
  const animFrame = useRef(null);

  // Listen for location updates from Firebase
  useEffect(() => {
     console.log("Setting up listener for order:", orderId);
    const partnerRef = ref(db, `deliveryPartners/${orderId}`);
    const unsubscribe = onValue(partnerRef, (snapshot) => {
          console.log("Snapshot received:", snapshot.val()); 
      const data = snapshot.val();
      if (!data){
         console.log("No data at this path yet");
         return;
      } 

      const newPos = { lat: data.lat, lng: data.lng };
      console.log("New position:", newPos);
      if (!displayPos) {
        setDisplayPos(newPos);
        targetPos.current = newPos;
      } else {
        targetPos.current = newPos;
        animateMarker();
      }
    },
    (error) => {
        console.error("Firebase listener error:", error); // catches permission errors
        }
  );

    return () => unsubscribe();
  }, [orderId]);

  // Smoothly glide the marker from its current shown position to the new target
  const animateMarker = () => {
    if (animFrame.current) cancelAnimationFrame(animFrame.current);

    const start = { ...displayPos };
    const end = { ...targetPos.current };
    const duration = 1500; // ms — tweak for faster/slower glide
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const lat = start.lat + (end.lat - start.lat) * progress;
      const lng = start.lng + (end.lng - start.lng) * progress;

      setDisplayPos({ lat, lng });

      if (progress < 1) {
        animFrame.current = requestAnimationFrame(step);
      }
    };

    animFrame.current = requestAnimationFrame(step);
  };

  if (!isLoaded || !displayPos) return <p>Loading map...</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={displayPos}
      zoom={16}
      options={{ disableDefaultUI: true, zoomControl: true,  mapId: "ef62e506f7333e24d5b1578f", }}
    >
      <Marker
        position={displayPos}
        icon={{
          url: "https://png.pngtree.com/png-clipart/20250106/original/pngtree-orange-delivery-man-on-motorcycle-png-image_20086589.png", 
          scaledSize: new window.google.maps.Size(80, 80),
        }}
      />
    </GoogleMap>
  );
}