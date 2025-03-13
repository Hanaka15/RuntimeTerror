const express = require("express");
const mongoose = require("mongoose");
const passport = require("./strategies/local.strategy");
const sessionConfig = require("./config/session");
const authRoutes = require("./routes/auth.routes");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("✅ MongoDB Connected");
});

// Start server
app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
