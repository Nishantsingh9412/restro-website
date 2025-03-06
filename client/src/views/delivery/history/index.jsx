import {
  Box,
  Flex,
  Heading,
  Text,
  Spinner,
  Button,
  HStack,
} from "@chakra-ui/react";
import { formatDistanceToNow, format, getMonth, getYear } from "date-fns";
import { GiPathDistance } from "react-icons/gi";
import { MdLocationPin, MdOutlineTimer } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getCompletedDeliveriesAction } from "../../../redux/action/delivery";
import PropTypes from "prop-types";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function DeliveryHistory() {
  const dispatch = useDispatch();
  const deliveries = useSelector(
    (state) => state.deliveryReducer?.completedDeliveries
  );
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);

  const getAllDatesInMonth = (month) => {
    const daysInMonth = new Date(
      new Date().getFullYear(),
      month + 1,
      0
    ).getDate(); // Get total days in the month
    return Array.from({ length: daysInMonth }, (_, i) => i + 1); // Generate all dates
  };

  const totalJobs = filteredDeliveries.length;
  const totalKm = filteredDeliveries
    .reduce((acc, delivery) => acc + delivery.distance / 1000, 0)
    .toFixed(1);

  const allDatesInMonth =
    selectedMonth !== null ? getAllDatesInMonth(selectedMonth) : [];

  useEffect(() => {
    if (selectedDate) {
      const filtered = deliveries.filter(
        (delivery) =>
          format(new Date(delivery.completedAt), "yyyy-M-d") === selectedDate
      );
      setFilteredDeliveries(filtered);
    } else if (selectedMonth !== null) {
      const filtered = deliveries.filter(
        (delivery) =>
          getMonth(new Date(delivery.completedAt)) === selectedMonth &&
          getYear(new Date(delivery.completedAt)) === new Date().getFullYear()
      );
      setFilteredDeliveries(filtered);
    } else {
      setFilteredDeliveries(deliveries);
    }
  }, [selectedDate, selectedMonth, deliveries]);

  // Fetch completed deliveries on component mount
  useEffect(() => {
    dispatch(getCompletedDeliveriesAction()).finally(() => setLoading(false));
  }, []);

  return (
    <Box mt={10} p={5} bg="gray.50" borderRadius="md" boxShadow="md">
      <Heading fontSize={24} textAlign="center">
        Delivery History
      </Heading>

      <Box width={"100%"} overflowX="auto" whiteSpace="nowrap">
        <Flex
          justifyContent="center"
          mb={5}
          flexDirection={"column"}
          alignItems={"center"}
        >
          <HStack maxH="200px" p={3} spacing={3}>
            {months.map((month, index) => (
              <Button
                key={index}
                variant={selectedMonth === index ? "solid" : "outline"}
                colorScheme="teal"
                onClick={() => {
                  setSelectedMonth(index);
                  setSelectedDate(null);
                }}
              >
                {month}
              </Button>
            ))}
          </HStack>
          {selectedMonth !== null && (
            <HStack maxH="200px" p={1} spacing={1}>
              {allDatesInMonth.map((date) => (
                <Button
                  key={date}
                  variant={
                    selectedDate ===
                    `${new Date().getFullYear()}-${selectedMonth + 1}-${date}`
                      ? "solid"
                      : "outline"
                  }
                  size={"sm"}
                  colorScheme="teal"
                  onClick={() =>
                    setSelectedDate(
                      `${new Date().getFullYear()}-${selectedMonth + 1}-${date}`
                    )
                  }
                >
                  {date}
                </Button>
              ))}
            </HStack>
          )}
        </Flex>
      </Box>
      <Flex justifyContent="space-between" mb={5} px={5}>
        <Text fontSize="lg">
          Total Jobs: <b>{totalJobs}</b>
        </Text>
        <Text fontSize="lg">
          Total Km: <b>{totalKm}</b> km
        </Text>
      </Flex>
      {loading ? (
        <Flex justifyContent="center" alignItems="center" height="50vh">
          <Spinner size="xl" color="teal.500" />
        </Flex>
      ) : filteredDeliveries?.length ? (
        <Flex
          flexDirection="column"
          borderRadius="md"
          bg="white"
          p={5}
          boxShadow="md"
        >
          {filteredDeliveries
            .sort((a, b) => b.completedAt - a.completedAt)
            .map((deli, i) => (
              <DeliveryItem key={i} delivery={deli} />
            ))}
        </Flex>
      ) : (
        <Text
          p={3}
          w="fit-content"
          bg="gray.100"
          mx="auto"
          my={20}
          borderRadius="md"
          textAlign="center"
        >
          You have not completed any orders yet
        </Text>
      )}
    </Box>
  );
}

const DeliveryItem = ({ delivery }) => {
  return (
    <Flex
      p={5}
      my={1}
      border="1px solid #eee"
      justifyContent={"space-between"}
      flexDirection={"column"}
    >
      <Flex fontSize={18} fontWeight={500} alignItems={"center"} gap={3}>
        Order no: {delivery.orderId}{" "}
        <Box
          px={2}
          bg={delivery.currentStatus === "Cancelled" ? "red.400" : "green.400"}
          color={"#fff"}
          fontSize={12}
          borderRadius={5}
        >
          {delivery.currentStatus}
        </Box>
        <Text fontSize={12} color={"#777"} fontWeight={500}>
          {delivery.completedAt
            ? formatDistanceToNow(delivery.completedAt) + " ago"
            : ""}
        </Text>
      </Flex>
      <Flex gap={3} my={2}>
        <Flex
          alignItems={"center"}
          gap={2}
          border={"1px solid #eee"}
          px={3}
          borderRadius={10}
        >
          <GiPathDistance />
          {(delivery.distance / 1000).toFixed(1)} km
        </Flex>
        <Flex
          alignItems={"center"}
          gap={2}
          border={"1px solid #eee"}
          px={3}
          borderRadius={10}
        >
          <MdOutlineTimer />
          {Math.ceil(delivery.estimatedTime / 60)} min
        </Flex>
        <Flex
          alignItems={"center"}
          gap={2}
          border={"1px solid #eee"}
          px={3}
          borderRadius={10}
        >
          <MdLocationPin />
          <Text fontSize={14} color={"#333"}>
            Drop Location: {delivery.deliveryAddress}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

DeliveryItem.propTypes = {
  delivery: PropTypes.shape({
    orderId: PropTypes.string.isRequired,
    currentStatus: PropTypes.string.isRequired,
    distance: PropTypes.number.isRequired,
    estimatedTime: PropTypes.number.isRequired,
    completedAt: PropTypes.instanceOf(Date),
    deliveryAddress: PropTypes.string.isRequired,
  }).isRequired,
};
