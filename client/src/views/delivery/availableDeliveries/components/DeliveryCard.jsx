import { Box, Button, Flex, Text, Image } from "@chakra-ui/react";
import { GrRestaurant } from "react-icons/gr";
import { FaLocationDot } from "react-icons/fa6";
import { FaRegClock } from "react-icons/fa";
import { LuMoveRight } from "react-icons/lu";
import { PropTypes } from "prop-types";

export default function DeliveryCard({
  data,
  handleAccept,
  handleReject,
  disabled,
}) {
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
              bg="green.500"
              _hover={{ background: "green.600" }}
              color="#fff"
              _disabled={{ background: "#ccc", pointerEvents: "none" }}
              disabled={disabled}
              onClick={() => handleAccept(data._id)}
              fontSize={14}
            >
              Accept
            </Button>
            <Button
              p={2}
              flex={1}
              bg="red.500"
              _hover={{ background: "red.600" }}
              color="#fff"
              _disabled={{ background: "#ccc", pointerEvents: "none" }}
              disabled={disabled}
              onClick={() => handleReject(data._id)}
              fontSize={14}
            >
              Reject
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}

DeliveryCard.propTypes = {
  data: PropTypes.object,
  handleAccept: PropTypes.func,
  handleReject: PropTypes.func,
  disabled: PropTypes.bool,
};
