import * as api from "../../api/index.js";
import { userTypes } from "../../utils/constant.js";

export const getAllNotifications = () => async (dispatch) => {
  try {
    const { data } = await api.getAllNotifications();
    dispatch({ type: "GET_ALL_NOTIFICATIONS", data: data?.result });
    return {
      success: true,
      message: "All Notifications Fetched Successfully",
    };
  } catch (err) {
    // console.log(
    //   "Error from getAllNotifications Action: " + err?.message,
    //   err?.stack
    // );
    return {
      success: false,
      message: err.response.data.error || "something went wrong",
      status: err.response.status,
    };
  }
};

export const getAllReceivedNotifications = (role) => async (dispatch) => {
  try {
    const { data } =
      role === userTypes.ADMIN
        ? await api.getNotificationByAdmin()
        : await api.getNotificationsByUser();

    dispatch({
      type:
        role === userTypes.ADMIN
          ? "GET_ALL_ADMIN_NOTIFICATIONS"
          : "GET_ALL_NOTIFICATIONS",
      data: data?.result,
    });
    return {
      success: true,
      message: "All Received Notifications Fetched Successfully",
    };
  } catch (err) {
    console.log(
      "Error from getAllReceivedNotifications Action: " + err?.message,
      err?.stack
    );
    return { success: false, message: "something went wrong" };
  }
};
