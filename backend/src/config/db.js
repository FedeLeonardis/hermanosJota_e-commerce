const mongoose = require("mongoose");
//Conexion de la BD
// mongoose
//   .connect(process.env.DB_URI)
//   .then(() => console.log("Conexion a la BD exitosa"))
//   .catch(() => console.log("Error al conectar la BD"));

const conectarDB = async () => {
  try {
    // Usamos await para esperar que la promesa de la conexión se resuelva
    // process.env.MONGO_URI viene de nuestro archivo .env
    await mongoose.connect(process.env.DB_URI);

    console.log("MongoDB conectado exitosamente. ✅");
  } catch (error) {
    console.error(`Error al conectar con la base de datos: ${error.message}`);

    // Si la conexión falla, detenemos la ejecución de la aplicación.
    // Si la app no puede hablar con su base de datos, no puede funcionar.
    process.exit(1);
  }
};

// Exportamos la función para poder usarla en nuestro archivo principal
module.exports = conectarDB;
