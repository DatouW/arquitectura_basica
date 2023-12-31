const express = require("express");
const router = express.Router();
const { Cliente } = require("../models/index");

//lista de los clientes
router.get("/", async (req, res) => {
  try {
    const clientes = await Cliente.findAll({
      attributes: ["idCliente"],
    });
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
});

module.exports = router;
