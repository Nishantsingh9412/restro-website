import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addDineInOrderAPI,
  allotDineInOrderToChefAPI,
  allotDineInOrderToWaiterAPI,
  getAllDineInOrdersAPI,
} from "../../api";

// Initial State
const initialState = {
  data: [],
  order: [],
  dineInFormData: {},
  loading: false,
  error: null,
};

// Thunks

export const allotDineInOrderToWaiter = createAsyncThunk(
  "dineInOrder/allotToWaiter",
  async ({ orderId, waiter }, { rejectWithValue }) => {
    try {
      await allotDineInOrderToWaiterAPI(orderId, waiter._id);
      return {
        orderId,
        assignedWaiter: { name: waiter.name, _id: waiter._id },
      };
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to allot waiter"
      );
    }
  }
);

export const allotDineInOrderToChef = createAsyncThunk(
  "dineInOrder/allotToChef",
  async ({ orderId, chef }, { rejectWithValue }) => {
    try {
      await allotDineInOrderToChefAPI(orderId, chef._id);
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

export const postDineInOrder = createAsyncThunk(
  "dineInOrder/post",
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await addDineInOrderAPI(orderData);
      return data?.result;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.error || "Failed to post order"
      );
    }
  }
);

export const getDineInOrders = createAsyncThunk(
  "dineInOrder/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getAllDineInOrdersAPI();
      return data?.result;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.error || "Failed to fetch orders"
      );
    }
  }
);

// Slice
const dineInOrderSlice = createSlice({
  name: "dineInOrder",
  initialState,
  reducers: {
    resetDineInOrder(state) {
      state.dineInFormData = initialState.dineInFormData;
    },
  },
  extraReducers: (builder) => {
    builder

      // Waiter Allotment
      .addCase(allotDineInOrderToWaiter.fulfilled, (state, action) => {
        state.order = state.order.map((item) =>
          item.orderId === action.payload.orderId
            ? { ...item, assignedWaiter: action.payload.assignedWaiter }
            : item
        );
      })

      // Chef Allotment
      .addCase(allotDineInOrderToChef.fulfilled, (state, action) => {
        state.order = state.order.map((item) =>
          item.orderId === action.payload.orderId
            ? { ...item, assignedChef: action.payload.assignedChef }
            : item
        );
      })

      // Post Order
      .addCase(postDineInOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postDineInOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(postDineInOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Orders
      .addCase(getDineInOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDineInOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(getDineInOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { resetDineInOrder } = dineInOrderSlice.actions;
export default dineInOrderSlice.reducer;
