import * as api from "../../api/index.js";

const handleApiCall = async (apiCall, dispatch, actionType, successMessage) => {
  try {
    const { data } = await apiCall();
    dispatch({ type: actionType, data: data?.result });
    return { success: true, message: successMessage };
  } catch (err) {
    return {
      success: false,
      message: err.response.data.error || "something went wrong",
    };
  }
};

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

export const cancelDeliveryAction = (deliveryId) => async (dispatch) => {
  return handleApiCall(
    () => api.updateDeliveryStatus(deliveryId, { status: "Cancelled" }),
    dispatch,
    "CANCEL_DELIVERY",
    "Delivery canceled successfully"
  );
};

export const completeDeliveryAction = (deliveryId) => async (dispatch) => {
  return handleApiCall(
    () => api.updateDeliveryStatus(deliveryId, { status: "Delivered" }),
    dispatch,
    "COMPLETE_DELIVERY",
    "Delivery completed successfully"
  );
};

export const udpateDeliveryStatusAction =
  (deliveryId, status) => async (dispatch) => {
    return handleApiCall(
      () => api.updateDeliveryStatus(deliveryId, { status }),
      dispatch,
      status === "Delivered"
        ? "ADD_COMPLETED_DELIVERY"
        : "UPDATE_DELIVERY_STATUS",
      "Delivery status updated successfully"
    );
  };

export const addDeliveryAction = (newDel) => async (dispatch) => {
  return handleApiCall(
    () => api.addDelivery(newDel),
    dispatch,
    "ADD_DELBOY",
    "Delivery boy added successfully"
  );
};

export const getAllAvailabelDeliveryAction = () => async (dispatch) => {
  return handleApiCall(
    () => api.getAllDeliveries(),
    dispatch,
    "GET_ALL_DELIVERY",
    "All Delivery Personnel Fetched Successfully"
  );
};

export const getActiveDeliveryAction = () => async (dispatch) => {
  return handleApiCall(
    () => api.getActiveDelivery(),
    dispatch,
    "SET_ACTIVE_DELIVERY",
    "Active Delivery Fetched Successfully"
  );
};

export const getCompletedDeliveriesAction = () => async (dispatch) => {
  return handleApiCall(
    () => api.getCompletedDeliveries(),
    dispatch,
    "GET_COMPLETED_DELIVERY",
    "Completed Delivery Fetched Successfully"
  );
};

export const getSingleDeliveryAction = (id) => async (dispatch) => {
  return handleApiCall(
    () => api.getSingleDelivery(id),
    dispatch,
    "GET_SINGLE_DELIVERY",
    "Delivery Fetched Successfully"
  );
};

export const updateSingleDeliveryAction =
  (id, updateData) => async (dispatch) => {
    return handleApiCall(
      () => api.updateSingleDelivery(id, updateData),
      dispatch,
      "UPDATE_SINGLE_DELIVERY",
      "Delivery Updated Successfully"
    );
  };

export const deleteSingleDeliveryAction = (id) => async (dispatch) => {
  return handleApiCall(
    () => api.deleteSingleDelivery(id),
    dispatch,
    "DELETE_SINGLE_DELIVERY",
    "Delivery Deleted Successfully"
  );
};
