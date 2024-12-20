import Staff from "../../models/employees/staffModel.js";
// Function to get all staff employees
export const getAllStaffs = async (req, res) => {
  try {
    // Fetch all staffs from the database
    const staffs = await Staff.find();

    // Check if staffs exist
    if (!staffs || staffs.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No staffs found" });
    }

    // Send the list of staffs as a response
    res.status(200).json(staffs);
  } catch (error) {
    // Handle any errors that occur during the fetch operation
    res.status(500).json({ message: error.message });
  }
};
