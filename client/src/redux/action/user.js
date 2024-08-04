import * as api from "../../api/index.js";

export const singleUserDataAction = (id) => async (dispatch) => {
  try {
    const { data } = await api.getSingleUserData(id);
    dispatch({ type: "SINGLE_USER_DATA", data: data.result });
    return { success: true, message: "User data fetched successfully" };
  } catch (error) {
    console.error("Error from Single User Data Action: " + error);
    return { success: false, message: error.response?.data?.message };
  }
};

export const updateProfilePicAction = (id, formData) => async (dispatch) => {
  try {
    const { data } = await api.UpdateUserProfilePic(id, formData);
    dispatch({ type: "UPDATE_PROFILE_PIC", data: data.result });
    return { success: true, message: "Profile Picture Updated Successfully" };
  } catch (err) {
    console.error("Error from Update Profile Pic Action: " + err);
    return { success: false, message: err.response?.data.message };
  }
};
