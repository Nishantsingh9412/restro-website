import * as api from '../../api';

export const AddNewSupplierAction = (supplierData) => async (dispatch) => {
    try {
        const { data } = await api.addSupplier(supplierData);
        dispatch({ type: 'ADD_SUPPLIER', data: data?.result });
        return { success: true, message: data.message }
    } catch (error) {
        console.log("Error in AddNewSupplierAction: ", error)
        return { success: false, message: error.message }
    }
}

export const GetAllSuppliersAction = (localStorageId) => async (dispatch) => {
    try {
        const { data } = await api.getAllSuppliers(localStorageId);
        dispatch({ type: 'GET_ALL_SUPPLIERS', data: data?.result });
        return { success: true, message: data.message }
    } catch (error) {
        console.log("Error in GetAllSuppliersAction: ", error)
        return { success: false, message: error.message }
    }
}

export const getSingleSupplierAction = (id) => async (dispatch) => {
    try {
        const { data } = await api.getSingleSupplier(id);
        dispatch({ type: 'GET_SINGLE_SUPPLIER', data: data?.result });
        return { success: true, message: data.message }
    } catch (error) {
        console.log("Error in getSingleSupplierAction: ", error)
        return { success: false, message: error.message }
    }
}

export const clearSelectedSupplierAction = () => {
    return {
        type: 'CLEAR_SELECTED_SUPPLIER'
    }
}


export const UpdateSupplierAction = (id, updatedData) => async (dispatch) => {
    try {
        const { data } = await api.UpdateSupplier(id, updatedData);
        dispatch({ type: 'UPDATE_SUPPLIER', data: data?.result });
        return { success: true, message: data.message }
    } catch (error) {
        console.log("Error in UpdateSupplierAction: ", error)
        return { success: false, message: error.message }
    }
}


export const DeleteSupplierAction = (id) => async (dispatch) => {
    try {
        await api.DeleteSupplier(id);
        return { success: true, message: 'Supplier Deleted Successfully' }
    } catch (error) {
        console.log("Error in DeleteSupplierAction: ", error)
        return { success: false, message: error.message }
    }
}
