import * as api from '../../api/index.js';

const handleApiCall = async (apiCall, dispatch, actionType, successMessage) => {
    try {
        const { data } = await apiCall;
        if (data && data.result) {
            dispatch({ type: actionType, data: data.result });
            return { success: true, message: successMessage, data: data.result };
        } else {
            throw new Error('No data returned from API');
        }
    } catch (err) {
        // console.log(err);
        // console.error(`Error in ${actionType}: ${err.message}`, err.stack);
        return { success: false, message: err.response.data.error, status: err.response.status };
    }
};

export const AddOrderItemAction = (ItemData) => async (dispatch) => {
    return handleApiCall(api.AddOrderItem(ItemData), dispatch, 'ADD_ORDER_ITEM', 'Order Item Added Successfully');
};

export const GetSingleItemOrderAction = (id) => async (dispatch) => {
    return handleApiCall(api.GetSingleItemOrder(id), dispatch, 'GET_SINGLE_ORDER_ITEM', 'Order Item fetched Successfully');
};

export const getAllOrderItemsAction = (localStorageId) => async (dispatch) => {
    return handleApiCall(api.getAllOrderItems(localStorageId), dispatch, 'GET_ALL_ORDER_ITEMS', 'Order Items fetched Successfully');
};

export const getDrinksOnlyAction = (localStorageId) => async (dispatch) => {
    return handleApiCall(api.getDrinksOnly(localStorageId), dispatch, 'GET_DRINKS_ONLY', 'Drinks fetched Successfully');
};

export const updateSingleItemOrderAction = (id, updatedData) => async (dispatch) => {
    return handleApiCall(api.UpdateSingleItemOrder(id, updatedData), dispatch, 'UPDATE_SINGLE_ORDER_ITEM', 'Order Item Updated Successfully');
};

export const deleteSingleItemOrderAction = (id) => async (dispatch) => {
    try {
        await api.deleteSingleItemOrder(id);
        dispatch({ type: 'DELETE_SINGLE_ORDER_ITEM', id });
        return { success: true, message: 'Order Item Deleted Successfully' };
    } catch (err) {
        console.error(`Error in DELETE_SINGLE_ORDER_ITEM: ${err.message}`, err.stack);
        return { success: false, message: err.message };
    }
};

export const searchOrderItemAction = (orderNameData, localStorageId) => async (dispatch) => {
    return handleApiCall(api.searchOrderItem(orderNameData, localStorageId), dispatch, 'SEARCH_ORDER_ITEM', 'Order Item Searched Successfully');
};

export const searchDrinksOnlyAction = (drinksData, localStorageId) => async (dispatch) => {
    return handleApiCall(api.searchDrinksOnly(drinksData, localStorageId), dispatch, 'SEARCH_DRINKS_ONLY', 'Drinks Searched Successfully');
};

export const ResetOrderItemAction = () => async (dispatch) => {
    try {
        dispatch({ type: 'RESET_ORDER_ITEM_TEMP' });
        return { success: true, message: 'Order Item Reset Successfully' };
    } catch (err) {
        console.error(`Error in RESET_ORDER_ITEM_TEMP: ${err.message}`, err.stack);
        return { success: false, message: err.message };
    }
};
