import { Box, Button, Flex, Text, Image } from "@chakra-ui/react";
import { GrRestaurant } from "react-icons/gr";
import { FaPersonBooth } from "react-icons/fa";
import PropTypes from "prop-types";
export default function OrderCard({
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
          <Flex gap={3}>
            <Flex
              alignItems="center"
              border="1px solid #ccc"
              p={2}
              borderRadius={5}
              flex={1}
            >
              <GrRestaurant />
              <Text ml={3}>{data.tableNumber} No. Table</Text>
            </Flex>
            <Flex
              alignItems="center"
              border="1px solid #ccc"
              p={2}
              borderRadius={5}
              flex={1}
            >
              <FaPersonBooth />
              <Text ml={3}>{data.numberOfGuests} Guest.</Text>
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

OrderCard.propTypes = {
  data: PropTypes.shape({
    customerImage: PropTypes.string,
    customerName: PropTypes.string.isRequired,
    orderId: PropTypes.number.isRequired,
    currentStatus: PropTypes.string,
    tableNumber: PropTypes.number.isRequired,
    numberOfGuests: PropTypes.number.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
  handleAccept: PropTypes.func.isRequired,
  handleReject: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};
