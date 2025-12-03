const express = require('express');
const UsuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

const router = express.Router();

router.use(authMiddleware);

// 👥 CRUD COMPLETO DE PRACTICANTES
router.post('/practicantes', authorize(['admin']), UsuarioController.createPracticante);
router.get('/practicantes', authorize(['admin']), UsuarioController.getPracticantes);
router.get('/practicantes/:id', UsuarioController.getPracticanteById); // ✅ NUEVA
router.put('/practicantes/:id', authorize(['admin']), UsuarioController.updatePracticante); // ✅ NUEVA
router.patch('/practicantes/:id/reactivar', authorize(['admin']), UsuarioController.reactivarPracticante); // ✅ NUEVA
router.delete('/practicantes/:id', authorize(['admin']), UsuarioController.deletePracticante);

// 📸 FOTO DE PERFIL
router.patch('/:id/foto', UsuarioController.actualizarFotoPerfil);

// 🔐 DATOS BIOMÉTRICOS
router.patch('/:id/biometricos', authorize(['admin']), UsuarioController.updateBiometricos);

// 👤 PERFIL
router.get('/:id/perfil', UsuarioController.getPerfilPracticante);

module.exports = router;