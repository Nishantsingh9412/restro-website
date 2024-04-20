import * as api from '../../api/index.js'

export const postQRItemAction = (newItem) => async (dispatch) => {
    try{
        const {data} = await api.postItemUsingQR(newItem);
        dispatch({type: 'ADD_QR_ITEM', data: data?.result});
        return {success: true, message: 'QR Item Added Successfully'};
    }catch(err){
        console.log("Error from courseFilter Action: " + err.message, err.stack);
        return {success: false, message: err.message}
    }
}

export const getSingleItemActionQR = (id) => async(dispatch) => {
    try{
        const {data} = await api.getSingleQRItem(id);
        dispatch({type: 'GET_SINGLE_QR_ITEM', data: data?.result});
        return {success: true, message: 'QR Item fetched Successfully'};
    }catch(err){
        console.log("Error from courseFilter Action: " + err.message, err.stack);
        return {success: false, message: err.message}
    }
}

export const getALlItemsActionQR = () => async(dispatch) => {
    try{
        const {data} = await api.getAllQRitems();
        dispatch({type: 'GET_ALL_QR_ITEMS', data: data?.result});
        return {success: true, message: 'QR Items fetched Successfully'};
    }catch(err){
        console.log("Error from courseFilter Action: " + err.message, err.stack);
        return {success: false, message: err.message}
    }
} 

export const updateSingleItemActionQR = (id, updatedData) => async(dispatch) => {
    try{
        const {data} = await api.upadteAllQRItems(id, updatedData);
        dispatch({type: 'UPDATE_SINGLE_QR_ITEM', data: data?.result});
        return {success: true, message: 'QR Item Updated Successfully'};
    }catch(err){
        console.log("Error from courseFilter Action: " + err.message, err.stack);
        return {success: false, message: err.message}
    }
}

export const deleteSingleQRItemAction = (id) => async(dispatch) => {
    try{
        await api.deleteSingleQRItem(id);
        return {success: true, message: 'QR Item Deleted Successfully'};
    }catch(err){
        console.log("Error from courseFilter Action: " + err.message, err.stack);
        return {success: false, message: err.message}
    }
}
