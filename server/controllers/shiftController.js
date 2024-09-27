import express from "express";
import mongoose from "mongoose";
import moment from "moment-timezone";
import Shift from "../models/employeeShift.js"; // Adjust the path as needed
import Employee from "../models/employee.js"; // Adjust the path as needed

export const editEmployeeShift = async (req, res) => {
  try {
    const { employeeId, from, to, note, date, _id } = req.body;
    if (!_id || !employeeId || !date || !from || !to)
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });

    const shiftDate = new Date(date);
    const fromDate = new Date(
      `${shiftDate.toISOString().split("T")[0]}T${from}:00Z`
    );
    const toDate = new Date(
      `${shiftDate.toISOString().split("T")[0]}T${to}:00Z`
    );
    const duration = moment
      .duration(moment(toDate).diff(moment(fromDate)))
      .asHours();

    const shift = await Shift.findByIdAndUpdate(
      _id,
      {
        employeeId,
        date: shiftDate,
        from: fromDate,
        to: toDate,
        duration,
        note,
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ success: true, message: "Shift edited", result: shift });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteEmployeeShift = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) return res.status(400).json({ message: "ID is required." });
    await Shift.findByIdAndDelete(_id);
    return res.status(200).json({
      message: "Shift deleted successfully.",
      result: "",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const addShiftOfEmployee = async (req, res) => {
  try {
    const { employeeId, from, to, note, date } = req.body;
    if (!employeeId || !date || !from || !to)
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });

    const shiftDate = new Date(date);
    const fromDate = new Date(
      `${shiftDate.toISOString().split("T")[0]}T${from}:00Z`
    );
    const toDate = new Date(
      `${shiftDate.toISOString().split("T")[0]}T${to}:00Z`
    );
    const duration = moment
      .duration(moment(toDate).diff(moment(fromDate)))
      .asHours();

    const shift = new Shift({
      employeeId,
      date: shiftDate,
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
    return res.status(500).json({ error: error.message });
  }
};

export const getEmployeeShift = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const shifts = await Shift.find({ employeeId })
      .sort({ from: 1 })
      .populate("employeeId", "name");
    if (shifts.length === 0)
      return res
        .status(404)
        .json({ message: "No shifts found for this employee." });
    return res
      .status(200)
      .json({ message: "Shift fetched", success: true, result: shifts });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getTodaysShift = async (req, res) => {
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
    return res.status(500).json({ error: error.message });
  }
};

export const getCurrentMonthShifts = async (req, res) => {
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

    if (shifts.length === 0)
      return res.status(404).json({
        message: "No shifts found for this employee in the current month.",
      });
    return res
      .status(200)
      .json({ message: "Shift fetched", success: true, result: shifts });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getShiftByIdAndDate = async (req, res) => {
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
    return res.status(500).json({ error: error.message });
  }
};

export const getEmployeesWithShiftsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

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
    return res.status(500).json({ error: error.message });
  }
};
