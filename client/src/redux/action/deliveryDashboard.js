import * as api from "../../api/index.js";

export const getDeliveryDashboardDataAction = (userId) => async (dispatch) => {
  try {
    const { data } = await api.getDeliveryDashboardData(userId);
    dispatch({
      type: "SET_DELIVERY_DASHBOARD_DATA",
      data: data.result,
    });
    return { success: true, message: "Dashboard data retrieved successfully" };
  } catch (err) {
    console.log(
      "Error from getDeliveryDashboardDataAction Action: " + err?.message,
      err?.stack
    );
    dispatch({
      type: "SET_DELIVERY_DASHBOARD_DATA",
      data: { error: true },
    });
    return { success: false, message: "something went wrong" };
  }
};
