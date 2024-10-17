import { useState, useMemo } from "react";
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
import { FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import CheckoutComp from "./CheckoutComp";
import PropTypes from "prop-types";
import EmptyCart from "./EmptyCart";
import CartItem from "./CartItem";

// CartDrawer component definition
const CartDrawer = ({ isOpen, onClose }) => {
  // Chakra UI hook for managing the state of the checkout drawer
  const {
    isOpen: isOpenCheckout,
    onOpen: onOpenCheckout,
    onClose: onCloseCheckout,
  } = useDisclosure();

  // State for drawer placement
  const [placement] = useState("right");

  // Redux dispatch function
  const dispatch = useDispatch();

  // Selector to get all order items from the Redux store
  const allOrderItems = useSelector((state) => state?.OrderItemReducer);

  // Memoized value for all cart items
  const allCartItems = useMemo(
    () => allOrderItems?.items || [],
    [allOrderItems]
  );

  // Memoized value for the total of all order items
  const AllOrderItemsTotal = useMemo(
    () => allOrderItems?.total || 0,
    [allOrderItems]
  );

  // Handler to remove an item completely from the order
  const handleRemoveItemOrderCompletely = (id) => {
    if (id) {
      dispatch({ type: "REMOVE_ORDER_ITEM_TEMP_COMPLETELY", data: id });
    }
  };

  // Handler to remove one quantity of an item from the order
  const handleRemoveItemOrder = (id) => {
    if (id) {
      dispatch({ type: "REMOVE_ORDER_ITEM_TEMP", data: id });
    }
  };

  // Handler to add one quantity of an item to the order
  const handleAddItemOrder = (product) => {
    if (product) {
      dispatch({ type: "ADD_ORDER_ITEM_TEMP", data: product });
    }
  };

  return (
    <Drawer placement={placement} onClose={onClose} isOpen={isOpen} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">
          <Flex justifyContent="space-between" alignItems="center">
            <Text ml="2">Your Cart</Text>
            <IconButton icon={<FaTimes />} onClick={onClose} variant="ghost" />
          </Flex>
        </DrawerHeader>
        <DrawerBody>
          <Box height={"70vh"} overflowY={"scroll"}>
            {allCartItems.length > 0 ? (
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
                    <Text
                      fontWeight={"bold"}
                      fontSize={"2xl"}
                      color={"#029CFF"}
                    >
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

// PropTypes validation
CartDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CartDrawer;
