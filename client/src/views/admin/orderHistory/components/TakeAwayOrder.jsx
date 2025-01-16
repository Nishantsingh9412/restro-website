/* eslint-disable react/prop-types */
import {
  Box,
  Heading,
  Text,
  Badge,
  UnorderedList,
  ListItem,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { MdLocalShipping } from "react-icons/md";

const TakeAwayOrder = ({ orderData, handleAllotWaiter }) => {
  const { _id, orderId, customerName, orderItems, totalPrice } = orderData;

  return (
    <Box
      key={_id}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p="6"
      bg="white"
      shadow="lg"
      transition="transform 0.2s"
      _hover={{ transform: "scale(1.02)" }}
    >
      <Flex justifyContent="space-between" alignItems="center" mb="4">
        <Heading as="h2" size="md" mb={4}>
          Order #{orderId}
        </Heading>
        <IconButton
          onClick={() => handleAllotWaiter(orderId)}
          aria-label="Allot Delivery Boy"
          title="Allot Delivery Boy"
          icon={<MdLocalShipping />}
          variant="outline"
          colorScheme="blue"
        />
      </Flex>
      <Text>
        <Badge colorScheme="blue">Customer</Badge> {customerName || "N/A"}
      </Text>
      <Text mt={2}>
        <Badge colorScheme="blue">Total Price</Badge> ${totalPrice}
      </Text>
      <Heading as="h3" size="sm" mt="6" mb="2">
        Order Items:
      </Heading>
      <UnorderedList>
        {orderItems?.map(({ _id, quantity, total }) => (
          <ListItem key={_id}>
            Quantity: {quantity} - Total: ${total}
          </ListItem>
        ))}
      </UnorderedList>
    </Box>
  );
};

export default TakeAwayOrder;
