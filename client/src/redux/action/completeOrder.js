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
      message: err?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// Action to post a complete order
export const postCompleteOrderAction = (orderData) => async (dispatch) => {
  return handleApiCall(
    () => api.addCompleteOrderAPI(orderData),
    dispatch,
    "POST_COMPLETE_ORDER",
    "Order placed successfully"
  );
};

// Action to get all complete orders
export const getCompleteOrderAction = (localstorageId) => async (dispatch) => {
  return handleApiCall(
    () => api.getAllCompleteOrdersAPI(localstorageId),
    dispatch,
    "GET_COMPLETE_ORDER",
    "Order fetched successfully"
  );
};

// Action to get a single complete order by ID
export const getSingleCompleteOrderAction = (id) => async (dispatch) => {
  return handleApiCall(
    () => api.getSingleCompleteOrderAPI(id),
    dispatch,
    "GET_SINGLE_COMPLETE_ORDER",
    "Order fetched successfully"
  );
};

// Action to update a complete order by ID
export const updateCompleteOrderAction =
  (id, orderData) => async (dispatch) => {
    return handleApiCall(
      () => api.updateSingleCompleteOrderAPI(id, orderData),
      dispatch,
      "UPDATE_COMPLETE_ORDER",
      "Order updated successfully"
    );
  };

// Action to delete a complete order by ID
export const deleteCompleteOrderAction = (id) => async (dispatch) => {
  return handleApiCall(
    () => api.deleteSingleCompleteOrderAPI(id),
    dispatch,
    "DELETE_COMPLETE_ORDER",
    "Order deleted successfully"
  );
};
