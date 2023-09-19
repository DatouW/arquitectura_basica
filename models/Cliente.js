const { DataTypes } = require("sequelize");
const sequelize = require("../database/index");

const Cliente = sequelize.define(
  "cliente",
  {
    ci: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // tableName: "cliente",
    timestamps: false,
  }
);

module.exports = Cliente;
