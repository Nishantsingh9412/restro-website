const initialState = {
  data: [],
  order: [],
  dineInFormData: {},
};
// Dine-In Order Reducer
const dineInOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ALLOT_WAITER_DINE_IN":
      return {
        ...state,
        data: state.data.map((item) =>
          item.orderId === action.data.orderId
            ? { ...item, assignedWaiter: action.data.assignedWaiter }
            : item
        ),
      };
    case "ALLOT_CHEF_DINE_IN":
      return {
        ...state,
        data: state.data.map((item) =>
          item.orderId === action.data.orderId
            ? { ...item, assignedChef: action.data.assignedChef }
            : item
        ),
      };

    case "POST_DINE_IN_ORDER":
      return {
        ...state,
        data: [...state.data, action.data],
      };

    case "GET_DINE_IN_ORDER":
      return {
        ...state,
        order: action.data,
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
export default dineInOrderReducer;
