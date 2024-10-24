import * as api from "../../api/index.js";

// Helper function to handle API calls
const handleApiCall = async (apiCall, dispatch, actionType, successMessage) => {
  try {
    const { data } = await apiCall();
    dispatch({ type: actionType, data: data?.result });
    return { success: true, message: successMessage };
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || "something went wrong",
    };
  }
};

// Action to accept a delivery
export const acceptDeliveryAction =
  (deliveryId, assignedTo) => async (dispatch) => {
    return handleApiCall(
      () =>
        api.updateDeliveryStatus(deliveryId, {
          userId: assignedTo,
          status: "Accepted",
        }),
      dispatch,
      "ACCEPT_DELIVERY",
      "Delivery accepted successfully"
    );
  };

// Action to cancel a delivery
export const cancelDeliveryAction = (deliveryId) => async (dispatch) => {
  dispatch({ type: "CANCEL_DELIVERY", data: { _id: deliveryId } });
  return { success: true, message: "Delivery canceled successfully" };
};

// Action to complete a delivery
export const completeDeliveryAction = (deliveryId) => async (dispatch) => {
  return handleApiCall(
    () => api.updateDeliveryStatus(deliveryId, "Completed"),
    dispatch,
    "COMPLETE_DELIVERY",
    "Delivery completed successfully"
  );
};

// Action to update the status of a delivery
export const updateDeliveryStatusAction =
  (deliveryId, status, userId) => async (dispatch) => {
    return handleApiCall(
      () => api.updateDeliveryStatus(deliveryId, { userId, status }),
      dispatch,
      status === "Completed"
        ? "ADD_COMPLETED_DELIVERY"
        : "UPDATE_DELIVERY_STATUS",
      "Delivery status updated successfully"
    );
  };

// Action to add a new delivery
export const addDeliveryAction = (newDel) => async (dispatch) => {
  return handleApiCall(
    () => api.addDelivery(newDel),
    dispatch,
    "ADD_DELBOY",
    "Delivery boy added successfully"
  );
};

// Action to get all available deliveries
export const getAllAvailabelDeliveryAction = (id) => async (dispatch) => {
  return handleApiCall(
    () => api.getAllDeliveries(id),
    dispatch,
    "GET_ALL_DELIVERY",
    "All Delivery Personnel Fetched Successfully"
  );
};

// Action to get all completed deliveries for a user
export const getCompletedDeliveriesAction = (userId) => async (dispatch) => {
  return handleApiCall(
    () => api.getCompletedDeliveries(userId),
    dispatch,
    "GET_COMPLETED_DELIVERY",
    "Completed Delivery Fetched Successfully"
  );
};

// Action to get a single delivery by ID
export const getSingleDeliveryAction = (id) => async (dispatch) => {
  return handleApiCall(
    () => api.getSingleDelivery(id),
    dispatch,
    "GET_SINGLE_DELIVERY",
    "Delivery Fetched Successfully"
  );
};

// Action to update a single delivery by ID
export const updateSingleDeliveryAction =
  (id, updateData) => async (dispatch) => {
    return handleApiCall(
      () => api.updateSingleDelivery(id, updateData),
      dispatch,
      "UPDATE_SINGLE_DELIVERY",
      "Delivery Updated Successfully"
    );
  };

// Action to delete a single delivery by ID
export const deleteSingleDeliveryAction = (id) => async (dispatch) => {
  dispatch({ type: "DELETE_SINGLE_DELIVERY", data: { _id: id } });
  return { success: true, message: "Delivery Deleted Successfully" };
};
