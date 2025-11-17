const express = require('express');
const AuthController = require('../controllers/authController');
const { body } = require('express-validator');

const router = express.Router();

router.post('/login', [
  body('dni').isLength({ min: 8, max: 8 }).withMessage('DNI debe tener 8 dígitos'),
  body('password').notEmpty().withMessage('Contraseña requerida')
], AuthController.login);

router.get('/verify', AuthController.verifyToken);

module.exports = router;