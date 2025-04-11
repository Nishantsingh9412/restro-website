// src/redux/slices/cartSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // each item will have a unique cartItemId
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.items.push(action.payload); // payload includes cartItemId
    },

    removeFromCart: (state, action) => {
      const cartItemId = action.payload;
      state.items = state.items.filter(
        (item) => item.cartItemId !== cartItemId
      );
    },

    updateQuantity: (state, action) => {
      const { cartItemId, quantity } = action.payload;
      const item = state.items.find((item) => item.cartItemId === cartItemId);
      if (item) {
        item.quantity = quantity;
      }
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
