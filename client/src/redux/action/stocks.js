import * as api from "../../api/index"; // Import all functions from the api module

// Helper function to handle API calls
const handleApiCall = async (apiFunc, actionType, localStorageId, dispatch) => {
  try {
    // Call the API function with the provided localStorageId
    const { data } = await apiFunc(localStorageId);

    // Dispatch the action with the retrieved data
    dispatch({ type: actionType, data: data.result });

    // Log the data for debugging purposes
    // console.log(`this is the data from ${actionType}: `, data.result);

    // Return success message
    return {
      success: true,
      message: `${actionType.replace("_", " ")} Fetched Successfully`,
    };
  } catch (error) {
    // Log the error message and stack trace for debugging purposes
    console.log(`Error from ${actionType}: ` + error.message, error.stack);

    // Return failure message
    return { success: false, message: "something went wrong" };
  }
};

// Action creator for fetching all stocks
export const getAllStocksAction = (localStorageId) => async (dispatch) => {
  // Use the helper function to handle the API call
  return handleApiCall(
    api.getAllStocks,
    "GET_ALL_STOCKS",
    localStorageId,
    dispatch
  );
};

// Action creator for fetching low stocks
export const getLowStocksAction = (localStorageId) => async (dispatch) => {
  // Use the helper function to handle the API call
  return handleApiCall(
    api.getLowStocks,
    "GET_LOW_STOCKS",
    localStorageId,
    dispatch
  );
};
