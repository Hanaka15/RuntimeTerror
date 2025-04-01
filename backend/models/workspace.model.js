const { DataTypes } = require("sequelize");
const User = require("./User");
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
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    timestamps: true,
  }
);

User.hasMany(Workspace, { foreignKey: "ownerId" });
Workspace.belongsTo(User, { foreignKey: "ownerId" });

module.exports = Workspace;
