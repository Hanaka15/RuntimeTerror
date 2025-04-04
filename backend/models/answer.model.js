module.exports = (sequelize, DataTypes) => {
    const Answer = sequelize.define("Answer", {
      id: { type: DataTypes.STRING, primaryKey: true, allowNull: false, defaultValue: () => require("../utils/snowflake").generate() },
      questionId: { type: DataTypes.STRING, allowNull: false },
      participantId: { type: DataTypes.STRING, allowNull: false },
      response: { type: DataTypes.TEXT, allowNull: true }
    });
  
    Answer.associate = (models) => {
      Answer.belongsTo(models.Question, { foreignKey: "questionId", as: "question" });
      Answer.belongsTo(models.Participant, { foreignKey: "participantId", as: "participant" });
    };
  
    return Answer;
  };
  