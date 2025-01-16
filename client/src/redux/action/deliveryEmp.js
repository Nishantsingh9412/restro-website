import * as api from "../../api/index.js";

// Get all delivery employees
export const getAllDeliveryEmpAction = () => async (dispatch) => {
  try {
    const { data } = await api.getAllDeliveryEmpAPI();
    dispatch({ type: "GET_ALL_DELIVERY_EMP", data: data?.result });
    return { success: true, message: "All delivery employees fetched successfully" };
  } catch (err) {
    // console.error(`Error from GET_ALL_DELIVERY_EMP: ${err.message}`, err.stack);
    return {
      success: false,
      message: err?.response?.data?.error || "An unexpected error occurred",
      status: err?.response?.status,
    };
  }
};