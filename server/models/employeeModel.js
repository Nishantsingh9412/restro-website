// import { Schema, model } from "mongoose";

// // Define the schema for the Employee model
// const employeeSchema = new Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     phone: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     address: {
//       street: {
//         type: String,
//         trim: true,
//       },
//       city: {
//         type: String,
//         trim: true,
//       },
//       zipCode: {
//         type: String,
//         trim: true,
//       },
//     },
//     birthday: {
//       type: Date,
//     },
//     nationality: {
//       type: String,
//       trim: true,
//     },
//     maritalStatus: {
//       type: String,
//       enum: ["Single", "Married", "Divorced", "Widowed"],
//       default: "Single",
//     },
//     children: {
//       type: Number,
//       default: 0,
//     },
//     healthInsurance: {
//       type: String,
//       trim: true,
//     },
//     socialSecurityNumber: {
//       type: String,
//       unique: true,
//       trim: true,
//     },
//     taxID: {
//       type: String,
//       unique: true,
//       trim: true,
//     },
//     dateOfJoining: {
//       type: Date,
//       required: true,
//     },
//     endOfEmployment: {
//       type: Date,
//     },
//     position: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     role: {
//       type: String,
//       enum: [
//         "Delivery Boy",
//         "Chef",
//         "Bar Tender",
//         "Manager",
//         "Kitchen Staff",
//         "Waiter",
//         "Custom",
//       ],
//       default: "Delivery Boy",
//     },
//     type: {
//       type: String,
//       enum: ["Full-Time", "Part-Time", "Intern", "Contract"],
//       default: "Full-Time",
//     },
//     workingHoursPerWeek: {
//       type: Number,
//       default: 40,
//     },
//     variableWorkingHours: {
//       type: Boolean,
//       default: false,
//     },
//     annualHolidayEntitlement: {
//       type: Number,
//       default: 20,
//     },
//     notes: {
//       type: String,
//       trim: true,
//     },
//     created_by: {
//       type: Schema.Types.ObjectId,
//       ref: "Admin",
//       required: true,
//     },
//   },
//   { timestamps: true } // Automatically manage createdAt and updatedAt fields
// );

// // Export the Employee model
// export default model("Employees", employeeSchema);
