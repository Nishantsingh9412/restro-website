import Task from '../models/taskSchema.js'
import Auth from '../models/auth.js'
import mongoose from 'mongoose';

// Assigning a task to an employee
export const assignTask = async (req, res) => {
    const {
        title,
        description,
        assignedTo,
        created_by,
        startDate,
        endDate
    } = req.body;
    try {
        if(!created_by)
            return res.status(400).json({ success: false, message: 'session expired' })

        if (!title || !startDate || !endDate || !assignedTo) {
            return res.status(400).json({ success: true, message: 'Please fill all the fields' })
        } else {
            const newTask = await Task
                .create({
                    title,
                    description,
                    assignedTo,
                    startDate,
                    endDate,
                    created_by
                });
            if (newTask) {
                return res.status(201).json({
                    success: true,
                    message: 'Task assigned successfully',
                    result: newTask
                })
            } else {
                return res.status(500).json({
                    success: false,
                    message: 'Task could not be assigned'
                })
            }

        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error:err
        })
    }
}

// Getting all tasks 
export const getAllTasks = async (req, res) => {
    try {
        const Alltasks = await Task.find();
        if (Alltasks) {
            return res.status(200).json({
                success: true,
                message: 'Tasks fetched successfully',
                result: Alltasks
            })
        } else {
            return res.status(400).json({
                success: false,
                message: 'No tasks found'
            })
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}


// getting all tasks assigned to a particular employee
export const getALLEmployeesAssignedTo = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).json({ success: false, message: 'Invalid task id' })

    try {
        const tasksAssigned = await Task.find({ assignedTo: _id });
        if (tasksAssigned) {
            return res.status(200).json({
                success: true,
                message: 'Tasks fetched successfully',
                result: tasksAssigned
            })
        } else {
            return res.status(400).json({
                success: false,
                message: 'No tasks found'
            })
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}
// All users where role='Employee'
export const AllEmployees = async (req, res) => {
    try {
        const AllEmployees = await Auth.find({ role: 'employee' });
        if (AllEmployees) {
            return res.status(200).json({
                success: true,
                message: 'Employees fetched successfully',
                result: AllEmployees
            })
        } else {
            return res.status(400).json({
                success: false,
                message: 'No employees found'
            })
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}
// Deleting a single task
export const deleteSingleTask = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id))
        return res.status(400).json({ success: false, message: 'Invalid task id' })
    try {
        const deletedTask = await Task.findByIdAndDelete(_id);
        if (deletedTask) {
            return res.status(200).json({
                success: true,
                message: 'Task deleted successfully',
                result: deletedTask
            })
        } else {
            return res.status(400).json({
                success: false,
                message: 'Task could not be deleted'
            })
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

// Updating a single task

export const updateSingleTask = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id))
        return res.status(400).json({ success: false, message: 'Invalid task id' })

    const {
        title,
        description,
        assignedTo,
        startDate,
        endDate
    } = req.body;
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            _id,
            {
                title,
                description,
                assignedTo,
                startDate,
                endDate
            },
            { new: true }
        );
        if (updatedTask) {
            return res.status(200).json({
                success: true,
                message: 'Task updated successfully',
                result: updatedTask
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Task could not be updated'
            });
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};