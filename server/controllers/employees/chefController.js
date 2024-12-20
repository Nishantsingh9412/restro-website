import Chef from "../../models/employees/chefModel.js";

// Function to get all chef employees
export const getAllChefs = async (req, res) => {
  try {
    // Fetch all chefs from the database
    const chefs = await Chef.find();

    // Check if chefs exist
    if (!chefs || chefs.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No chefs found" });
    }

    // Send the list of chefs as a response
    res.status(200).json(chefs);
  } catch (error) {
    // Handle any errors that occur during the fetch operation
    res.status(500).json({ message: error.message });
  }
};
