const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const path = require("path");
const app = express();
const errorMiddleware = require("./middlewares/error");

// Routes
const userRoutes = require("./routes/userRoutes");
const studentRoutes = require("./routes/studentRoutes");

// Middleware setup
const corsOptions = {
  origin: ["http://localhost:5173", "https://engageify.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "X-CSRF-Token",
    "X-HTTP-Method-Override",
  ],
};

app.use(cors(corsOptions)); // Enable CORS for your frontend URL
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet());

// Trust proxy setting (to fix the `X-Forwarded-For` issue)
app.set("trust proxy", true); // Add this line to trust the proxy

app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Import and use routes
app.use("/api/users", userRoutes);
app.use("/api/students", studentRoutes);

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;
