const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authmiddleware'); 

router.get('/', authenticateToken, (req, res) => {

  res.json({ message: 'Acceso a empleados concedido', user: req.user });
});


router.post('/', authenticateToken, (req, res) => {
o
  res.json({ message: 'Empleado creado (protegido)', user: req.user });
});

module.exports = router;