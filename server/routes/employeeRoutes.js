import express from 'express';

import {
    assignTask,
    getAllTasks,
    getALLEmployeesAssignedTo,
    AllEmployees,
    deleteSingleTask,
    updateSingleTask
} from '../controllers/employee.js';




const router = express.Router();

router.post('/assign-task', assignTask);
router.get('/tasks', getAllTasks);
router.get('/tasks-assigned-to-employee/:id', getALLEmployeesAssignedTo);
router.get('/all-employees', AllEmployees)
router.delete('/delete-single-task/:id', deleteSingleTask)
router.patch('/update-task/:id', updateSingleTask)



export default router;