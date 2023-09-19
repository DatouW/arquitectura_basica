const { Cliente, Deuda } = require("./models");

// Función para generar un número de CI aleatorio
function generarCINuevo() {
  // Generar un número de CI aleatorio de 7 dígitos
  const ciAleatorio = Math.floor(1000000 + Math.random() * 9000000);
  return ciAleatorio;
}

function generarNumeroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Función para poblar la tabla Cliente con n registros únicos
async function poblarTablaCliente(n) {
  try {
    for (let i = 0; i < n; i++) {
      const ci = generarCINuevo();
      const nombre = `Cliente ${i + 1}`;

      // Crear un nuevo registro de cliente
      await Cliente.create({ ci, nombre });
    }

    console.log(`Se poblaron ${n} registros únicos en la tabla Cliente.`);
  } catch (error) {
    console.error("Error al poblar la tabla Cliente:", error.message);
  }
}

async function poblarTablaDeuda(n) {
  try {
    const clientes = await Cliente.findAll({
      attributes: ["ci"],
    });
    for (let i = 0; i < n; i++) {
      const ciAleatoria =
        clientes[generarNumeroAleatorio(0, clientes.length - 1)].ci;
      const monto = generarNumeroAleatorio(1, 5000);
      // Crear un nuevo registro de cliente
      await Deuda.create({ clienteCi: ciAleatoria, monto });
    }
    console.log(`Se poblaron ${n} registros únicos en la tabla Deuda.`);
  } catch (error) {
    console.error("Error al poblar la tabla Deuda:", error.message);
  }
}

async function destroyTables() {
  try {
    await Cliente.destroy({
      where: {}, // No se especifican condiciones, por lo que elimina todos los registros
    });
    await Deuda.destroy({
      where: {},
    });
  } catch (error) {
    console.error("Error al poblar la tabla Deuda:", error.message);
  }
}
module.exports = {
  poblarTablaCliente,
  poblarTablaDeuda,
  destroyTables,
};
