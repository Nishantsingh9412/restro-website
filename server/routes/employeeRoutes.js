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
} from "../controllers/employeeController.js";

const router = express.Router();

router.post("/assign-task", assignTask);
router.get("/tasks", getAllTasks);
router.get("/tasks-assigned-to-employee/:id", getALLEmployeesAssignedTo);
router.get("/all-employees", AllEmployees);
router.delete("/delete-single-task/:id", deleteSingleTask);
router.patch("/update-task/:id", updateSingleTask);

router.post(
  "/add-employee",
  accessMiddleware("Employee-Management"),
  addEmployee
);

router.get(
  "/get-employee/:id",
  accessMiddleware("Employee-Management"),
  getEmployeeById
);

router.get(
  "/get-all-employee",
  accessMiddleware("Employee-Management"),
  getAllEmployees
);

router.get("/get-delivery-employees", accessMiddleware(), getDeliveryEmployees);

router.put(
  "/update-employee/:id",
  accessMiddleware("Employee-Management"),
  updateEmployee
);

router.delete(
  "/delete-employee/:id",
  accessMiddleware("Employee-Management"),
  deleteEmployee
);

router.get("/get-todays-employee-birthday", getTodaysBirthday);

router.get("/get-upcoming-employee-birthday", getUpcomingEmployeeBirthday);

export default router;
