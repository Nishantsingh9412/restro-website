import moment from "moment-timezone";
import mongoose from "mongoose";

import Absence from "../models/absence.js";
import Employee from "../models/employee.js";

export const deleteEmployeeAbsence = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) return res.status(400).json({ message: "ID is required." });
    await Absence.findByIdAndDelete(_id);
    return res
      .status(200)
      .json({ message: "Success", success: true, result: "" });
  } catch (err) {
    return res.status(500).json({ error: err.message, status: 500 });
  }
};

export const editEmployeeAbsence = async (req, res) => {
  try {
    const {
      employeeId,
      type,
      startDate,
      endDate,
      leaveType,
      notes,
      declineAssignedShifts,
      _id,
    } = req.body;
    if (
      !_id ||
      !employeeId ||
      !type ||
      !startDate ||
      !endDate ||
      !leaveType ||
      declineAssignedShifts == null
    )
      return res.status(400).json({ message: "All fields are required." });

    const absence = await Absence.findByIdAndUpdate(
      _id,
      {
        employeeId,
        type,
        startDate,
        endDate,
        leaveType,
        notes,
        declineAssignedShifts,
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ result: absence, message: "Success", success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message, status: 500 });
  }
};

export const addEmployeeAbsence = async (req, res) => {
  try {
    const {
      employeeId,
      type,
      startDate,
      endDate,
      leaveType,
      notes,
      declineAssignedShifts,
    } = req.body;
    if (
      !employeeId ||
      !type ||
      !startDate ||
      !endDate ||
      !leaveType ||
      declineAssignedShifts == null
    )
      return res.status(400).json({ message: "All fields are required." });

    const newAbsence = new Absence({
      employeeId,
      type,
      startDate,
      endDate,
      leaveType,
      notes,
      declineAssignedShifts,
    });
    await newAbsence.save();

    return res
      .status(201)
      .json({ result: newAbsence, message: "Success", success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getEmployeeAbsence = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const absences = await Absence.find({ employeeId })
      .sort({ startDate: 1 })
      .populate("employeeId", "name");
    if (absences.length === 0)
      return res
        .status(404)
        .json({ message: "No absences found for this employee." });

    return res
      .status(200)
      .json({ result: absences, message: "Success", success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message, status: 500 });
  }
};

export const getTodaysLeaveByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const todayStart = moment().tz("Asia/Kolkata").startOf("day").toDate();
    const todayEnd = moment().tz("Asia/Kolkata").endOf("day").toDate();
    const employees = await Employee.find({ created_by: userId }).select("_id");

    if (employees.length === 0)
      return res
        .status(404)
        .json({ message: "No employees found for this user.", success: false });
    const employeeIds = employees.map((emp) => emp._id);

    const absences = await Absence.find({
      employeeId: { $in: employeeIds },
      startDate: { $lte: todayEnd },
      endDate: { $gte: todayStart },
    }).populate("employeeId", "name");

    if (absences.length === 0)
      return res.status(404).json({
        message: "No leaves found for today for these employees.",
        success: false,
      });
    return res
      .status(200)
      .json({ result: absences, message: "", success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getEmployeesWithAbsencesByUser = async (req, res) => {
  const { userId } = req.params;

  if (!userId) return res.status(400).json({ error: "userId is required" });

  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const employees = await Employee.find({ created_by: userObjectId });
    if (!employees.length)
      return res
        .status(404)
        .json({ message: "No employees found", success: false });

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
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
