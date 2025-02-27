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
    <Box borderRadius={10} bg="gray.100" p={5} flex={1}>
      <Flex flexDirection="column" gap={5}>
        <Flex gap={10} alignItems="center">
          <Box width="60px" height="60px" borderRadius="50%" overflow="hidden">
            <Image
              src={
                data.customerImage ??
                "https://res.cloudinary.com/dezifvepx/image/upload/v1712570097/restro-website/dtqy5kkrwuuhamtp9gim.png"
              }
              alt={data.customerName}
            />
          </Box>
          <Text fontSize={18}>{data.customerName}</Text>
        </Flex>
        <Flex flexDirection="column" gap={3}>
          <Text>Order #{data.orderId}</Text>
          <Text
            bg="gray.200"
            w="fit-content"
            px={2}
            py={1}
            fontSize={12}
            borderRadius={10}
          >
            {data.paymentType?.toUpperCase()}
          </Text>
          <Flex gap={3}>
            <Flex
              alignItems="center"
              border="1px solid #ccc"
              p={2}
              borderRadius={5}
              flex={1}
            >
              <GrRestaurant />
              <LuMoveRight />
              <FaLocationDot />
              <Text ml={3}>{(data.distance / 1000).toFixed(1)} km</Text>
            </Flex>
            <Flex
              alignItems="center"
              border="1px solid #ccc"
              p={2}
              borderRadius={5}
              flex={1}
            >
              <FaRegClock />
              <Text ml={3}>{Math.ceil(data.estimatedTime / 60)} min.</Text>
            </Flex>
          </Flex>
          <Flex gap={3}>
            <Button
              p={3}
              flex={1}
              bg="green.500"
              _hover={{ background: "green" }}
              color="#fff"
              _disabled={{ background: "#ccc", pointerEvents: "none" }}
              disabled={disabled}
              onClick={() => handleAccept(data._id)}
            >
              Accept
            </Button>
            <Button
              p={3}
              flex={1}
              bg="red.500"
              _hover={{ background: "red" }}
              color="#fff"
              _disabled={{ background: "#ccc", pointerEvents: "none" }}
              disabled={disabled}
              onClick={() => handleReject(data._id)}
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
  disabled: PropTypes.Boolean,
};
