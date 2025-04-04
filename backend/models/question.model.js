const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const snowflake = require("../utils/snowflake");
const Quiz = require("./quiz.model"); //Import the Quiz model

const Question = sequelize.define(
    "Question",
    {
        id:{
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            defaultValue: () => snowflake.generate(), //Generate snowflake ID for the question ID
        },
        questionId:{
            type: DataTypes.STRING,
            allowNull: false,
            references:{
                model: "Quiz", //Reference to the Quiz table
                key: "id",
            }
        },
        questionText:{
            type: DataTypes.STRING, 
            allowNull: true, //optional field for question text
        },
        artifacts: {
            type: DataTypes.JSON, //store multiple artifacts (text context or paths for images and audio)
            allowNull: true,
        },
        correctArtifactIndex:{
            type: DataTypes.INTEGER, //Index of the correct artifact in the quiz
            allowNull: false,
        },
        artifactType: {
            type: DataTypes.ENUM("text", "image", "audio"), //Type of artifact (text, image , or artifact)
            allowNull: false,
        }
    }
);

Quiz.hasMany(Question, {foreignkey:"questionId", ondelete:"CASCADE"}); //One to many relationship with Question table
Question.belongsTo(Quiz, {foreignkey:"questionId"});
module.exports = Question;