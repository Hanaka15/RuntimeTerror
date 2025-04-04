module.exports = (sequelize, DataTypes) => {
    const WorkspaceResearcher = sequelize.define("WorkspaceResearcher", {
      researcherId: { type: DataTypes.STRING, allowNull: false },
      workspaceId: { type: DataTypes.STRING, allowNull: false },
      permission: { type: DataTypes.ENUM("read", "write", "admin"), allowNull: false }
    });
  
    return WorkspaceResearcher;
  };
  