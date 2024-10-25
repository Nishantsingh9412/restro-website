import * as api from "../../api/index.js";

// Helper function to handle API calls
const handleApiCall = async (apiFunc, dispatch, actionType, successMessage) => {
  try {
    // Execute the API function and destructure the data from the response
    const { data } = await apiFunc();
    // Dispatch the action with the data
    dispatch({ type: actionType, data: data?.result });
    // Return success message
    return { success: true, message: successMessage };
  } catch (err) {
    // Log the error message and stack trace
    // console.log(`Error from ${actionType} Action: ${err?.message}`, err?.stack);
    // Return error message
    return {
      success: false,
      message: err?.response?.data?.message || "Something went wrong",
    };
  }
};

// Action to add a new delivery personnel
export const addDelboyAction = (newDelboy) => async (dispatch) => {
  return handleApiCall(
    () => api.addDeliveryPersonnel(newDelboy),
    dispatch,
    "ADD_DELBOY",
    "Delivery boy added successfully"
  );
};

// Action to get all delivery personnel
export const getAllDelboyzAction = () => async (dispatch) => {
  return handleApiCall(
    api.getAllDeliveryPersonnels,
    dispatch,
    "GET_ALL_DELBOY",
    "All Delivery Personnel Fetched Successfully"
  );
};

// const getSingleDelBoyUser = (id) => async (dispatch) => {
//   return handleApiCall(
//     () => api.getSingleDeliveryPersonnel(id),
//     dispatch,
//     "GET_DELBOY_USER",
//     "Delivery Personnel Fetched Successfully"
//   );
// };

// Action to get a single delivery personnel by ID
export const getSingleDelBoyAction = (id) => async (dispatch) => {
  return handleApiCall(
    () => api.getSingleDeliveryPersonnel(id),
    dispatch,
    "GET_SINGLE_DELBOY",
    "Delivery Personnel Fetched Successfully"
  );
};

// Action to update a single delivery personnel by ID
export const updateSingleDelBoyAction =
  (id, updateData) => async (dispatch) => { 
    return handleApiCall(
      () => api.updateSingleDeliveryPersonnel(id, updateData),
      dispatch,
      "UPDATE_SINGLE_DELBOY",
      "Delivery Personnel Updated Successfully"
    );
  };

// Action to delete a single delivery personnel by ID
export const deleteSingleDelBoyAction = (id) => async (dispatch) => {
  return handleApiCall(
    () => api.deleteSingleDeliveryPersonnel(id),
    dispatch,
    "DELETE_SINGLE_DELBOY",
    "Delivery Personnel Deleted Successfully"
  );
};
