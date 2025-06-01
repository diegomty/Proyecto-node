const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrae el token del header

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado.' });
  }

  try {
    //verifica el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Busca el usuario en la base de datos 
    const usuario = await Usuario.findByPk(decoded.id);
    if (!usuario) {
      return res.status(401).json({ message: 'Token invalido. Usuario no encontrado.' });
    }
    req.user = usuario; // Guarda el usuario en la solicitud para usarlo en las rutas
    next(); // Llama al siguiente middleware o ruta
  }catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado.' });
    }
    return res.status(403).json({ message: 'Token invalido.' });
  }
};
module.exports = { authenticateToken };