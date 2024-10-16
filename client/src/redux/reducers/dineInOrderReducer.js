const initialState = {
  data: [],
  order: [],
};
// Dine-In Order Reducer
export const dineInOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case "POST_DINE_IN_ORDER":
      return {
        ...state,
        dineInFormData: action.payload,
      };

    case "GET_DINE_IN_ORDER":
      return {
        ...state,
        order: action.payload,
      };

    case "RESET_DINE_IN_ORDER":
      return {
        ...state,
        dineInFormData: initialState.dineInFormData,
      };

    default:
      return state;
  }
};
