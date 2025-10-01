const express = require('express')
const app = express()

const puerto = process.env.PORT || 5000

const productosRouter = require('./routes/productosRoutes')
app.use(express.json())
app.use('/api/productos', productosRouter)
app.get('/', (req, res) => {
    res.send('Bienvenido al API de Muebleria Jota en el repo')
})

app.listen(puerto, () => {
    console.log(`El servidor esta corriendo en el puerto ${puerto}`)
})