module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define(
    "Token",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        defaultValue: () => require("../utils/snowflake").generate(),
      },
      researcherId: {
        type: DataTypes.STRING, // Matches `Researcher.id`
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expire: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  // Set default expiration (30 days)
  Token.beforeCreate((token) => {
    token.expire = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  });
  
  Token.associate = (models) => {
    Token.belongsTo(models.Researcher, { foreignKey: "researcherId", onDelete: "CASCADE", as: "researcher" });
  };

  return Token;
};
