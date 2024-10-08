const initialState = {
  data: [],
  selectedOrder: null,
};

export default function compOrderReducer(state = initialState, action) {
  switch (action.type) {
    case "POST_COMPLETE_ORDER":
      return {
        ...state,
        data: [...state.data, action.data],
      };
    case "GET_COMPLETE_ORDER":
      return {
        ...state,
        data: action.data,
      };
    case "GET_SINGLE_COMPLETE_ORDER":
      return {
        ...state,
        selectedOrder: action.data,
      };
    case "UPDATE_COMPLETE_ORDER":
      return {
        ...state,
        data: state.data.map((item) =>
          item._id === action.data._id ? action.data : item
        ),
      };
    case "DELETE_COMPLETE_ORDER":
      return {
        ...state,
        data: state.data.filter((item) => item._id !== action.data._id),
      };
    default:
      return state;
  }
}
