import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // date: {
    //     type: Date,
    //     required: true
    // },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auth',
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);

