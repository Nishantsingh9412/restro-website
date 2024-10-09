// import { createDummyDeliveries } from "utils/createDummyData";

const initialState = {
  deliveries: [],
  activeDelivery: null,
  completedDeliveries: [],
};

const deliveryReducer = (state = initialState, action) => {
  switch (action.type) {
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
        deliveries: state.deliveries.map((del) =>
          del._id === action.data._id ? updatedStatus : del
        ),
        activeDelivery: updatedStatus,
      };
    }

    case "CANCEL_DELIVERY":
      return {
        ...state,
        deliveries: state.deliveries.filter(
          (item) => item._id !== action.data._id
        ),
        activeDelivery: null,
      };

    case "COMPLETE_DELIVERY":
      return {
        ...state,
        deliveries: state.deliveries.filter(
          (item) => item._id !== action.data._id
        ),
        activeDelivery: null,
        completedDeliveries: [action.data, ...state.completedDeliveries],
      };

    case "UPDATE_DELIVERY_STATUS":
      return {
        ...state,
        deliveries: state.deliveries.map((del) =>
          del._id === action.data._id ? action.data : del
        ),
        activeDelivery: action.data,
      };
    case "ADD_DELIVERY":
      return state.deliveries.some((item) => item._id === action.data._id)
        ? state
        : {
            ...state,
            deliveries: [action.data, ...state.deliveries],
          };

    case "GET_COMPLETED_DELIVERY":
      return { ...state, completedDeliveries: action.data || [] };
    case "ADD_COMPLETED_DELIVERY":
      return {
        ...state,
        deliveries: state.deliveries.filter(
          (item) => item._id !== action.data._id
        ),
        activeDelivery: null,
        completedDeliveries: [action.data, ...state.completedDeliveries],
      };
    case "GET_ALL_DELIVERY":
      return {
        ...state,
        deliveries: action.data || [],
      };
    case "GET_SINGLE_DELIVERY":
      return {
        ...state,
        activeDelivery: action.data,
      };
    case "UPDATE_SINGLE_DELIVERY":
      return {
        ...state,
        deliveries: state.deliveries.map((del) =>
          del._id === action.data._id ? action.data : del
        ),
      };
    case "DELETE_SINGLE_DELIVERY":
      return {
        ...state,
        deliveries: state.deliveries.filter(
          (item) => item._id !== action.data._id
        ),
      };
    default:
      return state;
  }
};

export default deliveryReducer;
