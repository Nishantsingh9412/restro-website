const initialState = {
  deliveryEmployees: [],
  loading: false,
  error: null,
};

const deliveryEmpReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_ALL_DELIVERY_EMP":
      return {
        ...state,
        deliveryEmployees: action.data,
        loading: false,
        error: null,
      };
    case "GET_ALL_DELIVERY_EMP_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "GET_ALL_DELIVERY_EMP_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
};

export default deliveryEmpReducer;
