import { useMemo } from "react";
import { Box, Text, Button, useDisclosure } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
// import CheckoutComp from "./CheckoutComp";
import CartItem from "./CartItem";
import EmptyCart from "./EmptyCart";
import {
  removeFromCart,
  updateQuantity,
} from "../../../../redux/action/cartItems";
// CartBox component definition
const CartBox = () => {
  // Chakra UI hook for managing the state of the checkout drawer
  const {
    // isOpen: isOpenCheckout,
    onOpen: onOpenCheckout,
    // onClose: onCloseCheckout,
  } = useDisclosure();

  // Redux dispatch function
  const dispatch = useDispatch();

  // Selector to get all order items from the Redux store
  const cartItems = useSelector((state) => state?.cart);
  // Memoized value for all cart items
  const allCartItems = useMemo(() => cartItems?.items || [], [cartItems]);

  // Memoized value for the total of all order items
  const allOrderItemsTotal = useMemo(
    () => cartItems?.totalOrderPrice || 0,
    [cartItems]
  );

  // Handler to remove one quantity of an item from the order
  const handleRemoveItemOrder = (cartItemId) => {
    if (cartItemId) {
      dispatch(removeFromCart(cartItemId));
    }
  };

  const handleUpdateItemOrder = (cartItemId, quantityChange) => {
    dispatch(updateQuantity({ cartItemId, quantityChange }));
  };

  return (
    <Box
      height={"70vh"}
      overflowY={"auto"}
      display={"flex"}
      flexDirection={"column"}
      flex={1}
      width={"100%"}
      maxWidth={"400px"}
      justifyContent={allCartItems.length > 0 ? "space-between" : "center"}
      alignItems={"center"}
      p={"1rem"}
      bg={"gray.50"}
      borderRadius={"md"}
      boxShadow={"lg"}
    >
      {allCartItems.length > 0 ? (
        <>
          <Box width={"100%"}>
            {allCartItems.map((item, index) => (
              <CartItem
                key={index}
                item={item}
                onRemove={handleRemoveItemOrder}
                onUpdate={handleUpdateItemOrder}
              />
            ))}
          </Box>
          <Box
            width={"100%"}
            mt={"auto"}
            bg={"white"}
            p={"1rem"}
            borderRadius={"md"}
            boxShadow={"md"}
          >
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              borderBottomWidth={"1px"}
              borderColor={"gray.200"}
              pb={"0.5rem"}
              mb={"1rem"}
            >
              <Text fontWeight={"bold"} fontSize={"lg"} color={"gray.700"}>
                Subtotal:
              </Text>
              <Text fontWeight={"bold"} fontSize={"lg"} color={"#029CFF"}>
                {parseFloat(allOrderItemsTotal).toFixed(2)} €
              </Text>
            </Box>
            <Button
              width={"100%"}
              background={"#029CFF"}
              color={"white"}
              _hover={{ color: "#029CFF", bg: "gray.100" }}
              onClick={onOpenCheckout}
              size={"md"}
              borderRadius={"full"}
            >
              Proceed to Checkout
            </Button>
          </Box>
        </>
      ) : (
        <EmptyCart />
      )}
    </Box>
  );
};

export default CartBox;
