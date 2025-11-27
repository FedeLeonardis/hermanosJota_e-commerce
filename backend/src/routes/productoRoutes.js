const express = require("express");
const productosRouter = express.Router();
const productoController = require("../controllers/productoController");
const verifyToken = require("../middleware/authMiddleware");
const adminGuard = require("../middleware/adminGuard");

//Publicas
productosRouter.get("/", productoController.getProductos);

productosRouter.get("/:id", productoController.getProductoId);

//Protegidos
productosRouter.post(
  "/",
  verifyToken,
  adminGuard,
  productoController.agregarProducto
);

productosRouter.put(
  "/:id",
  verifyToken,
  adminGuard,
  productoController.editarProducto
);

productosRouter.delete(
  "/:id",
  verifyToken,
  adminGuard,
  productoController.eliminarProducto
);

module.exports = productosRouter;
