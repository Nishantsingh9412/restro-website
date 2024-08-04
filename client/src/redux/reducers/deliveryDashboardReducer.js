const initialState = {
  data: {},
};

const deliveryDashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_DELIVERY_DASHBOARD_DATA":
      return {
        ...state,
        data: action.data,
      };
    default:
      return state;
  }
};

export default deliveryDashboardReducer;
