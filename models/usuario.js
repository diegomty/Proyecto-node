// models/Usuario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Tu instancia de Sequelize
const bcrypt = require('bcrypt'); // Para encriptar contraseñas

const Usuario = sequelize.define('Usuario', {
    // Los atributos del modelo se definen aquí
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: { // Usaremos correo para login 
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // El nombre de usuario (o correo) debe ser único
        validate: {
            isEmail: true, // Validación para asegurar que sea un formato de email
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'usuarios',
    hooks: {
        beforeCreate: async (usuario) => {
            if (usuario.password) {
                const salt = await bcrypt.genSalt(10); // Genera un 'salt'
                usuario.password = await bcrypt.hash(usuario.password, salt); // Hashea la contraseña
            }
        },
        beforeUpdate: async (usuario) => {
            // Hashear la contraseña solo si ha sido modificada
            if (usuario.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                usuario.password = await bcrypt.hash(usuario.password, salt);
            }
        }
    }
});

Usuario.prototype.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = Usuario;