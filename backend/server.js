require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");

// Conexion de la BD (solo si DB_URI está definida)
if (process.env.DB_URI) {
  mongoose
    .connect(process.env.DB_URI)
    .then(() => console.log("Conexion a la BD exitosa"))
    .catch((err) => console.log("Error al conectar la BD", err));
} else {
  console.warn(
    "WARN: DB_URI no definida. Se omitirá la conexión a MongoDB. Asegúrate de definir DB_URI en el entorno de producción."
  );
}

// const productosRouter = require("./routes/productosRoutes");

const productosRouter = require("./src/routes/productosRoutes");

// const loggerMiddleware = require("./middleware/logger");
const loggerMiddleware = require("./src/middleware/logger");

// Puerto configurable mediante variable de entorno para facilitar despliegues.
const puerto = process.env.PORT || 5000;

//Permite servir las imagenes de los productos desde backend (si tienen dudas preguntar a Walter)
const app = express();

// Habilitar CORS con whitelist configurable mediante la variable de entorno
// ALLOWED_ORIGINS (coma-separada). Ej: "https://mi-front.netlify.app,http://localhost:5173"
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

console.log(
  "CORS allowed origins:",
  allowedOrigins.length > 0 ? allowedOrigins : "(ninguno configurado)"
);

const corsOptions = {
  origin: function (origin, callback) {
    // origin == undefined -> petición desde servidor (curl, render internal) -> permitir
    if (!origin) return callback(null, true);

    // Si no hay orígenes permitidos configurados, bloquear por seguridad
    if (allowedOrigins.length === 0) {
      return callback(new Error("CORS: no allowed origins configured"), false);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS: origin not allowed"), false);
  },
  // Permitir credenciales (cookies) solo si se define la variable CORS_ALLOW_CREDENTIALS=true
  credentials: process.env.CORS_ALLOW_CREDENTIALS === "true",
};

app.use(cors(corsOptions));

app.use(
  "/images/productos",
  express.static(path.join(__dirname, "images", "productos"))
);

// Middlewares globales: CORS, parsing de JSON y logging básico.
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
