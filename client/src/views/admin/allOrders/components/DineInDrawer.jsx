/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Box,
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
import { FaCartShopping } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";

// Importing components
import EmptyCart from "./EmptyCart";
import CheckOutDinein from "./CheckOutDineIn";
import CartItem from "./CartItem"; // Importing CartItem component

const DineInDrawer = (props) => {
  // Destructuring props
  const isOpen = props.isOpen;
  const onClose = props.onClose;

  // Using Chakra UI's useDisclosure hook for managing the state of the checkout drawer
  const {
    isOpen: isOpenCheckoutRight,
    onOpen: onOpenCheckoutRight,
    onClose: onCloseCheckoutRight,
  } = useDisclosure();

  // State for drawer placement
  // eslint-disable-next-line no-unused-vars
  const [placement, setPlacement] = useState("left");

  // Redux hooks for dispatching actions and selecting state
  const dispatch = useDispatch();
  const allOrderItems = useSelector((state) => state?.OrderItemReducer);
  const allCartItems = allOrderItems?.items;

  // Logging cart items and total for debugging
  const AllOrderItemsTotal = allOrderItems?.total;

  // Handler to remove an item completely from the order
  const handleRemoveItemOrderCompletely = (id) => {
    if (id !== undefined) {
      dispatch({ type: "REMOVE_ORDER_ITEM_TEMP_COMPLETELY", data: id });
    }
  };

  // Handler to remove one quantity of an item from the order
  const handleRemoveItemOrder = (id) => {
    if (id !== undefined) {
      dispatch({ type: "REMOVE_ORDER_ITEM_TEMP", data: id });
    }
  };

  // Handler to add one quantity of an item to the order
  const handleAddItemOrder = (product) => {
    if (product !== undefined) {
      dispatch({ type: "ADD_ORDER_ITEM_TEMP", data: product });
    }
  };

  return (
    <div>
      <>
        {/* Drawer component for displaying the cart */}
        <Drawer
          placement={placement}
          onClose={onClose}
          isOpen={isOpen}
          size="md"
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">
              <Flex justifyContent="space-between" alignItems="center">
                <Flex alignItems="center">
                  <FaCartShopping />
                  <Text marginLeft="2">Your Cart</Text>
                </Flex>
                <IconButton
                  icon={<FaTimes />}
                  onClick={onClose}
                  variant="ghost"
                />
              </Flex>
            </DrawerHeader>
            <DrawerBody>
              {/* Display subtotal and checkout button if there are items in the cart */}
            <Box height="60vh" overflowY="scroll">
              {allCartItems?.length > 0 ? (
                <>
                  {allCartItems.map((item, index) => (
                    <CartItem
                      key={index}
                      item={item}
                      onRemoveCompletely={handleRemoveItemOrderCompletely}
                      onAdd={handleAddItemOrder}
                      onRemove={handleRemoveItemOrder}
                    />
                  ))}
                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    position={"absolute"}
                    bottom={"0"}
                    padding={"1rem"}
                    width={"90%"}
                  >
                    <Box
                      display={"flex"}
                      justifyContent={"space-between"}
                      padding={"1rem"}
                      borderTopWidth={"1px"}
                    >
                      <Text fontWeight={"bold"} fontSize={"2xl"}>
                        Subtotal :
                      </Text>

                      <Text
                        fontWeight={"bold"}
                        fontSize={"2xl"}
                        color={"#029CFF"}
                      >
                        {parseFloat(AllOrderItemsTotal).toFixed(2)} €
                      </Text>
                    </Box>
                    {/* Checkout drawer starts */}
                    <CheckOutDinein
                      allOrderItems={allOrderItems}
                      AllOrderItemsTotal={AllOrderItemsTotal}
                      onOpen={onOpenCheckoutRight}
                      onClose={onCloseCheckoutRight}
                      isOpen={isOpenCheckoutRight}
                    />
                    {/* Checkout drawer ends */}
                    <Button
                      background={"#029CFF"}
                      color={"white"}
                      _hover={{ color: "#029CFF", bg: "whitesmoke" }}
                      onClick={onOpenCheckoutRight}
                    >
                      Checkout
                    </Button>
                  </Box>
                </>
              ) : (
                // No items in cart show your cart is empty
                <EmptyCart />
              )}
            </Box>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    </div>
  );
};

export default DineInDrawer;
