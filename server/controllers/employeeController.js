import mongoose from "mongoose";
import Employee from "../models/employeeModel.js";
import DeliveryBoy from "../models/deliveryBoyModel.js";
import Waiter from "../models/employees/waiterModel.js";
import moment from "moment-timezone";
import Joi from "joi";
import Bartender from "../models/employees/bartenderModel.js";
import Staff from "../models/employees/staffModel.js";
import Manager from "../models/employees/managerModel.js";
import Chef from "../models/employees/chefModel.js";
import HelperEmployee from "../models/employees/helperEmpModel.js";
import { onlineUsers } from "../server.js";

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
  is_online: Joi.boolean().optional(),
  permissions: Joi.array().optional(),
});

// Mapping roles to their respective CASES
export const ROLE_CASES = {
  "Delivery Boy": DeliveryBoy,
  Waiter: Waiter,
  Chef: Chef,
  Manager: Manager,
  "Bar Tender": Bartender,
  "Kitchen Staff": Staff,
  Helper: HelperEmployee,
  Custom: Employee,
};

// Handle errors and send response
const handleError = (res, error, message = "Internal Server Error") => {
  console.error(message, error.message);
  return res.status(500).json({ success: false, message });
};

// Add a new employee to the database
export const addEmployee = async (req, res) => {
  const { role, id, created_by } = req.user;

  // Validate request body against schema
  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  // Extract the required fields from the request body
  const empData = req.body;
  const { email, phone } = empData;

  // Set the created_by field based on the user's role
  empData.created_by = role === "admin" ? id : created_by;

  console.log(empData);

  // Check if an employee with the same email or phone already exists
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
    // Create a new employee based on the role
    const newEmployee = await createEmployee(empData);
    return res.status(200).json({
      success: true,
      message: "Employee created successfully",
      result: newEmployee,
    });
  } catch (error) {
    return handleError(res, error, "Error in Add Employee");
  }
};

// Create a new employee based on the role
const createEmployee = (empData) => {
  const EmployeeModel = ROLE_CASES[empData?.role] || Employee;
  return EmployeeModel.create(empData);
};

// Get employees by restaurant based on userId or id
export const getAllEmployees = async (req, res) => {
  const { id, role } = req.user;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid User ID" });
  }
  try {
    const query =
      role === "admin"
        ? { created_by: id }
        : { created_by: req.user.created_by };

    const allEmployees = await Employee.find(query);

    if (allEmployees.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No Employees Found" });
    }

    // Filter out the admin from the list of employees
    const result =
      role === "admin"
        ? allEmployees
        : allEmployees.filter((employee) => employee.id !== id);

    // Return the list of employees
    return res.status(200).json({
      success: true,
      message: "All Employees",
      result,
    });
  } catch (error) {
    return handleError(res, error, "Error in getEmployeesByRestaurant");
  }
};

// Get employee by ID
export const getEmployeeById = async (req, res) => {
  const { id: _id } = req.params;
  const { id: userId, role } = req.user;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Employee ID" });
  }
  try {
    const filter = {
      _id,
      created_by: role === "admin" ? userId : req.user.created_by,
    };

    // Find the employee by ID
    const singleEmployee = await Employee.findOne(filter);

    if (!singleEmployee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee Not Found" });
    }

    return res.status(200).json({
      success: true,
      message: "Single Employee",
      result: singleEmployee,
    });
  } catch (error) {
    return handleError(res, error, "Error in getEmployeeById");
  }
};

// Get online employees by role
export const getOnlineEmployeesByRole = async (req, res) => {
  try {
    let { id: userId, role } = req.user;
    const { type } = req.params;
    userId = role === "admin" ? userId : req.user.created_by;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (!ROLE_CASES[type]) {
      return res.status(400).json({ message: "Invalid type parameter" });
    }

    const onlineEmployees = Array.from(onlineUsers.keys());
    const Model = ROLE_CASES[type];

    console.log(onlineEmployees, Model);

    const onlineRoleEmployees = await Model.find({
      _id: { $in: onlineEmployees },
      created_by: userId,
      is_online: true,
    });

    return res.status(200).json({
      success: true,
      message: `Online ${type}s`,
      result: onlineRoleEmployees,
    });
  } catch (error) {
    return handleError(res, error, "Error in GetOnlineEmployeesByRole");
  }
};

// Update an existing employee's details
export const updateEmployee = async (req, res) => {
  const { id: _id } = req.params;
  const { id: userId, role } = req.user;
  const updateData = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Employee ID" });
  }

  try {
    const filter = {
      _id,
      created_by: role === "admin" ? userId : req.user.created_by,
    };

    // Check if the employee exists
    const existingEmployee = await Employee.findOne(filter);
    if (!existingEmployee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    console.log(updateData.permissions, existingEmployee.permissions);

    // Check Permission being updated by the admin or not
    if (
      role !== "admin" &&
      updateData.permissions &&
      !updateData.permissions.every((perm) =>
        existingEmployee.permissions.some(
          (existingPerm) => existingPerm.id === perm.id
        )
      )
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Permission Denied" });
    }
    // Check if role is being updated

    if (updateData.role && updateData.role !== existingEmployee.role) {
      // Remove the old employee document
      await Employee.findByIdAndDelete(_id);

      // Create a new employee document in the new role
      const newEmployee = await createEmployee({
        ...existingEmployee.toObject(),
        ...updateData, // Override with updated fields
        __t: undefined, // Remove the discriminator key
      });

      return res.status(200).json({
        success: true,
        message: "Employee role updated successfully",
        result: newEmployee,
      });
    }

    // Update the existing employee document
    const employee = await Employee.findByIdAndUpdate(_id, updateData, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      result: employee,
    });
  } catch (error) {
    console.log(error);
    return handleError(res, error, "Error in Update Employee");
  }
};

// Delete an employee from the database
export const deleteEmployee = async (req, res) => {
  const { id: _id } = req.params;
  const { id: userId, role } = req.user;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Employee ID" });
  }

  try {
    const filter = {
      _id,
      created_by: role === "admin" ? userId : req.user.created_by,
    };
    const deletedEmployee = await Employee.findOneAndDelete(filter);

    if (!deletedEmployee) {
      return res
        .status(404)
        .json({ success: false, message: "Error Deleting Employee" });
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
  const { id, role, created_by } = req.user;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid User ID" });
  }
  try {
    const filter =
      role === "admin"
        ? { created_by: id, role: "Delivery Boy" }
        : { created_by: created_by, role: "Delivery Boy" };

    const deliveryEmployees = await Employee.find(filter);

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
