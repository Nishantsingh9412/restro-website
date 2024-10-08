import React, { useState } from "react";
import {
  Box,
  Image,
  Text,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Button,
  Flex,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";
import { BiSolidTrash } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import CheckoutComp from "./CheckoutComp";

const CartDrawer = ({ isOpen, onOpen, onClose }) => {
  const {
    isOpen: isOpenCheckout,
    onOpen: onOpenCheckout,
    onClose: onCloseCheckout,
  } = useDisclosure();
  const [placement] = useState("right");
  const dispatch = useDispatch();

  const allOrderItems = useSelector((state) => state?.OrderItemReducer);
  const allCartItems = allOrderItems?.items || [];
  const AllOrderItemsTotal = allOrderItems?.total || 0;

  const handleRemoveItemOrderCompletely = (id) => {
    if (id !== undefined) {
      dispatch({ type: "REMOVE_ORDER_ITEM_TEMP_COMPLETELY", data: id });
    }
  };

  const handleRemoveItemOrder = (id) => {
    if (id !== undefined) {
      dispatch({ type: "REMOVE_ORDER_ITEM_TEMP", data: id });
    }
  };

  const handleAddItemOrder = (product) => {
    if (product !== undefined) {
      dispatch({ type: "ADD_ORDER_ITEM_TEMP", data: product });
    }
  };

  return (
    <Drawer placement={placement} onClose={onClose} isOpen={isOpen} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">
          <Flex justifyContent="space-between" alignItems="center">
            <Flex alignItems="center">
              {/* <FaCartShopping /> */}
              <Text ml="2">Your Cart</Text>
            </Flex>
            <IconButton icon={<FaTimes />} onClick={onClose} variant="ghost" />
          </Flex>
        </DrawerHeader>
        <DrawerBody>
          {allCartItems.map((item, index) => (
            <Box
              key={index}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              mb={3}
              p="6"
            >
              <Flex justifyContent="space-between" alignItems="center">
                <Flex alignItems="center">
                  <Image
                    borderRadius="full"
                    boxSize="50px"
                    src={item?.pic}
                    alt="Food-Image"
                  />
                  <Box ml="1rem">
                    <Text
                      mt="1"
                      fontWeight="semibold"
                      as="h4"
                      lineHeight="tight"
                      isTruncated
                    >
                      {item?.orderName}
                      <BiSolidTrash
                        size={"20"}
                        style={{
                          marginLeft: "8px",
                          marginTop: "2px",
                          cursor: "pointer",
                          color: "red",
                        }}
                        onClick={() =>
                          handleRemoveItemOrderCompletely(item._id)
                        }
                      />
                    </Text>
                    <Text
                      mt="1"
                      fontWeight="semibold"
                      as="h4"
                      lineHeight="tight"
                      isTruncated
                    >
                      {item?.quantity} X {item?.priceVal}{" "}
                      {item?.priceUnit === "Euro" ? "€" : item?.priceUnit}
                    </Text>
                  </Box>
                </Flex>
                <Flex
                  background={"#fa4a0c"}
                  color={"white"}
                  gap={"1rem"}
                  borderRadius={"50px"}
                  px={"10px"}
                  alignItems="center"
                >
                  <Text
                    style={{
                      cursor: "pointer",
                      userSelect: "none",
                      fontSize: "20px",
                    }}
                    onClick={() => handleAddItemOrder(item)}
                  >
                    +
                  </Text>
                  <Text
                    style={{
                      cursor: "pointer",
                      userSelect: "none",
                      fontSize: "20px",
                    }}
                    onClick={() => handleRemoveItemOrder(item._id)}
                  >
                    -
                  </Text>
                </Flex>
              </Flex>
              <Box display={"flex"} justifyContent={"end"} mt={"0.5rem"}>
                {item?.quantity * item?.priceVal}{" "}
                {item?.priceUnit === "Euro" ? "€" : item?.priceUnit}
              </Box>
            </Box>
          ))}
          <Box
            display={"flex"}
            flexDirection={"column"}
            position={"absolute"}
            bottom={"0"}
            p={"1rem"}
            width={"90%"}
          >
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              p={"1rem"}
              borderTopWidth={"1px"}
            >
              <Text fontWeight={"bold"} fontSize={"2xl"}>
                Subtotal :
              </Text>
              <Text fontWeight={"bold"} fontSize={"2xl"} color={"#029CFF"}>
                {parseFloat(AllOrderItemsTotal).toFixed(2)} €
              </Text>
            </Box>
            <CheckoutComp
              allOrderItems={allOrderItems}
              AllOrderItemsTotal={AllOrderItemsTotal}
              onOpen={onOpenCheckout}
              onClose={onCloseCheckout}
              isOpen={isOpenCheckout}
            />
            <Button
              background={"#029CFF"}
              color={"white"}
              _hover={{ color: "#029CFF", bg: "whitesmoke" }}
              onClick={onOpenCheckout}
            >
              Checkout
            </Button>
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
