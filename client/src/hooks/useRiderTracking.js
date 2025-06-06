import { useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import { USER_STATUS } from "../utils/constant";

export const useRiderTrackingMap = () => {
  const mapRef = useRef(null);
  const map = useRef(null);
  const markersRef = useRef({});
  const TOMTOM_API_KEY = import.meta.env.VITE_APP_TOMTOM_API_KEY;

  const deliveryBoys = useSelector(
    (state) => state.location.deliveryBoyLocations || []
  );

  const onlineDeliveryBoys = useMemo(
    () => deliveryBoys.filter((emp) => emp.status === USER_STATUS.ONLINE),
    [deliveryBoys]
  );

  useEffect(() => {
    if (!map.current && mapRef.current) {
      const location = onlineDeliveryBoys?.[0]?.location || {
        latitude: 50.95042,
        longitude: 6.933551,
      };

      map.current = tt.map({
        key: TOMTOM_API_KEY,
        container: mapRef.current,
        center: [location.longitude, location.latitude],
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
    if (!map.current || !Array.isArray(deliveryBoys)) return;

    deliveryBoys.forEach((boy) => {
      const { _id, name, location } = boy;
      const lat = location?.latitude || 0;
      const lng = location?.longitude || 0;

      if (markersRef.current[_id]) {
        markersRef.current[_id].setLngLat([lng, lat]);
      } else {
        const marker = new tt.Marker().setLngLat([lng, lat]).addTo(map.current);
        const popup = new tt.Popup({ offset: 35 }).setText(name);
        marker.setPopup(popup);
        markersRef.current[_id] = marker;
      }
    });

    // Remove markers of offline users
    const currentIds = deliveryBoys.map((b) => b._id);
    Object.keys(markersRef.current).forEach((id) => {
      if (!currentIds.includes(id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });
  }, [deliveryBoys]);

  return {
    mapRef,
    deliveryBoys,
    onlineDeliveryBoys,
  };
};
