import * as api from "../../api";

// Helper function to handle API calls
const handleApiCall = async (apiCall, dispatch, actionType) => {
  try {
    const { data } = await apiCall;
    if (dispatch && actionType) {
      // Dispatch the action with the data received from the API
      dispatch({ type: actionType, data: data?.result });
    }
    return { success: true, message: data.message };
  } catch (error) {
    console.log(`Error in ${actionType}: `, error);
    return { success: false, message: error.message };
  }
};

// Action to add a new supplier
export const addNewSupplierAction = (supplierData) => async (dispatch) => {
  return handleApiCall(api.addSupplier(supplierData), dispatch, "ADD_SUPPLIER");
};

// Action to get all suppliers
export const getAllSuppliersAction = (localStorageId) => async (dispatch) => {
  return handleApiCall(
    api.getAllSuppliers(localStorageId),
    dispatch,
    "GET_ALL_SUPPLIERS"
  );
};

// Action to get a single supplier by ID
export const getSingleSupplierAction = (id) => async (dispatch) => {
  return handleApiCall(
    api.getSingleSupplier(id),
    dispatch,
    "GET_SINGLE_SUPPLIER"
  );
};

// Action to clear the selected supplier
export const clearSelectedSupplierAction = () => ({
  type: "CLEAR_SELECTED_SUPPLIER",
});

// Action to update a supplier by ID
export const updateSupplierAction = (id, updatedData) => async (dispatch) => {
  return handleApiCall(
    api.UpdateSupplier(id, updatedData),
    dispatch,
    "UPDATE_SUPPLIER"
  );
};

// Action to delete a supplier by ID
export const deleteSupplierAction = (id) => async () => {
  try {
    await api.DeleteSupplier(id);
    return { success: true, message: "Supplier Deleted Successfully" };
  } catch (error) {
    console.log("Error in DeleteSupplierAction: ", error);
    return { success: false, message: error.message };
  }
};
