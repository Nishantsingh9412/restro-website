import { userTypes } from "../../utils/constant";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getNotificationByAdmin, getNotificationsByUser } from "../../api";

export const getAllNotifications = createAsyncThunk(
  "notifications/get-all",
  async (role, { rejectWithValue }) => {
    try {
      const { data } =
        role === userTypes.ADMIN
          ? await getNotificationByAdmin()
          : await getNotificationsByUser();
      return data.result;
    } catch (err) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    data: [],
    status: "idle",
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action) => {
      const { data } = action.payload;
      if (!state.data.some((item) => item._id === data._id)) {
        state.data.unshift(data);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllNotifications.pending, (state) => {
        state.status = "isLoading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload || [];
        state.error = null;
        state.isLoading = false;
      })
      .addCase(getAllNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch notifications.";
        state.isLoading = false;
      });
  },
});

export const { addNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
