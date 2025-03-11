import { createSlice } from "@reduxjs/toolkit";

const deliveryBoy = createSlice({
  name: "deliveryBoy",
  initialState: {
    deliveryOffer: {
      supplierId: "",
      orderOfferDetails: {},
      isOfferModalOpen: false,
    },
    loading: false,
    error: null,
  },
  reducers: {
    // Reducer Functions
    showDeliveryOffer: (state, action) => {
      const { data, supplier } = action.payload;
      state.deliveryOffer = {
        supplierId: supplier,
        orderOfferDetails: data,
        isOfferModalOpen: true,
      };
    },
    hideDeliveryOffer: (state) => {
      state.deliveryOffer = deliveryBoy.getInitialState().deliveryOffer;
    },
  },
});
export const { showDeliveryOffer, hideDeliveryOffer } = deliveryBoy.actions;

export default deliveryBoy.reducer;
