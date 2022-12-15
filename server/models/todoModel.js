const mongoose = require("mongoose");

const todoSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      unique: true,
      maxLength: [100, "Title should not exceeds more than 20 characters"],
    },
    tasks: [],
  },
  { timestamps: true }
);

module.exports = mongoose.model("TodoSchema", todoSchema);
