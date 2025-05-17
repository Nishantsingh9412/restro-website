import { memo, useMemo } from "react"; // Ensure React is imported
import { Box, Text, Button } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import CartItem from "./CartItem";
import EmptyCart from "./EmptyCart";
import {
  removeFromCart,
  updateQuantity,
  // switchGuest,
} from "../../../../redux/action/cartItems"; // Update the import path if needed
import PropTypes from "prop-types";
import { formatToGermanCurrency } from "../../../../utils/utils";
// import { orderTypes } from "../../../../utils/constant";

const CartBox = memo(({ handleOnProceed }) => {
  const dispatch = useDispatch();

  const cart = useSelector(
    (state) =>
      state?.cart?.guestsCart?.guest || { items: [], totalOrderPrice: 0 }
  ); // Handle undefined cart
  const allCartItems = useMemo(() => cart?.items || [], [cart]);
  const allOrderItemsTotal = useMemo(() => cart?.totalOrderPrice || 0, [cart]);

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
      maxHeight={"600px"}
      overflowY="auto"
      display="flex"
      flexDirection="column"
      flex={1}
      width="100%"
      maxWidth="400px"
      alignItems="center"
      p="1rem"
      bg="gray.50"
      borderRadius="md"
      boxShadow="lg"
    >
      {Array.isArray(allCartItems) && allCartItems.length > 0 ? ( // Ensure allCartItems is an array
        <>
          <Box width="100%">
            {allCartItems.map((item) => (
              <CartItem
                key={item.cartItemId}
                item={item}
                onRemove={handleRemoveItemOrder}
                onUpdate={handleUpdateItemOrder}
              />
            ))}
          </Box>
          <Box
            width="100%"
            mt="auto"
            bg="white"
            p="1rem"
            borderRadius="md"
            boxShadow="md"
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottomWidth="1px"
              borderColor="gray.200"
              pb="0.5rem"
              mb="1rem"
            >
              <Text fontWeight="bold" fontSize="lg" color="gray.700">
                Subtotal:
              </Text>
              <Text fontWeight="bold" fontSize="lg" color="#029CFF">
                {formatToGermanCurrency(allOrderItemsTotal)}
              </Text>
            </Box>
            <Button
              width="100%"
              background="#029CFF"
              color="white"
              _hover={{ color: "#029CFF", bg: "gray.100" }}
              onClick={handleOnProceed}
              size="md"
              borderRadius="full"
              isDisabled={
                !Number.isFinite(allOrderItemsTotal) || allOrderItemsTotal <= 0
              } // Ensure valid total before enabling
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
});

CartBox.propTypes = {
  handleOnProceed: PropTypes.func.isRequired,
};

CartBox.displayName = "CartBox";

export default CartBox;
