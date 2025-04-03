const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const bcrypt = require("bcryptjs");
const snowflake = require("../utils/snowflake");

const Quiz = sequelize.define(
    "Quiz",
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            defaultValue: () => snowflake.generate(), //Generate snowflake ID for the  quiz ID
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        workspaceId: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: "Workspace", 
                key: "id",
            }
        }
    }
);

module.exports = Quiz;