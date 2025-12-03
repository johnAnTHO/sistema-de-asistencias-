const express = require('express');
const ReporteController = require('../controllers/reporteController');
const authMiddleware = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

const router = express.Router();

router.use(authMiddleware);

// 📊 REPORTES (SOLO ADMIN)
router.get('/asistencias', authorize(['admin']), ReporteController.generarReporteAsistencias);

module.exports = router;