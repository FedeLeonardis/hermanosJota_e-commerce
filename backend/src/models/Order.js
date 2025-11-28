const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        producto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Producto",
          required: true,
        },
        cantidad: { type: Number, required: true },
        precioUnitario: { type: Number, required: true },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    estado: {
      type: String,
      default: "pendiente",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
