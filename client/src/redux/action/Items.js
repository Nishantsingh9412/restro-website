import * as api from "../../api/index.js";

// Helper function to handle errors
// eslint-disable-next-line no-unused-vars
const handleError = (err, actionName) => {
  // console.log(`Error from ${actionName}: ${err.message}`, err.stack);
  return { success: false, message: err.response.data.error, status: err.response.status };  
};

// Action to add a new item
export const addItemAction = (itemData) => async (dispatch) => {
  try {
    const { data } = await api.AddItem(itemData);
    dispatch({ type: "ADD_ITEM", data: data.result });
    return { success: true, message: "Item Added Successfully" };
  } catch (err) {
    return handleError(err, "AddItemAction");
  }
};

// Action to fetch all items
export const getAllItemsAction = (localStorageId) => async (dispatch) => {
  try {
    const { data } = await api.GetAllItems(localStorageId);
    dispatch({ type: "GET_ALL_ITEMS", data: data.result });
    return { success: true, message: "Items Fetched Successfully" };
  } catch (err) {
    console.log(err);
    return handleError(err, "GetAllItemsAction");
  }
};

// Action to fetch a single item by ID
export const getSingleItemAction = (id) => async (dispatch) => {
  try {
    const { data } = await api.GetSingleItem(id);
    dispatch({ type: "GET_SINGLE_ITEM", data: data.result });
    return { success: true, message: "Item Fetched Successfully" };
  } catch (err) {
    return handleError(err, "GetSingleItemAction");
  }
};

// Action to update a single item by ID
export const updateSingleItemAction = (id, updatedData) => async (dispatch) => {
  try {
    const { data } = await api.updateSingleItem(id, updatedData);
    dispatch({ type: "UPDATE_SINGLE_ITEM", data: data.result });
    return { success: true, message: "Item Updated Successfully" };
  } catch (err) {
    return handleError(err, "UpdateSingleItemAction");
  }
};

// Action to delete a single item by ID
export const deleteSingleItemAction = (id) => async (dispatch) => {
  try {
    await api.deleteSingleItem(id);
    dispatch({ type: "DELETE_SINGLE_ITEM", id });
    return { success: true, message: "Item Deleted Successfully" };
  } catch (err) {
    return handleError(err, "DeleteSingleItemAction");
  }
};
