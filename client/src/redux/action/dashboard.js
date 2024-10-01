import * as api from "../../api/index.js";

const handleApiCall = async (apiFunc, dispatch, actionType, successMessage) => {
  try {
    const { data } = await apiFunc();
    if (!data) throw new Error("No data received from API");
    dispatch({ type: actionType, data: data.result || data });
    return {
      success: true,
      message: successMessage,
      data: data.result || data,
    };
  } catch (err) {
    return { success: false, message: err.message || "An error occurred" };
  }
};

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
