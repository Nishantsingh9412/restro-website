import * as api from "../../api/index.js";

const handleApiCall = async (apiCall, dispatch, actionType, successMessage) => {
  try {
    const { data } = await apiCall;
    if (data && data.result) {
      dispatch({ type: actionType, data: data.result });
      return { success: true, message: successMessage, data: data.result };
    } else {
      throw new Error("No data returned from API");
    }
  } catch (err) {
    return {
      success: false,
      message: err.response.data.error,
      status: err.response.status,
    };
  }
};

export const AddOrderItemAction = (ItemData) => async (dispatch) => {
  return handleApiCall(
    api.AddOrderItem(ItemData),
    dispatch,
    "ADD_ORDER_ITEM",
    "Order Item Added Successfully"
  );
};

export const GetSingleItemOrderAction = (id) => async (dispatch) => {
  return handleApiCall(
    api.GetSingleItemOrder(id),
    dispatch,
    "GET_SINGLE_ORDER_ITEM",
    "Order Item fetched Successfully"
  );
};

export const getAllOrderItemsAction = () => async (dispatch) => {
  return handleApiCall(
    api.getAllOrderItems(),
    dispatch,
    "GET_ALL_ORDER_ITEMS",
    "Order Items fetched Successfully"
  );
};

export const updateSingleItemOrderAction =
  (id, updatedData) => async (dispatch) => {
    return handleApiCall(
      api.UpdateSingleItemOrder(id, updatedData),
      dispatch,
      "UPDATE_SINGLE_ORDER_ITEM",
      "Order Item Updated Successfully"
    );
  };

export const deleteSingleItemOrderAction = (id) => async (dispatch) => {
  try {
    await api.deleteSingleItemOrder(id);
    dispatch({ type: "DELETE_SINGLE_ORDER_ITEM", id });
    return { success: true, message: "Order Item Deleted Successfully" };
  } catch (err) {
    console.error(
      `Error in DELETE_SINGLE_ORDER_ITEM: ${err.message}`,
      err.stack
    );
    return { success: false, message: err.message };
  }
};

export const ResetOrderItemAction = () => async (dispatch) => {
  try {
    dispatch({ type: "RESET_ORDER_ITEM_TEMP" });
    return { success: true, message: "Order Item Reset Successfully" };
  } catch (err) {
    console.error(`Error in RESET_ORDER_ITEM_TEMP: ${err.message}`, err.stack);
    return { success: false, message: err.message };
  }
};
