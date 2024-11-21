import * as api from "../../api/index.js";

export const getAllNotifications = () => async (dispatch) => {
  try {
    const { data } = await api.getAllNotifications();
    dispatch({ type: "GET_ALL_NOTIFICATIONS", data: data?.result });
    return {
      success: true,
      message: "All Notifications Fetched Successfully",
    };
  } catch (err) {
    console.log(
      "Error from getAllNotifications Action: " + err?.message,
      err?.stack
    );
    return { success: false, message: "something went wrong" };
  }
};

export const getAllReceivedNotifications = (id, role) => async (dispatch) => {
  try {
    const { data } = (await (role === "admin"))
      ? api.getNotificationByAdmin()
      : api.getNotificationsByUser();
    dispatch({
      type:
        role === "admin"
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
