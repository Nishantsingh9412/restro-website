import express from "express";
import {
  addEmployeeAbsence,
  getEmployeeAbsence,
  getTodaysLeaveByUserId,
  getEmployeesWithAbsencesByUser,
  editEmployeeAbsence,
  deleteEmployeeAbsence,
  // getCurrentMonthShifts
} from "../controllers/absenceController.js";
import { adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add-employee-leave", addEmployeeAbsence);

router.post("/delete-employee-leave", deleteEmployeeAbsence);

router.post("/edit-employee-leave", editEmployeeAbsence);

router.get("/get-employee-leave/:employeeId", getEmployeeAbsence);

router.get("/get-todays-leave/:userId", getTodaysLeaveByUserId);

router.get(
  "/get-all-employee-leave",
  adminMiddleware,
  getEmployeesWithAbsencesByUser
);

// router.get('/current-month/:employeeId',getCurrentMonthShifts)

export default router;
