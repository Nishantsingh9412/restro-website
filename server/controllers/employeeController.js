import mongoose from "mongoose";
import Employee from "../models/employeeModel.js";
import moment from "moment-timezone";
import Joi from "joi";

// Define validation schema using Joi
const schema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  country_code: Joi.string().required(),
  role: Joi.string().required(),
  address: Joi.object().optional(),
  birthday: Joi.date().optional(),
  nationality: Joi.string().optional(),
  maritalStatus: Joi.string().optional(),
  children: Joi.number().optional(),
  healthInsurance: Joi.string().optional(),
  dateOfJoining: Joi.date().optional().allow(null),
  endOfEmployment: Joi.date().optional().allow(null),
  type: Joi.string().optional(),
  workingHoursPerWeek: Joi.number().optional(),
  variableWorkingHours: Joi.boolean().optional(),
  annualHolidayEntitlement: Joi.number().optional(),
  notes: Joi.string().optional(),
  created_by: Joi.string().required(),
});

const handleError = (res, error, message = "Internal Server Error") => {
  console.error(message, error.message);
  return res.status(500).json({ success: false, message });
};

// Add a new employee to the database
export const addEmployee = async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  const { email, phone } = req.body;
  const existingEmployee = await Employee.findOne({
    $or: [{ email }, { phone }],
  });
  if (existingEmployee) {
    return res.status(400).json({
      success: false,
      message: "Employee with this email or phone number already exists",
    });
  }
  try {
    const newEmployee = await Employee.create(req.body);
    return res.status(200).json({
      success: true,
      message: "Employee created successfully",
      result: newEmployee,
    });
  } catch (error) {
    return handleError(res, error, "Error in Add Employee");
  }
};

// Get employees by restaurant based on userId or id
export const getEmployeesByRestaurant = async (req, res) => {
  const id = req.user.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid User ID" });
  }
  const query = { created_by: id };
  try {
    const employees = await Employee.find(query);
    return res.status(200).json({
      success: true,
      message: "Employees retrieved successfully",
      result: employees,
    });
  } catch (error) {
    return handleError(res, error, "Error in getEmployeesByRestaurant");
  }
};

// Update an existing employee's details
export const updateEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    if (!employeeId) {
      return res
        .status(400)
        .json({ success: false, message: "Employee ID parameter is required" });
    }

    const employee = await Employee.findByIdAndUpdate(employeeId, req.body, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      result: employee,
    });
  } catch (error) {
    return handleError(res, error, "Error in updateEmployee");
  }
};

// Delete an employee from the database
export const deleteEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    if (!employeeId) {
      return res
        .status(400)
        .json({ success: false, message: "Employee ID parameter is required" });
    }

    const employee = await Employee.findByIdAndDelete(employeeId);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Employee deleted successfully" });
  } catch (error) {
    return handleError(res, error, "Error in deleteEmployee");
  }
};
// Get employees who have birthdays today (based on German timezone)
export const getTodaysBirthday = async (req, res) => {
  try {
    const todayDE = moment().tz("Europe/Berlin");
    const month = todayDE.month() + 1;
    const day = todayDE.date();

    const employees = await Employee.find({
      $expr: {
        $and: [
          { $eq: [{ $month: "$birthday" }, month] },
          { $eq: [{ $dayOfMonth: "$birthday" }, day] },
        ],
      },
    });

    return res
      .status(200)
      .json({ success: true, message: "Birthdays today", result: employees });
  } catch (error) {
    return handleError(res, error, "Error in getTodaysBirthday");
  }
};

// Get employees who have birthdays in the next 30 days (based on German timezone)
export const getUpcomingEmployeeBirthday = async (req, res) => {
  try {
    const todayDE = moment().tz("Europe/Berlin").startOf("day");
    const endDateDE = todayDE.clone().add(30, "days").endOf("day");

    const employees = await Employee.find({});
    const upcomingBirthdays = employees
      .filter((employee) => {
        const birthday = moment(employee.birthday).tz("Europe/Berlin");
        const birthdayThisYear = birthday.clone().year(todayDE.year());
        const birthdayNextYear = birthday.clone().year(todayDE.year() + 1);

        return (
          birthdayThisYear.isBetween(todayDE, endDateDE, null, "[]") ||
          birthdayNextYear.isBetween(todayDE, endDateDE, null, "[]")
        );
      })
      .sort((a, b) => {
        const aBirthdayThisYear = moment(a.birthday).year(todayDE.year());
        const bBirthdayThisYear = moment(b.birthday).year(todayDE.year());
        return aBirthdayThisYear.diff(bBirthdayThisYear);
      });

    return res.status(200).json({
      success: true,
      message: "Upcoming birthdays",
      result: upcomingBirthdays.length ? upcomingBirthdays : [],
    });
  } catch (error) {
    return handleError(res, error, "Error in getUpcomingEmployeeBirthday");
  }
};

// Get all delivery employees
export const getDeliveryEmployees = async (req, res) => {
  const id = req.user.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid User ID" });
  }
  try {
    const deliveryEmployees = await Employee.find({
      created_by: id,
      role: "Delivery Boy",
    });

    if (!deliveryEmployees) {
      return res.status(404).json({
        success: false,
        message: "No delivery employees found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Delivery employees retrieved successfully",
      result: deliveryEmployees,
    });
  } catch (error) {
    return handleError(res, error, "Error in getDeliveryEmployees");
  }
};
