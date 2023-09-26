const axios = require("axios");
const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");

const URL = "http://localhost:3000/api";
const PORCENTAJE = [0.5, 0.8, 1];

// Obtener la lista de clientes
const obtenerClientes = async () => {
  const { data } = await axios.get(URL + "/clientes");
  return data;
};

//elegir aleatoriamente un cliente
const elegirClienteAleatorio = (clientes) => {
  const index = Math.floor(Math.random() * clientes.length);
  return clientes[index].idCliente;
};

//obtener las deudas de un cliente
const obtenerDeudas = async (idCliente) => {
  try {
    // Simulación de una solicitud para obtener las deudas de un cliente
    const { data } = await axios.get(URL + `/deudas/${idCliente}`);

    return data;
  } catch (error) {
    console.error(
      `Error al obtener las deudas para ${idCliente}: ${error.message}`
    );
    return [];
  }
};

// Lógica para pagar las deudas de un cliente (simulación)
const pagarDeudas = async (deudas) => {
  const cantidad = Math.floor(Math.random() * deudas.length + 1);
  //pagar n deudas
  const arr = [];
  for (let i = 0; i < cantidad; i++) {
    const porc = PORCENTAJE[Math.floor(Math.random() * PORCENTAJE.length)];
    arr.push({
      ...deudas[i],
      monto: (deudas[i].monto * porc).toFixed(2),
    });
  }
  //   console.log(arr);
  try {
    const { data } = await axios.post(URL + "/pagos", {
      deudas: arr,
    });
    console.log(data);
  } catch (error) {
    console.log(error.message);
  }
};

async function ejecutar(clientes) {
  setInterval(async () => {
    const id = elegirClienteAleatorio(clientes);
    const deudas = await obtenerDeudas(id);
    if (deudas.length !== 0) await pagarDeudas(deudas);
  }, 3000);
}

if (isMainThread) {
  // Obtener la lista de clientes
  obtenerClientes()
    .then((clientes) => {
      // Crear dos hilos trabajadores
      const worker1 = new Worker(__filename, {
        workerData: { clientes },
      });
      const worker2 = new Worker(__filename, {
        workerData: { clientes },
      });

      // Escuchar mensajes de los hilos trabajadores
      worker1.on("message", (message) => {
        console.log(`Worker 1: ${message}`);
      });
      worker2.on("message", (message) => {
        console.log(`Worker 2: ${message}`);
      });

      // Iniciar los hilos trabajadores
      worker1.postMessage({ action: "iniciar" });
      worker2.postMessage({ action: "iniciar" });
    })
    .catch((error) => {
      console.error("Error al obtener la lista de clientes:", error.message);
    });
} else {
  // Este es un hilo trabajador

  // Manejar el mensaje del hilo principal
  parentPort.on("message", (message) => {
    if (message.action === "iniciar") {
      const { clientes } = workerData;
      ejecutar(clientes);
    }
  });
}
