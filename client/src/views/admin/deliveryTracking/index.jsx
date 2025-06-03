import { useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";

const RiderTrackingMap = () => {
  const mapRef = useRef(null);
  const map = useRef(null);
  const markersRef = useRef({});
  const TOMTOM_API_KEY = import.meta.env.VITE_APP_TOMTOM_API_KEY;

  const deliveryBoys = useSelector(
    (state) => state.location.deliveryBoyLocations || []
  );
  const onlineDeliveryBoys = useMemo(
    () => deliveryBoys.filter((emp) => emp.status === "online"),
    [deliveryBoys]
  );

  console.log(deliveryBoys);

  useEffect(() => {
    if (!map.current && mapRef.current) {
      const location = onlineDeliveryBoys?.[0]?.location || {
        latitude: 50.95042,
        longitude: 6.933551,
      };
      map.current = tt.map({
        key: TOMTOM_API_KEY, // put your key here
        container: mapRef.current,
        center: [location.longitude, location.latitude], // Default location
        zoom: 13,
      });

      map.current.addControl(new tt.NavigationControl());
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        markersRef.current = {};
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !deliveryBoys || !Array.isArray(deliveryBoys)) return;

    deliveryBoys.forEach((boy) => {
      const { _id, name, location } = boy;

      // Update or create marker
      if (markersRef.current[_id]) {
        markersRef.current[_id].setLngLat([
          location?.longitude || 0,
          location?.latitude || 0,
        ]);
      } else {
        const marker = new tt.Marker()
          .setLngLat([location?.longitude, location?.latitude])
          .addTo(map.current);

        const popup = new tt.Popup({ offset: 35 }).setText(name);
        marker.setPopup(popup);

        markersRef.current[_id] = marker;
      }
    });

    // Optionally remove markers of offline users
    const currentIds = deliveryBoys.map((b) => b._id);
    Object.keys(markersRef.current).forEach((id) => {
      if (!currentIds.includes(id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });
  }, [deliveryBoys]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "20px",
      }}
    >
      <h1
        style={{ marginBottom: "10px", fontWeight: "bold", fontSize: "20px" }}
      >
        Delivery Tracking Map
      </h1>
      <div
        ref={mapRef}
        style={{
          width: "95%",
          height: "600px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      />
    </div>
  );
};

export default RiderTrackingMap;
