const express = require("express");
const router = express.Router();

const controller = require('../authcontrol/controller')
const mailer = require('../authcontrol/mailer');
const Service = require('../models/Service'); // Import the Service model
const Projects = require('../models/Projects'); // Import the Projects model
const Employees = require('../models/Employees'); // Import the Employees model
const Testimonial = require('../models/Testimonial'); // Import the Testimonial model
const Contact = require('../models/Contact');
const QuotationRequest = require("../models/QuotationRequest.js");


const bcrypt = require("bcryptjs");
const Users = require("../models/Users");

const  subscribeToNewsletter  = require("../utils/mailchimp");



// POST /api/subscribe
// router.post("/newsletter/subscribe", async (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).json({ message: "Email is required" });
//   }

//   try {
//     const result = await subscribeToNewsletter(email);
//     if (result.success) {
//       res.status(200).json({ message: "Subscription successful!", data: result.data });
//     } else {
//       res.status(400).json({ message: result.message });
//     }
//   } catch (error) {
//     console.error("Subscription Error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });


router.post("/newsletter/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    // Add your logic here to save the email to the database or newsletter system
    console.log("Subscribed email:", email);

    // Send the welcome email
    const emailSent = await mailer.sendSubscriberWelcomeEmail(email);
    if (!emailSent) {
      return res.status(500).json({ success: false, message: "Failed to send welcome email" });
    }

    res.status(200).json({ success: true, message: "Subscription successful, welcome email sent!" });
  } catch (error) {
    console.error("Error during subscription:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
/*..........................................registration.................................................... */


router.post("/quote",controller.GetAFreeQuoteSection,mailer.sendWelcomeEmail);

// Flag a specific quotation request

router.get("/quote", async (req, res) => {
  try {
    const quotes = await QuotationRequest.find({ flagged: false }).sort({ createdAt: -1 });
    res.status(200).json(quotes);
  } catch (error) {
    console.error("Error fetching quotes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/quote/flagged", async (req, res) => {
  try {
    const flaggedQuotes = await QuotationRequest.find({ flagged: true }).sort({ createdAt: -1 });
    res.status(200).json(flaggedQuotes);
  } catch (error) {
    console.error("Error fetching flagged quotes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/quote/:id/flag", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedQuote = await QuotationRequest.findByIdAndUpdate(
      id,
      { flagged: true }, // Mark as flagged
      { new: true } // Return the updated document
    );

    if (!updatedQuote) {
      return res.status(404).json({ error: "Quote request not found" });
    }

    res.status(200).json({ message: "Quote request flagged successfully", data: updatedQuote });
  } catch (error) {
    console.error("Error flagging quote request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.put("/quote/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["pending", "ongoing", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updatedQuote = await QuotationRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedQuote) {
      return res.status(404).json({ error: "Quote request not found" });
    }

    res.status(200).json({ message: "Status updated successfully", data: updatedQuote });
  } catch (error) {
    console.error("Error updating quote status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});





/*..........................................contact requests.................................................... */

router.post("/contact/send",controller.handleContactFormSubmission,mailer.sendContactEmail);

// Route to get all unflagged contact requests
router.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find({ flagged: false }); // Exclude flagged contacts
    res.status(200).json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to flag a contact request as deleted
router.delete('/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const flaggedContact = await Contact.findByIdAndUpdate(
      id,
      { flagged: true }, // Flag the contact instead of deleting
      { new: true }
    );

    if (!flaggedContact) {
      return res.status(404).json({ error: 'Contact request not found' });
    }

    res.status(200).json({ msg: 'Contact request flagged successfully', success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Route to update the status of a contact request
router.put('/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'ongoing', 'complete'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ error: 'Contact request not found' });
    }

    res.status(200).json({ msg: 'Contact request updated successfully', success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




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

/*..........................................testimonials .................................................... */

// Create Testimonial
router.post('/testimonials', async (req, res) => {
  try {
    const { name, profession, text, image } = req.body;
    const newTestimonial = new Testimonial({ name, profession, text, image });
    await newTestimonial.save();
    res.status(201).json({ msg: 'Testimonial created successfully', success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get All Testimonials
router.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.status(200).json(testimonials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update Testimonial
router.put('/testimonials/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, profession, text, image } = req.body;
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      id,
      { name, profession, text, image },
      { new: true }
    );
    if (!updatedTestimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    res.status(200).json({ msg: 'Testimonial updated successfully', success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete Testimonial
router.delete('/testimonials/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTestimonial = await Testimonial.findByIdAndDelete(id);
    if (!deletedTestimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    res.status(200).json({ msg: 'Testimonial deleted successfully', success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





/*..........................................login .................................................... */

//register
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Users({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});










  
module.exports = router;




