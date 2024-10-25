const initialState = {
  name: "",
  phoneNumber: "",
  paymentMethod: "online",
  deliveryMethod: "pickup",
  address: "",
  address2: "",
  city: "",
  state: "",
  zip: "",
  noteFromCustomer: "",
};

const stepperFormReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_FORM_DATA":
      return { ...state, ...action.data };
    case "RESET_FORM_DATA":
      return { ...initialState };
    default:
      return state;
  }
};

export default stepperFormReducer;
