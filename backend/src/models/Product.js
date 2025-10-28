const mongoose = require("mongoose");
const productoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      trim: true,
      required: [true, "El nombre del producto es obligatorio."],
    },
    descripcion: {
      type: String,
      trim: [true, "La descripción es obligatoria."],
      required: true,
    },
    precio: {
      type: Number,
      min: [0, "El precio no peude ser negativo."],
      required: [true, "El precio es obligatorio."],
    },
    stock: {
      type: Number,
      min: [0, "La cantidad no puede ser negativa."],
      required: true,
    },
    features: {
      medidas: { type: String, trim: true },
      materiales: { type: String, trim: true },
      acabado: { type: String, trim: true },
      peso: { type: String, trim: true },
      capacidad: { type: String, trim: true },
      modulares: { type: String, trim: true },
      tapizado: { type: String, trim: true },
      confort: { type: String, trim: true },
      rotacion: { type: String, trim: true },
      garantia: { type: String, trim: true },
      almacenamiento: { type: String, trim: true },
      colchon: { type: String, trim: true },
      sostenibilidad: { type: String, trim: true },
      extension: { type: String, trim: true },
      apilables: { type: String, trim: true },
      incluye: { type: String, trim: true },
      cables: { type: String, trim: true },
      almacenamiento: { type: String, trim: true },
      certificación: { type: String, trim: true },
      regulación: { type: String, trim: true },
      caracteristica: { type: String, trim: true },
    },
    imagenUrl: {
      type: String,
      required: [true, "La imagen es obligatoria."],
    },
  },
  {
    timestamos: true,
  }
);

module.exports = mongoose.model("Producto", productoSchema);
