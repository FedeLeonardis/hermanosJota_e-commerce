const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    // Buscar token en cookie o en header Authorization
    const token =
      req.cookies?.authToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No estás autenticado" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // { id, username }
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};

module.exports = verifyToken;
