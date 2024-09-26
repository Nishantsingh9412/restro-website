import * as api from "../../api/index.js";

export const getAbsentApi = (employeeId) => {
	return async (dispatch) => {
		try {
			const { data } = await api.getAbsentdata(employeeId);
			dispatch({ type: "GET_ABSENT_ONLY", data: data?.absences });
			return {
				success: true,
				message: "Absent get Successfully",
				data: data?.absences,
			};
		} catch (err) {
			return { success: false, message: err.message };
		}
	};
};
export const getEmployeShiftApi = () => {
	return async (dispatch) => {
		try {
			const { data } = await api.getemployeshiftdata();
			dispatch({ type: "GET_SHIFT_ONLY", data: data.result });
			return {
				success: true,
				message: "Shift get Successfully",
				data: data.result,
			};
		} catch (err) {
			return { success: false, message: err.message };
		}
	};
};
export const getBirthdayApi = () => {
	return async (dispatch) => {
		try {
			const { data } = await api.getbirthdayapidata();
			dispatch({ type: "GET_BIRTHDAY_ONLY", data: data });
			return { success: true, message: "Shift get Successfully", data: data };
		} catch (err) {
			return { success: false, message: err.message };
		}
	};
};
export const getUpcomingBirthdayApi = () => {
	return async (dispatch) => {
		try {
			const { data } = await api.getupcomingbirthdayapidata();
			dispatch({ type: "GET_BIRTHDAY_ONLY", data: data });
			return { success: true, message: "Shift get Successfully", data: data };
		} catch (err) {
			return { success: false, message: err.message };
		}
	};
};
