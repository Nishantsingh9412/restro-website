import Manager from "../../models/employees/managerModel.js";
// Function to get all manager employees
export const getAllManagers = async (req, res) => {
  try {
    // Fetch all managers from the database
    const managers = await Manager.find();

    // Check if managers exist
    if (!managers || managers.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No managers found" });
    }

    // Send the list of managers as a response
    res.status(200).json(managers);
  } catch (error) {
    // Handle any errors that occur during the fetch operation
    res.status(500).json({ message: error.message });
  }
};
