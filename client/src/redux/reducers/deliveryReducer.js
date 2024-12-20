// Initial state for the delivery reducer
const initialState = {
  deliveries: [],
  activeDelivery: null,
  completedDeliveries: [],
};

// Helper function to update a delivery in the deliveries array
const updateDelivery = (deliveries, updatedDelivery) =>
  deliveries.map((del) =>
    del._id === updatedDelivery._id ? updatedDelivery : del
  );

// Delivery reducer function
const deliveryReducer = (state = initialState, action) => {
  switch (action.type) {
    // Handle accepting a delivery
    case "ACCEPT_DELIVERY": {
      const found = state.deliveries.find(
        (item) => item._id === action.data._id
      );
      if (!found) return state;
      const updatedStatus = {
        ...found,
        currentStatus: "Accepted",
        statusHistory: [
          ...found.statusHistory,
          { status: "Accepted", updatedAt: new Date() },
        ],
      };
      return {
        ...state,
        deliveries: updateDelivery(state.deliveries, updatedStatus),
        activeDelivery: updatedStatus,
      };
    }

    // Handle canceling or deleting a single delivery
    case "CANCEL_DELIVERY":
    case "DELETE_SINGLE_DELIVERY":
      return {
        ...state,
        deliveries: state.deliveries.filter(
          (item) => item._id !== action.data._id
        ),
        activeDelivery:
          action.type === "CANCEL_DELIVERY" ? null : state.activeDelivery,
      };

    // Handle completing a delivery or adding a completed delivery
    case "COMPLETE_DELIVERY":
    case "ADD_COMPLETED_DELIVERY":
      return {
        ...state,
        deliveries: state.deliveries.filter(
          (item) => item._id !== action.data._id
        ),
        activeDelivery: null,
        completedDeliveries: [action.data, ...state.completedDeliveries],
      };

    // Handle updating delivery status or updating a single delivery
    case "UPDATE_DELIVERY_STATUS":
    case "UPDATE_SINGLE_DELIVERY":
      return {
        ...state,
        deliveries: updateDelivery(state.deliveries, action.data),
        activeDelivery:
          action.type === "UPDATE_DELIVERY_STATUS"
            ? action.data
            : state.activeDelivery,
      };

    // Handle adding a new delivery
    case "ADD_DELIVERY":
      return state.deliveries.some((item) => item._id === action.data._id)
        ? state
        : {
            ...state,
            deliveries: [action.data, ...state.deliveries],
          };

    // Handle getting completed deliveries
    case "GET_COMPLETED_DELIVERY":
      return { ...state, completedDeliveries: action.data || [] };

    // Handle getting all deliveries
    case "GET_ALL_DELIVERY":
      return { ...state, deliveries: action.data || [] };

    // Handle getting a single delivery
    case "GET_SINGLE_DELIVERY":
      return { ...state, activeDelivery: action.data };

    case "SET_ACTIVE_DELIVERY":
      return { ...state, activeDelivery: action.data };

    // Default case to return the current state
    default:
      return state;
  }
};

export default deliveryReducer;
