module.exports = (sequelize, DataTypes) => {
    const Study = sequelize.define("Study", {
      id: { type: DataTypes.STRING, primaryKey: true, allowNull: false, defaultValue: () => require("../utils/snowflake").generate() },
      workspaceId: { type: DataTypes.STRING, allowNull: false },
      studyname: { type: DataTypes.STRING, allowNull: false }
    });
  
    Study.associate = (models) => {
      Study.belongsTo(models.Workspace, { foreignKey: "workspaceId", as: "workspace" });
      Study.hasMany(models.Question, { foreignKey: "studyId", as: "questions", onDelete: "CASCADE" });
    };
  
    return Study;
  };
  