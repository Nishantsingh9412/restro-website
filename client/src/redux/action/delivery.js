import * as api from "../../api/index.js";

const handleApiCall = async (apiCall, dispatch, actionType, successMessage) => {
  try {
    const { data } = await apiCall();
    dispatch({ type: actionType, data: data?.result || { _id: data?.id } });
    return { success: true, message: successMessage };
  } catch (err) {
    console.log(`Error from ${actionType} Action: ${err?.message}`, err?.stack);
    return { success: false, message: "something went wrong" };
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

export const cancelDeliveryAction =
  (deliveryId, userId) => async (dispatch) => {
    return handleApiCall(
      () =>
        api.updateDeliveryStatus(deliveryId, { status: "Canceled", userId }),
      dispatch,
      "CANCEL_DELIVERY",
      "Delivery canceled successfully"
    );
  };

export const completeDeliveryAction =
  (deliveryId, userId) => async (dispatch) => {
    return handleApiCall(
      () =>
        api.updateDeliveryStatus(deliveryId, { status: "Completed", userId }),
      dispatch,
      "COMPLETE_DELIVERY",
      "Delivery completed successfully"
    );
  };

export const udpateDeliveryStatusAction =
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

export const addDeliveryAction = (newDel) => async (dispatch) => {
  return handleApiCall(
    () => api.addDelivery(newDel),
    dispatch,
    "ADD_DELBOY",
    "Delivery boy added successfully"
  );
};

export const getAllAvailabelDeliveryAction = (id) => async (dispatch) => {
  return handleApiCall(
    () => api.getAllDeliveries(id),
    dispatch,
    "GET_ALL_DELIVERY",
    "All Delivery Personnel Fetched Successfully"
  );
};

export const getActiveDeliveryAction = (id) => async (dispatch) => {
  return handleApiCall(
    () => api.getActiveDelivery(id),
    dispatch,
    "SET_ACTIVE_DELIVERY",
    "Active Delivery Fetched Successfully"
  );
};

export const getCompletedDeliveriesAction = (userId) => async (dispatch) => {
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
