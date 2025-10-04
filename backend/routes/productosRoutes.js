const express = require("express");
const productosRouter = express.Router();

const productos = require("../../frontend/src/data");

productosRouter.get("/", (req, res) => {
  res.json(productos);
});
productosRouter.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const producto = productos.find((p) => p.id === id);
  if (!producto) {
    return res.status(400).json({ message: "Producto no encontrado." });
  }
  res.json(producto);
});

module.exports = productosRouter;
