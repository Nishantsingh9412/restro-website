import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dineIn: {
    customerName: "",
    specialRequests: "",
    tableNumber: "",
    numberOfGuests: "",
    paymentMethod: "",
    orderMethod: "",
    guests: [],
  },
  takeAway: {
    customerName: "",
  },
  delivery: {
    customerName: "",
    phoneNumber: "",
    paymentMethod: "",
    city: "",
    address: "",
    dropLocation: {
      lat: NaN,
      lng: NaN,
    },
    dropLocationName: "",
    zip: "",
    noteFromCustomer: "",
  },
};

const customerInfo = createSlice({
  name: "customerInfo",
  initialState: initialState,
  reducers: {
    setDineInInfo: (state, action) => {
      state.dineIn = {
        ...state.dineIn,
        ...action.payload,
      };
      // Update guests array if number of guests changes
      if (action.payload.numberOfGuests) {
        const numberOfGuests = parseInt(action.payload.numberOfGuests, 10);
        if (numberOfGuests < state.dineIn.guests.length) {
          state.dineIn.guests = state.dineIn.guests.slice(0, numberOfGuests);
        }
      }
    },
    updateDineInGuestName: (state, action) => {
      const { index, name } = action.payload;
      const updatedGuests = state.dineIn.guests || [];
      updatedGuests[index] = {
        ...(updatedGuests[index] || {}),
        name,
      };
      state.dineIn.guests = updatedGuests;
    },
    resetDineInInfo: (state) => {
      state.dineIn = initialState.dineIn;
    },
    setTakeAwayInfo: (state, action) => {
      state.takeAway = {
        ...state.takeAway,
        ...action.payload,
      };
    },
    resetTakeAwayInfo: (state) => {
      state.takeAway = initialState.takeAway;
    },
    setDeliveryInfo: (state, action) => {
      state.delivery = {
        ...state.delivery,
        ...action.payload,
      };
    },
    resetDeliveryInfo: (state) => {
      state.delivery = initialState.delivery;
    },
    resetAllInfo: (state) => {
      state.dineIn = initialState.dineIn;
      state.takeAway = initialState.takeAway;
      state.delivery = initialState.delivery;
      state.orderType = initialState.orderType;
    },
  },
});

export const {
  setDineInInfo,
  updateDineInGuestName,
  resetDineInInfo,
  setTakeAwayInfo,
  resetTakeAwayInfo,
  setDeliveryInfo,
  resetDeliveryInfo,
  resetAllInfo,
} = customerInfo.actions;

export default customerInfo.reducer;
