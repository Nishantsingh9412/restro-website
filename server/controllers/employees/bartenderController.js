import Bartender from "../../models/employees/bartenderModel.js";

// Bar Tender Controller

// get all bartenders
export const getAllBartenders = async (req, res) => {
  try {
    // Fetch all bartenders from the database
    const bartenders = await Bartender.find();

    // Check if bartenders exist
    if (!bartenders || bartenders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No bartenders found" });
    }

    // Send the list of bartenders as a response
    res.status(200).json(bartenders);
  } catch (error) {
    // Handle any errors that occur during the fetch operation
    res.status(500).json({ message: error.message });
  }
};
