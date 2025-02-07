const initialState = {
  data: [],
  order: [],
};

const takeAwayOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ALLOT_CHEF_TAKE_AWAY":
      console.log("action", action.data);
      return {
        ...state,
        order: state.order.map((item) =>
          item.orderId === action.data.orderId
            ? { ...item, assignedChef: action.data.assignedChef }
            : item
        ),
      };
    case "POST_TAKE_AWAY_ORDER":
      return {
        ...state,
        dineInFormData: action.payload,
      };

    case "GET_TAKE_AWAY_ORDER":
      return {
        ...state,
        order: action.data,
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

export default takeAwayOrderReducer;
