require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
//Conexion de la BD
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Conexion a la BD exitosa"))
  .catch(() => console.log("Error al conectar la BD"));

const productosRouter = require("./src/routes/productosRoutes");
const userRouter = require("./src/routes/userRoutes");

const loggerMiddleware = require("./src/middleware/logger");

// Puerto configurable mediante variable de entorno para facilitar despliegues.
const puerto = process.env.PORT || 5000;

//Permite servir las imagenes de los productos desde backend (si tienen dudas preguntar a Walter)
const app = express();

// Configuración de CORS para permitir peticiones desde el frontend
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(
  "/images/productos",
  express.static(path.join(__dirname, "images", "productos"))
);

// Middlewares globales: parsing de JSON y logging básico.
app.use(express.json());
app.use(loggerMiddleware);

//Ignora el error de favicon no encontrado
app.get("/favicon.ico", (req, res) => res.status(204).end());

// Endpoint raíz de cortesía para verificar que la API está viva.
app.get("/", (req, res) => {
  res.send("Bienvenido al API de Muebleria Jota en el repo");
});

// Rutas de dominio principal agrupadas por recurso.
app.use("/api/productos", productosRouter);
app.use("/api/users", userRouter);

// Manejo centralizado para rutas inexistentes.
app.use((req, res, next) => {
  const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

// Middleware de manejo de errores: uniforma estructura de respuesta y loguea detalles.
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Error de servidor.";
  console.error({ statusCode, message, stack: err.stack });
  res.status(statusCode).json({ error: message });
});

// Inicialización del servidor HTTP.
app.listen(puerto, () => {
  console.log(`El servidor esta corriendo en el puerto ${puerto}`);
});
