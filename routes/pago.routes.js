const express = require("express");
const { Pago, Deuda } = require("../models");
const router = express.Router();

// Routes
router.post("/", async (req, res) => {
  const { deudas, monto } = req.body;
  try {
    await sequelize.transaction(async (t) => {
      const pago = await Pago.create(
        {
          monto,
        },
        { transaction: t }
      );

      // Paso 2: Actualiza múltiples registros de deuda
      for (let i = 0; i < deudas.length; i++) {
        await Deuda.update(
          { pagoId: pago.id },
          {
            where: {
              idDeuda: deudas[i],
              pagoId: null,
            },
            transaction: t,
          }
        );
      }
    });
    res.status(200).json(deudas);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
