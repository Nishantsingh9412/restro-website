import { localStorageData } from "../../utils/constant";

const adminReducer = (state = { data: null }, action) => {
  switch (action.type) {
    case "AUTH":
      localStorage.setItem(
        localStorageData.PROFILE_DATA,
        JSON.stringify({ ...action?.data })
      ); // ? -> optional chaining
      return { ...state, data: action?.data };
    case "LOGOUT":
      localStorage.clear();
      return { ...state, data: null };
    default:
      return state;
  }
};

export default adminReducer;
