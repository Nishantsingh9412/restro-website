import Admin from "../models/adminModel.js";

// Get all admins
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    if (admins.length === 0) {
      return res.status(404).json({ message: "No admins found" });
    }
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAdmin = async (req, res) => {
  const id = req.params.id;
  try {
    if (!id) {
      return res.status(400).json({ message: "Admin ID is required" });
    }
    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ message: "Admin deleted successfully", res: admin });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid Admin ID" });
    }
    res.status(500).json({ message: error.message });
  }
};
