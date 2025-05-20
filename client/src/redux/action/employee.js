// import * as api from "../../api/index.js";

// // Helper function to handle API calls
// const handleApiCall = async (apiCall, dispatch, actionType, successMessage) => {
//   try {
//     const { data } = await apiCall();
//     dispatch({ type: actionType, data: data.result || data });
//     return {
//       success: true,
//       message: successMessage,
//       data: data.result || data,
//     };
//   } catch (err) {
//     return { success: false, message: err.response.data.error || "An error occurred", status: err.response.status };
//   }
// };

// // Action to fetch employee data by ID
// export const getEmployeeApi = () => {
//   return async (dispatch) => {
//     return handleApiCall(
//       () => api.getemployeedata(),
//       dispatch,
//       "GET_EMPLOYEE_ONLY",
//       "Employee fetched successfully"
//     );
//   };
// };

// // Action to post new employee data
// export const postEmployeeApi = (dataemployee) => {
//   return async (dispatch) => {
//     if (!dataemployee) {
//       return { success: false, message: "Employee data is required" };
//     }
//     return handleApiCall(
//       () => api.postemployeedata(dataemployee),
//       dispatch,
//       "POST_EMPLOYEE_ONLY",
//       "Employee posted successfully"
//     );
//   };
// };

// // Action to update existing employee data by ID
// export const updateEmployeeApi = (employeedataId, dataemployee) => {
//   return async (dispatch) => {
//     if (!employeedataId || !dataemployee) {
//       return { success: false, message: "Employee ID and data are required" };
//     }
//     return handleApiCall(
//       () => api.updateemployeedata(employeedataId, dataemployee),
//       dispatch,
//       "UPDATE_EMPLOYEE_ONLY",
//       "Employee updated successfully"
//     );
//   };
// };

// // Action to delete employee data by ID
// export const deleteEmployeeApi = (employeeId) => {
//   return async (dispatch) => {
//     if (!employeeId) {
//       return { success: false, message: "Employee ID is required" };
//     }
//     return handleApiCall(
//       () => api.deleteemployeedata(employeeId),
//       dispatch,
//       "DELETE_EMPLOYEE_ONLY",
//       "Employee deleted successfully"
//     );
//   };
// };

// // Action to fetch detailed employee data by ID
// export const getEmployeeDetailApi = (employeeId) => {
//   return async (dispatch) => {
//     if (!employeeId) {
//       return { success: false, message: "Employee ID is required" };
//     }
//     return handleApiCall(
//       () => api.employeedetaildata(employeeId),
//       dispatch,
//       "GET_EMPLOYEE_ONLY",
//       "Employee details fetched successfully"
//     );
//   };
// };
