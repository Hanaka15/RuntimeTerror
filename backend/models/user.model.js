const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const bcrypt = require("bcryptjs");
const snowflake = require("../utils/snowflake");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: () => snowflake.generate(),
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "Username is required" },
        isAlphanumeric: { msg: "Username should only contain letters and numbers" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Password is required" },
      },
    },
  },
  {
    tableName: "Users", // ✅ Ensure table name matches in database
    timestamps: true,
  }
);

// Hash password before saving
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

User.beforeUpdate(async (user) => {
  if (user.changed("password")) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

module.exports = User;
