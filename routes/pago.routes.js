const express = require("express");
const { Pago } = require("../models");
const router = express.Router();

// Routes
router.post("/", async (req, res) => {
  const { deudas } = req.body;

  try {
    if (deudas) {
      await Pago.bulkCreate(deudas);
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
