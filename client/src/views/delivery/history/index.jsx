import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { getCompletedDeliveries } from "../../../api/index";
import { formatDistanceToNow } from "date-fns";
import { GiPathDistance } from "react-icons/gi";
import { MdOutlineTimer } from "react-icons/md";
import { useSelector } from "react-redux";
export default function DeliveryHistory() {
  const deliveries = useSelector(
    (state) => state.deliveryReducer?.completedDeliveries
  );

  return (
    <>
      <Heading mt={20} mb={5} fontSize={20}>
        Delivery History
      </Heading>
      {deliveries?.length ? (
        <Flex flexDirection={"column"} borderRadius={20} bg={"#fff"}>
          {deliveries
            .sort((a, b) => b.completedAt - a.completedAt)
            .map((deli, i) => (
              <DeliveryItem key={i} delivery={deli} />
            ))}
        </Flex>
      ) : (
        <Text
          p={3}
          w={"fit-content"}
          bg={"rgba(255, 255, 255, 0.5)"}
          mx={"auto"}
          my={20}
        >
          You have not completed any orders yet
        </Text>
      )}
    </>
  );
}

const DeliveryItem = ({ delivery }) => {
  return (
    <Flex
      p={5}
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
      </Flex>
      <Text fontSize={12} color={"#777"}>
        {delivery.completedAt
          ? formatDistanceToNow(delivery.completedAt) + " ago"
          : ""}
      </Text>
    </Flex>
  );
};
