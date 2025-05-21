import express from "express";
import mongoose from "mongoose";
import moment from "moment-timezone";
import Shift from "../models/employeeShift.js";
import Employee from "../models/employeeModel.js";
import Joi from "joi";

// Utility function to parse date and time
const parseDateTime = (date, time) => {
  return new Date(`${moment(date).format("YYYY-MM-DD")}T${time}:00Z`);
};
// Centralized error handling
const handleError = (res, error) => {
  console.error("Server Error:", error);
  return res
    .status(500)
    .json({ message: "Server Error", error: error.message, status: 500 });
};

// Validation schema
const shiftSchema = Joi.object({
  employeeId: Joi.string().required(),
  from: Joi.string().required(),
  to: Joi.string().required(),
  note: Joi.string().allow(""),
  date: Joi.date().required(),
  _id: Joi.string().optional(),
});

// Edit Employee Shift
export const editEmployeeShift = async (req, res) => {
  try {
    const { error, value } = shiftSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const { employeeId, from, to, note, date, _id } = value;
    if (!_id)
      return res
        .status(400)
        .json({ success: false, message: "Shift ID is required" });

    const fromDate = parseDateTime(date, from);
    const toDate = parseDateTime(date, to);
    const duration = moment
      .duration(moment(toDate).diff(moment(fromDate)))
      .asHours();

    const shift = await Shift.findByIdAndUpdate(
      _id,
      { employeeId, date, from: fromDate, to: toDate, duration, note },
      { new: true }
    );

    if (!shift)
      return res
        .status(404)
        .json({ success: false, message: "Shift not found" });

    return res
      .status(200)
      .json({ success: true, message: "Shift edited", result: shift });
  } catch (err) {
    return handleError(res, err);
  }
};

// Delete Employee Shift
export const deleteEmployeeShift = async (req, res, next) => {
  try {
    const { _id } = req.body;
    if (!_id) return res.status(400).json({ message: "ID is required." });

    const shift = await Shift.findByIdAndDelete(_id);
    if (!shift) return res.status(404).json({ message: "Shift not found." });

    return res
      .status(200)
      .json({ message: "Shift deleted successfully.", success: true });
  } catch (err) {
    return handleError(res, err);
  }
};

// Add Shift of Employee
export const addShiftOfEmployee = async (req, res, next) => {
  try {
    const { error, value } = shiftSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const { employeeId, from, to, note, date } = value;

    const fromDate = parseDateTime(date, from);
    const toDate = parseDateTime(date, to);
    const duration = moment
      .duration(moment(toDate).diff(moment(fromDate)))
      .asHours();

    const shift = new Shift({
      employeeId,
      date,
      from: fromDate,
      to: toDate,
      duration,
      note,
    });
    await shift.save();

    return res
      .status(201)
      .json({ message: "Shift added", success: true, result: shift });
  } catch (error) {
    return handleError(res, error);
  }
};

// Get Employee Shift
export const getEmployeeShift = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const shifts = await Shift.find({ employeeId })
      .sort({ from: 1 })
      .populate("employeeId", "name");

    if (!shifts.length)
      return res
        .status(404)
        .json({ message: "No shifts found for this employee." });

    return res
      .status(200)
      .json({ message: "Shift fetched", success: true, result: shifts });
  } catch (error) {
    return handleError(res, error);
  }
};

// Get Today's Shift
export const getTodaysShift = async (req, res, next) => {
  try {
    const todayStart = moment().tz("Asia/Kolkata").startOf("day").toDate();
    const todayEnd = moment().tz("Asia/Kolkata").endOf("day").toDate();

    const shifts = await Shift.find({
      from: { $gte: todayStart },
      to: { $lte: todayEnd },
    }).populate("employeeId", "name");

    return res
      .status(200)
      .json({ message: "Shift fetched", success: true, result: shifts });
  } catch (error) {
    return handleError(res, error);
  }
};

// Get Current Month Shifts
export const getCurrentMonthShifts = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const startOfMonth = moment().tz("Asia/Kolkata").startOf("month").toDate();
    const endOfMonth = moment().tz("Asia/Kolkata").endOf("month").toDate();

    const shifts = await Shift.find({
      employeeId,
      from: { $gte: startOfMonth },
      to: { $lte: endOfMonth },
    })
      .sort({ from: 1 })
      .populate("employeeId", "name");

    if (!shifts.length)
      return res.status(404).json({
        message: "No shifts found for this employee in the current month.",
      });

    return res
      .status(200)
      .json({ message: "Shift fetched", success: true, result: shifts });
  } catch (error) {
    return handleError(res, error);
  }
};

// Get Shift by ID and Date
export const getShiftByIdAndDate = async (req, res, next) => {
  try {
    const { employeeId, date } = req.params;
    if (!employeeId || !date)
      return res
        .status(400)
        .json({ error: "employeeId and date are required" });

    const shiftDate = new Date(date);
    const shift = await Shift.findOne({
      employeeId: new mongoose.Types.ObjectId(employeeId),
      date: shiftDate,
    });

    if (!shift) return res.status(404).json({ message: "Shift not found" });

    return res
      .status(200)
      .json({ message: "Shift fetched", success: true, result: shift });
  } catch (error) {
    return handleError(res, error);
  }
};

// Get Employees with Shifts by User
export const getEmployeesWithShiftsByUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const employees = await Employee.find({ created_by: userObjectId });

    if (!employees.length)
      return res
        .status(404)
        .json({ message: "No employees found", success: false });

    const employeeIds = employees.map((emp) => emp._id);
    const shifts = await Shift.find({ employeeId: { $in: employeeIds } });

    const employeesWithShifts = employees.map((emp) => ({
      ...emp.toObject(),
      shifts: shifts.filter((shift) => shift.employeeId.equals(emp._id)),
    }));

    return res.status(200).json({
      message: "Shift fetched",
      success: true,
      result: employeesWithShifts,
    });
  } catch (error) {
    return handleError(res, error);
  }
};
