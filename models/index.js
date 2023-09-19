const Cliente = require("./Cliente");
const Deuda = require("./Deuda");
const Pago = require("./Pago");

// Definir relaciones
Cliente.hasMany(Deuda, { foreignKey: "clienteCi", sourceKey: "ci" });
Deuda.belongsTo(Cliente, { foreignKey: "clienteCi", targetKey: "ci" });

Pago.hasMany(Deuda, { foreignKey: "pagoId", targetKey: "idPago" });
Deuda.belongsTo(Pago, { foreignKey: "pagoId", sourceKey: "idPago" });

module.exports = {
  Cliente,
  Deuda,
  Pago,
};
