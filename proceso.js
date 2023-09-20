const { Cliente, Deuda } = require("./models");
const sequelize = require("./database");

// Definir una función para llamar al procedimiento almacenado
async function InsertarClientes(n) {
  try {
    // Ejecutar el procedimiento almacenado
    const resultado = await sequelize.query("CALL insertar_clientes(:nro)", {
      replacements: { nro: n },
    });
    // El resultado del procedimiento estará en resultado[0]
    console.log("Resultado del procedimiento:", resultado[0]);
  } catch (error) {
    console.error("Error al llamar al procedimiento almacenado:", error);
  }
}

async function InsertarDeudas(n) {
  try {
    // Ejecutar el procedimiento almacenado
    const resultado = await sequelize.query("CALL insertar_deuda(:nro)", {
      replacements: { nro: n },
    });
    // El resultado del procedimiento estará en resultado[0]
    console.log("Resultado del procedimiento:", resultado[0]);
  } catch (error) {
    console.error("Error al llamar al procedimiento almacenado:", error);
  }
}
