// models/Empleado.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Tu instancia de Sequelize

const Empleado = sequelize.define('Empleado', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellidos: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true, // Puede ser nulo si no es obligatorio
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // El correo del empleado debe ser único
    validate: {
      isEmail: true, // Valida que sea un formato de email
    },
  },
  direccion: {
    type: DataTypes.TEXT, // TEXT para direcciones más largas
    allowNull: true,
  },
}, {
  tableName: 'empleados',
});

module.exports = Empleado;