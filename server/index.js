
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const bodyParser = require('body-parser');
const connectDB = require('./utils/db.js');
const userRoute = require("./routes/usersRoute.js");


const body=require('body-parser');
const app = express();

// Connect to Database
connectDB();


// Middleware
const allowedOrigins = ["https://rividco-admin-frontend.vercel.app", "https://rividco.netlify.app"];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('Public'));
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Express Server");
});
app.use("/api", userRoute);
app.use(express.static('Public'));
app.use(body.json());
// Server Initialization
const PORT =  8000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app; // Export the app object


