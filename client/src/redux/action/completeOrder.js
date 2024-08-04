import * as api from "../../api/index.js";

export const allotDeliveryBoyAction =
  (orderId, deliveryBoy, supplier) => async (dispatch) => {
    try {
      await api.allotDeliveryBoyAPI(orderId, deliveryBoy._id, supplier);
      dispatch({
        type: "ALLOT_DELIVERY_BOY",
        data: {
          orderId: orderId,
          assignedTo: { name: deliveryBoy.name, _id: deliveryBoy._id },
        },
      });
      return { success: true, message: "Delivery boy allocated successfully" };
    } catch (err) {
      console.log("Error from courseFilter Action: " + err.message, err.stack);
      return { success: false, message: err?.response?.data?.message };
    }
  };

export const postCompleteOrderAction = (orderData) => async (dispatch) => {
  try {
    const { data } = await api.addCompleteOrderAPI(orderData);
    dispatch({ type: "POST_COMPLETE_ORDER", data: data?.result });
    return { success: true, message: "Order placed successfully" };
  } catch (err) {
    console.log("Error from courseFilter Action: " + err.message, err.stack);
    return { success: false, message: err?.response?.data?.message };
  }
};

export const getCompleteOrderAction = (localstorageId) => async (dispatch) => {
  try {
    const { data } = await api.getAllCompleteOrdersAPI(localstorageId);
    dispatch({ type: "GET_COMPLETE_ORDER", data: data?.result });
    return { success: true, message: "order fetched successfully" };
  } catch (err) {
    console.log("Error from courseFilter Action: " + err.message, err.stack);
    return { success: false, message: err?.response?.data?.message };
  }
};

export const getSingleCompleteOrderAction = (id) => async (dispatch) => {
  try {
    const { data } = await api.getSingleCompleteOrderAPI(id);
    dispatch({ type: "GET_SINGLE_COMPLETE_ORDER", data: data?.result });
    return { success: true, message: "order fetched successfully" };
  } catch (err) {
    console.log("Error from courseFilter Action: " + err.message, err.stack);
    return { success: false, message: err?.response?.data?.message };
  }
};

export const updateCompleteOrderAction =
  (id, orderData) => async (dispatch) => {
    try {
      const { data } = await api.updateSingleCompleteOrderAPI(id, orderData);
      dispatch({ type: "UPDATE_COMPLETE_ORDER", data: data?.result });
      return { success: true, message: "order updated successfully" };
    } catch (err) {
      console.log("Error from courseFilter Action: " + err.message, err.stack);
      return { success: false, message: err?.response?.data?.message };
    }
  };

export const deleteCompleteOrderAction = (id) => async (dispatch) => {
  try {
    const { data } = await api.deleteSingleCompleteOrderAPI(id);
    dispatch({ type: "DELETE_COMPLETE_ORDER", data: data?.result });
    return { success: true, message: "order deleted successfully" };
  } catch (err) {
    console.log("Error from courseFilter Action: " + err.message, err.stack);
    return { success: false, message: err?.response?.data?.message };
  }
};
