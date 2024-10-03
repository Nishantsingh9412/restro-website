import * as api from "../../api/index.js";

// Action to post shift data (either add or edit)
export const postShiftApi = (dataemployee, isEdit) => {
  return async (dispatch) => {
    try {
      let data;
      if (isEdit) {
        // If editing, call the edit shift API
        const res = await api.editshiftdata(dataemployee);
        data = res.data;
      } else {
        // If adding, call the add shift API
        const res = await api.addshiftdata(dataemployee);
        data = res.data;
      }
      // Dispatch the action to the reducer with the new data
      dispatch({ type: "POST_EMPLOYEE_ONLY", data: data });
      return {
        success: true,
        message: "Employee post Successfully",
        data: data,
      };
    } catch (err) {
      // Return error message if API call fails
      return { success: false, message: err.message };
    }
  };
};

// Action to delete shift data
export const deleteShiftApi = (dataemployee) => {
  return async (dispatch) => {
    try {
      // Call the delete shift API
      const { data } = await api.deleteShiftData(dataemployee);
      // Dispatch the action to the reducer with the deleted employee data
      dispatch({ type: "DELETE_EMPLOYEE_ONLY", data: dataemployee });
      return {
        success: true,
        message: "Employee delete Successfully",
        data: data,
      };
    } catch (err) {
      // Return error message if API call fails
      return { success: false, message: err.message };
    }
  };
};

// Action to fetch shift details by employee ID
export const fetchShitDetailsApi = (employeeId) => {
  return async (dispatch) => {
    try {
      // Call the fetch shift details API
      const { data } = await api.fetchshiftdetailsdata(employeeId);
      // Dispatch the action to the reducer with the fetched data
      dispatch({ type: "GET_EMPLOYEE_ONLY", data: data });
      return {
        success: true,
        message: "Employee get Successfully",
        data: data,
      };
    } catch (err) {
      // Return error message if API call fails
      return { success: false, message: err.message };
    }
  };
};

// Action to get shift data by user ID
export const getShiftByEmpl = (userId) => {
  return async (dispatch) => {
    try {
      // Call the get shift by employee API
      const { data } = await api.getshiftbyempldata(userId);
      // Dispatch the action to the reducer with the fetched data
      dispatch({ type: "GET_EMPLOYEE_ONLY", data: data.result });
      return {
        success: true,
        message: "Employee get Successfully",
        data: data.result,
      };
    } catch (err) {
      // Return error message if API call fails
      return { success: false, message: err.message };
    }
  };
};
