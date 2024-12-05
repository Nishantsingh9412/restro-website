import { useEffect, useCallback, useMemo } from "react";
import { MdLocalShipping } from "react-icons/md";
import {
  Box,
  Heading,
  Text,
  UnorderedList,
  ListItem,
  Stack,
  SimpleGrid,
  IconButton,
  Flex,
  Badge,
  Divider,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { getCompleteOrderAction } from "../../../redux/action/completeOrder.js";
// import { singleUserDataAction } from "../../../redux/action/user.js";
import { useState } from "react";
import AllotDeliveryBoyModal from "./components/AllotDeliveryModal.jsx";
import { allotDeliveryBoyAction } from "../../../redux/action/completeOrder.js";
const OrderHistory = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.userReducer?.user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState("");

  const compOrderData = useSelector((state) => state?.compOrder?.data);

  const localUserData = useMemo(
    () => JSON.parse(localStorage.getItem("ProfileData")),
    []
  );
  const localUserId = localUserData?.result?._id;

  const fetchCompleteOrders = useCallback(() => {
    dispatch(getCompleteOrderAction(localUserId));
  }, [dispatch, localUserId]);

  useEffect(() => {
    fetchCompleteOrders();
    // dispatch(singleUserDataAction(localUserId));
  }, [fetchCompleteOrders]);

  const handleAllotDeliveryBoy = useCallback((orderId) => {
    console.log(orderId);
    // console.log("Allot Delivery Boy Pending .........");
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  }, []);

  const handleModalSubmit = useCallback((data) => {
    dispatch(
      allotDeliveryBoyAction({
        orderId: selectedOrderId,
        deliveryBoy: data,
      })
    );
  });

  return (
    <>
      {" "}
      <AllotDeliveryBoyModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onSubmit={handleModalSubmit}
        supplierId={user?._id || user?.result?._id || localUserId}
      />
      <Box mt="4" px="4">
        <Box maxW="1200px" mx="auto" p="4">
          <Heading as="h1" size="xl" mb="6" textAlign="center">
            Recent Orders
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {compOrderData?.map(
              ({
                _id,
                orderId,
                name,
                phoneNumber,
                paymentMethod,
                deliveryMethod,
                address,
                city,
                state,
                zip,
                noteFromCustomer,
                totalPrice,
                orderItems,
                assignedTo,
                completedAt,
              }) => (
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
                    <Heading as="h2" size="md" bg="green.100" mb={4} p={2}>
                      Completed
                    </Heading>
                  ) : assignedTo ? (
                    <Heading as="h2" size="md" bg="blue.100" mb={4} p={2}>
                      Assigned to {assignedTo.name}
                    </Heading>
                  ) : (
                    <Flex
                      justifyContent="space-between"
                      alignItems="center"
                      mb="4"
                    >
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
                      <Badge colorScheme="blue">Customer</Badge> {name}
                    </Text>
                    <Text>
                      <Badge colorScheme="blue">Phone</Badge> {phoneNumber}
                    </Text>
                    <Text>
                      <Badge colorScheme="blue">Payment</Badge> {paymentMethod}
                    </Text>
                    <Text>
                      <Badge colorScheme="blue">Delivery</Badge>{" "}
                      {deliveryMethod}
                    </Text>
                    <Text>
                      <Badge colorScheme="blue">Address</Badge> {address},{" "}
                      {city}, {state}, {zip}
                    </Text>
                    <Text>
                      <Badge colorScheme="blue">Note</Badge> {noteFromCustomer}
                    </Text>
                    <Text>
                      <Badge colorScheme="blue">Total</Badge> ${totalPrice}
                    </Text>
                  </Stack>
                  <Heading as="h3" size="sm" mt="6" mb="2">
                    Order Items:
                  </Heading>
                  <UnorderedList>
                    {orderItems.map(({ _id, quantity, total }) => (
                      <ListItem key={_id}>
                        Quantity: {quantity} - Total: ${total}
                      </ListItem>
                    ))}
                  </UnorderedList>
                </Box>
              )
            )}
          </SimpleGrid>
        </Box>
      </Box>
    </>
  );
};

export default OrderHistory;
