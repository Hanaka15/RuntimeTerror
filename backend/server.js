require("dotenv").config();
const express = require("express");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const Validator = require("./middleware/validation.middleware")
const sequelize = require("./db");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(Validator.Errors);

// Routes
app.use("/auth", require("./routes/auth.routes"));
app.use("/workspace", require("./routes/workspace.routes"));


// Sync Models
sequelize.sync( {force: false} )
  .then(() => console.log("Models synchronized with PostgreSQL"))
  .catch((err) => console.log("Error syncing models:", err));

// Start Server
app.listen(3000, () => console.log("Server running on port 3000"));
