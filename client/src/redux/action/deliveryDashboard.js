import * as api from "../../api/index.js";

// Action to get delivery dashboard data
export const getDeliveryDashboardDataAction = (userId) => async (dispatch) => {
  try {
    // Make an API call to get delivery dashboard data
    const { data } = await api.getDeliveryDashboardData(userId);

    // Dispatch the action to set the delivery dashboard data in the store
    dispatch({
      type: "SET_DELIVERY_DASHBOARD_DATA",
      data: data.result,
    });

    // Return success response
    return { success: true, message: "Dashboard data retrieved successfully" };
  } catch (err) {
    // Log the error to the console
    console.error("Error From Get Delivery Dashboard Action:", err);

    // Dispatch the action to set an error state in the store
    dispatch({
      type: "SET_DELIVERY_DASHBOARD_DATA",
      data: { error: true },
    });

    // Return failure response
    return { success: false, message: "Something went wrong" };
  }
};
