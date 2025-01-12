import Waiter from "../../models/employees/waiterModel.js";
import Delivery from "../../models/deliveryBoyModel.js";
// Function to get all waiter employees
export const getAllWaiters = async (req, res) => {
  try {
    // Fetch all waiters from the database
    const waiters = await Waiter.find();

    // Check if waiters exist
    if (!waiters || waiters.length === 0) {
      return res
        .status(404)
        .json({ sucess: false, message: "No waiters found" });
    }

    // Send the list of waiters as a response
    res.status(200).json(waiters);
  } catch (error) {
    // Handle any errors that occur during the fetch operation
    res.status(500).json({ message: error.message });
  }
};

// function to get all delivery employees
export const getAllDelivery = async (req, res) => {
  try {
    // Fetch all delivery from the database
    const delivery = await Delivery.find({ role: "delivery" });

    // Check if delivery exist
    if (!delivery || delivery.length === 0) {
      return res
        .status(404)
        .json({ sucess: false, message: "No delivery found" });
    }

    // Send the list of delivery as a response
    res.status(200).json(delivery);
  } catch (error) {
    // Handle any errors that occur during the fetch operation
    res.status(500).json({ message: error.message });
  }
};
