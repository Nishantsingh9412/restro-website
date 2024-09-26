import * as api from "../../api/index.js";

export const getEmployeeApi = (employeeId) => {
	return async (dispatch) => {
		try {
			const { data } = await api.getemployeedata(employeeId);
			dispatch({ type: 'GET_EMPLOYEE_ONLY', data: data.result });
			return { success: true, message: 'Employee get Successfully', data: data.result };
		} catch (err) {

			// console.log("Error from Employee Action: " + err.message, err.stack);
			return { success: false, message: err.message };
		}
	};
};
export const postEmployeeApi = (dataemployee) => {
	return async (dispatch) => {
		try {

			const { data } = await api.postemployeedata(dataemployee);

			dispatch({ type: 'POST_EMPLOYEE_ONLY', data: data });
			return { success: true, message: 'Employee post Successfully', data: data };
		} catch (err) {

			// console.log("Error from Employee Action: " + err.message, err.stack);
			return { success: false, message: err.message };
		}
	};
}

export const updateEmployeeApi = (employeedataId, dataemployee) => {
	return async (dispatch) => {
		try {
			const { data } = await api.updateemployeedata(employeedataId, dataemployee);
			dispatch({ type: 'UPDATE_EMPLOYEE_ONLY', data: data });
			return { success: true, message: 'Employee post Successfully', data: data };
		} catch (err) {
			return { success: false, message: err.message };
		}
	};
}

export const deleteEmployeeApi = (employeeId) => {
	return async (dispatch) => {
		try {

			const { data } = await api.deleteemployeedata(employeeId);

			dispatch({ type: 'DELETE_EMPLOYEE_ONLY', data: data.result });
			return { success: true, message: 'Employee get Successfully', data: data.result };
		} catch (err) {

			// console.log("Error from Employee Action: " + err.message, err.stack);
			return { success: false, message: err.message };
		}
	};
};
export const getEmployeeDetailApi = (employeeId) => {
	return async (dispatch) => {
		try {
			const { data } = await api.employeedetaildata(employeeId);
			dispatch({ type: 'GET_EMPLOYEE_ONLY', data: data.result });
			return { success: true, message: 'Employee get Successfully', data: data.result };
		} catch (err) {
			return { success: false, message: err.message };
		}
	};
}
