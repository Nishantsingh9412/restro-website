import express from "express";
import {
  addShiftOfEmployee,
  getEmployeeShift,
  getTodaysShift,
  getCurrentMonthShifts,
  getShiftByIdAndDate,
  getEmployeesWithShiftsByUser,
  editEmployeeShift,
  deleteEmployeeShift,
} from "../controllers/shiftController.js";
import { accessMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add-employee-shift", addShiftOfEmployee);

router.post("/delete-employee-shift", deleteEmployeeShift);

router.post("/edit-employee-shift", editEmployeeShift);

router.get("/get-employee-shift/:employeeId", getEmployeeShift);

router.get("/get-todays-shift", getTodaysShift);

router.get("/current-month/:employeeId", getCurrentMonthShifts);

router.get("/get-shift-by-IdAndDate/:employeeId/:date", getShiftByIdAndDate);

router.get(
  "/get-shift-with-employee",
  accessMiddleware(),
  getEmployeesWithShiftsByUser
);
export default router;
