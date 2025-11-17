const express = require('express');
const AsistenciaController = require('../controllers/asistenciaController');
const authMiddleware = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

const router = express.Router();

router.use(authMiddleware);

// Registro biométrico (practicantes)
router.post('/entrada/biometrica', AsistenciaController.marcarEntradaBiometrica);
router.post('/salida/biometrica', AsistenciaController.marcarSalidaBiometrica);

// Registro manual (solo admin)
router.post('/manual', authorize(['admin']), AsistenciaController.registrarAsistenciaManual);
router.delete('/:id', authorize(['admin']), AsistenciaController.eliminarAsistencia);

// Consultas
router.get('/hoy', AsistenciaController.getAsistenciasHoy);
router.get('/mis-asistencias', AsistenciaController.getMisAsistencias);

module.exports = router;
