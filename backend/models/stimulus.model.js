module.exports = (sequelize, DataTypes) => {
    const Stimulus = sequelize.define("Stimulus", {
      id: { type: DataTypes.STRING, primaryKey: true, allowNull: false, defaultValue: () => require("../utils/snowflake").generate() },
      questionId: { type: DataTypes.STRING, allowNull: false },
      type: { type: DataTypes.ENUM("text", "image", "audio", "video"), allowNull: false },
      url: { type: DataTypes.STRING, allowNull: true }
    });
  
    Stimulus.associate = (models) => {
      Stimulus.belongsTo(models.Question, { foreignKey: "questionId", as: "question" });
    };
  
    return Stimulus;
  };
  