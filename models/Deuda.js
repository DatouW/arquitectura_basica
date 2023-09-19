const { DataTypes } = require("sequelize");
const sequelize = require("../database/index");

const Deuda = sequelize.define(
  "deuda",
  {
    idDeuda: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isNumeric: true,
        min: 0,
      },
    },
  },
  {
    // tableName: "deuda",
    timestamps: false,
  }
);

module.exports = Deuda;
