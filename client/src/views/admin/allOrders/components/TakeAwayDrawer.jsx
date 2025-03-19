/* eslint-disable react/prop-types */
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
import { FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import EmptyCart from "./EmptyCart";
import CartItem from "./CartItem";
import CheckOutTakeAway from "./CheckoutTakeaway";

// Helper function to format price with unit
const formatPrice = (value, unit) =>
  `${parseFloat(value).toFixed(2)} ${unit === "Euro" ? "€" : unit}`;

const TakeAwayDrawer = ({ isOpen, onClose }) => {
  // Chakra UI hook for managing the state of the checkout drawer
  const {
    isOpen: isOpenCheckoutRight,
    onOpen: onOpenCheckoutRight,
    onClose: onCloseCheckoutRight,
  } = useDisclosure();

  // Redux hooks for dispatching actions and selecting state
  const dispatch = useDispatch();
  const allOrderItems = useSelector((state) => state?.OrderItemReducer);
  const { items: allCartItems, total: AllOrderItemsTotal } = allOrderItems;

  // Handler functions for modifying the cart items
  const handleRemoveItemOrderCompletely = (id) =>
    dispatch({ type: "REMOVE_ORDER_ITEM_TEMP_COMPLETELY", data: id });
  const handleRemoveItemOrder = (id) =>
    dispatch({ type: "REMOVE_ORDER_ITEM_TEMP", data: id });
  const handleAddItemOrder = (product) =>
    dispatch({ type: "ADD_ORDER_ITEM_TEMP", data: product });

  return (
    <Drawer placement="bottom" onClose={onClose} isOpen={isOpen} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">
          <Flex justifyContent="space-between" alignItems="center">
            <Flex alignItems="center">
              <FaCartShopping />
              <Text ml="2">Your Cart</Text>
            </Flex>
            <IconButton icon={<FaTimes />} onClick={onClose} variant="ghost" />
          </Flex>
        </DrawerHeader>
        <DrawerBody>
          <Box height="70vh" overflowY="scroll" mb={0}>
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
                  display="flex"
                  flexDirection="column"
                  position="relative"
                  bottom="0"
                  p="1rem"
                  w="90%"
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    p="1rem"
                    borderTopWidth="1px"
                  >
                    <Text fontWeight="bold" fontSize="2xl">
                      Subtotal:
                    </Text>
                    <Text fontWeight="bold" fontSize="2xl" color="#029CFF">
                      {formatPrice(AllOrderItemsTotal, "Euro")}
                    </Text>
                  </Box>
                  <CheckOutTakeAway
                    allOrderItems={allOrderItems}
                    AllOrderItemsTotal={AllOrderItemsTotal}
                    onOpen={onOpenCheckoutRight}
                    onClose={onCloseCheckoutRight}
                    isOpen={isOpenCheckoutRight}
                  />
                  <Button
                    background="#029CFF"
                    color="white"
                    _hover={{ color: "#029CFF", bg: "whitesmoke" }}
                    onClick={onOpenCheckoutRight}
                  >
                    Checkout
                  </Button>
                </Box>
              </>
            ) : (
              <EmptyCart />
            )}
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default TakeAwayDrawer;
