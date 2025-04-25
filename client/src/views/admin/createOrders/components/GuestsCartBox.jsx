import { useMemo, useState } from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import CartItem from "./CartItem";
import EmptyCart from "./EmptyCart";
import {
  removeFromCart,
  updateQuantity,
  switchGuest,
  removeGuest,
} from "../../../../redux/action/cartItems";
import PropTypes from "prop-types";
import { guestTypes } from "../../../../utils/constant";

// Component to display the cart for guests
const GuestsCartBox = ({ handleOnProceed }) => {
  const dispatch = useDispatch();

  // Access cart state from Redux store
  const cart = useSelector((state) => state.cart);
  const { guestsCart, currentGuest } = cart;

  // Access dine-in customer information from Redux store
  const { guests } = useSelector((state) => state.customerInfo.dineIn);

  // State to track the currently selected guest
  const [selectedGuest, setSelectedGuest] = useState(currentGuest);

  // Memoized value for the current guest's cart
  const currentGuestCart = useMemo(
    () =>
      selectedGuest === guestTypes.GUEST
        ? guestsCart
        : guestsCart[selectedGuest] || {},
    [guestsCart, selectedGuest]
  );

  // Memoized value for all cart items (either for all guests or a specific guest)
  const allCartItems = useMemo(() => {
    if (selectedGuest === guestTypes.GUEST) {
      // Merge all guests' items into a single array
      return Object.values(guestsCart).flatMap(
        (guestCart) => guestCart.items || []
      );
    }
    return currentGuestCart.items || [];
  }, [guestsCart, currentGuestCart, selectedGuest]);

  // Memoized value for the total price of all order items
  const allOrderItemsTotal = useMemo(() => {
    if (selectedGuest === guestTypes.GUEST) {
      // Calculate the total for all guests
      return Object.values(guestsCart).reduce(
        (total, guestCart) => total + (guestCart.totalOrderPrice || 0),
        0
      );
    }
    return currentGuestCart.totalOrderPrice || 0;
  }, [guestsCart, currentGuestCart, selectedGuest]);

  // Handler to remove an item from the cart
  const handleRemoveItemOrder = (cartItemId) => {
    if (cartItemId) {
      dispatch(removeFromCart(cartItemId));
    }
  };

  // Handler to update the quantity of an item in the cart
  const handleUpdateItemOrder = (cartItemId, quantityChange) => {
    dispatch(updateQuantity({ cartItemId, quantityChange }));
  };

  // Handler to switch the selected guest
  const handleGuestChange = (guestId) => {
    setSelectedGuest(guestId);
    dispatch(switchGuest(guestId));
  };

  // Handler to remove a guest from the cart which are not in guests list
  const handleRefreshGuestsCart = () => {
    // Check if the guestsCart is consist more than the guests list or not updated
    const guestsInCart = Object.keys(guestsCart);
    const guestsInList = guests.map((guest) => guest.name);
    const guestsToRemove = guestsInCart.filter(
      (guest) => !guestsInList.includes(guest)
    );
    // Remove guests that are not in the guests list
    guestsToRemove.forEach((guest) => {
      dispatch(removeGuest(guest));
    });
  };

  // Effect to refresh the guests cart when the component mounts
  useMemo(() => {
    if (Array.isArray(guests) && guests.length > 0) {
      handleRefreshGuestsCart();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guests]);

  return (
    <Box
      height="75vh"
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
      {/* /* Tabs to select a guest (only for dine-in individual orders) */}
      {Array.isArray(guests) && guests.length > 0 && (
        <Box
          display="flex"
          overflowX="auto"
          borderBottom="1px solid"
          borderColor="gray.200"
          mb="1rem"
          width="100%"
          scrollBehavior="smooth"
          sx={{
            "&::-webkit-scrollbar": {
              height: "2px",
              transition: "opacity 0.3s ease",
              opacity: 0,
            },
            "&:hover::-webkit-scrollbar": {
              opacity: 1,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#029CFF",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f0f0f0",
            },
            scrollbarWidth: "none", // default hidden on Firefox
            "&:hover": {
              scrollbarWidth: "thin", // show on hover
            },
          }}
        >
          {[{ name: guestTypes.GUEST, label: "All Guests" }, ...guests].map(
            (guest, index) => (
              <Box
                key={index}
                onClick={() => handleGuestChange(guest.name)}
                borderBottom={
                  selectedGuest === guest.name ? "2px solid #029CFF" : "none"
                }
                color={selectedGuest === guest.name ? "#029CFF" : "gray.600"}
                fontWeight={selectedGuest === guest.name ? "bold" : "normal"}
                px="1rem"
                flexShrink={0}
                _hover={{ cursor: "pointer" }}
              >
                {guest.label || guest.name}
              </Box>
            )
          )}
        </Box>
      )}
      {Array.isArray(allCartItems) && allCartItems.length > 0 ? (
        <>
          <Box width="100%">
            {/* Display items for all guests or a specific guest */}
            {selectedGuest === guestTypes.GUEST
              ? Object.entries(guestsCart).map(
                  ([guestName, guestCart]) =>
                    // Display items for each guest except the first one
                    guestName !== guestTypes.GUEST && (
                      <Box key={guestName} mb="1rem">
                        <Text
                          fontWeight="bold"
                          fontSize="md"
                          color="gray.600"
                          mb="0.5rem"
                        >
                          {guestName}&apos;s Orders:
                        </Text>
                        {guestCart.items.length === 0 ? (
                          <Text fontSize="sm" color="gray.500">
                            No items in the cart.
                          </Text>
                        ) : (
                          guestCart.items.map((item) => (
                            <CartItem
                              key={item.cartItemId}
                              item={item}
                              onRemove={handleRemoveItemOrder}
                              onUpdate={handleUpdateItemOrder}
                            />
                          ))
                        )}
                      </Box>
                    )
                )
              : allCartItems.map((item) => (
                  <CartItem
                    key={item.cartItemId}
                    item={item}
                    onRemove={handleRemoveItemOrder}
                    onUpdate={handleUpdateItemOrder}
                  />
                ))}
          </Box>

          {/* Display subtotal and proceed to checkout button */}
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
                {parseFloat(allOrderItemsTotal || 0).toFixed(2)} €
              </Text>
            </Box>
            {currentGuest === guestTypes.GUEST && (
              <Button
                width="100%"
                background="#029CFF"
                color="white"
                _hover={{ color: "#029CFF", bg: "gray.100" }}
                onClick={handleOnProceed}
                size="md"
                borderRadius="full"
                isDisabled={allOrderItemsTotal <= 0}
              >
                Proceed to Checkout
              </Button>
            )}
          </Box>
        </>
      ) : (
        // Display empty cart message if no items are present
        <EmptyCart />
      )}
    </Box>
  );
};

// Prop type validation for the component
GuestsCartBox.propTypes = {
  handleOnProceed: PropTypes.func.isRequired,
};

export default GuestsCartBox;
