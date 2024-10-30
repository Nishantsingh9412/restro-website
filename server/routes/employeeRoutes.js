import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  assignTask,
  getAllTasks,
  getALLEmployeesAssignedTo,
  AllEmployees,
  deleteSingleTask,
  updateSingleTask,
} from "../controllers/employee.js";

import {
  addEmployee,
  getEmployeesByRestaurant,
  updateEmployee,
  deleteEmployee,
  getTodaysBirthday,
  getUpcomingEmployeeBirthday,
  getDeliveryEmployees,
} from "../controllers/employeeController.js";

const router = express.Router();

router.post("/assign-task", assignTask);
router.get("/tasks", getAllTasks);
router.get("/tasks-assigned-to-employee/:id", getALLEmployeesAssignedTo);
router.get("/all-employees", AllEmployees);
router.delete("/delete-single-task/:id", deleteSingleTask);
router.patch("/update-task/:id", updateSingleTask);

router.post("/add-employee", addEmployee);

router.get("/get-all-employee", authMiddleware, getEmployeesByRestaurant);

router.get("/get-delivery-employees", authMiddleware, getDeliveryEmployees);

router.put("/update-employee/:employeeId", updateEmployee);

router.delete("/delete-employee/:employeeId", deleteEmployee);

router.get("/get-todays-employee-birthday", getTodaysBirthday);

router.get("/get-upcoming-employee-birthday", getUpcomingEmployeeBirthday);

export default router;
