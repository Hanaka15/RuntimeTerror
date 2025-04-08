const bcrypt = require("bcryptjs");
const { generate } = require("../utils/snowflake");

module.exports = (sequelize, DataTypes) => {
  const Researcher = sequelize.define("Researcher", {
    id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
  });

  Researcher.associate = (models) => {
    Researcher.hasMany(models.Workspace, { foreignKey: "ownerId", as: "ownedWorkspaces" });
    Researcher.belongsToMany(models.Workspace, {
      through: models.WorkspaceResearcher,
      as: "sharedWorkspaces",
      foreignKey: "researcherId"
    });
  };

  Researcher.beforeCreate(async (researcher) => {
    if (!researcher.id) {
      researcher.id = generate();
    }
    researcher.passwordHash = await bcrypt.hash(researcher.passwordHash, 10);
  });

  return Researcher;
};