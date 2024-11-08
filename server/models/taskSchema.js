import mongoose from 'mongoose'; // Import mongoose library

const { Schema, model } = mongoose; // Destructure Schema and model from mongoose

// Define the task schema
const taskSchema = new Schema({
    title: {
        type: String, // Title is a string
        required: true, // Title is required
        trim: true // Trim whitespace from the title
    },
    description: {
        type: String, // Description is a string
        trim: true // Trim whitespace from the description
    },
    assignedTo: {
        type: Schema.Types.ObjectId, // Reference to a User object
        ref: 'User', // Referencing the User model
        required: true // assignedTo is required
    },
    startDate: {
        type: Date, // Start date is a date
        required: true, // Start date is required
        default: Date.now // Default value is the current date
    },
    endDate: {
        type: Date, // End date is a date
        required: true // End date is required
    },
    created_by: {
        type: Schema.Types.ObjectId, // Reference to an Auth object
        ref: 'Admin', // Referencing the Auth model
        required: true // createdBy is required
    }
}, { timestamps: true }); // Automatically add createdAt and updatedAt timestamps

// Export the Task model based on the taskSchema
export default model('Task', taskSchema);
