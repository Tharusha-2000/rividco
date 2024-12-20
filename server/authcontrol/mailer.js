var nodemailer = require('nodemailer');
const otpGenerator = require("otp-generator");


exports.sendWelcomeEmail = (req, res) => {
  
  try {
    const { name, email, mobile, service, note} = res.locals.userData;

    var transporter = nodemailer.createTransport({

        service: 'gmail',
        auth: {
          user: process.env.Email,
          pass: process.env.Password
        }
      });
      
      var mailOptions = {
        from: email,
        to: process.env.Email,
        subject: 'Get A Free Quote',
        html:  `
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px; font-family: Arial, sans-serif;">
        <h2 style="color: #333;">Free Quote Request</h2>
        <p style="color: #555;">You have received a new request for a free quote. Here are the details:</p>
        <ul style="list-style-type: none; padding: 0;">
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Mobile:</strong> ${mobile}</li>
          <li><strong>Service:</strong> ${service}</li>
          <li><strong>Note:</strong> ${note}</li>
        </ul>
        <p style="color: #555;">Please contact the requester as soon as possible to provide the quote.</p>
      </div>
    `




      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
            res.status(500).json({ msg: "server error"});
        } else {
          console.log('Email sent: ' + info.response);

         res.status(201).json({ msg: "User registered successfully",success: true});
        }
      });
      

    }catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
 
};


exports.sendContactEmail = (req, res) => {
  
    const { name, email,subject, message} = res.locals.ContactData;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.Email, 
        pass: process.env.Password, // App-specific password (from .env)
      },
    });
    
    
    
    const mailOptions = {
      from: process.env.Email, // Sender email
      to: process.env.Email, // Receiver email (same email as sender in this case)
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px; font-family: Arial, sans-serif;">
          <h2 style="color: #333;">Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </div>
      `,
    };
  
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
          res.status(500).json({ msg: "server error"});
      } else {
        console.log('Email sent: ' + info.response);

       res.status(201).json({ msg: "User registered successfully",success: true});
      }
    });
    console.log("Contact email sent successfully!");

  };




