const Usuario = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, roles } = req.body;
    const existUser = await Usuario.findOne({ $or: [{ email }, { username }] }); // Corregido nombre variable
    if (existUser) {
      return res
        .status(400)
        .json({ message: "El email o nombre ya están en uso." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new Usuario({
      username,
      email,
      password: hashedPassword,
      roles,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      roles: savedUser.roles,
    });
  } catch (error) {
    console.error("Error al crear usuario:", error.message);
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
};

const loginUser = async (req, res, next) => {
  console.log("👉 1. Entrando a loginUser");

  try {
    console.log("👉 2. Body recibido:", req.body);

    const JWT_SECRET = process.env.JWT_SECRET;

    console.log(
      "👉 3. Clave Secreta:",
      JWT_SECRET ? "✅ Definida correctamente" : "❌ Error"
    );

    // Checkpoint 3: Buscar en Base de Datos
    const usuario = await Usuario.findOne({ email: req.body.email });
    console.log(
      "👉 4. Resultado búsqueda usuario:",
      usuario ? "Encontrado" : "No encontrado"
    );

    if (!usuario) {
      return res
        .status(400)
        .json({ message: "Credenciales invalidas (Email no existe)." });
    }

    // Checkpoint 4: Comparar contraseña
    console.log("👉 5. Comparando contraseñas...");
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      usuario.password
    );
    console.log("👉 6. Contraseña válida?:", isValidPassword);

    if (!isValidPassword) {
      return res
        .status(400)
        .json({ message: "Credenciales invalidas (Password incorrecto)." });
    }

    // Checkpoint 5: Generar Token
    console.log("👉 7. Generando token...");

    // 👇 AQUÍ USAMOS LA VARIABLE QUE DEFINIMOS ARRIBA
    const token = jwt.sign(
      { id: usuario._id, username: usuario.username, rol: usuario.roles },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("👉 8. Token generado con éxito");

    res
      .status(200)
      .cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000,
      })
      .json({
        message: "Login Exitoso",
        token: token, // IMPORTANTE para tu frontend
        usuario: {
          id: usuario._id,
          username: usuario.username,
          email: usuario.email,
          roles: usuario.roles,
        },
      });
  } catch (error) {
    console.error("❌ ERROR EN EL CATCH:", error);
    // Pasamos el error al middleware de server.js para ver el stack completo
    next(error);
  }
};

const getUserProfile = async (req, res) => {
  try {
    res.json({
      message: `Bienvenido al perfil, ${req.usuario.username}`,
      usuario: req.usuario,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el perfil." });
  }
};

const logoutUser = (req, res) => {
  res
    .clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .status(200)
    .json({ message: "Logout exitoso" });
};

const checkSession = (req, res) => {
  res.json({
    usuario: req.usuario,
  });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
  checkSession,
};
