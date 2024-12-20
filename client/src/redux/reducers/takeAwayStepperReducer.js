const initialState = {
  customerName: "",
};

const takeAwayStepperReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_TAKE_AWAY_FORM_DATA":
      return {
        ...state,
        ...action.payload,
      };
    case "RESET_TAKE_AWAY_FORM_DATA":
      return { ...initialState };
    default:
      return state;
  }
};

export default takeAwayStepperReducer;
