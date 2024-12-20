const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String, // Base64 encoded image
      required: true,
    },
  ],
});

const Projects = mongoose.model("Projects", projectSchema);

module.exports = Projects;