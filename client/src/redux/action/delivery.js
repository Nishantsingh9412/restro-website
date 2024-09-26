import * as api from "../../api/index.js";

export const acceptDeliveryAction =
	(deliveryId, assignedTo) => async (dispatch) => {
		try {
			const { data } = await api.updateDeliveryStatus(deliveryId, {
				userId: assignedTo,
				status: "Accepted",
			});
			dispatch({
				type: "ACCEPT_DELIVERY",
				data: data.result,
			});
			return { success: true, message: "Delivery accepted successfully" };
		} catch (err) {
			// console.log(
			// 	"Error from acceptDelivery Action: " + err?.message,
			// 	err?.stack,
			// );
			return { success: false, message: "something went wrong" };
		}
	};

export const cancelDeliveryAction = (deliveryId) => async (dispatch) => {
	try {
		// const { data } = await api.updateDeliveryStatus(deliveryId, "Cancelled");
		dispatch({ type: "CANCEL_DELIVERY", data: { _id: deliveryId } });
		return { success: true, message: "Delivery canceled successfully" };
	} catch (err) {
		// console.log(
		// 	"Error from cancelDelivery Action: " + err?.message,
		// 	err?.stack,
		// );
		return { success: false, message: "something went wrong" };
	}
};

export const completeDeliveryAction = (deliveryId) => async (dispatch) => {
	try {
		const { data } = await api.updateDeliveryStatus(deliveryId, "Completed");
		dispatch({ type: "COMPLETE_DELIVERY", data: data.result });
		return { success: true, message: "Delivery completed successfully" };
	} catch (err) {
		// console.log(
		// 	"Error from completeDelivery Action: " + err?.message,
		// 	err?.stack,
		// );
		return { success: false, message: "something went wrong" };
	}
};

export const udpateDeliveryStatusAction =
	(deliveryId, status, userId) => async (dispatch) => {
		try {
			const { data } = await api.updateDeliveryStatus(deliveryId, {
				userId,
				status,
			});
			if (status === "Completed") {
				dispatch({ type: "ADD_COMPLETED_DELIVERY", data: data.result });
			} else
				dispatch({
					type: "UPDATE_DELIVERY_STATUS",
					data: data.result,
				});
			return { success: true, message: "Delivery status updated successfully" };
		} catch (err) {
			// console.log(
			// 	"Error from updateDeliveryStatus Action: " + err?.message,
			// 	err?.stack,
			// );
			return { success: false, message: "something went wrong" };
		}
	};

export const addDeliveryAction = (newDel) => async (dispatch) => {
	try {
		const { data } = await api.addDelivery(newDel);
		dispatch({ type: "ADD_DELBOY", data: data?.result });
		return { success: true, message: "Delivery boy added successfully" };
	} catch (err) {
		// console.log("Error from AddDelboy Action: " + err?.message, err?.stack);
		return {
			success: false,
			message: err?.response?.data?.message || "something went wrong",
		};
	}
};

export const getAllAvailabelDeliveryAction = (id) => async (dispatch) => {
	try {
		const { data } = await api.getAllDeliveries(id);
		dispatch({ type: "GET_ALL_DELIVERY", data: data?.result });
		return {
			success: true,
			message: "All Delivery Personnel Fetched Successfully",
		};
	} catch (err) {
		// console.log("Error from getAllItems Action: " + err?.message, err?.stack);
		return { success: false, message: "something went wrong" };
	}
};

export const getCompletedDeliveriesAction = (userId) => async (dispatch) => {
	try {
		const { data } = await api.getCompletedDeliveries(userId);
		dispatch({ type: "GET_COMPLETED_DELIVERY", data: data?.result });
		return {
			success: true,
			message: "Completed Delivery Fetched Successfully",
		};
	} catch (err) {
		// console.log(
		// 	"Error from getCompletedDeliveries Action: " + err?.message,
		// 	err?.stack,
		// );
		return { success: false, message: "something went wrong" };
	}
};

export const getSingleDeliveryAction = (id) => async (dispatch) => {
	try {
		const { data } = await api.getSingleDelivery(id);
		dispatch({ type: "GET_SINGLE_DELIVERY", data: data?.result });
		return {
			success: true,
			message: "Delivery Fetched Successfully",
		};
	} catch (err) {
		// console.log(
		// 	"Error from getSingleDelivery Action: " + err?.message,
		// 	err?.stack,
		// );
		return { success: false, message: "something went wrong" };
	}
};

export const updateSingleDeliveryAction =
	(id, updateData) => async (dispatch) => {
		try {
			const { data } = await api.updateSingleDelivery(id, updateData);
			dispatch({ type: "UPDATE_SINGLE_DELIVERY", data: data?.result });
			return {
				success: true,
				message: "Delivery Updated Successfully",
			};
		} catch (err) {
			// console.log(
			// 	"Error from updateSingleItem Action: " + err?.message,
			// 	err?.stack,
			// );
			return { success: false, message: "something went wrong" };
		}
	};

export const deleteSingleDeliveryAction = (id) => async (dispatch) => {
	try {
		// const { data } = await api.deleteSingleDeliveryPersonnel(id);
		dispatch({ type: "DELETE_SINGLE_DELIVERY", data: { _id: id } });
		return {
			success: true,
			message: "Delivery Deleted Successfully",
		};
	} catch (err) {
		// console.log(
		// 	"Error from deleteSingleItem Action: " + err?.message,
		// 	err?.stack,
		// );
		return { success: false, message: "something went wrong" };
	}
};
