import * as api from "../../api/index.js";

const handleAdminAction = async (apiCall, user, dispatch) => {
  try {
    const { data } = await apiCall(user);
    localStorage.setItem("ProfileData", JSON.stringify(data));
    dispatch({ type: "AUTH", data });
    return { success: true, message: "Operation successful" };
  } catch (err) {
    const errorMessage =
      err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : "An unexpected error occurred";
    return { success: false, message: errorMessage };
  }
};

export const SignUpAdminAction = (newUser) => async (dispatch) => {
  return handleAdminAction(api.signUpAPI, newUser, dispatch);
};

export const LoginAdminAction = (user) => async (dispatch) => {
  return handleAdminAction(api.loginAPI, user, dispatch);
};
