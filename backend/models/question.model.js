module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define("Question", {
      id: { type: DataTypes.STRING, primaryKey: true, allowNull: false, defaultValue: () => require("../utils/snowflake").generate() },
      studyId: { type: DataTypes.STRING, allowNull: false },
      questionText: { type: DataTypes.STRING, allowNull: true },
      artifacts: { type: DataTypes.JSON, allowNull: true },
      correctArtifactIndex: { type: DataTypes.INTEGER, allowNull: false },
      artifactType: { type: DataTypes.ENUM("text", "image", "audio"), allowNull: false }
    });
  
    Question.associate = (models) => {
      Question.belongsTo(models.Study, { foreignKey: "quizId", onDelete: "CASCADE", as: "quiz" });
      Question.hasMany(models.Stimulus, { foreignKey: "questionId", as: "stimuli" });
      Question.hasMany(models.Answer, { foreignKey: "questionId", as: "answers" });
    };
  
    return Question;
  };
  