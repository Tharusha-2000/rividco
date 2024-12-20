const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = mongoose.Schema(
  {
    
    fname:{
      type: String,
      required: false,
    },

    lname:{
      type: String,
      required: false,
    },

    dob:{
      type: String,
      required: false,
    },

     role:{
      type: String,
      required: false,
    },

     email: {
      type: String,
      required: false,
    },
  
   },
  );

   
const Project = mongoose.model("project", userSchema);

module.exports = Project;