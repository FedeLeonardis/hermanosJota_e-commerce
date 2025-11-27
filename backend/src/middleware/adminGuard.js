const adminGuard = (req, res, next) => {
  if (req.usuario && req.usuario.rol.includes("admin")) {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Acceso denegado. Se requiere rol de administrador." });
  }
};

module.exports = adminGuard;
