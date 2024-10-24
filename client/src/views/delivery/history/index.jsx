import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { formatDistanceToNow } from "date-fns";
import { GiPathDistance } from "react-icons/gi";
import { MdOutlineTimer } from "react-icons/md";
import { useSelector } from "react-redux";

// Main component to display delivery history
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
        <Flex flexDirection="column" borderRadius={20} bg="#fff">
          {deliveries
            .sort((a, b) => b.completedAt - a.completedAt)
            .map((deli, i) => (
              <DeliveryItem key={i} delivery={deli} />
            ))}
        </Flex>
      ) : (
        <Text
          p={3}
          w="fit-content"
          bg="rgba(255, 255, 255, 0.5)"
          mx="auto"
          my={20}
        >
          You have not completed any orders yet
        </Text>
      )}
    </>
  );
}

// Component to display individual delivery item
const DeliveryItem = ({ delivery }) => {
  const { orderId, currentStatus, distance, estimatedTime, completedAt } = delivery;

  return (
    <Flex
      p={5}
      border="1px solid #eee"
      justifyContent="space-between"
      flexDirection="column"
    >
      <Flex fontSize={18} fontWeight={500} alignItems="center" gap={3}>
        Order no: {orderId}{" "}
        <Box
          px={2}
          bg={currentStatus === "Cancelled" ? "red.400" : "green.400"}
          color="#fff"
          fontSize={12}
          borderRadius={5}
        >
          {currentStatus}
        </Box>
      </Flex>
      <Flex gap={3} my={2}>
        <InfoBox icon={<GiPathDistance />} text={`${(distance / 1000).toFixed(1)} km`} />
        <InfoBox icon={<MdOutlineTimer />} text={`${Math.ceil(estimatedTime / 60)} min`} />
      </Flex>
      <Text fontSize={12} color="#777">
        {completedAt ? formatDistanceToNow(completedAt) + " ago" : ""}
      </Text>
    </Flex>
  );
};

// Reusable component for displaying icon and text
const InfoBox = ({ icon, text }) => (
  <Flex
    alignItems="center"
    gap={2}
    border="1px solid #eee"
    px={3}
    borderRadius={10}
  >
    {icon}
    {text}
  </Flex>
);

InfoBox.propTypes = {
  icon: PropTypes.element.isRequired,
  text: PropTypes.string.isRequired,
};

DeliveryItem.propTypes = {
  delivery: PropTypes.shape({
    orderId: PropTypes.string.isRequired,
    currentStatus: PropTypes.string.isRequired,
    distance: PropTypes.number.isRequired,
    estimatedTime: PropTypes.number.isRequired,
    completedAt: PropTypes.instanceOf(Date),
  }).isRequired,
};
