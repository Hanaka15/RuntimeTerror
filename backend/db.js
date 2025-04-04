require("dotenv").config();
const { Sequelize } = require("sequelize");

// Connect to PostgreSQL
const sequelize = new Sequelize(process.env.PG_URI, {
  dialect: "postgres",
  logging: false,
});

// Test Connection
sequelize
  .authenticate()
  .then(() => console.log("PostgreSQL Connected"))
  .catch((err) => console.log("Error connecting to PostgreSQL:", err));
  
module.exports = sequelize;
