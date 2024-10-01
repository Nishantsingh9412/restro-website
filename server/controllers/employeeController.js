import mongoose from "mongoose";
import Employee from "../models/employee.js";
import moment from "moment-timezone";

const handleError = (res, error, message = "Internal Server Error") => {
  console.error(message, error.message);
  return res.status(500).json({ success: false, message });
};

export const addEmployee = async (req, res) => {
  try {
    const requiredFields = [
      "name",
      "email",
      "employeeID",
      "status",
      "type",
      "created_by",
    ];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res
          .status(400)
          .json({ success: false, message: `Field ${field} is required` });
      }
    }

    const newEmployee = await Employee.create(req.body);
    return res
      .status(200)
      .json({
        success: true,
        message: "Employee created successfully",
        result: newEmployee,
      });
  } catch (error) {
    return handleError(res, error, "Error in addEmployee");
  }
};

export const getEmployeesByRestaurant = async (req, res) => {
  try {
    const [key, value] = req.params.allActive.split("_");
    const query =
      key === "userId"
        ? { created_by: value }
        : key === "id"
        ? { _id: value }
        : {};

    const employees = await Employee.find(query);
    if (!employees.length) {
      return res
        .status(404)
        .json({
          success: false,
          message: "No employees found for this restaurant",
        });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "Employees retrieved successfully",
        result: employees,
      });
  } catch (error) {
    return handleError(res, error, "Error in getEmployeesByRestaurant");
  }
};

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
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "Employee updated successfully",
        result: employee,
      });
  } catch (error) {
    return handleError(res, error, "Error in updateEmployee");
  }
};

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

export const getTodaysBirthday = async (req, res) => {
  try {
    const todayIST = moment().tz("Asia/Kolkata");
    const month = todayIST.month() + 1;
    const day = todayIST.date();

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
export const getUpcomingEmployeeBirthday = async (req, res) => {
  try {
    const todayIST = moment().tz("Asia/Kolkata").startOf("day");
    const endDateIST = todayIST.clone().add(30, "days").endOf("day");

    const employees = await Employee.find({});
    const upcomingBirthdays = employees
      .filter((employee) => {
        const birthday = moment(employee.birthday).tz("Asia/Kolkata");
        const birthdayThisYear = birthday.clone().year(todayIST.year());
        const birthdayNextYear = birthday.clone().year(todayIST.year() + 1);

        return (
          birthdayThisYear.isBetween(todayIST, endDateIST, null, "[]") ||
          birthdayNextYear.isBetween(todayIST, endDateIST, null, "[]")
        );
      })
      .sort((a, b) => {
        const aBirthdayThisYear = moment(a.birthday).year(todayIST.year());
        const bBirthdayThisYear = moment(b.birthday).year(todayIST.year());
        return aBirthdayThisYear.diff(bBirthdayThisYear);
      });

    if (upcomingBirthdays.length === 0) {
      return res
        .status(200)
        .json({
          success: true,
          message: "No employees have birthdays in the next 30 days.",
          result: [],
        });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "Upcoming birthdays",
        result: upcomingBirthdays,
      });
  } catch (error) {
    return handleError(res, error, "Error in getUpcomingEmployeeBirthday");
  }
};
