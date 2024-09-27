import mongoose from 'mongoose';

const EmployeeSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: false },
    address: {
        street: { type: String, required: false },
        city: { type: String, required: false },
        zipCode: { type: String, required: false }
    },
    birthday: { type: Date, required: false },
    nationality: { type: String, required: false },
    maritalStatus: { type: String, required: false },
    children: { type: Number, required: false },
    healthInsurance: { type: String, required: false },
    socialSecurityNumber: { type: String, required: false },
    taxID: { type: String, required: false },
    status: { type: String, required: true, enum: ['Active', 'Inactive'] },
    dateOfJoining: { type: Date, required: false },
    endOfEmployment: { type: Date, required: false },
    employeeID: { type: String, required: true },
    position: { type: String, required: false },
    type: { type: String, required: true, enum: ['Full-time', 'Part-time', 'Intern', 'Contractor'] },
    workingHoursPerWeek: { type: Number, required: false },
    variableWorkingHours: { type: Boolean, required: false },
    annualHolidayEntitlement: { type: Number, required: false },
    notes: { type: String, required: false },
   
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auth',
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Employee', EmployeeSchema);
