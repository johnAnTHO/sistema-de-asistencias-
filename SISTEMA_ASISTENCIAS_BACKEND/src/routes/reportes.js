const express = require('express');
const ReporteController = require('../controllers/reporteController');
const authMiddleware = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

const router = express.Router();

router.use(authMiddleware);

router.get('/asistencias', ReporteController.getReporteAsistencias);
router.get('/tardanzas', ReporteController.getReporteTardanzas);
router.get('/exportar-practicante', authorize(['admin', 'supervisor']), ReporteController.exportarReportePracticante);

module.exports = router;