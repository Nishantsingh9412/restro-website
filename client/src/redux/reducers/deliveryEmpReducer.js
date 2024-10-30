const initialState = {
  deliveryEmployees: [],
};

const deliveryEmpReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_ALL_DELIVERY_EMP":
      return {
        ...state,
        deliveryEmployees: action.data || [],
      };
    default:
      return state;
  }
};

export default deliveryEmpReducer;
