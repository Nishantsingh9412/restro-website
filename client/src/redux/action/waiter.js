import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../../api/index.js";
import { statuses } from "../../utils/constant.js";

// Action to get waiter dashboard data
export const getWaiterDashboardDataAction = createAsyncThunk(
  "waiter/getWaiterDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.getWaiterDashboardData();
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

// Action to get all orders
export const getWaiterAllOrdersAction = createAsyncThunk(
  "waiter/getAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.getWaiterAllOrders();
      return data.result;
    } catch (err) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

//Update order status action
export const updateOrderStatusActon = createAsyncThunk(
  "waiter/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const updatedData = {
        status: status,
      };
      const { data } = await api.updateDineInOrderStatus(orderId, updatedData);
      return data.result;
    } catch (err) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

// Action to get active order
export const getWaiterActiveOrderAction = createAsyncThunk(
  "waiter/getActiveOrder",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.getWaiterActiveOrder();
      return data.result;
    } catch (err) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

const waiterSlice = createSlice({
  name: "waiter",
  initialState: {
    dashboardData: null,
    shiftsData: null,
    status: "idle",
    error: null,
    orders: [],
    activeOrders: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWaiterDashboardDataAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getWaiterDashboardDataAction.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dashboardData = action.payload;
      })
      .addCase(getWaiterDashboardDataAction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getWaiterAllOrdersAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getWaiterAllOrdersAction.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload;
      })
      .addCase(getWaiterAllOrdersAction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getWaiterActiveOrderAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getWaiterActiveOrderAction.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.activeOrders = action.payload;
      })
      .addCase(getWaiterActiveOrderAction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateOrderStatusActon.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateOrderStatusActon.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { orderId, currentStatus } = action.payload;

        // state.orders = state.orders.map((order) => {
        //   if (order.orderId === orderId) {
        //     order.currentStatus = currentStatus;
        //   }
        //   return order;
        // });
        if (
          currentStatus === statuses.COMPLETED ||
          currentStatus === statuses.CANCELLED
        ) {
          state.activeOrders = state.activeOrders.filter(
            (order) => order.orderId !== orderId
          );
        } else if (currentStatus !== statuses.REJECTED) {
          const existingOrder = state.activeOrders.find(
            (order) => order.orderId === orderId
          );
          if (existingOrder) {
            existingOrder.currentStatus = currentStatus;
          } else {
            state.activeOrders.push(action.payload);
          }
        }
        // remove the order from the list if it is completed or cancelled
        state.orders = state.orders.filter(
          (order) => order.orderId !== orderId
        );
      })
      .addCase(updateOrderStatusActon.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearError } = waiterSlice.actions;

export default waiterSlice.reducer;
