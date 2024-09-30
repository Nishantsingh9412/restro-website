import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    address: {
        street: String,
        city: String,
        zipCode: String
    },
    birthday: Date,
    nationality: String,
    maritalStatus: String,
    children: Number,
    healthInsurance: String,
    socialSecurityNumber: String,
    taxID: String,
    status: { type: String, required: true, enum: ['Active', 'Inactive'] },
    dateOfJoining: Date,
    endOfEmployment: Date,
    employeeID: { type: String, required: true },
    position: String,
    type: { type: String, required: true, enum: ['Full-time', 'Part-time', 'Intern', 'Contractor'] },
    workingHoursPerWeek: Number,
    variableWorkingHours: Boolean,
    annualHolidayEntitlement: Number,
    notes: String,
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auth',
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Employee', EmployeeSchema);
