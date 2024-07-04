import * as api from '../../api/index.js';

export const AddOrderItemAction = (ItemData) => async (dispatch) => {
    try {
        const { data } = await api.AddOrderItem(ItemData);
        dispatch({ type: 'ADD_ORDER_ITEM', data: data?.result });
        return { success: true, message: 'Order Item Added Successfully' };
    } catch (err) {
        console.log("Error from courseFilter Action: " + err.message, err.stack);
        return { success: false, message: err.message };
    }
}

export const GetSingleItemOrderAction = (id) => async (dispatch) => {
    try {
        const { data } = await api.GetSingleItemOrder(id);
        dispatch({ type: 'GET_SINGLE_ORDER_ITEM', data: data?.result });
        return { success: true, message: 'Order Item fetched Successfully' };
    } catch (err) {
        console.log("Error from courseFilter Action: " + err.message, err.stack);
        return { success: false, message: err.message };
    }
}

export const getAllOrderItemsAction = (localStorageId) => async (dispatch) => {
    try {
        const { data } = await api.getAllOrderItems(localStorageId);
        dispatch({ type: 'GET_ALL_ORDER_ITEMS', data: data?.result });
        return { success: true, message: 'Order Items fetched Successfully', data: data?.result };
    } catch (err) {
        console.log("Error from courseFilter Action: " + err.message, err.stack);
        return { success: false, message: err.message };
    }
}

export const getDrinksOnlyAction = (localStorageId) => async (dispatch) => {
    try {
        const { data } = await api.getDrinksOnly(localStorageId);
        dispatch({ type: 'GET_DRINKS_ONLY', data: data?.result });
        return { success: true, message: 'Drinks fetched Successfully', data: data?.result };
    } catch (err) {
        console.log("Error from courseFilter Action: " + err.message, err.stack);
        return { success: false, message: err.message };
    }
}

export const updateSingleItemOrderAction = (id, updatedData) => async (dispatch) => {
    try {
        const { data } = await api.UpdateSingleItemOrder(id, updatedData);
        dispatch({ type: 'UPDATE_SINGLE_ORDER_ITEM', data: data?.result });
        return { success: true, message: 'Order Item Updated Successfully' };
    } catch (err) {
        console.log("Error from courseFilter Action: " + err.message, err.stack);
        return { success: false, message: err.message };
    }
}

export const deleteSingleItemOrderAction = (id) => async (dispatch) => {
    try {
        await api.deleteSingleItemOrder(id);
        return { success: true, message: 'Order Item Deleted Successfully' };
    } catch (err) {
        console.log("Error from courseFilter Action: " + err.message, err.stack);
        return { success: false, message: err.message };
    }
}

export const searchOrderItemAction = (orderNameData, localStorageId) => async (dispatch) => {
    try {
        const { data } = await api.searchOrderItem(orderNameData, localStorageId);
        dispatch({ type: 'SEARCH_ORDER_ITEM', data: data?.result });
        return { success: true, message: 'Order Item Searched Successfully', data: data?.result };
    } catch (err) {
        console.log("Error from courseFilter Action: " + err.message, err.stack);
        return { success: false, message: err.message };
    }
}

export const searchDrinksOnlyAction = (drinksData, localStorageId) => async (dispatch) => {
    try {
        const { data } = await api.searchDrinksOnly(drinksData, localStorageId);
        dispatch({ type: 'SEARCH_DRINKS_ONLY', data: data?.result });
        return { success: true, message: 'Drinks Searched Successfully', data: data?.result };
    } catch (err) {
        console.log("Error from courseFilter Action: " + err.message, err.stack);
        return { success: false, message: err.message };
    }
}

export const ResetOrderItemAction = () => async (dispatch) => {
    try {
        dispatch({ type: 'RESET_ORDER_ITEM_TEMP' });
        return { success: true, message: 'Order Item Reset Successfully' };
    } catch (err) {
        console.log("Error from courseFilter Action: " + err.message, err.stack);
        return { success: false, message: err.message };
    }
}

