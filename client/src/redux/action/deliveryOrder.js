import * as api from "../../api/index.js";

const handleApiCall = async (apiCall, dispatch, actionType, successMessage) => {
  try {
    const { data } = await apiCall();
    dispatch({ type: actionType, data: data?.result });
    return { success: true, message: successMessage };
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.error,
      status: err?.response?.status,
    };
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
      
      return { success: false, message: err?.response?.data?.message };
    }
  };

export const postDeliveryOrderAction = (orderData) => async (dispatch) => {
  return handleApiCall(
    () => api.addDeliveryOrderAPI(orderData),
    dispatch,
    "POST_DELIVERY_ORDER",
    "Order placed successfully"
  );
};

export const getDeliveryOrderAction = (localstorageId) => async (dispatch) => {
  return handleApiCall(
    () => api.getAllDeliveryOrdersAPI(localstorageId),
    dispatch,
    "GET_DELIVERY_ORDER",
    "Order fetched successfully"
  );
};

export const getSingleDeliveryOrderAction = (id) => async (dispatch) => {
  return handleApiCall(
    () => api.getSingleDeliveryOrderAPI(id),
    dispatch,
    "GET_SINGLE_DELIVERY_ORDER",
    "Order fetched successfully"
  );
};

export const updateCompleteOrderAction =
  (id, orderData) => async (dispatch) => {
    return handleApiCall(
      () => api.updateSingleDeliveryOrderAPI(id, orderData),
      dispatch,
      "UPDATE_DELIVERY_ORDER",
      "Order updated successfully"
    );
  };

export const deleteCompleteOrderAction = (id) => async (dispatch) => {
  return handleApiCall(
    () => api.deleteSingleDeliveryOrderAPI(id),
    dispatch,
    "DELETE_DELIVERY_ORDER",
    "Order deleted successfully"
  );
};
