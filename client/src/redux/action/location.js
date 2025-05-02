import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentLocation: {
    lat: null,
    lng: null,
  },
  deliveryBoyLocations: [],
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setDeliveryBoyLocation: (state, action) => {
      const { _id, name, location, status } = action.payload;
      const existingIndex = state.deliveryBoyLocations.findIndex(
        (loc) => loc._id === _id
      );
      if (existingIndex >= 0) {
        state.deliveryBoyLocations[existingIndex].location = location;
      } else {
        state.deliveryBoyLocations.push({ _id, name, location, status });
      }
    },
    setCurrentLocation: (state, action) => {
      const currentLocation = action.payload;
      state.currentLocation = {
        lat: currentLocation.latitude,
        lng: currentLocation.longitude,
      };
    },
  },
});

export const { setDeliveryBoyLocation, setCurrentLocation } =
  locationSlice.actions;

export default locationSlice.reducer;
