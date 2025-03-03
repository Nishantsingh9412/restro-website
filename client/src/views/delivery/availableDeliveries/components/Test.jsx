import React from "react";
import DeliveryBoyNavigationTomTom from "./DeliveryMap";
import { Heading } from "@chakra-ui/react";
const TestNavigation = () => {
  const [currentLocation, setCurrentLocation] = React.useState({
    lat: 50.9375 + (Math.random() - 0.5) * 0.001,
    lng: 6.9603 + (Math.random() - 0.5) * 0.001,
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLocation({
        lat: 50.9375 + (Math.random() - 0.5) * 0.01,
        lng: 6.9603 + (Math.random() - 0.5) * 0.01,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  const pickupLocation = { lat: 50.9475, lng: 6.9503 }; // Nearby pickup point
  const dropPoints = [
    { lat: 50.9575, lng: 6.9403, orderId: "#1234" }, // Drop point 1
    { lat: 50.9675, lng: 6.9303, orderId: "#4333" }, // Drop point 2
    { lat: 50.9775, lng: 6.9203, orderId: "#434" }, // Drop point 3
  ];

  return (
    <div>
      <Heading mt={14} mb={3} fontSize={24}>
        Current Orders
      </Heading>
      <DeliveryBoyNavigationTomTom
        currentLocation={currentLocation}
        pickupLocation={pickupLocation}
        dropPoints={dropPoints}
      />
    </div>
  );
};

export default TestNavigation;
