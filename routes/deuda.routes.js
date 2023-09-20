const express = require("express");
const { Deuda } = require("../models");
const router = express.Router();

// obtener las deudas dependientes de pago de un cliente
router.get("/:ci", async (req, res) => {
  const { ci } = req.params;

  try {
    const deudas = await Deuda.findAll({
      attributes: ["idDeuda", "saldo"],
      where: {
        idCliente: ci,
        pagada: false,
      },
    });
    res.status(200).json(deudas);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
