require("dotenv").config();
const cors = require('cors');
const express = require("express");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const { sequelize } = require("./models")

const app = express();

sequelize.sync({ alter: true })
  .then(() => {
    console.log('sync successfull');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

// Middleware

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Routes
app.use("/auth", require("./routes/auth.routes"));
app.use("/workspaces", require("./routes/workspace.routes"));
app.use("/", require("./routes/study.routes"));
app.use("/", require("./routes/question.routes"));

app.listen(3000, () => console.log("Server running on port 3000"));
