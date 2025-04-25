import mongoose from "mongoose";

const userTypes = {
  ADMIN: "admin",
  EMPLOYEE: "employee",
};

const formatOrderItems = (orderItems) => {
  const formattedOrderItems = orderItems.map((item) => ({
    item: new mongoose.Types.ObjectId(item._id),
    selectedCustomizations: item.selectedCustomizations,
    quantity: item.totalQuantity,
    total: item.totalPrice,
  }));
  return formattedOrderItems;
};

export { formatOrderItems, userTypes };
