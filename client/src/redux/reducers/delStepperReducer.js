const initialState = {
  name: "",
  phoneNumber: "",
  paymentMethod: "",
  deliveryMethod: "",
  dropLocation: {
    lat: NaN,
    lng: NaN,
  },
  dropLocationName: "",
  address: "",
  address2: "",
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
