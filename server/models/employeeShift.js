import mongoose from "mongoose";

// Define the schema for a Shift
const ShiftSchema = new mongoose.Schema(
  {
    // Reference to the Employee model
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    // Date of the shift
    date: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value instanceof Date && !isNaN(value);
        },
        message: (props) => `${props.value} is not a valid date!`,
      },
    },
    // Start time of the shift
    from: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value instanceof Date && !isNaN(value);
        },
        message: (props) => `${props.value} is not a valid date!`,
      },
    },
    // End time of the shift
    to: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value instanceof Date && !isNaN(value);
        },
        message: (props) => `${props.value} is not a valid date!`,
      },
    },
    // Duration of the shift in hours
    duration: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          return value > 0;
        },
        message: (props) => `${props.value} should be a positive number!`,
      },
    },
    // Optional note for the shift
    note: { type: String, required: false },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Pre-save hook to validate and calculate the duration
ShiftSchema.pre("save", function (next) {
  // Ensure the "from" time is before the "to" time
  if (this.from >= this.to) {
    return next(new Error('The "from" time must be before the "to" time.'));
  }
  // Calculate the duration in hours
  this.duration = (this.to - this.from) / (1000 * 60 * 60);
  next();
});

// Export the Shift model
export default mongoose.model("Shift", ShiftSchema);
