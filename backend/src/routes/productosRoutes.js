const express = require("express");
const productosRouter = express.Router();
const mongoose = require("mongoose");
const Producto = require("../models/Product");

// const productos = require("../data/productos");
const productos = require("../../data/productos");

//Get desde la BD
productosRouter.get("/", async (req, res, next) => {
  try {
    const productos = await Producto.find({});
    res.status(200).json(productos);
  } catch (error) {
    console.error("Error al obttner productos:", error.message);
  }
});

// GET /api/productos
// Devuelve la lista completa del catálogo.
// productosRouter.get("/", (req, res) => {
//   res.json(productos);
// });

// GET /api/productos/:id
// Recupera un único producto filtrando por identificador.
// productosRouter.get("/:id", (req, res) => {
//   const id = parseInt(req.params.id, 10); // Check
//   const producto = productos.find((p) => p.id === id);
//   if (!producto) {
//     return res.status(404).json({ message: "Producto no encontrado." });
//   }

//   res.json(producto);
// });

productosRouter.get("/:id", async (req, res, next) => {
  try {
    const idProducto = parseInt(req.params.id, 10);
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      const error = new Error("Producto no encontrado.");
      error.status = 404;
      return next(error);
    }
    res.status(200).json(producto);
  } catch (error) {
    console.error("Error al obtener el producto por ID:", error.message);
  }
});

productosRouter.post("/", async (req, res, next) => {
  try {
    const producto = await Producto.create(req.body);
    res.status(201).json({
      mensaje: "Producto creado con exito.",
      producto: producto,
    });
  } catch (error) {
    console.error("Error al crear el producto:", error.message);
    error.status = 400;
    next(error);
  }
});

productosRouter.put("/:id", async (req, res, next) => {
  try {
    const idProducto = req.params.id;
    const datosActualizados = req.body;
    console.log(
      `Actualizando producto con id: ${idProducto} con datos: ${datosActualizados}`
    );
    const productoActualizado = await Producto.findByIdAndUpdate(
      idProducto,
      datosActualizados,
      { new: true, runValidators: true }
    );

    if (!productoActualizado) {
      const error = new Error("Producto no encontrado para actualziar");
      erros.status = 404;
      return next(error);
    }
  } catch (error) {
    console.error("Error al actualizar el producto:", error.message);
    error.status = 404;
    next(error);
  }
});

productosRouter.delete("/:id", async (req, res, next) => {
  try {
    const idProducto = req.params.id;
    const productoEliminado = await Producto.findByIdAndDelete(idProducto);
    if (!productoEliminado) {
      const error = new Error("Producto no encontrado para eliminar.");
      error.status = 404;
      return next(error);
    }
  } catch (error) {
    console.error("Error al eliminar el usuario:", error.message);
    error.status = 404;
    next(error);
  }
});

module.exports = productosRouter;
