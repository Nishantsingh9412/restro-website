// hooks/useGuestsCartLogic.js
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  updateQuantity,
  switchGuest,
  removeGuest,
} from "../redux/action/cartItems";
import { guestTypes } from "../utils/constant";
import { useToast } from "../contexts/useToast";

export const useGuestsCartLogic = (handleOnProceed) => {
  const showToast = useToast();
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
    const guestsInCart = Object.keys(guestsCart);
    const guestsInList = guests.map((guest) => guest.name);
    const guestsToRemove = guestsInCart.filter(
      (guest) => !guestsInList.includes(guest)
    );
    const guestsToAdd = guestsInList.filter(
      (guest) => !guestsInCart.includes(guest)
    );
    // Add new guests to the cart
    guestsToAdd.forEach((guest) => {
      dispatch(switchGuest(guest));
    });
    guestsToRemove.forEach((guest) => {
      dispatch(removeGuest(guest));
    });
  };

  // Handler to proceed to checkout
  const handleOnSubmit = () => {
    // Check if the every guest consist orders items atleast one
    const allGuestsHaveItems = Object.entries(guestsCart).every(
      ([guestName, guestCart]) =>
        guestName === guestTypes.GUEST || guestCart.items.length > 0
    );
    if (!allGuestsHaveItems) {
      showToast("Please add items to the cart for all guests", "info");
      return;
    }
    // Proceed to checkout with the selected guest
    if (selectedGuest === guestTypes.GUEST) {
      handleOnProceed();
    }
  };

  // Effect to refresh the guests cart when the component mounts
  useEffect(() => {
    if (Array.isArray(guests) && guests.length > 0) {
      handleRefreshGuestsCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guests]);

  return {
    guests,
    currentGuest,
    selectedGuest,
    allCartItems,
    allOrderItemsTotal,
    guestsCart,
    handleGuestChange,
    handleRemoveItemOrder,
    handleUpdateItemOrder,
    handleOnSubmit,
  };
};
