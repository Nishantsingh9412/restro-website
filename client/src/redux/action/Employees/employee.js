import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../../../api/index.js";

const handlePending = (state) => {
  state.loading = true;
};

const handleFulfilled = (state, action, key) => {
  state.loading = false;
  state[key] = action.payload;
};

const handleRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

export const updateEmployeeOnlineStatus = createAsyncThunk(
  "employee/updateEmployeeOnlineStatus",
  async (formdata, { rejectWithValue }) => {
    try {
      const { data } = await api.updateEmployeeOnlineStatus(formdata);
      return data.result;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const updateOdometerReading = createAsyncThunk(
  "employee/updateOdometerReading",
  async (formdata, { rejectWithValue }) => {
    try {
      const { data } = await api.updateOdometerReading(formdata);
      return data.result;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const getEmployeeShifts = createAsyncThunk(
  "employee/getEmployeeShifts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.getEmployeeShifts();
      return data.result;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    shifts: [],
    status: null,
    odometer: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateEmployeeOnlineStatus.pending, handlePending)
      .addCase(updateEmployeeOnlineStatus.fulfilled, (state, action) =>
        handleFulfilled(state, action, "status")
      )
      .addCase(updateEmployeeOnlineStatus.rejected, handleRejected)
      .addCase(getEmployeeShifts.pending, handlePending)
      .addCase(getEmployeeShifts.fulfilled, (state, action) =>
        handleFulfilled(state, action, "shifts")
      )
      .addCase(getEmployeeShifts.rejected, handleRejected)
      .addCase(updateOdometerReading.pending, handlePending)
      .addCase(updateOdometerReading.fulfilled, (state, action) =>
        handleFulfilled(state, action, "odometer")
      )
      .addCase(updateOdometerReading.rejected, handleRejected);
  },
});

export const { clearError } = employeeSlice.actions;

export default employeeSlice.reducer;
