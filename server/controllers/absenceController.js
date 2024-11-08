import moment from "moment-timezone";
import mongoose from "mongoose";
import Joi from "joi";
import Absence from "../models/absence.js";
import Employee from "../models/employeeModel.js";

// Validation schemas
const absenceSchema = Joi.object({
  employeeId: Joi.string().required(),
  type: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  leaveType: Joi.string().required(),
  notes: Joi.string().allow(""),
  declineAssignedShifts: Joi.boolean().required(),
  _id: Joi.string().optional(),
});

const idSchema = Joi.object({
  _id: Joi.string().required(),
});

const userIdSchema = Joi.object({
  userId: Joi.string().required(),
});

// Centralized error handler
const handleError = (res, error) => {
  return res.status(500).json({ error: error.message, status: 500 });
};

// Add a new employee absence
export const addEmployeeAbsence = async (req, res) => {
  const { error, value } = absenceSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const newAbsence = new Absence(value);
    await newAbsence.save();

    return res
      .status(201)
      .json({ result: newAbsence, message: "Success", success: true });
  } catch (err) {
    return handleError(res, err);
  }
};

// Delete an employee absence
export const deleteEmployeeAbsence = async (req, res) => {
  const { error, value } = idSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { _id } = value;
    const result = await Absence.findByIdAndDelete(_id);
    if (!result) return res.status(404).json({ message: "Absence not found." });

    return res
      .status(200)
      .json({ message: "Success", success: true, result: "" });
  } catch (err) {
    return handleError(res, err);
  }
};

// Edit an employee absence
export const editEmployeeAbsence = async (req, res) => {
  const { error, value } = absenceSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { _id, ...updateData } = value;
    const absence = await Absence.findByIdAndUpdate(_id, updateData, {
      new: true,
    });
    if (!absence)
      return res.status(404).json({ message: "Absence not found." });

    return res
      .status(200)
      .json({ result: absence, message: "Success", success: true });
  } catch (err) {
    return handleError(res, err);
  }
};

// Get absences for a specific employee
export const getEmployeeAbsence = async (req, res) => {
  const { employeeId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    return res.status(400).json({ message: "Invalid employee ID." });
  }

  try {
    const absences = await Absence.find({ employeeId })
      .sort({ startDate: 1 })
      .populate("employeeId", "name");

    if (absences.length === 0) {
      return res
        .status(404)
        .json({ message: "No absences found for this employee." });
    }

    return res
      .status(200)
      .json({ result: absences, message: "Success", success: true });
  } catch (err) {
    return handleError(res, err);
  }
};

// Get today's leaves by user ID
export const getTodaysLeaveByUserId = async (req, res) => {
  const { error, value } = userIdSchema.validate(req.params);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { userId } = value;
    const todayStart = moment().startOf("day").toDate();
    const todayEnd = moment().endOf("day").toDate();
    const employees = await Employee.find({ created_by: userId }).select("_id");

    if (employees.length === 0) {
      return res
        .status(404)
        .json({ message: "No employees found for this user.", success: false });
    }

    const employeeIds = employees.map((emp) => emp._id);

    const absences = await Absence.find({
      employeeId: { $in: employeeIds },
      startDate: { $lte: todayEnd },
      endDate: { $gte: todayStart },
    }).populate("employeeId", "name");

    if (absences.length === 0) {
      return res.status(200).json({
        message: "No leaves found for today for these employees.",
        success: false,
      });
    }

    return res
      .status(200)
      .json({ result: absences, message: "", success: true });
  } catch (err) {
    return handleError(res, err);
  }
};

// Get employees with absences by user ID
export const getEmployeesWithAbsencesByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const employees = await Employee.find({ created_by: userObjectId });

    if (!employees.length) {
      return res
        .status(404)
        .json({ message: "No employees found", success: false });
    }

    const employeeIds = employees.map((emp) => emp._id);
    const absences = await Absence.find({ employeeId: { $in: employeeIds } });

    const employeesWithAbsences = employees.map((emp) => ({
      ...emp.toObject(),
      absences: absences.filter((absence) =>
        absence.employeeId.equals(emp._id)
      ),
    }));

    return res
      .status(200)
      .json({ result: employeesWithAbsences, success: true, message: "" });
  } catch (err) {
    return handleError(res, err);
  }
};
