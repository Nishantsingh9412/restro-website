import * as api from '../../api/index.js';

export const AddItemAction = (ItemData) => async (dispatch) => {
    try {
        const { data } = await api.AddItem(ItemData);
        dispatch({ type: 'ADD_ITEM',data:data.result });
        return { success: true, message: 'Item Added Successfully' };
    } catch (err) {
        console.log("Error from courseFilter Action: " + err.message, err.stack);
        return { success: false, message: 'something went wrong' };
    }
} 

export const GetAllItemsAction = () => async (dispatch) => {
    try{
        const {data} = await api.GetAllItems();
        dispatch({ type: 'GET_ALL_ITEMS', data:data.result});
        return { success: true, message: 'Items Fetched Successfully' };
    }catch(err){
        console.log("Error from courseFilter Action: " + err.message, err.stack);
        return { success: false, message: 'something went wrong' };
    }
}

export const GetSingleItemAction = (id) => async(dispatch) => {
    try{
        const {data} = await api.GetSingleItem(id);
        dispatch({ type: 'GET_SINGLE_ITEM', data:data.result});
        return { success: true, message: 'Item Fetched Successfully' };
    }catch(err){
        console.log("Error from courseFilter Action: " + err.message, err.stack);
        return { success: false, message: 'something went wrong' };
    }
}

export const updateSingleItemAction = (id,updatedData) => async(dispatch) => {
    try{
        const {data} = await api.updateSingleItem(id,updatedData);
        dispatch({type: 'UPDATE_SINGLE_ITEM', data:data.result});
        return { success: true, message: 'Item Updated Successfully' };
    }catch(err){
        console.log("Error from courseFilter Action: " + err.message, err.stack);
        return { success: false, message: 'something went wrong' };
    }
}

export const deleteSingleItemAction = (id) => async(dispatch) => {
    try{
        await api.deleteSingleItem(id);
        return { success: true, message: 'Item Deleted Successfully' };
    }catch(err){
        console.log("Error from courseFilter Action: " + err.message, err.stack);
        return { success: false, message: 'something went wrong' };
    }
}