const { DataTypes, Op } = require("sequelize");
const sequelize = require("../db");
const snowflake = require("../utils/snowflake");

const Token = sequelize.define(
  "Token",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: () => snowflake.generate(),
    },
    userId: {
      type: DataTypes.STRING,  // ✅ Matches `User.id`
      references: {
        model: "Users", // ✅ Ensure correct table name
        key: "id",
      },
      allowNull: false,
      onDelete: "CASCADE",
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

// Auto-set expiration date
Token.beforeCreate((token) => {
  token.expire = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
});

// Cleanup expired tokens
Token.cleanupExpiredTokens = async function () {
  await Token.destroy({
    where: {
      expire: {
        [Op.lt]: new Date(),
      },
    },
  });
};

module.exports = Token;
