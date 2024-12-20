const express = require("express");
const router = express.Router();

const controller = require('../authcontrol/controller')
const mailer = require('../authcontrol/mailer');
const Service = require('../models/Service'); // Import the Service model
const Projects = require('../models/Projects'); // Import the Projects model
const Employees = require('../models/Employees'); // Import the Employees model


const  subscribeToNewsletter  = require("../utils/mailchimp");



// POST /api/subscribe
router.post("/newsletter/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const result = await subscribeToNewsletter(email);
    if (result.success) {
      res.status(200).json({ message: "Subscription successful!", data: result.data });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    console.error("Subscription Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
/*..........................................registration.................................................... */
router.post("/contact/send",controller.handleContactFormSubmission,mailer.sendContactEmail);

router.post("/quote",controller.GetAFreeQuoteSection,mailer.sendWelcomeEmail);

/*..........................................services .................................................... */

// Route to add a new service
router.post("/services", async (req, res) => {
  try {
    const { service, description, image, serviceCategory } = req.body;
    const newService = new Service({ service, description, image, serviceCategory });
    await newService.save();
    res.status(201).json({ msg: "Service added successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get all services
router.get("/services", async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to update a service
router.put("/services/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { service, description, image, serviceCategory } = req.body;
    const updatedService = await Service.findByIdAndUpdate(
      id,
      { service, description, image, serviceCategory },
      { new: true }
    );
    if (!updatedService) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.status(200).json({ msg: "Service updated successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to delete a service
router.delete("/services/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedService = await Service.findByIdAndDelete(id);
    if (!deletedService) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.status(200).json({ msg: "Service deleted successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

 /*..........................................projects .................................................... */

// Route to add a new project
router.post("/projects", async (req, res) => {
  try {
    const { title, description, category, images } = req.body;
    const newProject = new Projects({ title, description, category, images });
    await newProject.save();
    res.status(201).json({ msg: "Project added successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get all projects
router.get("/projects", async (req, res) => {
  try {
    const projects = await Projects.find();
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to update a project
router.put("/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, images } = req.body;
    const updatedProject = await Projects.findByIdAndUpdate(
      id,
      { title, description, category, images },
      { new: true }
    );
    if (!updatedProject) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json({ msg: "Project updated successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to delete a project
router.delete("/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProject = await Projects.findByIdAndDelete(id);
    if (!deletedProject) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json({ msg: "Project deleted successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
/*..........................................employees .................................................... */

// Route to add a new employee
router.post("/employees", async (req, res) => {
  try {
    const { name, jobTitle, description, image, socialMedia } = req.body;
    const newEmployee = new Employees({ name, jobTitle, description, image, socialMedia });
    await newEmployee.save();
    res.status(201).json({ msg: "Employee added successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get all employees
router.get("/employees", async (req, res) => {
  try {
    const employees = await Employees.find();
    res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to update an employee
router.put("/employees/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, jobTitle, description, image, socialMedia } = req.body;
    const updatedEmployee = await Employees.findByIdAndUpdate(
      id,
      { name, jobTitle, description, image, socialMedia },
      { new: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.status(200).json({ msg: "Employee updated successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to delete an employee
router.delete("/employees/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEmployee = await Employees.findByIdAndDelete(id);
    if (!deletedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.status(200).json({ msg: "Employee deleted successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
/*..........................................summary .................................................... */

// Route to get the total number of projects and services
router.get("/summary", async (req, res) => {
  try {
    const totalProjects = await Projects.countDocuments();
    const totalServices = await Service.countDocuments();
    res.status(200).json({ totalProjects, totalServices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});












  
module.exports = router;




