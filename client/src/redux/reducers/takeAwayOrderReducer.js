const initialState = {
  data: [],
  order: [],
};

export const dineInOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case "POST_TAKE_AWAY_ORDER":
      return {
        ...state,
        dineInFormData: action.payload,
      };

    case "GET_TAKE_AWAY_ORDER":
      return {
        ...state,
        order: action.payload,
      };

    case "RESET_TAKE_AWAY_ORDER":
      return {
        ...state,
        dineInFormData: initialState.dineInFormData,
      };

    default:
      return state;
  }
};
