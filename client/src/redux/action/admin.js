import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../../api/index.js";

export const getAdminData = createAsyncThunk(
  "admin/getAdminData",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.getAdminData();
      return data.result;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const updateAdminProfilePic = createAsyncThunk(
  "admin/updateAdminProfilePic",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.updateAdminProfilePic(formData);
      return data.result;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    data: null,
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
      .addCase(getAdminData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAdminData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(getAdminData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateAdminProfilePic.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateAdminProfilePic.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(updateAdminProfilePic.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearError } = adminSlice.actions;

export default adminSlice.reducer;
