const initialState = {
  delboyz: [],
  selectedDelBoy: null,
  delBoyUser: {},
};

const delBoyReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_DELBOY":
      return {
        ...state,
        delboyz: [...state.delboyz, action.data],
      };
    case "GET_ALL_DELBOY":
      return {
        ...state,
        delboyz: action.data,
      };
    case "GET_SINGLE_DELBOY":
      return {
        ...state,
        selectedDelBoy: action.data,
        delBoyUser: action.data
      };
    // case "GET_DELBOY_USER":
    //   return {
    //     ...state,
    //     delBoyUser: action.data,
    //   };
    case "UPDATE_SINGLE_DELBOY":
      return {
        ...state,
        delboyz: state.delboyz.map((delboy) =>
          delboy._id === action.data._id ? action.data : delboy
        ),
        delBoyUser:
          action.data._id === state.delBoyUser._id ? action.data : state.delBoyUser,
      };
    default:
      return state;
  }
};

export default delBoyReducer;
