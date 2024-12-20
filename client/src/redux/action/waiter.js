import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../../api/index.js";

export const getWaiterDashboardDataAction = createAsyncThunk(
  "waiter/getWaiterDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.getWaiterDashboardData();
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
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
      });
  },
});

export const { clearError } = waiterSlice.actions;

export default waiterSlice.reducer;
