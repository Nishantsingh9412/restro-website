// Initial state of the delivery dashboard
const initialState = {
  data: {}, // Holds the delivery dashboard data
};

// Reducer function to handle actions related to the delivery dashboard
const deliveryDashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    // Action to set the delivery dashboard data
    case "SET_DELIVERY_DASHBOARD_DATA":
      return {
        ...state, // Spread the current state
        data: action.data, // Update the data with the payload from the action
      };
    // Default case returns the current state if action type is not matched
    default:
      return state;
  }
};

// Export the reducer as the default export
export default deliveryDashboardReducer;
