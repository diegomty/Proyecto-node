// crearAdmin.js
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
const bcrypt = require('bcryptjs');
const sequelize = require('./config/database');
const Usuario = require('./models/usuario');

async function crearAdmin() {
  try {
    await sequelize.authenticate();

    console.log('--- Creación de Usuario Administrador ---');

    readline.question('Correo electrónico del administrador: ', async (email) => {
      readline.question('Contraseña del administrador: ', async (password) => {
        readline.close();

        if (!email || !password) {
          console.error('El correo y la contraseña no pueden estar vacíos.');
          await sequelize.close();
          return;
        }

        // Validar formato de email (básico)
        if (!/\S+@\S+\.\S+/.test(email)) {
            console.error('Formato de correo electrónico inválido.');
            await sequelize.close();
            return;
        }

        try {
          // Verificar si el usuario ya existe
          const existingUser = await Usuario.findOne({ where: { username: email } });
          if (existingUser) {
            console.log(`El usuario con el correo ${email} ya existe.`);
            await sequelize.close();
            return;
          }

          // El hook beforeCreate se encargará de hashear la contraseña
          const nuevoAdmin = await Usuario.create({
            username: email,
            password: password, // La contraseña se hasheará automáticamente por el hook
          });
          console.log(`Usuario administrador ${nuevoAdmin.username} creado exitosamente.`);

        } catch (error) {
          if (error.name === 'SequelizeValidationError') {
            console.error('Error de validación:', error.errors.map(e => e.message));
          } else if (error.name === 'SequelizeUniqueConstraintError') {
            console.error('Error: El correo electrónico ya está en uso.');
          }
          else {
            console.error('Error al crear el administrador:', error);
          }
        } finally {
          await sequelize.close(); // Cierra la conexión a la base de datos
        }
      });
    });

  } catch (dbError) {
    console.error('No se pudo conectar a la base de datos para crear el admin:', dbError);
    readline.close(); // Asegura que readline se cierre si hay error de BD
  }
}

crearAdmin();