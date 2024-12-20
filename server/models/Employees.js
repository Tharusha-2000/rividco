const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Base64 encoded image
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  socialMedia: [
    {
      platform: {
        type: String,
        required: true,
      },
      link: {
        type: String,
        required: true,
      },
    },
  ],
});

const Employees = mongoose.model("Employees", employeeSchema);

module.exports = Employees;