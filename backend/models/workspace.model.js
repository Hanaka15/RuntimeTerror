module.exports = (sequelize, DataTypes) => {
  const Workspace = sequelize.define("Workspace", {
    id: { type: DataTypes.STRING, primaryKey: true, allowNull: false, defaultValue: () => require("../utils/snowflake").generate() },
    name: { type: DataTypes.STRING, allowNull: false },
    ownerId: { type: DataTypes.STRING, allowNull: false }
  });

  Workspace.associate = (models) => {
    Workspace.belongsTo(models.Researcher, { foreignKey: "ownerId", as: "owner" });
    Workspace.hasMany(models.Study, { foreignKey: "workspaceId", as: "quizzes" });
    Workspace.belongsToMany(models.Researcher, {
      through: models.WorkspaceResearcher,
      as: "researchers",
      foreignKey: "workspaceId"
    });
  };

  return Workspace;
};
