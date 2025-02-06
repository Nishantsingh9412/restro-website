import * as api from "../../api/index.js";

// Helper function to handle API calls
const handleApiCall = async (apiCall, dispatch, actionType, successMessage) => {
  try {
    // Execute the API call
    const { data } = await apiCall();
    // Dispatch the action with the result data
    dispatch({ type: actionType, data: data?.result });
    // Return success message
    return { success: true, message: successMessage };
  } catch (err) {
    // Log the error
    // console.error(`Error from ${actionType}: ${err.message}`, err.stack);
    // Return error message
    return {
      success: false,
      message: err?.response?.data?.error || "An unexpected error occurred",
      status: err?.response?.status,
    };
  }
};
// Action to allot order to waiter
export const allotDineInOrderToWaiterAction =
  ({ orderId, waiter }) =>
  async (dispatch) => {
    try {
      await api.allotDineInOrderToWaiter(orderId, waiter._id);
      dispatch({
        type: "ALLOT_WAITER_DINE_IN",
        data: {
          orderId: orderId,
          assignedTo: { name: waiter.name, _id: waiter?._id },
        },
      });
      return { success: true, message: "Order allotted successfully" };
    } catch (err) {
      console.error(
        "Error from ALLOT_DINE_IN_ORDER Action: " + err.message,
        err.stack
      );
      return { success: false, message: err?.response?.data?.message };
    }
  };

// Action to allot order to chef
export const allotDineInOrderToChefAction =
  ({ orderId, chef }) =>
  async (dispatch) => {
    try {
      await api.allotDineInOrderToChef(orderId, chef._id);
      dispatch({
        type: "ALLOT_CHEF_DINE_IN",
        data: {
          orderId: orderId,
          assignedTo: { name: chef.name, _id: chef?._id },
        },
      });
      return { success: true, message: "Order allotted successfully" };
    } catch (err) {
      console.error(
        "Error from ALLOT_DINE_IN_ORDER Action: " + err.message,
        err.stack
      );
      return { success: false, message: err?.response?.data?.message };
    }
  };

// Action to post new dine-in order
export const postDineInOrderAction = (orderData) => async (dispatch) => {
  return handleApiCall(
    () => api.addDineInOrderAPI(orderData),
    dispatch,
    "POST_DINE_IN_ORDER",
    "Order placed successfully"
  );
};

// Action to get all dine-in orders
export const getDineInOrderAction = () => async (dispatch) => {
  return handleApiCall(
    () => api.getAllDineInOrdersAPI(),
    dispatch,
    "GET_DINE_IN_ORDER",
    "Order fetched successfully"
  );
};

// reset dine-in order
export const resetDineInOrderAction = () => async (dispatch) => {
  return dispatch({ type: "RESET_DINE_IN_ORDER" });
};
