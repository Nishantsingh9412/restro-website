import Task from "../models/taskSchema.js";
// import Auth from "../models/auth.js";
import mongoose from "mongoose";
import Joi from "joi";

// Validation schema for task
const taskSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().optional().allow(""),
    assignedTo: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    created_by: Joi.string().required(),
});

// Assigning a task to an employee
export const assignTask = async (req, res) => {
    // Validate request body against schema
    const { error } = taskSchema.validate(req.body);
    if (error)
        return res
            .status(400)
            .json({ success: false, message: error.details[0].message });

    const { title, description, assignedTo, created_by, startDate, endDate } =
        req.body;

    try {
        // Create new task
        const newTask = await Task.create({
            title,
            description,
            assignedTo,
            startDate,
            endDate,
            created_by,
        });
        return res
            .status(201)
            .json({
                success: true,
                message: "Task assigned successfully",
                result: newTask,
            });
    } catch (err) {
        // Handle internal server error
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal server error",
                error: err.message,
            });
    }
};

// Getting all tasks
export const getAllTasks = async (req, res) => {
    try {
        // Fetch all tasks from database
        const allTasks = await Task.find();
        return res
            .status(200)
            .json({
                success: true,
                message: "Tasks fetched successfully",
                result: allTasks,
            });
    } catch (err) {
        // Handle internal server error
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal server error",
                error: err.message,
            });
    }
};

// Getting all tasks assigned to a particular employee
export const getALLEmployeesAssignedTo = async (req, res) => {
    const { id: _id } = req.params;
    // Validate task ID
    if (!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).json({ success: false, message: "Invalid task id" });

    try {
        // Fetch tasks assigned to the employee
        const tasksAssigned = await Task.find({ assignedTo: _id });
        return res
            .status(200)
            .json({
                success: true,
                message: "Tasks fetched successfully",
                result: tasksAssigned,
            });
    } catch (err) {
        // Handle internal server error
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal server error",
                error: err.message,
            });
    }
};

// All users where role='Employee'
export const AllEmployees = async (req, res) => {
    try {
        // Fetch all employees from database
        const allEmployees = await Auth.find({ role: "employee" });
        return res
            .status(200)
            .json({
                success: true,
                message: "Employees fetched successfully",
                result: allEmployees,
            });
    } catch (err) {
        // Handle internal server error
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal server error",
                error: err.message,
            });
    }
};

// Deleting a single task
export const deleteSingleTask = async (req, res) => {
    const { id: _id } = req.params;
    // Validate task ID
    if (!mongoose.Types.ObjectId.isValid(_id))
        return res.status(400).json({ success: false, message: "Invalid task id" });

    try {
        // Delete task by ID
        const deletedTask = await Task.findByIdAndDelete(_id);
        if (!deletedTask)
            return res
                .status(400)
                .json({ success: false, message: "Task could not be deleted" });

        return res
            .status(200)
            .json({
                success: true,
                message: "Task deleted successfully",
                result: deletedTask,
            });
    } catch (err) {
        // Handle internal server error
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal server error",
                error: err.message,
            });
    }
};

// Updating a single task
export const updateSingleTask = async (req, res) => {
    const { id: _id } = req.params;
    // Validate task ID
    if (!mongoose.Types.ObjectId.isValid(_id))
        return res.status(400).json({ success: false, message: "Invalid task id" });

    // Validate request body against schema
    const { error } = taskSchema.validate(req.body);
    if (error)
        return res
            .status(400)
            .json({ success: false, message: error.details[0].message });

    const { title, description, assignedTo, startDate, endDate } = req.body;

    try {
        // Update task by ID
        const updatedTask = await Task.findByIdAndUpdate(
            _id,
            { title, description, assignedTo, startDate, endDate },
            { new: true }
        );
        if (!updatedTask)
            return res
                .status(400)
                .json({ success: false, message: "Task could not be updated" });

        return res
            .status(200)
            .json({
                success: true,
                message: "Task updated successfully",
                result: updatedTask,
            });
    } catch (err) {
        // Handle internal server error
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal server error",
                error: err.message,
            });
    }
};
