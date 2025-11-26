const Usuario = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const existUSer = await Usuario.findOne({ $or: [{ email }, { username }] });
    if (existUSer) {
      return res
        .status(400)
        .json({ message: "El email o nombre ya estan en uso." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUSer = new Usuario({ username, email, password: hashedPassword });
    const savedUSer = await newUSer.save();

    res.status(201).json({
      _id: savedUSer._id,
      username: savedUSer.username,
      email: savedUSer.email,
    });
  } catch (error) {
    console.error("Error al crear usuario:", error.message);
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
};

const loginUser = async (req, res, next) => {
  try {
    const usuario = await Usuario.findOne({ email: req.body.email });
    if (!usuario) {
      return res.status(400).json({ message: "Credenciales invalidas." });
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      usuario.password
    );
    if (!isValidPassword) {
      return res.status(400).json({ message: "Credenciales invalidas." });
    }

    const token = jwt.sign(
      { id: usuario._id, username: usuario.username },
      process.env.JWT_SECRET,
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
        usuario: {
          id: usuario._id,
          username: usuario.username,
          email: usuario.email,
        },
      });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
    console.error(error.message);
  }
};

const getUserProfile = async (req, res) => {
  try {
    // req.user viene del middleware
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
  // verifyToken ya cargó el usuario en req.user
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
