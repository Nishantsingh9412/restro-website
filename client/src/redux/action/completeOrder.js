import * as api from "../../api/index.js";

const handleApiCall = async (apiCall, dispatch, actionType, successMessage) => {
  try {
    const { data } = await apiCall();
    dispatch({ type: actionType, data: data?.result });
    return { success: true, message: successMessage };
  } catch (err) {
    // console.log(`Error from ${actionType} Action: ${err.message}`, err.stack);
    return { success: false, message: err?.response?.data?.error, status: err?.response?.status };
  }
};
export const allotDeliveryBoyAction =
  ({ orderId, deliveryBoy }) =>
  async (dispatch) => {
    console.log("Allot Delivery", orderId, deliveryBoy._id);
    try {
      await api.allotDeliveryBoyAPI(orderId, deliveryBoy?._id);
      dispatch({
        type: "ALLOT_DELIVERY_BOY",
        data: {
          orderId: orderId,
          assignedTo: { name: deliveryBoy.name, _id: deliveryBoy?._id },
        },
      });
      return { success: true, message: "Delivery boy allocated successfully" };
    } catch (err) {
      console.log(
        "Error from ALLOT_DELIVERY_BOY Action: " + err.message,
        err.stack
      );
      return { success: false, message: err?.response?.data?.message };
    }
  };

export const postCompleteOrderAction = (orderData) => async (dispatch) => {
  return handleApiCall(
    () => api.addCompleteOrderAPI(orderData),
    dispatch,
    "POST_COMPLETE_ORDER",
    "Order placed successfully"
  );
};

export const getCompleteOrderAction = (localstorageId) => async (dispatch) => {
  return handleApiCall(
    () => api.getAllCompleteOrdersAPI(localstorageId),
    dispatch,
    "GET_COMPLETE_ORDER",
    "Order fetched successfully"
  );
};

export const getSingleCompleteOrderAction = (id) => async (dispatch) => {
  return handleApiCall(
    () => api.getSingleCompleteOrderAPI(id),
    dispatch,
    "GET_SINGLE_COMPLETE_ORDER",
    "Order fetched successfully"
  );
};

export const updateCompleteOrderAction =
  (id, orderData) => async (dispatch) => {
    return handleApiCall(
      () => api.updateSingleCompleteOrderAPI(id, orderData),
      dispatch,
      "UPDATE_COMPLETE_ORDER",
      "Order updated successfully"
    );
  };

export const deleteCompleteOrderAction = (id) => async (dispatch) => {
  return handleApiCall(
    () => api.deleteSingleCompleteOrderAPI(id),
    dispatch,
    "DELETE_COMPLETE_ORDER",
    "Order deleted successfully"
  );
};
