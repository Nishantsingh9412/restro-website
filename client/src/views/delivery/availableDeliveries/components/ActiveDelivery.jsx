import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { BiSolidPhoneCall } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import DeliveryMap from "./DeliveryMap";
import { useEffect, useState } from "react";

export default function ActiveDelivery({
  activeDelivery,
  handleCancel,
  handleUpdateStatus,
}) {
  const [origin, setOrigin] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      const watcher = navigator.geolocation.watchPosition(
        (position) => {
          if (
            origin?.lat === position.coords.latitude &&
            origin?.lng === position.coords.longitude
          )
            return;
          setOrigin({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          console.log(
            "My location: ",
            position.coords.latitude,
            position.coords.longitude
          );
        },
        (error) => {
          console.error("Error getting location", error);
        }
      );

      return () => navigator.geolocation.clearWatch(watcher);
    } else {
      console.error("Geolocation not supported by this browser");
    }
  }, [origin]);

  return (
    <>
      <Heading mt={{ base: 40, md: 20 }} fontSize={20}>
        Active Delivery
      </Heading>
      <Text fontSize={12} my={5} color={"#aaa"}>
        * Complete this delivery to see more available deliveries
      </Text>
      {origin && activeDelivery.deliveryLocation ? (
        <DeliveryMap
          waypoints={
            activeDelivery.currentStatus === "Accepted"
              ? [activeDelivery?.pickupLocation]
              : []
          }
          destination={activeDelivery?.deliveryLocation}
          origin={origin}
          center={origin}
        />
      ) : (
        <Text my={20} mx={"auto"} width={"fit-content"} p={3} bg={"#eee"}>
          Loading...
        </Text>
      )}
      <Flex
        gap={5}
        flexDirection={"column"}
        bg={"#fff"}
        p={5}
        borderRadius={10}
      >
        <Flex gap={10} alignItems={"center"}>
          <Box
            width={"60px"}
            height={"60px"}
            maxW={"100%"}
            borderRadius={"50%"}
            overflow={"hidden"}
          >
            <img
              src={activeDelivery.restaurantImage}
              alt={activeDelivery.restaurantName}
              width={"100%"}
            />
          </Box>
          <Text fontSize={18}>{activeDelivery.restaurantName}</Text>
        </Flex>
        <Text mb={-3}>Customer info:</Text>
        <Flex gap={3} alignItems={"center"} flexWrap={"wrap"}>
          <Text display={"flex"} gap={2} alignItems={"center"}>
            <FaUserCircle /> {activeDelivery.customerName}
          </Text>
          <Text display={"flex"} gap={2} alignItems={"center"}>
            <BiSolidPhoneCall /> {activeDelivery.customerContact}
          </Text>
        </Flex>
        <Flex gap={3} alignItems={"center"} flexWrap={"wrap"}>
          <Text>
            Estimated distance: {(activeDelivery.distance / 1000).toFixed(1)} km
          </Text>
          <Text>
            Estimated Time: {Math.ceil(activeDelivery.estimatedTime / 60)} min
          </Text>
        </Flex>
        <Flex gap={3} alignItems={"center"} flexDirection={"column"}>
          <Text display={"flex"} flexDirection={"column"} alignItems={"center"}>
            Current Status:{" "}
            <Text color={"green.400"}>{activeDelivery.currentStatus}</Text>
          </Text>
          <Text display={"flex"} flexDirection={"column"} w={"100%"}>
            Next stage:
            <Button
              onClick={() =>
                handleUpdateStatus(
                  activeDelivery._id,
                  getNextStatus(activeDelivery.currentStatus)
                )
              }
              w={"100%"}
              borderRadius={"4px"}
              p={3}
              bg={"green.500"}
              color={"#fff"}
              _hover={{ background: "green" }}
            >
              {getNextStatus(activeDelivery.currentStatus)}
            </Button>
          </Text>
        </Flex>
      </Flex>
    </>
  );
}

const getNextStatus = (current) => {
  if (current === "Available") return "Accepted";
  if (current === "Accepted") return "Picked up";
  if (current === "Picked up") return "Completed";
};