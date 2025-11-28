const Order = require("../models/Order");

// @desc    Crear un nuevo pedido
// @route   POST /api/orders
// @access  Privado
const addOrderItems = async (req, res) => {
  try {
    const { items, total } = req.body;

    // 1. Validar items
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No hay items en el pedido" });
    }

    // 2. DETECCIÓN INTELIGENTE DEL ID DE USUARIO
    // Intentamos leer el ID de varias formas posibles para evitar errores
    // Si req.user no existe, lanzamos error manual para evitar crash
    if (!req.user) {
      return res
        .status(401)
        .json({
          message: "Error de sesión: Usuario no encontrado en el request.",
        });
    }

    // A veces el token decodificado guarda el id como 'id', otras como '_id'
    const usuarioId = req.user.id || req.user._id || req.user.userId;

    if (!usuarioId) {
      return res
        .status(400)
        .json({
          message: "Error de token: No se pudo obtener el ID del usuario.",
        });
    }

    // 3. Mapeo de datos (Frontend -> Backend Schema)
    const orderItems = items.map((item) => ({
      producto: item.productoId,
      cantidad: Number(item.cantidad),
      precioUnitario: Number(item.precioUnitario),
    }));

    // 4. Crear la orden
    const order = new Order({
      usuario: usuarioId, // 👈 Aquí usamos el ID que detectamos arriba
      items: orderItems,
      total: Number(total),
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("🔥 ERROR EN ADD ORDER:", error);
    res
      .status(500)
      .json({ message: "Error al procesar el pedido: " + error.message });
  }
};

module.exports = { addOrderItems };
