const express = require("express");
const cors = require("cors");
const productosRouter = require("./routes/productosRoutes");
const loggerMiddleware = require("./middleware/logger");

// Puerto configurable mediante variable de entorno para facilitar despliegues.
const puerto = process.env.PORT || 5000;

const app = express();

// Middlewares globales: CORS, parsing de JSON y logging básico.
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

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
