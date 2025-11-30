const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, roles } = req.body;

    const existUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existUser) {
      return res
        .status(400)
        .json({ message: "El email o nombre ya están en uso." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
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

    const usuario = await User.findOne({ email: req.body.email });

    if (!usuario) {
      return res
        .status(400)
        .json({ message: "Credenciales invalidas (Email no existe)." });
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      usuario.password
    );

    if (!isValidPassword) {
      return res
        .status(400)
        .json({ message: "Credenciales invalidas (Password incorrecto)." });
    }

    const token = jwt.sign(
      { id: usuario._id, username: usuario.username, rol: usuario.roles },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

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
        token: token,
        usuario: {
          id: usuario._id,
          username: usuario.username,
          email: usuario.email,
          roles: usuario.roles,
        },
      });
  } catch (error) {
    console.error("❌ ERROR EN EL CATCH:", error);
    next(error);
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error en profile:", error);
    res.status(500).json({ message: "Error al obtener perfil" });
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
  if (!req.user) {
    return res.status(401).json({ isAuthenticated: false });
  }

  res.json({
    isAuthenticated: true,
    user: req.user,
  });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
  checkSession,
};
