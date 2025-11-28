const express = require("express");
const { addOrderItems } = require("../controllers/orderController");
// Asegúrate de que authMiddleware exporte 'protect' correctamente
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Ruta protegida para crear pedidos
router.post("/", protect, addOrderItems);

module.exports = router;
