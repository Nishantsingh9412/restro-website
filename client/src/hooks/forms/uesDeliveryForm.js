import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { setDeliveryInfo } from "../../redux/action/customerInfo";
import { useToast } from "../../contexts/useToast";

export const useDeliveryOrderFormLogic = (onProceed) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const formData = useSelector((state) => state.customerInfo.delivery);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(
      setDeliveryInfo({
        [name]: value,
      })
    );
  };

  const validate = () => {
    const requiredFields = [
      "customerName",
      "phoneNumber",
      "address",
      "dropLocation",
      "dropLocationName",
    ];

    for (const field of requiredFields) {
      const value = formData[field];
      if (!value || (typeof value === "string" && value.trim() === "")) {
        toast(
          `Please enter ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`,
          "error"
        );
        document.querySelector(`[name="${field}"]`)?.focus();
        return false;
      }
    }

    if (!/^\d{11}$/.test(formData.phoneNumber)) {
      toast("Please enter a valid 11-digit phone number", "error");
      return false;
    }

    if (formData.zip && !/^\d{5}$/.test(formData.zip)) {
      toast("Please enter a valid 5 digit zip code", "error");
      return false;
    }

    if (
      formData.dropLocationName &&
      (!formData.dropLocationName.includes(formData.city) ||
        !formData.dropLocationName.includes(formData.zip))
    ) {
      toast("Drop location name should include city and zip", "error");
      return false;
    }

    return true;
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onProceed();
  };

  return {
    isOpen,
    formData,
    setIsOpen,
    handleChange,
    handleAddressSubmit,
  };
};
