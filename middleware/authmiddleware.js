const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No hay token, autorización denegada' });
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Añadir el usuario decodificado al request
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token no válido' });
  }
};

module.exports = authMiddleware;