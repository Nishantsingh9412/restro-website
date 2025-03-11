import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../../../api/index.js";
import { orderTypes, statuses } from "../../../utils/constant.js";

// Action to get chef dashboard data
export const getChefDashboardDataAction = createAsyncThunk(
  "chef/getChefDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.getChefDashboardData();
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

// Action to get all orders
export const getChefAllOrdersAction = createAsyncThunk(
  "chef/getAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.getChefAllOrders();
      return data.result;
    } catch (err) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

// Action to get active order
export const getChefActiveOrderAction = createAsyncThunk(
  "chef/getActiveOrder",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.getChefActiveOrder();
      return data.result;
    } catch (err) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

// Update order status action
export const updateOrderStatusActon = createAsyncThunk(
  "chef/updateOrderStatus",
  async ({ orderType, orderId, status }, { rejectWithValue }) => {
    try {
      const apiCall =
        orderType === orderTypes.DINE_IN
          ? api.updateDineInOrderStatus
          : api.updateTakeAwayOrderStatus;
      const updatedData = {
        status: status,
      };
      const { data } = await apiCall(orderId, updatedData);
      return data.result;
    } catch (err) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

const chefSlice = createSlice({
  name: "chef",
  initialState: {
    dashboardData: null,
    shiftsData: null,
    status: "idle",
    error: null,
    orders: {
      dineInOrders: [],
      takeAwayOrders: [],
    },
    activeOrder: {
      dineInActiveOrder: null,
      takeAwayActiveOrder: null,
    },
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addTakeAwayOrder: (state, action) => {
      if (
        !state.orders.takeAwayOrders.some(
          (order) => order.orderId === action.payload.orderId
        )
      ) {
        state.orders.takeAwayOrders.push(action.payload);
      }
    },
    addDineInOrderToChef: (state, action) => {
      if (
        !state.orders.dineInOrders.some(
          (order) => order.orderId === action.payload.orderId
        )
      ) {
        state.orders.dineInOrders.push(action.payload);
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getChefDashboardDataAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getChefDashboardDataAction.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dashboardData = action.payload;
      })
      .addCase(getChefDashboardDataAction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getChefAllOrdersAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getChefAllOrdersAction.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload;
      })
      .addCase(getChefAllOrdersAction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getChefActiveOrderAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getChefActiveOrderAction.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { dineInActiveOrder, takeAwayActiveOrder } = action.payload;
        state.activeOrder["dineInActiveOrder"] =
          dineInActiveOrder?.length > 0 ? dineInActiveOrder[0] : null;
        state.activeOrder["takeAwayActiveOrder"] =
          takeAwayActiveOrder?.length > 0 ? takeAwayActiveOrder[0] : null;
      })
      .addCase(getChefActiveOrderAction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateOrderStatusActon.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateOrderStatusActon.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { orderId, currentStatus } = action.payload;
        const orderType = action.meta.arg.orderType;
        const ordersKey =
          orderType === orderTypes.DINE_IN ? "dineInOrders" : "takeAwayOrders";
        const activeOrderKey =
          orderType === orderTypes.DINE_IN
            ? "dineInActiveOrder"
            : "takeAwayActiveOrder";

        if (
          currentStatus === statuses.COMPLETED ||
          currentStatus === statuses.CANCELLED
        ) {
          state.activeOrder[activeOrderKey] = null;
        } else if (currentStatus !== statuses.REJECTED) {
          state.activeOrder[activeOrderKey] = action.payload;
        }
        // Remove the order from the orders list
        state.orders[ordersKey] = state.orders[ordersKey].filter(
          (o) => o.orderId !== orderId
        );
      })
      .addCase(updateOrderStatusActon.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearError, addTakeAwayOrder, addDineInOrderToChef } =
  chefSlice.actions;

export default chefSlice.reducer;
