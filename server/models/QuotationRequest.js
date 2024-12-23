const mongoose = require("mongoose");

const QuoteRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    note: {
      type: String,
    },
    flagged: {
      type: Boolean,
      default: false, // Default is not flagged
    },
    status: {
      type: String,
      enum: ["pending", "ongoing", "completed"],
      default: "pending", // Default status
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuoteRequest", QuoteRequestSchema);
