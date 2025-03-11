import { Box, Button, Flex, Text, Image } from "@chakra-ui/react";
import { GrRestaurant } from "react-icons/gr";
import { FaLocationDot } from "react-icons/fa6";
import { FaRegClock } from "react-icons/fa";
import { LuMoveRight } from "react-icons/lu";
import { PropTypes } from "prop-types";
import { statuses } from "../../../../utils/constant";

export default function DeliveryCard({
  data,
  handleUpdateStatus,
  disabled,
}) {
  const getNextStatus = (current) => {
    switch (current) {
      case statuses.AVAILABLE:
        return { status: statuses.PICKED_UP, color: "blue.500" };
      case statuses.PICKED_UP:
      case statuses.OUT_FOR_DELIVERY:
        return { status: statuses.DELIVERED, color: "green.500" };
      case statuses.DELIVERED:
        return { status: statuses.COMPLETED, color: "purple.500" };
      case statuses.CANCELLED:
        return { status: statuses.AVAILABLE, color: "red.500" };
      default:
        return { status: "Completed", color: "gray.500" };
    }
  };
  const nextStatus = getNextStatus(data.currentStatus);

  return (
    <Box
      borderRadius={8}
      bg="white"
      p={4}
      maxW="600px"
      boxShadow="lg"
      border="1px solid #e2e8f0"
    >
      <Flex flexDirection="row" gap={4}>
        <Flex flexDirection="column" flex={1} gap={2}>
          <Flex justifyContent={"space-between"}>
            <Box>
              <Text fontSize={20} fontWeight="bold">
                {data.customerName}
              </Text>
              <Text fontSize={16} color="gray.600">
                Order #{data.orderId}
              </Text>
              <Text
                bg="gray.200"
                w="fit-content"
                mt={2}
                px={2}
                py={1}
                fontSize={14}
                borderRadius={8}
              >
                {data.paymentType?.toUpperCase()}
              </Text>
            </Box>
            <Box
              width="50px"
              height="50px"
              borderRadius="50%"
              overflow="hidden"
            >
              <Image
                src={
                  data.customerImage ??
                  "https://res.cloudinary.com/dezifvepx/image/upload/v1712570097/restro-website/dtqy5kkrwuuhamtp9gim.png"
                }
                alt={data.customerName}
              />
            </Box>
          </Flex>
          <Flex gap={4} mt={2}>
            <Flex
              alignItems="center"
              border="1px solid #ccc"
              p={2}
              borderRadius={5}
              flex={1}
              fontSize={14}
            >
              <GrRestaurant />
              <LuMoveRight />
              <FaLocationDot />
              <Text ml={2}>{(data.distance / 1000).toFixed(1)} km</Text>
            </Flex>
            <Flex
              alignItems="center"
              border="1px solid #ccc"
              p={2}
              borderRadius={5}
              flex={1}
              fontSize={14}
            >
              <FaRegClock />
              <Text ml={2}>{Math.ceil(data.estimatedTime / 60)} min.</Text>
            </Flex>
          </Flex>
          <Flex gap={2} mt={4}>
            <Button
              p={2}
              flex={1}
              bg={disabled ? "#ccc" : nextStatus.color}
              _hover={{
                background: disabled
                  ? null
                  : nextStatus.color.split(".")[0] + ".600",
              }}
              color="#fff"
              _disabled={{ background: "#ccc", pointerEvents: "none" }}
              disabled={disabled}
              onClick={
                disabled
                  ? null
                  : () => handleUpdateStatus(data._id, nextStatus.status)
              }
              fontSize={14}
            >
              {nextStatus.status}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}

DeliveryCard.propTypes = {
  data: PropTypes.object,
  handleUpdateStatus: PropTypes.func,
  disabled: PropTypes.bool,
};
