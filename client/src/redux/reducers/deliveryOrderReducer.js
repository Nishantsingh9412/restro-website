const initialState = {
  data: [],
  selectedOrder: null,
};

export default function deliveryOrderReducer(state = initialState, action) {
  switch (action.type) {
    case "ALLOT_DELIVERY_BOY":
      return {
        ...state,
        data: state.data.map((item) =>
          item.orderId === action.data.orderId
            ? { ...item, assignedTo: action.data.assignedTo }
            : item
        ),
      };
    case "POST_DELIVERY_ORDER":
      return {
        ...state,
        data: [...state.data, action.data],
      };
    case "GET_DELIVERY_ORDER":
      return {
        ...state,
        data: action.data,
      };
    case "GET_SINGLE_DELIVERY_ORDER":
      return {
        ...state,
        selectedOrder: action.data,
      };
    case "UPDATE_DELIVERY_ORDER":
      return {
        ...state,
        data: state.data.map((item) =>
          item._id === action.data._id ? action.data : item
        ),
      };
    case "DELETE_DELIVERY_ORDER":
      return {
        ...state,
        data: state.data.filter((item) => item._id !== action.data._id),
      };
    default:
      return state;
  }
}
