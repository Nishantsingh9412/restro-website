import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import * as api from "../../api/index.js";

export const getLoggedInUserData = createAsyncThunk(
  "user/getLoggedInUserData",
  async (role, { rejectWithValue }) => {
    try {
      if (role === "admin") {
        const { data } = await api.getAdminData();
        return data.result;
      } else {
        const { data } = await api.getEmployeeData();
        return data.result;
      }
    } catch (err) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

// update profile picture
export const updateProfilePicAction = createAsyncThunk(
  "user/updateProfilePic",
  async (formData, { rejectWithValue }) => {
    try {
      const role = formData.get("role");
      if (role === "admin") {
        const { data } = await api.updateAdminProfilePic(formData);
        return data.result;
      } else {
        const { data } = await api.updateEmployeeProfilePic(formData);
        return data.result;
      }
    } catch (err) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearEmpData: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLoggedInUserData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getLoggedInUserData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(getLoggedInUserData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateProfilePicAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProfilePicAction.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(updateProfilePicAction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearError, clearEmpData } = userSlice.actions;

export default userSlice.reducer;
