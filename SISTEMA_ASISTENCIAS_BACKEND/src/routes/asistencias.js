const express = require('express');
const AsistenciaController = require('../controllers/AsistenciaController');
const authMiddleware = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

const router = express.Router();

router.use(authMiddleware);

// Registro biométrico (practicantes)
router.post('/entrada/biometrica', AsistenciaController.marcarEntradaBiometrica);
router.post('/salida/biometrica', AsistenciaController.marcarSalidaBiometrica);

// 📍 REGISTRO DNI ELECTRÓNICO (NUEVAS RUTAS)
router.post('/entrada/dni', AsistenciaController.marcarEntradaDNI);
router.post('/salida/dni', AsistenciaController.marcarSalidaDNI);

// 📍 VISUALIZACIÓN PARA PRACTICANTES (NUEVAS RUTAS)
router.get('/mis-asistencias', AsistenciaController.getMisAsistencias);
router.get('/mi-resumen', AsistenciaController.getMiResumen);

// Registro manual (solo admin)
router.post('/manual', authorize(['admin']), AsistenciaController.registrarAsistenciaManual);
router.delete('/:id', authorize(['admin']), AsistenciaController.eliminarAsistencia);

module.exports = router;