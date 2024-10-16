// Initial state for the dine-in form
const initialState = {
  tableNumber: "",
  numberOfGuests: "",
  customerName: "",
  phoneNumber: "",
  emailAddress: "",
  specialRequests: "",
};

// Reducer function to handle dine-in form actions
const dineInStepperReducer = (state = initialState, action) => {
  switch (action.type) {
    // Action to set the dine-in form data
    case "SET_DINE_IN_FORM_DATA":
      return { ...state, ...action.data };
    // Action to reset the dine-in form data to initial state
    case "RESET_DINE_IN_FORM_DATA":
      return { ...initialState };
    // Default case to return the current state
    default:
      return state;
  }
};

export default dineInStepperReducer;
