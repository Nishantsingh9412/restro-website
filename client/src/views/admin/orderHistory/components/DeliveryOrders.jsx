/* eslint-disable react/prop-types */
import {
  Box,
  Heading,
  Flex,
  IconButton,
  Divider,
  Stack,
  Text,
  Badge,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import { MdLocalShipping } from "react-icons/md";
import { camelCaseToSentenceCase } from "../../../../utils/utils";

const DeliveryOrders = ({ orderData, handleAllotDeliveryBoy }) => {
  const {
    _id,
    orderId,
    name,
    phoneNumber,
    paymentMethod,
    deliveryMethod,
    address,
    zip,
    noteFromCustomer,
    totalPrice,
    orderItems,
    assignedTo,
    completedAt,
  } = orderData;

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
      {completedAt ? (
        <Heading
          as="h2"
          size="md"
          bg="green.100"
          textAlign={"center"}
          mb={4}
          p={2}
        >
          Completed
        </Heading>
      ) : assignedTo ? (
        <Heading as="h2" size="md" bg="blue.100" mb={4} p={2}>
          Assigned to {assignedTo.name}
        </Heading>
      ) : (
        <Flex justifyContent="space-between" alignItems="center" mb="4">
          <Heading as="h2" size="md">
            Order #{orderId}
          </Heading>
          <IconButton
            onClick={() => handleAllotDeliveryBoy(orderId)}
            aria-label="Allot Delivery Boy"
            title="Allot Delivery Boy"
            icon={<MdLocalShipping />}
            variant="outline"
            colorScheme="blue"
          />
        </Flex>
      )}
      <Divider mb="4" />
      <Stack spacing="3">
        <Text>
          <Badge colorScheme="blue">Customer</Badge> {name || "N/A"}
        </Text>
        <Text>
          <Badge colorScheme="blue">Phone</Badge> {phoneNumber || "N/A"}
        </Text>
        <Text>
          <Badge colorScheme="blue">Payment</Badge>{" "}
          {camelCaseToSentenceCase(paymentMethod) || "N/A"}
        </Text>
        <Text>
          <Badge colorScheme="blue">Delivery</Badge>{" "}
          {camelCaseToSentenceCase(deliveryMethod) || "N/A"}
        </Text>
        <Text>
          <Badge colorScheme="blue">Address</Badge> {address}, {zip}
        </Text>
        <Text>
          <Badge colorScheme="blue">Note</Badge> {noteFromCustomer || "N/A"}
        </Text>
        <Text>
          <Badge colorScheme="blue">Total</Badge> ${totalPrice || "N/A"}
        </Text>
      </Stack>
      <Heading as="h3" size="sm" mt="6" mb="2">
        Order Items:
      </Heading>
      <UnorderedList>
        {orderItems?.map(({ _id, quantity, total, item, subItems }) => (
          <ListItem key={_id}>
            {item?.orderName}{" "}
            {subItems?.length > 0 && (
              <Text as="span" fontSize={"sm"} color={"gray.500"}>
                {" "}
                (
                {subItems?.map((subItem, index) => (
                  <Text key={index} as={"span"}>
                    {subItem.name + (index === subItems.length - 1 ? "" : ", ")}
                  </Text>
                ))}
                )
              </Text>
            )}{" "}
            &times; {quantity} - Total: ${total}
          </ListItem>
        ))}
      </UnorderedList>
    </Box>
  );
};

export default DeliveryOrders;
