// config/database.js
const { Sequelize } = require('sequelize');

// Reemplaza con tus credenciales de MySQL
const sequelize = new Sequelize('taller_node_db', 'root', 'TuPassword123!', {
  host: 'localhost', // o la IP de tu servidor MySQL si es remoto
  dialect: 'mysql',
  logging: false, // Poner en true para ver las consultas SQL en la consola, útil para depurar
});

// Probar la conexión
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Conexión con MySQL establecida correctamente.');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos MySQL:', error);
  }
}

// testConnection(); // Puedes descomentar esto temporalmente para probar la conexión al iniciar

module.exports = sequelize;