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
    console.error(`Error from ${actionType}: ${err.message}`, err.stack);
    // Return error message
    return {
      success: false,
      message: err.response.data.error || "something went wrong",
      status: err.response.status,
    };
  }
};

// Action to allot order to chef
export const allotTakeAwayOrderToChefAction =
  ({ orderId, chef }) =>
  async (dispatch) => {
    try {
      await api.allotTakeAwayOrderToChef(orderId, chef._id);
      dispatch({
        type: "ALLOT_CHEF_TAKE_AWAY",
        data: {
          orderId: orderId,
          assignedTo: { name: chef.name, _id: chef?._id },
        },
      });
      return { success: true, message: "Order allotted successfully" };
    } catch (err) {
      console.error(
        "Error from ALLOT_TAKE_AWAY_ORDER Action: " + err.message,
        err.stack
      );
      return { success: false, message: err?.response?.data?.message };
    }
  };

// Action to post new take-away order
export const postTakeAwayOrderAction = (orderData) => async (dispatch) => {
  return handleApiCall(
    () => api.addTakeAwayOrderAPI(orderData),
    dispatch,
    "POST_TAKE_AWAY_ORDER",
    "Order placed successfully"
  );
};

// Action to get all take-away orders
export const getTakeAwayOrderAction = (localstorageId) => async (dispatch) => {
  return handleApiCall(
    () => api.getAllTakeAwayOrdersAPI(localstorageId),
    dispatch,
    "GET_TAKE_AWAY_ORDER",
    "Order fetched successfully"
  );
};

// reset take-away order
export const resetTakeAwayOrderAction = () => async (dispatch) => {
  return dispatch({ type: "RESET_TAKE_AWAY_ORDER" });
};
