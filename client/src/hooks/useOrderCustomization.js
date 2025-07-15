import { useState } from "react";
import { useToast } from "../contexts/useToast";

export const useCustomization = (item) => {
  const showToast = useToast();
  const [customizationSelections, setCustomizationSelections] = useState({});

  const handleOptionChange = (customizationId, value) => {
    setCustomizationSelections((prev) => ({
      ...prev,
      [customizationId]: value,
    }));
  };

  const validateSelections = () => {
    return item.customization.every((c) => {
      if (!c.required) return true;
      const selected = customizationSelections[c._id] || [];
      return selected.length > 0 && selected.length <= c.maxSelect;
    });
  };

  const buildSelectedCustomizations = () => {
    return item.customization.map((custom) => {
      const selectedNames = customizationSelections[custom._id] || [];

      const selectedOptions = custom.option
        .filter((opt) => selectedNames.includes(opt.name))
        .map((opt) => ({
          name: opt.name,
          price: opt.price,
        }));

      return {
        title: custom.title,
        selectedOptions,
      };
    });
  };

  const calculateFinalPrice = (selectedCustomizations) => {
    return (
      item.basePrice +
      selectedCustomizations.reduce((acc, custom) => {
        return (
          acc + custom.selectedOptions.reduce((sum, opt) => sum + opt.price, 0)
        );
      }, 0)
    );
  };

  const getFinalOrder = () => {
    const selectedCustomizations = buildSelectedCustomizations();
    const price = calculateFinalPrice(selectedCustomizations);

    return {
      ...item,
      selectedCustomizations,
      price,
      totalPrice: price,
      totalQuantity: 1,
    };
  };

  return {
    showToast,
    customizationSelections,
    handleOptionChange,
    validateSelections,
    getFinalOrder,
  };
};
