const express = require("express");
const sequelize = require("./database/index");
require("./models/index");
const {
  poblarTablaCliente,
  poblarTablaDeuda,
  destroyTables,
} = require("./datos");

const { InsertarClientes, InsertarDeudas } = require("./proceso");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/clientes", require("./routes/cliente.routes"));
app.use("/api/deudas", require("./routes/deuda.routes"));
app.use("/api/pagos", require("./routes/pago.routes"));

(async () => {
  try {
    //     await sequelize.authenticate();
    //     console.log("Connection has been established successfully.");
    await sequelize.sync();

    console.log("Modelos sincronizados con la base de datos.");
    await destroyTables();
    await InsertarClientes(30);
    await InsertarDeudas(50);

    app.listen(3000, () => {
      console.log("Running on port 3000");
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
