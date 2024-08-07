import * as api from "../../api/index.js";

export const AddDelboyAction = (newDelboy) => async (dispatch) => {
  try {
    const { data } = await api.addDeliveryPersonnel(newDelboy);
    dispatch({ type: "ADD_DELBOY", data: data?.result });
    return { success: true, message: "Delivery boy added successfully" };
  } catch (err) {
    console.log("Error from AddDelboy Action: " + err?.message, err?.stack);
    return {
      success: false,
      message: err?.response?.data?.message || "something went wrong",
    };
  }
};

export const getAllDelboyzAction = () => async (dispatch) => {
  try {
    const { data } = await api.getAllDeliveryPersonnels();
    dispatch({ type: "GET_ALL_DELBOY", data: data?.result });
    return {
      success: true,
      message: "All Delivery Personnel Fetched Successfully",
    };
  } catch (err) {
    console.log("Error from getAllItems Action: " + err?.message, err?.stack);
    return { success: false, message: "something went wrong" };
  }
};

// export const getSingleDelBoyUser = (id) => async (dispatch) => {
//   try {
//     const { data } = await api.getSingleDeliveryPersonnel(id);
//     dispatch({ type: "GET_DELBOY_USER", data: data?.result });
//     return { success: true, message: "Delivery User Fetched Successfully" };
//   } catch (err) {
//     console.error("Error from getSingleDelBoyUser : ", err);
//     return { success: false, message: "something went wrong" };
//   }
// };

export const getSingleDelBoyAction = (id) => async (dispatch) => {
  try {
    const { data } = await api.getSingleDeliveryPersonnel(id);
    dispatch({ type: "GET_SINGLE_DELBOY", data: data?.result });
    return {
      success: true,
      message: "Delivery Personnel Fetched Successfully",
    };
  } catch (err) {
    console.log(
      "Error from getSingleDelBoy Action: " + err?.message,
      err?.stack
    );
    return { success: false, message: "something went wrong" };
  }
};

export const updateSingleDelBoyAction =
  (id, updateData) => async (dispatch) => {
    try {
      const { data } = await api.updateSingleDeliveryPersonnel(id, updateData);
      dispatch({ type: "UPDATE_SINGLE_DELBOY", data: data?.result });
      return {
        success: true,
        message: "Delivery Personnel Updated Successfully",
      };
    } catch (err) {
      console.error("Error from updateSingleItem Action: " + err);
      return { success: false, message: "something went wrong" };
    }
  };

export const deleteSingleDelBoyAction = (id) => async (dispatch) => {
  try {
    const { data } = await api.deleteSingleDeliveryPersonnel(id);
    dispatch({ type: "DELETE_SINGLE_DELBOY", data: data?.result });
    return {
      success: true,
      message: "Delivery Personnel Deleted Successfully",
    };
  } catch (err) {
    console.log(
      "Error from deleteSingleItem Action: " + err?.message,
      err?.stack
    );
    return { success: false, message: "something went wrong" };
  }
};
