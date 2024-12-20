import HelperEmployee from "../../models/employees/helperEmpModel.js";

// Function to get all helper employees
export const getAllHelpers = async (req, res) => {
  try {
    // Fetch all helpers from the database
    const helpers = await HelperEmployee.find();

    // Check if helpers exist
    if (!helpers || helpers.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No Helper found" });
    }

    // Send the list of helpers as a response
    res.status(200).json(helpers);
  } catch (error) {
    // Handle any errors that occur during the fetch operation
    res.status(500).json({ message: error.message });
  }
};
