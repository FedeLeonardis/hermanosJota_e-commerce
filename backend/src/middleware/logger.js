/**
 * Middleware simple que deja un registro de cada petición entrante.
 * Sirve para depurar rápidamente la actividad del servidor sin depender de herramientas externas.
 */
const loggerMiddleware = (req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.originalUrl}`);
    next();
};

module.exports = loggerMiddleware;