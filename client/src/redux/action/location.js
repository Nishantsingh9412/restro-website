import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    deliveryBoyLocations: []
};

const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        setDeliveryBoyLocation: (state, action) => {
            const { _id, location } = action.payload;
            const existingIndex = state.deliveryBoyLocations.findIndex(loc => loc._id === _id);
            if (existingIndex >= 0) {
                state.deliveryBoyLocations[existingIndex].location = location;
            } else {
                state.deliveryBoyLocations.push({ _id, location });
            }
        }
    }
});

export const { setDeliveryBoyLocation } = locationSlice.actions;

export default locationSlice.reducer;