// app.js
require('dotenv').config(); // Cargar variables de entorno desde .env
const express = require('express');
const sequelize = require('./config/database');

// Importar modelos
const Usuario = require('./models/usuario');
const Empleado = require('./models/Empleado');

const authRoutes = require('./routes/authRoutes'); 
const app = express();
const PORT = process.env.PORT || process.env.APP_PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡El servidor del Taller de Node.js está funcionando!');
});

app.use('/api/auth', authRoutes); // Rutas de autenticación

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Conexión con MySQL establecida correctamente.');

    // Sincronizar modelos:
    // { alter: true } intentará actualizar las tablas para que coincidan con el modelo.
    // Es más seguro para desarrollo que force: true.
    await sequelize.sync({ alter: true });
    console.log('Todos los modelos fueron sincronizados exitosamente.');

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo conectar y sincronizar la base de datos:', error);
  }
}

startServer();