// useDineInFormLogic.js
import { useDispatch, useSelector } from "react-redux";
import {
  setDineInInfo,
  updateDineInGuestName,
} from "../../redux/action/customerInfo";
import { clearCart } from "../../redux/action/cartItems";
import { useToast } from "../../contexts/useToast";
import { orderMethods } from "../../utils/constant";

export const useDineInFormLogic = (onProceed) => {
  const showToast = useToast();
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.customerInfo.dineIn);

  const {
    customerName,
    specialRequests,
    tableNumber,
    numberOfGuests,
    paymentMethod,
    orderMethod,
  } = formData;

  const handleChange = (e) => {
    if (e.target.id === "numberOfGuests") {
      const guests = parseInt(e.target.value, 10);
      if (guests === 1) {
        dispatch(
          setDineInInfo({
            orderMethod: orderMethods.TOGETHER,
            customerName: "",
          })
        );
      }
      if (guests > 20) {
        showToast("Number of guests should be between 1 and 20", "error");
        return;
      }
    }

    const { id, value } = e.target;
    dispatch(setDineInInfo({ [id]: value }));
  };

  const handleOrderMethodChange = (value) => {
    if (numberOfGuests && numberOfGuests < 2) {
      showToast(
        "Order method cannot be changed to individual with 1 guest",
        "info"
      );
      return;
    }
    dispatch(setDineInInfo({ orderMethod: value }));
    if (value === orderMethods.INDIVIDUAL) {
      dispatch(clearCart());
    } else {
      dispatch(setDineInInfo({ customerName: "", guests: [] }));
    }
  };

  const handleGuestNameChange = (index) => (e) => {
    const { value } = e.target;
    const trimmedValue = value.trim();

    if (trimmedValue === "") {
      dispatch(updateDineInGuestName({ index, name: value }));
      return;
    }

    const duplicateName = formData.guests.some(
      (guest, guestIndex) =>
        guestIndex !== index &&
        guest?.name?.trim().toLowerCase() === trimmedValue.toLowerCase() &&
        trimmedValue.length >= 3
    );

    if (duplicateName) {
      showToast(
        `Guest name "${value}" is already taken. Please use a unique name.`,
        "error"
      );
      return;
    }

    dispatch(updateDineInGuestName({ index, name: value }));
  };

  const validate = () => {
    const requiredFields = ["numberOfGuests", "orderMethod"];
    for (const field of requiredFields) {
      if (!formData[field]?.toString().trim()) {
        showToast(
          `Please enter ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`,
          "error"
        );
        return false;
      }
    }

    if (orderMethod === orderMethods.INDIVIDUAL && numberOfGuests > 1) {
      const invalidGuest = formData.guests.some(
        (guest) => !guest?.name?.trim() || guest.name.trim().length < 3
      );
      if (invalidGuest) {
        showToast(
          "Each guest must have a name with at least 3 characters",
          "error"
        );
        return false;
      }
    } else if (orderMethod === orderMethods.TOGETHER && !customerName) {
      showToast("Please enter customer name", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onProceed();
  };

  return {
    customerName,
    specialRequests,
    tableNumber,
    numberOfGuests,
    paymentMethod,
    orderMethod,
    formData,
    handleChange,
    handleOrderMethodChange,
    handleGuestNameChange,
    handleSubmit,
    dispatch,
  };
};
