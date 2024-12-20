
const bcrypt = require("bcryptjs");
const Contact = require("../models/Contact.js");

//register user
exports.GetAFreeQuoteSection = async (req, res, next) => {
  try {
    const { name, email, mobile, service, note } = req.body;

    // Here, you would handle the data (e.g., save it to a database)
    console.log('Quote request received:', { name, email, mobile, service, note });
     res.locals.userData = { name, email, mobile, service, note };
     
    next();
  } catch (error) {
    console.error(error);
  }
};



// Handle contact form submission
exports.handleContactFormSubmission = async (req, res , next) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    // Save the contact details to the database
    const newContact = new Contact({
      name,
      email,
      subject,
      message,
    });
    await newContact.save();

    res.locals.ContactData = { name, email,subject, message };
    next();
    // Send email notification
    // await sendContactEmail(name, email, subject, message);

    res.status(200).json({ success: true, message: "Contact saved and email sent successfully!" });
  } catch (error) {
    console.error("Error handling contact submission:", error);
    res.status(500).json({ success: false, message: "An error occurred. Please try again later." });
  }
};



