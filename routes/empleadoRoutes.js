const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Empleado = require('../models/Empleado'); 
const { authenticateToken } = require('../middleware/authmiddleware'); 

router.post('/', async (req, res) => {
   try {
    const { nombre, apellidos, telefono, correo, direccion} = req.body;

    //validadion basica de entrada
    if (!nombre || !apellidos || !correo){
      return res.status(400).json({message: 'Nombre, apellidos y correo son campos requeridos.'})
    }

    const existente = await Empleado.findOne({ where: { correo } });
    if (existente) {
      return res.status(400).json({ message: 'Ya existe un empleado con ese correo.' });
    }

    const nuevoEmpleado = await Empleado.create({
      nombre,
      apellidos,
      telefono,
      correo,
      direccion
    });
    res.status(201).json({message: 'Empleado agregado exitosamente', empleado: nuevoEmpleado});
   } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: 'Error de validación', errors: error.errors.map(e => e.message) });
    }
    console.error('Error al agregar empleado:', error);
    res.status(500).json({ message: 'Error interno del servidor al agregar empleado' });
  }
});

// 2. OBTENER todos los empleados (READ)
router.get('/', async (req, res) => {
  try {
    const empleados = await Empleado.findAll({
        order: [['nombre', 'ASC']]
    });
    res.json(empleados);
  } catch (error) {
    console.error('Error al obtener empleados:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener los empleados.' });
  }
});

// 3. OBTENER un empleado por su ID 
router.get('/:id', async (req, res) => {
  try {
    const empleado = await Empleado.findByPk(req.params.id);
    if (!empleado) {
      return res.status(404).json({ message: 'Empleado no encontrado.' });
    }
    res.json(empleado);
  } catch (error) {
    console.error('Error al obtener empleado por ID:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// 4. MODIFICAR datos de un empleado (UPDATE)
router.put('/:id', async (req, res) => {
  try {
    const empleado = await Empleado.findByPk(req.params.id);
    if (!empleado) {
      return res.status(404).json({ message: 'Empleado no encontrado.' });
    }

    const { nombre, apellidos, telefono, correo, direccion } = req.body;

    if (correo && correo !== empleado.correo) {
        const existenteConNuevoCorreo = await Empleado.findOne({ where: { correo: correo } });
        if (existenteConNuevoCorreo) {
            return res.status(400).json({ message: 'El nuevo correo electrónico ya está en uso por otro empleado.' });
        }
    }


    empleado.nombre = nombre || empleado.nombre;
    empleado.apellidos = apellidos || empleado.apellidos;
    empleado.telefono = telefono !== undefined ? telefono : empleado.telefono; // Para permitir string vacío o null
    empleado.correo = correo || empleado.correo;
    empleado.direccion = direccion !== undefined ? direccion : empleado.direccion; // Para permitir string vacío o null

    await empleado.save(); // Guarda los cambios

    res.json({ message: 'Empleado actualizado exitosamente.', empleado });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: 'Error de validación.', errors: error.errors.map(e => e.message) });
    }
    console.error('Error al actualizar empleado:', error);
    res.status(500).json({ message: 'Error interno del servidor al actualizar el empleado.' });
  }
});

// 5. ELIMINAR un empleado de la base de datos (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    const empleado = await Empleado.findByPk(req.params.id);
    if (!empleado) {
      return res.status(404).json({ message: 'Empleado no encontrado.' });
    }

    await empleado.destroy(); // Elimina el empleado
    res.json({ message: 'Empleado eliminado exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar empleado:', error);
    res.status(500).json({ message: 'Error interno del servidor al eliminar el empleado.' });
  }
});

// 6. BUSCAR empleados por su nombre
router.get('/buscar/por-nombre', async (req, res) => {
  const { nombre } = req.query;

  if (!nombre) {
    return res.status(400).json({ message: 'Debe proporcionar un término de búsqueda para el nombre.' });
  }

  try {
    const empleados = await Empleado.findAll({
      where: {
        nombre: {
          [Op.like]: `%${nombre}%`,
        },
      },
    });

    if (empleados.length === 0) {
      return res.status(404).json({ message: 'No se encontraron empleados con ese nombre.' });
    }
    res.json(empleados);
  } catch (error) {
    console.error('Error al buscar empleados por nombre:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});


module.exports = router;