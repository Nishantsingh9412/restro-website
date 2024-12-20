import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { BiSolidPhoneCall } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import DeliveryMap from "./DeliveryMap";
import { HiExternalLink } from "react-icons/hi";
import { useEffect, useState } from "react";

export default function ActiveDelivery({
  activeDelivery,
  handleUpdateStatus,
  handleCancel,
}) {
  return (
    <>
      <Heading mt={{ base: 40, md: 20 }} fontSize={20}>
        Active Delivery
      </Heading>
      <Text fontSize={12} my={5} color={"#aaa"}>
        * Complete this delivery to see more available deliveries
      </Text>
      {activeDelivery.deliveryLocation ? (
        <DeliveryMap
          origin={activeDelivery?.dropLocation}
          destination={activeDelivery?.deliveryLocation}
          center={activeDelivery?.dropLocation}
        />
      ) : (
        <Text my={20} mx={"auto"} width={"fit-content"} p={3} bg={"#eee"}>
          Loading...
        </Text>
      )}

      <a
        href={`https://www.google.com/maps/dir/?api=1&origin=${
          activeDelivery?.dropLocation?.lat
        },${activeDelivery?.dropLocation?.lng}&destination=${encodeURIComponent(
          `${activeDelivery?.deliveryAddress}`
        )}&travelmode=driving`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          textDecoration: "none",
          padding: "10px",
          background: "#fff",
          borderRadius: "4px",
          display: "block",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          border: "1px solid #ddd",
        }}
      >
        Open in Google Maps <HiExternalLink />
      </a>

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
        <Text mb={-4} opacity={0.6} fontSize={14}>
          Customer info:
        </Text>
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
            <Text opacity={0.6} fontSize={14}>
              Estimated distance:
            </Text>{" "}
            {(activeDelivery.distance / 1000).toFixed(1)} km
          </Text>
          <Text>
            <Text opacity={0.6} fontSize={14}>
              Estimated Time:
            </Text>{" "}
            {Math.ceil(activeDelivery.estimatedTime / 60)} min
          </Text>
        </Flex>

        <Flex gap={3} alignItems={"center"} flexDirection={"column"}>
          <Text display={"flex"} flexDirection={"column"} alignItems={"center"}>
            Current Status:{" "}
            <Text color={"green.400"}>{activeDelivery.currentStatus}</Text>
          </Text>
          <Text
            display={"flex"}
            flexDirection={"column"}
            w={"100%"}
            alignItems={"center"}
          >
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
            <Button
              onClick={() => {
                handleCancel(activeDelivery._id);
              }}
              w={"100%"}
              borderRadius={"4px"}
              p={3}
              bg={"red.500"}
              color={"#fff"}
              _hover={{ background: "red" }}
              mt={2}
            >
              Cancel Delivery
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
  return "Cancelled";
};
