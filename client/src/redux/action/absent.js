import * as api from "../../api/index.js";

// Action to fetch absence details of an employee by their ID
export const fetchAbsenceDetailsApi = (employeeId) => {
  return async (dispatch) => {
    try {
      // Call the API to fetch absence details
      const { data } = await api.fetchabsencedetailsdata(employeeId);

      // Dispatch the fetched data to the Redux store
      dispatch({ type: "GET_EMPLOYEE_ONLY", data: data });

      // Return success response
      return {
        success: true,
        message: "Employee get Successfully",
        data: data,
      };
    } catch (err) {
      // Handle any errors that occur during the API call
      // // console.log("Error from Employee Action: " + err.message, err.stack);
      return { success: false, message: err.message };
    }
  };
};

// Action to post (add or edit) absence data of an employee
export const postAbsenceApi = (dataemployee, isEdit) => {
  return async (dispatch) => {
    try {
      let data;
      if (isEdit) {
        // If editing, call the API to edit absence data
        const res = await api.editAbsenceData(dataemployee);
        data = res.data;
      } else {
        // If adding, call the API to add new absence data
        const res = await api.addAbsencedata(dataemployee);
        data = res.data;
      }

      // Dispatch the posted data to the Redux store
      dispatch({ type: "POST_EMPLOYEE_ONLY", data: data });

      // Return success response
      return {
        success: true,
        message: "Employee post Successfully",
        data: data,
      };
    } catch (err) {
      // Handle any errors that occur during the API call
      // console.log('Error from Employee Action: ' + err.message, err.stack);
      return { success: false, message: err.message };
    }
  };
};

// Action to delete absence data of an employee
export const deleteAbsenceApi = (dataemployee) => {
  return async (dispatch) => {
    try {
      // Call the API to delete absence data
      const { data } = await api.deleteAbsenceData(dataemployee);

      // Dispatch the deleted data to the Redux store
      dispatch({ type: "DELETE_EMPLOYEE_ONLY", data: dataemployee });

      // Return success response
      return {
        success: true,
        message: "Employee delete Successfully",
        data: data,
      };
    } catch (err) {
      // Handle any errors that occur during the API call
      // // console.log('Error from Employee Action: ' + err.message, err.stack);
      return { success: false, message: err.message };
    }
  };
};

// Action to get absence data of an employee by their user ID
export const getAbsenceByEmpl = (userId) => {
  return async (dispatch) => {
    try {
      // Call the API to get absence data by user ID
      const { data } = await api.getabsencebyempldata(userId);

      // Dispatch the fetched data to the Redux store
      dispatch({ type: "GET_EMPLOYEE_ONLY", data: data.result });

      // Return success response
      return {
        success: true,
        message: "Employee get Successfully",
        data: data.result,
      };
    } catch (err) {
      // Handle any errors that occur during the API call
      // console.log('Error from Employee Action: ' + err.message, err.stack);
      return { success: false, message: err.message };
    }
  };
};
