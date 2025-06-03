/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
  Box,
  Select,
  Heading,
  Spinner,
  Center,
  Card,
  CardBody,
  Text,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { FaMapMarkerAlt, FaUserTie } from "react-icons/fa";
import axios from "axios";
import DeliveryMap from "../../delivery/availableDeliveries/components/DeliveryMap";

const OrderTracking = () => {
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [selectedBoyId, setSelectedBoyId] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);

  // Fetch all delivery boys
  useEffect(() => {
    const fetchDeliveryBoys = async () => {
      try {
        const res = await axios.get("/api/delivery-boys");
        // setDeliveryBoys(res.data || []);
      } catch (error) {
        console.error("Failed to fetch delivery boys", error);
      }
    };

    fetchDeliveryBoys();
  }, []);

  // Fetch orders and current location of the selected delivery boy
  useEffect(() => {
    const fetchOrdersAndLocation = async () => {
      if (!selectedBoyId) return;
      setLoading(true);
      try {
        const res = await axios.get(
          `/api/delivery-boys/${selectedBoyId}/details`
        );
        const { currentLocation, assignedOrders } = res.data;

        setCurrentLocation(currentLocation);
        setPickupLocation(assignedOrders[0]?.pickupLocation || currentLocation);

        const dropPoints = assignedOrders.map((order) => ({
          lat: order.dropLocation.lat,
          lng: order.dropLocation.lng,
          orderId: order._id,
          customer: order.customerName,
          address: order.dropLocation.address,
        }));

        setOrders(dropPoints);
      } catch (error) {
        console.error("Failed to fetch orders or location", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndLocation();
  }, [selectedBoyId]);

  return (
    <Box px={{ base: 2, md: 8 }} py={6} minH="80vh" bg="gray.50">
      <Heading
        mb={6}
        color="teal.700"
        fontWeight={700}
        fontSize={{ base: "xl", md: "2xl" }}
      >
        Delivery Tracking Dashboard
      </Heading>

      <Card mb={8} maxW="400px">
        <CardBody>
          <Flex align="center" gap={2} mb={2}>
            <Icon as={FaUserTie} color="teal.500" boxSize={5} />
            <Text fontWeight={600}>Select Delivery Boy</Text>
          </Flex>
          <Select
            placeholder="Select Delivery Boy"
            onChange={(e) => setSelectedBoyId(e.target.value)}
            value={selectedBoyId}
            bg="white"
            borderColor="teal.200"
            focusBorderColor="teal.400"
          >
            {deliveryBoys?.map((boy) => (
              <option key={boy._id} value={boy._id}>
                {boy.name}
              </option>
            ))}
          </Select>
        </CardBody>
      </Card>

      {loading ? (
        <Center minH="200px">
          <Spinner size="xl" color="teal.500" />
        </Center>
      ) : (
        <Box>
          <Card mb={6}>
            <CardBody>
              <Flex align="center" gap={2} mb={2}>
                <Icon as={FaMapMarkerAlt} color="teal.500" boxSize={5} />
                <Text fontWeight={600}>Current Location</Text>
              </Flex>
              <Text color="gray.700" fontSize="md">
                {currentLocation
                  ? `Lat: ${currentLocation.lat}, Lng: ${currentLocation.lng}`
                  : "Not available"}
              </Text>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Text fontWeight={600} mb={2} color="teal.600">
                Assigned Orders
              </Text>
              {orders.length !== 0 ? (
                <Text color="gray.500">No assigned orders.</Text>
              ) : (
                <Box>
                  {orders.map((order) => (
                    <Box
                      key={order.orderId}
                      p={3}
                      mb={2}
                      borderRadius="md"
                      bg="teal.50"
                      border="1px solid"
                      borderColor="teal.100"
                    >
                      <Text fontWeight={500}>Order #{order.orderId}</Text>
                      <Text fontSize="sm" color="gray.700">
                        Customer: {order.customer}
                      </Text>
                      <Text fontSize="sm" color="gray.700">
                        Address:{" "}
                        {order.address ||
                          `Lat: ${order.lat}, Lng: ${order.lng}`}
                      </Text>
                    </Box>
                  ))}
                </Box>
              )}
              <DeliveryMap
                currentLocation={{
                  lat: 51.5074,
                  lng: -0.1278,
                }}
                pickupLocation={{
                  lat: 51.5074,
                  lng: -0.1278,
                }}
                dropPoints={[
                  {
                    orderId: 1,
                    lat: 51.5074,
                    lng: -0.1379,
                  },
                  {
                    orderId: 2,
                    lat: 51.5074,
                    lng: -0.1979,
                  },
                  {
                    orderId: 3,
                    lat: 51.5074,
                    lng: -0.3779,
                  },
                ]}
              />
            </CardBody>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default OrderTracking;
