import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../../api/index.js";

const handleAdminAction = async (apiCall, user) => {
  try {
    const { data } = await apiCall(user);
    localStorage.setItem("ProfileData", JSON.stringify(data));
    return { data, success: true, message: "Operation successful" };
  } catch (err) {
    const errorMessage =
      err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : "An unexpected error occurred";
    return { success: false, message: errorMessage };
  }
};

export const signUpAdmin = createAsyncThunk(
  "admin/signUp",
  async (newUser, { rejectWithValue }) => {
    const result = await handleAdminAction(api.signUpAPI, newUser);
    if (!result.success) {
      return rejectWithValue(result.message);
    }
    return result.data;
  }
);

export const loginAdmin = createAsyncThunk(
  "admin/login",
  async (user, { rejectWithValue }) => {
    const result = await handleAdminAction(api.loginAPI, user);
    if (!result.success) {
      return rejectWithValue(result.message);
    }
    return result.data;
  }
);

export const loginEmployee = createAsyncThunk(
  "employee/login",
  async (user, { rejectWithValue }) => {
    const result = await handleAdminAction(api.loginEmployee, user);
    if (!result.success) {
      return rejectWithValue(result.message);
    }
    return result.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    profile: null,
    status: "idle",
    error: null,
  },
  reducers: {
    logoutUser: (state) => {
      state.profile = null;
      localStorage.removeItem("ProfileData");
      console.log("Logged out", state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpAdmin.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signUpAdmin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(signUpAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(loginAdmin.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(loginEmployee.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginEmployee.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(loginEmployee.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logoutUser } = authSlice.actions;

export default authSlice.reducer;
