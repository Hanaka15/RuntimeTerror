module.exports = (sequelize, DataTypes) => {
    const Participant = sequelize.define("Participant", {
      id: { type: DataTypes.STRING, primaryKey: true, allowNull: false, defaultValue: () => require("../utils/snowflake").generate() },
      age: { type: DataTypes.INTEGER, allowNull: true },
      gender: { type: DataTypes.ENUM("male", "female", "non-binary", "other", "prefer not to say"), allowNull: true },
      educationLevel: { type: DataTypes.STRING, allowNull: true }
    });
  
    Participant.associate = (models) => {
      Participant.hasMany(models.Answer, { foreignKey: "participantId", as: "answers" });
    };
  
    return Participant;
  };
