import React, { useEffect, useState } from "react";
import { MdLocalShipping } from "react-icons/md";
import {
  Box,
  Heading,
  Text,
  UnorderedList,
  ListItem,
  Stack,
  SimpleGrid,
  Flex,
} from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  allotDeliveryBoyAction,
  getCompleteOrderAction,
} from "../../../redux/action/completeOrder.js";
import AllotDeliveryBoyModal from "./components/AllotDeliveryBoyModal.jsx";
import { singleUserDataAction } from "../../../redux/action/user.js";

const OrderHistory = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useSelector((state) => state?.userReducer?.user);
  console.log("USER", user);

  const compOrderData = useSelector((state) => state?.compOrder?.data);
  // console.log("compOrderData :", compOrderData);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  // console.log(compOrderData)

  const localUserData = JSON.parse(localStorage.getItem("ProfileData"));
  const localUserId = localUserData?.result?._id;
  

  useEffect(() => {
    dispatch(getCompleteOrderAction(localUserId));
    dispatch(singleUserDataAction(localUserId));
  }, []);

  const handleAllotDeliveryBoy = (orderId) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (data) => {
    console.log(data, selectedOrderId);
    dispatch(allotDeliveryBoyAction(selectedOrderId, data, localUserId));
  };

  return (
    <>
      <AllotDeliveryBoyModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onSubmit={handleModalSubmit}
        supplierId={user?._id || user?.result?._id || localUserId}
      />
      <div style={{ marginTop: "5vw", marginLeft: "4vw" }}>
        <Box maxW="1200px" mx="auto" p="4">
          <Heading as="h1" size="xl" mb="4">
            Recent Orders
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {compOrderData?.map((order) => (
              <Box
                key={order._id.$oid}
                border="1px"
                borderColor="gray.200"
                borderRadius="md"
                p="4"
                shadow="md"
              >
                {order.assignedTo && (
                  <Text
                    p={2}
                    bg={"blue.100"}
                    // color={"#fff"}
                    textAlign={"center"}
                    mb={2}
                  >
                    Assigned to {order.assignedTo.name}
                  </Text>
                )}
                <Box display={"flex"} justifyContent={"space-between"}>
                  <Heading as="h2" size="md" mb="2">
                    Order # {order.orderId}{" "}
                  </Heading>
                  {!order.assignedTo && (
                    <IconButton
                      onClick={() => handleAllotDeliveryBoy(order.orderId)}
                      aria-label="Allot Delivery Boy"
                      title="Allot Delivery Boy"
                      icon={<MdLocalShipping />}
                    />
                  )}
                </Box>
                <Text mb="2">
                  <strong>Customer:</strong> {order.name}
                </Text>
                <Text mb="2">
                  <strong>Phone:</strong> {order.phoneNumber}
                </Text>
                <Text mb="2">
                  <strong>Payment Method:</strong> {order.paymentMethod}
                </Text>
                <Text mb="2">
                  <strong>Delivery Method:</strong> {order.deliveryMethod}
                </Text>
                <Text mb="2">
                  <strong>Address:</strong> {order.address}, {order.city},{" "}
                  {order.state}, {order.zip}
                </Text>
                <Text mb="2">
                  <strong>Note from Customer:</strong> {order.noteFromCustomer}
                </Text>
                <Text mb="2">
                  <strong>Total Price:</strong> ${order.TotalPrice}
                </Text>
                <Heading as="h3" size="sm" mt="4" mb="2">
                  Order Items:
                </Heading>
                <Flex
                  flexDirection={"column"}
                  justifyContent={"space-between"}
                  gap={3}
                  flex={"grow"}
                >
                  <UnorderedList>
                    {order.orderItems.map((item) => (
                      <ListItem key={item._id}>
                        {/* Item ID: {item.item.$oid} -  */}
                        Quantity: {item.quantity} - Total: ${item.total}
                      </ListItem>
                    ))}
                  </UnorderedList>
                </Flex>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </div>
    </>
  );
};

export default OrderHistory;
