import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addTakeAwayOrderAPI,
  allotTakeAwayOrderToChefAPI,
  getAllTakeAwayOrdersAPI,
} from "../../api";

// Initial State
const initialState = {
  data: [],
  order: [],
  dineInFormData: {},
  loading: false,
  error: null,
};

// Async Thunks

export const allotTakeAwayOrderToChef = createAsyncThunk(
  "takeAwayOrder/allotToChef",
  async ({ orderId, chef }, { rejectWithValue }) => {
    try {
      await allotTakeAwayOrderToChefAPI(orderId, chef._id);
      return {
        orderId,
        assignedChef: { name: chef.name, _id: chef._id },
      };
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to allot chef"
      );
    }
  }
);

export const postTakeAwayOrder = createAsyncThunk(
  "takeAwayOrder/post",
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await addTakeAwayOrderAPI(orderData);
      return data?.result;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.error || "Failed to place order"
      );
    }
  }
);

export const getTakeAwayOrders = createAsyncThunk(
  "takeAwayOrder/getAll",
  async (localstorageId, { rejectWithValue }) => {
    try {
      const { data } = await getAllTakeAwayOrdersAPI(localstorageId);
      return data?.result;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.error || "Failed to fetch orders"
      );
    }
  }
);

// Slice
const takeAwayOrderSlice = createSlice({
  name: "takeAwayOrder",
  initialState,
  reducers: {
    resetTakeAwayOrder: (state) => {
      state.dineInFormData = initialState.dineInFormData;
    },
  },
  extraReducers: (builder) => {
    builder

      // Allot Chef
      .addCase(allotTakeAwayOrderToChef.fulfilled, (state, action) => {
        state.order = state.order.map((item) =>
          item.orderId === action.payload.orderId
            ? { ...item, assignedChef: action.payload.assignedChef }
            : item
        );
      })

      // Post Order
      .addCase(postTakeAwayOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postTakeAwayOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.dineInFormData = action.payload;
      })
      .addCase(postTakeAwayOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Orders
      .addCase(getTakeAwayOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTakeAwayOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(getTakeAwayOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { resetTakeAwayOrder } = takeAwayOrderSlice.actions;
export default takeAwayOrderSlice.reducer;
