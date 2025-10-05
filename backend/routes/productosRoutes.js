const express = require("express");
const productosRouter = express.Router();

const productos = require("../data/productos");

// GET /api/productos
// Devuelve la lista completa del catálogo.
productosRouter.get("/", (req, res) => {
  res.json(productos);
});

// GET /api/productos/:id
// Recupera un único producto filtrando por identificador.
productosRouter.get("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const producto = productos.find((p) => p.id === id);
  if (!producto) {
    return res.status(404).json({ message: "Producto no encontrado." });
  }

  res.json(producto);
});

module.exports = productosRouter;
