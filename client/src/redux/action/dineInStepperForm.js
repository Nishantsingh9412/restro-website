// Action to set form data with the provided data
export const setFormData = (data) => ({
  type: "SET_DINE_IN_FORM_DATA",
  data: data,
});

// Action to reset form data
export const resetFormDataAction = () => ({
  type: "RESET_DINE_IN_FORM_DATA",
});
