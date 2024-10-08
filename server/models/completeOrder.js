import mongoose from "mongoose";

const { Schema, model } = mongoose;

const orderItemsSubDocsSchema = new Schema({
  item: {
    type: Schema.Types.ObjectId,
    //TODO: change to OrderedItems
    ref: "OrderdItems",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

const completeOrderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
    },
    deliveryMethod: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    address2: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    zip: {
      type: String,
    },
    noteFromCustomer: {
      type: String,
    },
    orderItems: [orderItemsSubDocsSchema],
    totalPrice: {
      type: Number,
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model("CompleteOrder", completeOrderSchema);
