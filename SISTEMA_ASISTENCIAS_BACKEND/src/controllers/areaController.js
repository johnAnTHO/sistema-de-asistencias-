const Area = require('../models/Area');

class AreaController {
  // Obtener todas las áreas
  static async getAreas(req, res) {
    try {
      const areas = await Area.findAll();
      
      res.json({
        total: areas.length,
        areas
      });

    } catch (error) {
      console.error('Error obteniendo áreas:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Obtener áreas con jerarquía
  static async getAreasJerarquia(req, res) {
    try {
      const areas = await Area.findWithHierarchy();
      
      res.json({
        areas
      });

    } catch (error) {
      console.error('Error obteniendo jerarquía:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = AreaController;