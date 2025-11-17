const express = require('express');
const AreaController = require('../controllers/areaController');
// const authMiddleware = require('../middleware/auth'); // COMENTA ESTA LÍNEA

const router = express.Router();

// router.use(authMiddleware); // COMENTA ESTA LÍNEA

router.get('/', AreaController.getAreas);
router.get('/jerarquia', AreaController.getAreasJerarquia);

module.exports = router;