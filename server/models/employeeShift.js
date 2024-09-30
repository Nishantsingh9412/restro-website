import mongoose from "mongoose";

const ShiftSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
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
    note: { type: String, required: false },
  },
  { timestamps: true }
);

ShiftSchema.pre("save", function (next) {
  if (this.from >= this.to) {
    return next(new Error('The "from" time must be before the "to" time.'));
  }
  this.duration = (this.to - this.from) / (1000 * 60 * 60); // Calculate duration in hours
  next();
});

export default mongoose.model("Shift", ShiftSchema);
