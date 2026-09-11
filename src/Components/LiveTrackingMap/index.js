// LiveTrackingMap.jsx
import { useEffect, useState, useRef } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { ref, onValue } from "firebase/database";
import { db } from "../../Firebase/firebase";
import { toast } from 'react-toastify';
const containerStyle = { width: "100%", height: "500px" };

export default function LiveTrackingMap({ orderId, destination }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyA71lvLQ-op2tgBVdF5Al3f_V8ASGS_n1k",
  });

  const [displayPos, setDisplayPos] = useState(null);
  const displayPosRef = useRef(null);
  const targetPos = useRef(null);
  const animFrame = useRef(null);
  const hasNotified = useRef(false); 
  const [eta,setEta] = useState(null);
  useEffect(() => {
  
    const partnerRef = ref(db, `deliveryPartners/${orderId}`);
    const unsubscribe = onValue(
      partnerRef,
      (snapshot) => {
        
        const data = snapshot.val();
      
        if (!data) return;

        const newPos = { lat: data.lat, lng: data.lng };

        if (!displayPosRef.current) { 
          setDisplayPos(newPos);
          displayPosRef.current = newPos;
          targetPos.current = newPos;
        } else {
          targetPos.current = newPos;
          animateMarker();
        }
          debugger
          if (typeof data.progress === "number") {
          const remaining = Math.round((1 - data.progress) * (data.totalDurationSec || 60));
           console.log("ETA calc:", { progress: data.progress, remaining })
          setEta(remaining);
        }

         if (data.status === "delivered" && !hasNotified.current) {
        hasNotified.current = true;
         toast("Product delivered 🎉", { theme: "dark" });
        showDeliveredNotification();
      }
      },
      (error) => {
        console.error("Firebase listener error:", error);
      }
    );

    return () => unsubscribe();
  }, [orderId]);

   

  const showDeliveredNotification = () => {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Order Delivered! 🎉", {
      body: "Your delivery partner has arrived at your location.",
      icon: "https://tse2.mm.bing.net/th/id/OIP.2FpDriaF9RsJuVcIURjb2wHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", 
    });
  }
};

  const animateMarker = () => {
    if (animFrame.current) cancelAnimationFrame(animFrame.current);

    const start = { ...displayPosRef.current };
    const end = { ...targetPos.current };
    const duration = 1500;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const lat = start.lat + (end.lat - start.lat) * progress;
      const lng = start.lng + (end.lng - start.lng) * progress;
      const pos = { lat, lng };

      setDisplayPos(pos);
      displayPosRef.current = pos;

      if (progress < 1) {
        animFrame.current = requestAnimationFrame(step);
      }
    };

    animFrame.current = requestAnimationFrame(step);
  };

   const formatEta = (seconds) => {
    if (seconds === null) return "Calculating...";
    if (seconds <= 0) return "Arriving now";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (!isLoaded || !displayPos) return <p>Loading map...</p>;

  return (
    <div className="mb-5">
         <div style={{
        padding: "10px 16px",
        background: "#1e293b",
        color: "white",
        borderRadius: "8px 8px 0 0",
        fontWeight: 600,
        fontSize: "14px",
      }}>
        ETA: {formatEta(eta)}
      </div>
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={displayPos}
      zoom={16}
      options={{ disableDefaultUI: true, zoomControl: true, mapId: "ef62e506f7333e24d5b1578f" }}
    >
   
      <Marker
        position={displayPos}
        icon={{
          url: "https://png.pngtree.com/png-clipart/20250106/original/pngtree-orange-delivery-man-on-motorcycle-png-image_20086589.png",
          scaledSize: new window.google.maps.Size(80, 80),
        }}
      />

    
      {destination && (
        <Marker
          position={destination}
          icon={{
            url: "https://static.vecteezy.com/system/resources/previews/010/147/019/original/house-symbol-home-icon-sign-design-free-png.png",
            scaledSize: new window.google.maps.Size(36, 36),
          }}
        />
      )}
    </GoogleMap>
    </div>
  );
}