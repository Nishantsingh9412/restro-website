const initialState = {
  notifications: [],
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return state.notifications.some((item) => item._id === action.data._id)
        ? state
        : {
            ...state,
            notifications: [action.data, ...state.notifications],
          };
    case "GET_ALL_NOTIFICATIONS":
      return {
        ...state,
        notifications: action.data || [],
      };
    case "GET_ALL_ADMIN_NOTIFICATIONS":
      return {
        ...state,
        notifications: action.data || [],
      };
    default:
      return state;
  }
};

export default notificationReducer;
