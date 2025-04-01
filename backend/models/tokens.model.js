const { DataTypes } = require("sequelize");
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
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "id",
      },
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expire: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: () => new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
  },
  {
    timestamps: false,
  }
);

Token.prototype.invalidateToken = async function () {
  await this.destroy();
};

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
