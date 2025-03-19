require("dotenv").config();
const express = require("express");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Routes
app.use("/auth", require("./routes/auth.routes"));
app.use("/workspace", require("./routes/workspace.routes"))

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

// Start Server
app.listen(3000, () => console.log("Server running on port 3000"));
