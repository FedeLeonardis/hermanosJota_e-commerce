const express = require('express')
const app = express()

const puerto = process.env.PORT || 5000
app.use(express.json())
const productosRouter = require('./routes/productosRoutes')
const loggerMiddleware = require('./middleware/logger')
app.use(loggerMiddleware)
app.get('/', (req, res) => {
    res.send('Bienvenido al API de Muebleria Jota en el repo')
})
app.use('/api/productos', productosRouter)

app.use((req, res, next) => {
    const error = new Error(`Ruta no encontrada: ${req.originalUrl}`)
    error.status = 404
    next(error)
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Error de servidor.'
    console.error({ statusCode, message, stack: err.stack })
    res.status(statusCode).json({ error: message })
})
app.listen(puerto, () => {
    console.log(`El servidor esta corriendo en el puerto ${puerto}`)
})