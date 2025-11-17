const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_muni_sjb');
    
    // Verificar que el usuario aún existe y está activo
    const result = await pool.query(
      'SELECT id, dni, nombres, apellidos, rol, area_id FROM usuarios WHERE id = $1 AND activo = true',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Token inválido. Usuario no encontrado.' });
    }

    req.usuario = result.rows[0];
    next();

  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = authMiddleware;