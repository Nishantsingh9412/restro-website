import { Box, Button, Flex, Text, Image } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { orderTypes } from "../../../utils/constant";

export default function TakeAwayOrderCard({
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
          <Text fontSize={18}>
            {data.customerName === "" ? "N/A" : data.customerName}
          </Text>
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
            {data.currentStatus?.toUpperCase()}
          </Text>

          <Box>
            <Text fontWeight="bold">Ordered Items:</Text>
            <Box pl={3}>
              {data?.orderItems?.map((order, index) => (
                <Text key={index}>
                  {order?.item?.orderName} - {order?.quantity}
                </Text>
              ))}
            </Box>
          </Box>

          <Flex gap={3}>
            <Button
              p={3}
              flex={1}
              bg="green.500"
              _hover={{ background: "green" }}
              color="#fff"
              _disabled={{ background: "#ccc", pointerEvents: "none" }}
              disabled={disabled}
              onClick={() => handleAccept(data?.orderId, orderTypes.TAKE_AWAY)}
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
              onClick={() => handleReject(data.orderId)}
            >
              Reject
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}

TakeAwayOrderCard.propTypes = {
  data: PropTypes.shape({
    customerImage: PropTypes.string,
    customerName: PropTypes.string.isRequired,
    orderId: PropTypes.number.isRequired,
    currentStatus: PropTypes.string,
    tableNumber: PropTypes.number.isRequired,
    numberOfGuests: PropTypes.number.isRequired,
    orderItems: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
      })
    ).isRequired,
    specialInstructions: PropTypes.string,
    _id: PropTypes.string.isRequired,
  }).isRequired,
  handleAccept: PropTypes.func.isRequired,
  handleReject: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};
