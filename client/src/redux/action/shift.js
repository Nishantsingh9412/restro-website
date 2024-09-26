import * as api from '../../api/index.js';

export const postShiftApi = (dataemployee, isEdit) => {
	return async (dispatch) => {
		try {
			let data;
			if (isEdit) {
				const res = await api.editshiftdata(dataemployee);
				data = res.data;
			} else {
				const res = await api.addshiftdata(dataemployee);
				data = res.data;
			}
			dispatch({ type: 'POST_EMPLOYEE_ONLY', data: data });
			return { success: true, message: 'Employee post Successfully', data: data };
		} catch (err) {
			return { success: false, message: err.message };
		}
	};
};

export const deleteShiftApi = (dataemployee) => {
	return async (dispatch) => {
		try {
			const { data } = await api.deleteShiftData(dataemployee);
			dispatch({ type: 'DELETE_EMPLOYEE_ONLY', data: dataemployee });
			return { success: true, message: 'Employee delete Successfully', data: data };
		} catch (err) {
			return { success: false, message: err.message };
		}
	};
}

export const fetchShitDetailsApi = (employeeId) => {
	return async (dispatch) => {
		try {
			const { data } = await api.fetchshiftdetailsdata(employeeId);
			dispatch({ type: 'GET_EMPLOYEE_ONLY', data: data });
			return { success: true, message: 'Employee get Successfully', data: data };
		} catch (err) {
			return { success: false, message: err.message };
		}
	};
};

export const getShiftByEmpl = (userId) => {
	return async (dispatch) => {
		try {
			const { data } = await api.getshiftbyempldata(userId);
			dispatch({ type: 'GET_EMPLOYEE_ONLY', data: data.result });
			return { success: true, message: 'Employee get Successfully', data: data.result };
		} catch (err) {
			// console.log("Error from Employee Action: " + err.message, err.stack);
			return { success: false, message: err.message };
		}
	};
};
