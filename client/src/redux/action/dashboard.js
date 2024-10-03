import * as api from "../../api/index.js";

// Helper function to handle API calls
const handleApiCall = async (apiFunc, dispatch, actionType, successMessage) => {
  try {
    // Call the API function and destructure the data from the response
    const { data } = await apiFunc();
    if (!data) throw new Error("No data received from API");

    // Dispatch the action with the received data
    dispatch({ type: actionType, data: data.result || data });

    // Return success response
    return {
      success: true,
      message: successMessage,
      data: data.result || data,
    };
  } catch (err) {
    // Return error response
    return { success: false, message: err.message || "An error occurred" };
  }
};

// Action to get absent data for a specific employee
export const getAbsentApi = (employeeId) => {
  return async (dispatch) => {
    if (!employeeId) {
      return { success: false, message: "Employee ID is required" };
    }
    return handleApiCall(
      () => api.getAbsentdata(employeeId),
      dispatch,
      "GET_ABSENT_ONLY",
      "Absent data retrieved successfully"
    );
  };
};

// Action to get employee shift data
export const getEmployeShiftApi = () => {
  return async (dispatch) => {
    return handleApiCall(
      api.getemployeshiftdata,
      dispatch,
      "GET_SHIFT_ONLY",
      "Shift data retrieved successfully"
    );
  };
};

// Action to get birthday data
export const getBirthdayApi = () => {
  return async (dispatch) => {
    return handleApiCall(
      api.getbirthdayapidata,
      dispatch,
      "GET_BIRTHDAY_ONLY",
      "Birthday data retrieved successfully"
    );
  };
};

// Action to get upcoming birthday data
export const getUpcomingBirthdayApi = () => {
  return async (dispatch) => {
    return handleApiCall(
      api.getupcomingbirthdayapidata,
      dispatch,
      "GET_BIRTHDAY_ONLY",
      "Upcoming birthday data retrieved successfully"
    );
  };
};
