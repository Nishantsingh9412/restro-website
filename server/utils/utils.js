import mongoose from "mongoose";

const userTypes = {
  ADMIN: "admin",
  EMPLOYEE: "employee",
};

// Format order items while creating orders like delivery, dine-in or take-away
const formatOrderItems = (orderItems) => {
  const formattedOrderItems = orderItems.map((item) => ({
    item: new mongoose.Types.ObjectId(item._id),
    selectedCustomizations: item.selectedCustomizations,
    guestName: item.guestName,
    quantity: item.totalQuantity,
    total: item.totalPrice,
  }));
  return formattedOrderItems;
};

export { formatOrderItems, userTypes };

// Generate a random barcode based on german policy, if not available.
export const generateEAN13 = (prefix = '401') => {
  let base = prefix;
  while (base.length < 12) {
    base += Math.floor(Math.random() * 10);
  }

  const calculateCheckDigit = (number) => {
    let sum = 0;
    for (let i = 0; i < number.length; i++) {
      const digit = parseInt(number[i]);
      sum += i % 2 === 0 ? digit : digit * 3;
    }
    const remainder = sum % 10;
    return remainder === 0 ? 0 : 10 - remainder;
  };

  const checkDigit = calculateCheckDigit(base);
  return base + checkDigit;
};