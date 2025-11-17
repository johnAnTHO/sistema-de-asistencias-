const express = require('express');
const UsuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/auth');
const { authorize, soloPropiosDatos } = require('../middleware/authorize');

const router = express.Router();
router.use(authMiddleware);

// Gestión de practicantes
router.get('/practicantes', authorize(['admin', 'supervisor']), UsuarioController.getPracticantes);
router.post('/practicantes', authorize(['admin']), UsuarioController.createPracticante);
router.delete('/practicantes/:id', authorize(['admin']), UsuarioController.deletePracticante); // ✅ RUTA DELETE

// Perfil y foto
router.get('/:id/perfil', soloPropiosDatos, UsuarioController.getPerfilPracticante);
router.put('/:id/foto', soloPropiosDatos, UsuarioController.actualizarFotoPerfil);

// Datos biométricos
router.put('/:id/biometricos', authorize(['admin', 'supervisor']), UsuarioController.updateBiometricos);

module.exports = router;
