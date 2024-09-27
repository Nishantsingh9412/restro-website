import mongoose from "mongoose";
import Employee from "../models/employee.js";
import moment from "moment-timezone";

export const addEmployee = async (req, res) => {
	try {
		const {
			name,
			email,
			phone,
			address,
			birthday,
			nationality,
			maritalStatus,
			children,
			healthInsurance,
			socialSecurityNumber,
			taxID,
			status,
			dateOfJoining,
			endOfEmployment,
			employeeID,
			position,
			type,
			workingHoursPerWeek,
			variableWorkingHours,
			annualHolidayEntitlement,
			notes,

			created_by,
		} = req.body;

		if (!name || !email || !employeeID || !status || !type || !created_by)
			return res.status(400).json({
				success: false,
				message: "All required fields must be filled",
			});
		const newEmployee = await Employee.create({
			name,
			email,
			phone,
			address,
			birthday,
			nationality,
			maritalStatus,
			children,
			healthInsurance,
			socialSecurityNumber,
			taxID,
			status,
			dateOfJoining,
			endOfEmployment,
			employeeID,
			position,
			type,
			workingHoursPerWeek,
			variableWorkingHours,
			annualHolidayEntitlement,
			notes,

			created_by,
		});

		if (!newEmployee)
			return res
				.status(400)
				.json({ success: false, message: "Error in creating employee" });
		return res.status(200).json({
			success: true,
			message: "Employee created successfully",
			result: newEmployee,
		});
	} catch (error) {
		console.log("Error in addEmployee", error.message);
		return res
			.status(500)
			.json({ success: false, message: "Internal Server Error" });
	}
};

export const getEmployeesByRestaurant = async (req, res) => {
	try {
		let userAccording = req.params.allActive;
		let userTypeSplit = userAccording.split("_");

		const employees = await Employee.find(
			userTypeSplit[0] === "userId"
				? { created_by: userTypeSplit[1] }
				: userTypeSplit[0] === "id"
					? { _id: userTypeSplit[1] }
					: {},
		);
		if (!employees || employees.length === 0)
			return res.status(404).json({
				success: false,
				message: "No employees found for this restaurant",
			});
		return res.status(200).json({
			success: true,
			message: "Employees retrieved successfully",
			result: employees,
		});
	} catch (error) {
		console.log("Error in getEmployeesByRestaurant", error.message);
		return res
			.status(500)
			.json({ success: false, message: "Internal Server Error" });
	}
};

export const updateEmployee = async (req, res) => {
	try {
		const { employeeId } = req.params; // Assume restaurantId and employeeId are passed as URL parameters

		if (!employeeId)
			return res.status(400).json({
				success: false,
				message: "Restaurant ID and Employee ID parameters are required",
			});

		const updates = req.body; // Get updates from request body
		const employee = await Employee.findOneAndUpdate(
			{ _id: employeeId },
			updates,
			{ new: true },
		);

		if (!employee)
			return res.status(404).json({
				success: false,
				message:
					"Employee not found or not associated with the specified restaurant",
			});
		return res.status(200).json({
			success: true,
			message: "Employee updated successfully",
			result: employee,
		});
	} catch (error) {
		console.log("Error in updateEmployee", error.message);
		return res
			.status(500)
			.json({ success: false, message: "Internal Server Error" });
	}
};

export const deleteEmployee = async (req, res) => {
	try {
		const { employeeId } = req.params; // Assume employeeId is passed as a URL parameter
		if (!employeeId)
			return res
				.status(400)
				.json({ success: false, message: "Employee ID parameter is required" });

		const employee = await Employee.findByIdAndDelete(employeeId);
		if (!employee)
			return res
				.status(404)
				.json({ success: false, message: "Employee not found" });
		return res
			.status(200)
			.json({ success: true, message: "Employee deleted successfully" });
	} catch (error) {
		console.log("Error in deleteEmployee", error.message);
		return res
			.status(500)
			.json({ success: false, message: "Internal Server Error" });
	}
};

export const getTodaysBirthday = async (req, res) => {
	try {
		const todayIST = moment().tz("Asia/Kolkata");
		const month = todayIST.month() + 1; // month() is zero-based
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
		return res.status(500).json({ error: error.message });
	}
};

export const getUpcomingEmployeeBirthday = async (req, res) => {
	try {
		const todayIST = moment().tz("Asia/Kolkata").startOf("day");
		const endDateIST = moment(todayIST).add(30, "days").endOf("day");

		const employees = await Employee.find({});
		const upcomingBirthdays = employees
			.filter((employee) => {
				const birthday = moment(employee.birthday);
				const birthdayThisYear = birthday.clone().year(todayIST.year());
				const birthdayNextYear = birthday.clone().year(todayIST.year() + 1);

				return (
					birthdayThisYear.isBetween(todayIST, endDateIST, null, "[]") ||
					birthdayNextYear.isBetween(todayIST, endDateIST, null, "[]")
				);
			})
			.sort((a, b) => {
				const aBirthday = moment(a.birthday);
				const bBirthday = moment(b.birthday);

				const aBirthdayThisYear = aBirthday.clone().year(todayIST.year());
				const bBirthdayThisYear = bBirthday.clone().year(todayIST.year());

				return aBirthdayThisYear.diff(bBirthdayThisYear);
			});

		if (upcomingBirthdays.length === 0)
			return res
				.status(404)
				.json({ message: "No employees have birthdays in the next 30 days." });

		return res.status(200).json({
			message: "Upcoming birthdays",
			result: upcomingBirthdays,
			success: true,
		});
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};
