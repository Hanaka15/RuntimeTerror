require("dotenv").config();
const express = require("express");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const { syncDB } = require("./models");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

syncDB();

// Global error handler (for other errors)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Routes
app.use("/auth", require("./routes/auth.routes"));
app.use("/workspace", require("./routes/workspace.routes"));
app.use("/study", require("./routes/study.routes"));
app.use("/question", require("./routes/question.routes"));
app.use("/answer", require ("./routes/answer.routes"));


// Start Server
app.listen(3000, () => console.log("Server running on port 3000"));
