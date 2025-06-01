// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario'); 

// Ruta de Login (POST /api/auth/login)
router.post('/login', async (req, res) => {
  const { username, password } = req.body; // username será el email

  if (!username || !password) {
    return res.status(400).json({ message: 'Correo y contraseña son requeridos.' });
  }

  try {
    // 1. Buscar el usuario por su username (email)
    const usuario = await Usuario.findOne({ where: { username: username } });

    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas.' }); // Usuario no encontrado
    }

    // 2. Comparar la contraseña ingresada con la almacenada 
    const isMatch = await usuario.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas.' }); // Contraseña incorrecta
    }

    // 3. Si las credenciales son correctas, generar un JWT
    const payload = {
      id: usuario.id,
      username: usuario.username,
     
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // El token expira en 1 hora
    );

    res.json({
      message: 'Inicio de sesión exitoso.',
      token: token,
      userId: usuario.id,
      username: usuario.username
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

module.exports = router;