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

const router = express.Router();

router.post("/add-employee-leave", addEmployeeAbsence);

router.post("/delete-employee-leave", deleteEmployeeAbsence);

router.post("/edit-employee-leave", editEmployeeAbsence);

router.get("/get-employee-leave/:employeeId", getEmployeeAbsence);

router.get("/get-todays-leave/:userId", getTodaysLeaveByUserId);

router.get(
  "/getEmployeesWithAbsencesByUser/:userId",
  getEmployeesWithAbsencesByUser
);

// router.get('/current-month/:employeeId',getCurrentMonthShifts)

export default router;