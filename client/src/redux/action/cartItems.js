import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  items: [], // each item will have a unique cartItemId
  totalOrderPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { price, totalQuantity, selectedCustomizations } = action.payload;

      // Ensure selectedCustomizations is not undefined
      const customizations = selectedCustomizations ?? {};

      // Check if an item with the same customizations exists
      const existingItem = state.items.find(
        (item) =>
          JSON.stringify(item.selectedCustomizations) ===
          JSON.stringify(customizations)
      );

      if (existingItem) {
        // Update the existing item
        existingItem.totalQuantity += totalQuantity;
        existingItem.totalPrice += price * totalQuantity;
      } else {
        // Create a new item with a unique cartItemId
        state.items.push({
          ...action.payload,
          cartItemId: uuidv4(),
          totalOrderPrice: price * totalQuantity,
        });
      }

      // Update the total price of the cart
      state.totalOrderPrice = state.items.reduce(
        (total, item) => total + item.totalPrice,
        0
      );
    },

    removeFromCart: (state, action) => {
      const cartItemId = action.payload;
      const itemToRemove = state.items.find(
        (item) => item.cartItemId === cartItemId
      );

      if (itemToRemove) {
        state.totalOrderPrice -= itemToRemove.totalPrice;
        state.items = state.items.filter(
          (item) => item.cartItemId !== cartItemId
        );
      }
    },

    updateQuantity: (state, action) => {
      const { cartItemId, quantityChange } = action.payload;
      const item = state.items.find((item) => item.cartItemId === cartItemId);

      if (item) {
        const newQuantity = item.totalQuantity + quantityChange;

        if (newQuantity > 0) {
          item.totalQuantity = newQuantity;
          item.totalPrice = item.price * newQuantity;
        } else {
          state.items = state.items.filter(
            (item) => item.cartItemId !== cartItemId
          );
        }

        state.totalOrderPrice = state.items.reduce(
          (total, item) => total + item.totalPrice,
          0
        );
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalOrderPrice = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
