const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    unique: true,
    maxLength: [15, "Title should not exceeds more than 20 characters"],
  },
  tasks: [
    {
      type: String
    },
  ],
});

module.exports = mongoose.model("TodoSchema", todoSchema);
