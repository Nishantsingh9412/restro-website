import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addDeliveryOrderAPI,
  allotDeliveryBoyAPI,
  deleteSingleDeliveryOrderAPI,
  getAllDeliveryOrdersAPI,
  getSingleDeliveryOrderAPI,
  updateSingleDeliveryOrderAPI,
} from "../../api";

// Initial State
const initialState = {
  data: [],
  selectedOrder: null,
  loading: false,
  error: null,
};

// Async Thunks
export const allotDeliveryBoy = createAsyncThunk(
  "deliveryOrder/allotDeliveryBoy",
  async ({ orderId, deliveryBoy }, { rejectWithValue }) => {
    try {
      await allotDeliveryBoyAPI(orderId, deliveryBoy._id);
      return {
        orderId,
        assignedTo: { name: deliveryBoy.name, _id: deliveryBoy._id },
      };
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to allot delivery boy"
      );
    }
  }
);

export const postDeliveryOrder = createAsyncThunk(
  "deliveryOrder/post",
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await addDeliveryOrderAPI(orderData);
      return data?.result;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.error || "Failed to place order"
      );
    }
  }
);

export const getDeliveryOrders = createAsyncThunk(
  "deliveryOrder/getAll",
  async (localstorageId, { rejectWithValue }) => {
    try {
      const { data } = await getAllDeliveryOrdersAPI(localstorageId);
      return data?.result;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.error || "Failed to fetch orders"
      );
    }
  }
);

export const getSingleDeliveryOrder = createAsyncThunk(
  "deliveryOrder/getSingle",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await getSingleDeliveryOrderAPI(id);
      return data?.result;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.error || "Failed to fetch order"
      );
    }
  }
);

export const updateDeliveryOrder = createAsyncThunk(
  "deliveryOrder/update",
  async ({ id, orderData }, { rejectWithValue }) => {
    try {
      const { data } = await updateSingleDeliveryOrderAPI(id, orderData);
      return data?.result;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.error || "Failed to update order"
      );
    }
  }
);

export const deleteDeliveryOrder = createAsyncThunk(
  "deliveryOrder/delete",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await deleteSingleDeliveryOrderAPI(id);
      return data?.result;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.error || "Failed to delete order"
      );
    }
  }
);

// Slice
const deliveryOrderSlice = createSlice({
  name: "deliveryOrder",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Allot delivery boy
      .addCase(allotDeliveryBoy.fulfilled, (state, action) => {
        state.data = state.data.map((item) =>
          item.orderId === action.payload.orderId
            ? { ...item, assignedTo: action.payload.assignedTo }
            : item
        );
      })

      // Post
      .addCase(postDeliveryOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postDeliveryOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(postDeliveryOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All
      .addCase(getDeliveryOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDeliveryOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getDeliveryOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Single
      .addCase(getSingleDeliveryOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingleDeliveryOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(getSingleDeliveryOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateDeliveryOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDeliveryOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(updateDeliveryOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteDeliveryOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDeliveryOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter(
          (item) => item._id !== action.payload._id
        );
      })
      .addCase(deleteDeliveryOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export reducer
export default deliveryOrderSlice.reducer;
