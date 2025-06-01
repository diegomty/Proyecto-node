// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('taller_node_db', 'root', 'TuPassword123!', {
  host: 'localhost', 
  dialect: 'mysql',
  logging: false,
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Conexión con MySQL establecida correctamente.');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos MySQL:', error);
  }
}

module.exports = sequelize;