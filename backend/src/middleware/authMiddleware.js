// const jwt = require("jsonwebtoken");

// const verifyToken = (req, res, next) => {
//   try {
//     // Buscar token en cookie o en header Authorization
//     const token =
//       req.cookies?.authToken ||
//       req.header("Authorization")?.replace("Bearer ", "");

//     if (!token) {
//       return res.status(401).json({ message: "No estás autenticado" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.usuario = decoded; // { id, username }
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Token inválido o expirado" });
//   }
// };

// module.exports = verifyToken;

const jwt = require("jsonwebtoken");

// 1. Cambié el nombre de 'verifyToken' a 'protect' para coincidir con tu ruta
const protect = (req, res, next) => {
  try {
    // Buscar token en cookie o en header Authorization
    const token =
      req.cookies?.authToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No estás autenticado" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2. ⚠️ IMPORTANTE: Cambié 'req.usuario' a 'req.user'
    // Tu controlador de órdenes busca 'req.user._id', si esto dice 'usuario' fallará.
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};

// 3. Exportamos como objeto para que funcione el: const { protect } = require(...)
module.exports = { protect };
