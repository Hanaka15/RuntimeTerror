const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./user.model");
const snowflake = require("../utils/snowflake");

const Workspace = sequelize.define(
  "Workspace",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: () => snowflake.generate(),
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ownerId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    timestamps: true,
  }
);

// Define relationships
User.hasMany(Workspace, { foreignKey: "ownerId", onDelete: "CASCADE" });
Workspace.belongsTo(User, { foreignKey: "ownerId" });

module.exports = Workspace;
