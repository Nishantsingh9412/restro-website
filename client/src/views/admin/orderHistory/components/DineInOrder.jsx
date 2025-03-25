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
import { MdRestaurant } from "react-icons/md";

const DineInOrder = ({ orderData, handleAllotWaiter }) => {
  const {
    _id,
    completedAt,
    assignedWaiter,
    orderId,
    customerName,
    numberOfGuests,
    specialRequests,
    totalPrice,
    tableNumber,
    orderItems,
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
      ) : assignedWaiter ? (
        <Heading as="h2" size="md" bg="blue.100" mb={4} p={2}>
          Assigned to {assignedWaiter?.name}
        </Heading>
      ) : (
        <Flex justifyContent="space-between" alignItems="center" mb="4">
          <Heading as="h2" size="md">
            Order #{orderId}
          </Heading>
          <IconButton
            onClick={handleAllotWaiter}
            aria-label="Allot Waiter"
            title="Allot Waiter"
            icon={<MdRestaurant />}
            variant="outline"
            colorScheme="blue"
          />
        </Flex>
      )}
      <Divider mb="4" />
      <Stack spacing="3">
        <Text>
          <Badge colorScheme="blue">Name</Badge> {customerName || "N/A"}
        </Text>
        <Text>
          <Badge colorScheme="blue">Guests</Badge> {numberOfGuests || "N/A"}
        </Text>
        <Text>
          <Badge colorScheme="blue">Note</Badge> {specialRequests || "N/A"}
        </Text>
        <Text>
          <Badge colorScheme="blue">Total</Badge> ${totalPrice || "0.00"}
        </Text>
        <Text>
          <Badge colorScheme="blue">Table No</Badge> {tableNumber || "N/A"}
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

export default DineInOrder;
