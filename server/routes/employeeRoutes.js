import express from "express";
import { accessMiddleware } from "../middleware/authMiddleware.js";

import {
  assignTask,
  getAllTasks,
  AllEmployees,
  deleteSingleTask,
  updateSingleTask,
  getALLEmployeesAssignedTo,
} from "../controllers/employeeTaskController.js";

import {
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getTodaysBirthday,
  getDeliveryEmployees,
  getAllEmployees,
  getUpcomingEmployeeBirthday,
  getEmployeeById,
  getOnlineEmployeesByRole,
} from "../controllers/employeeController.js";

const router = express.Router();

const employeeManagementAccess = accessMiddleware("Employee-Management");
const foodAndDrinksAccess = accessMiddleware("Food-And-Drinks");

router.post("/assign-task", assignTask);
router.get("/tasks", getAllTasks);
router.get("/tasks-assigned-to-employee/:id", getALLEmployeesAssignedTo);
router.get("/all-employees", AllEmployees);
router.delete("/delete-single-task/:id", deleteSingleTask);
router.patch("/update-task/:id", updateSingleTask);

router.post("/add-employee", employeeManagementAccess, addEmployee);
router.get("/get-employee/:id", employeeManagementAccess, getEmployeeById);
router.get("/get-all-employee", employeeManagementAccess, getAllEmployees);
router.get(
  "/get-online-employees/:type",
  foodAndDrinksAccess,
  getOnlineEmployeesByRole
);
router.get("/get-delivery-employees", accessMiddleware(), getDeliveryEmployees);
router.put("/update-employee/:id", employeeManagementAccess, updateEmployee);
router.delete("/delete-employee/:id", employeeManagementAccess, deleteEmployee);

router.get("/get-todays-employee-birthday", getTodaysBirthday);
router.get("/get-upcoming-employee-birthday", getUpcomingEmployeeBirthday);

export default router;
