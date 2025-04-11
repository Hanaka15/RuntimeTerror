const bcrypt = require("bcryptjs");
const { generate } = require("../utils/snowflake");

module.exports = (sequelize, DataTypes) => {
  const Researcher = sequelize.define("Researcher", {
    id: { type: DataTypes.STRING, primaryKey: true, allowNull: false, defaultValue: () => generate() },
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    avatar: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
  });

  Researcher.associate = (models) => {
    Researcher.hasMany(models.Workspace, { foreignKey: "ownerId", as: "ownedWorkspaces" });
    Researcher.belongsToMany(models.Workspace, {
      through: models.WorkspaceResearcher,
      as: "sharedWorkspaces",
      foreignKey: "researcherId"
    });
  };

  return Researcher;
};