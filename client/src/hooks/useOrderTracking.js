import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { USER_STATUS } from "../utils/constant";
import { getAllOrderDropPoints } from "../api";

export const useOrderTracking = () => {
  const [selectedBoyId, setSelectedBoyId] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropPoints, setDropPoints] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);

  const deliveryBoys = useSelector(
    (state) => state.location.deliveryBoyLocations || []
  );
  const notifications = useSelector(
    (state) => state.notificationReducer.notifications
  );

  const onlineDeliveryBoys = useMemo(
    () => deliveryBoys.filter((emp) => emp.status === USER_STATUS.ONLINE),
    [deliveryBoys]
  );

  const selectedDeliveryBoy = useMemo(
    () => onlineDeliveryBoys.find((boy) => boy._id === selectedBoyId),
    [selectedBoyId, onlineDeliveryBoys]
  );

  const currentLocation = useMemo(() => {
    const loc = selectedDeliveryBoy?.location;
    return loc?.latitude && loc?.longitude
      ? { lat: loc.latitude, lng: loc.longitude }
      : null;
  }, [selectedDeliveryBoy]);

  useEffect(() => {
    const fetchOrdersAndLocation = async () => {
      if (!selectedBoyId) {
        setDropPoints([]);
        setOrderDetails([]);
        return;
      }

      try {
        const res = await getAllOrderDropPoints(selectedBoyId);
        if (res.status === 200 && Array.isArray(res.data?.result)) {
          const drops = [];
          const details = [];

          for (const order of res.data.result) {
            const { orderId, customerName, deliveryAddress, deliveryLocation } =
              order;

            if (
              deliveryLocation &&
              typeof deliveryLocation.lat === "number" &&
              typeof deliveryLocation.lng === "number"
            ) {
              drops.push({
                orderId,
                lat: deliveryLocation.lat,
                lng: deliveryLocation.lng,
              });

              details.push({
                orderId,
                customer: customerName,
                address: deliveryAddress,
                lat: deliveryLocation.lat,
                lng: deliveryLocation.lng,
              });
            }
          }

          setDropPoints(drops);
          setOrderDetails(details);
        } else {
          setDropPoints([]);
          setOrderDetails([]);
        }
      } catch (error) {
        console.error("Failed to fetch orders or location", error);
        setDropPoints([]);
        setOrderDetails([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndLocation();
  }, [selectedBoyId, notifications]);

  return {
    loading,
    dropPoints,
    orderDetails,
    currentLocation,
    selectedBoyId,
    setSelectedBoyId,
    onlineDeliveryBoys,
  };
};
