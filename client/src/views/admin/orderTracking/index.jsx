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
import { FaUserTie } from "react-icons/fa";
import DeliveryMap from "../../delivery/availableDeliveries/components/DeliveryMap";
import { useOrderTracking } from "../../../hooks/useOrderTracking";

const OrderTracking = () => {
  const {
    loading,
    dropPoints,
    orderDetails,
    selectedBoyId,
    currentLocation,
    setSelectedBoyId,
    onlineDeliveryBoys,
  } = useOrderTracking();

  return (
    <Box px={{ base: 2, md: 8 }} py={6} minH="80vh" bg="gray.50">
      <Heading
        mb={6}
        color="teal.700"
        fontWeight={700}
        fontSize={{ base: "xl", md: "2xl" }}
      >
        Order Tracking Dashboard
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
            {onlineDeliveryBoys.map((boy) => (
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
          {currentLocation && dropPoints.length > 0 && (
            <DeliveryMap
              currentLocation={currentLocation}
              dropPoints={dropPoints}
            />
          )}
          <Card mt={6}>
            <CardBody>
              <Text fontWeight={600} mb={2} color="teal.600">
                Assigned Orders
              </Text>
              {orderDetails.length === 0 ? (
                <Text color="gray.500">No assigned orders.</Text>
              ) : (
                <Box>
                  {orderDetails.map((order) => (
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
                        Address: {order.address}
                      </Text>
                    </Box>
                  ))}
                </Box>
              )}
            </CardBody>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default OrderTracking;
