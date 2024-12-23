import express from "express";
import { adminMiddleware } from "../middleware/authMiddleware.js";

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
  getEmployeesByRestaurant,
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

router.post("/add-employee", adminMiddleware, addEmployee);

router.get("/get-employee/:id", adminMiddleware, getEmployeeById);

router.get("/get-all-employee", adminMiddleware, getEmployeesByRestaurant);

router.get("/get-delivery-employees", adminMiddleware, getDeliveryEmployees);

router.put("/update-employee/:id", updateEmployee);

router.delete("/delete-employee/:id", deleteEmployee);

router.get("/get-todays-employee-birthday", getTodaysBirthday);

router.get("/get-upcoming-employee-birthday", getUpcomingEmployeeBirthday);

export default router;
