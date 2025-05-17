import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  orderType: "",
  guestsCart: {
    guest: {
      items: [], // each item will have a unique cartItemId
      totalOrderPrice: 0,
    },
  },
  currentGuest: "guest", // default to the first guest
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setOrderType: (state, action) => {
      state.orderType = action.payload;
    },
    resetOrderType: (state) => {
      state.orderType = initialState.orderType;
    },
    switchGuest: (state, action) => {
      const guestId = action.payload;
      if (!state.guestsCart[guestId]) {
        state.guestsCart[guestId] = {
          items: [],
          totalOrderPrice: 0,
        };
      }
      state.currentGuest = guestId;
    },
    removeGuest: (state, action) => {
      const guestId = action.payload;
      if (state.guestsCart[guestId]) {
        delete state.guestsCart[guestId];
      }
      // Reset to the first guest if the current guest is removed
      if (state.currentGuest === guestId) {
        const remainingGuests = Object.keys(state.guestsCart);
        state.currentGuest =
          remainingGuests.length > 0 ? remainingGuests[0] : "guest";
      }
    },
    addToCart: (state, action) => {
      const { price, totalQuantity, selectedCustomizations, itemName } =
        action.payload;
      const currentGuest = state.guestsCart[state.currentGuest];

      // Ensure selectedCustomizations is not undefined
      const customizations = selectedCustomizations ?? {};

      // Check if an item with the same customizations exists
      const existingItem = currentGuest.items.find((item) => {
        // If the item has no customizations, match by price and name
        if (
          Object.keys(customizations).length === 0 &&
          Object.keys(item.selectedCustomizations || {}).length === 0
        ) {
          return item.price === price && item.itemName === itemName;
        }
        // Otherwise, match by customizations
        return (
          JSON.stringify(item.selectedCustomizations) ===
          JSON.stringify(customizations)
        );
      });

      if (existingItem) {
        // Update the existing item
        existingItem.totalQuantity += totalQuantity;
        existingItem.totalPrice += price * totalQuantity;
      } else {
        // Create a new item with a unique cartItemId
        currentGuest.items.push({
          ...action.payload,
          cartItemId: uuidv4(),
          totalPrice: price * totalQuantity,
        });
      }

      // Update the total price of the guest's cart
      currentGuest.totalOrderPrice = currentGuest.items.reduce(
        (total, item) => total + item.totalPrice,
        0
      );
    },

    removeFromCart: (state, action) => {
      const cartItemId = action.payload;
      const currentGuest = state.guestsCart[state.currentGuest];
      const itemToRemove = currentGuest.items.find(
        (item) => item.cartItemId === cartItemId
      );

      if (itemToRemove) {
        currentGuest.totalOrderPrice -= itemToRemove.totalPrice;
        currentGuest.items = currentGuest.items.filter(
          (item) => item.cartItemId !== cartItemId
        );
      }
    },

    updateQuantity: (state, action) => {
      const { cartItemId, quantityChange } = action.payload;
      const currentGuest = state.guestsCart[state.currentGuest];
      const item = currentGuest.items.find(
        (item) => item.cartItemId === cartItemId
      );

      if (item) {
        const newQuantity = item.totalQuantity + quantityChange;

        if (newQuantity > 0) {
          item.totalQuantity = newQuantity;
          item.totalPrice = item.price * newQuantity;
        } else {
          currentGuest.items = currentGuest.items.filter(
            (item) => item.cartItemId !== cartItemId
          );
        }

        currentGuest.totalOrderPrice = currentGuest.items.reduce(
          (total, item) => total + item.totalPrice,
          0
        );
      }
    },

    clearCart: (state) => {
      state.guestsCart = {
        guest: {
          items: [],
          totalOrderPrice: 0,
        },
      };
      state.currentGuest = "guest"; // Reset to the first guest
      state.orderType = initialState.orderType; // Reset order type
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setOrderType,
  resetOrderType,
  switchGuest,
  removeGuest,
} = cartSlice.actions;

export default cartSlice.reducer;
