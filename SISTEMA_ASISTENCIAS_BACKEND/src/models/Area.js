const pool = require('../config/database');

class Area {
  // Obtener todas las áreas
  static async findAll() {
    const result = await pool.query(`
      SELECT a1.*, a2.nombre as area_padre_nombre,
        (SELECT COUNT(*) FROM usuarios u WHERE u.area_id = a1.id AND u.activo = true) as total_practicantes
      FROM areas a1
      LEFT JOIN areas a2 ON a1.area_padre_id = a2.id
      WHERE a1.activo = true
      ORDER BY a1.tipo, a1.nombre
    `);
    
    return result.rows;
  }

  // Obtener áreas con jerarquía
  static async findWithHierarchy() {
    const result = await pool.query(`
      WITH RECURSIVE area_tree AS (
        SELECT id, nombre, tipo, area_padre_id, 1 as nivel
        FROM areas 
        WHERE area_padre_id IS NULL AND activo = true
        
        UNION ALL
        
        SELECT a.id, a.nombre, a.tipo, a.area_padre_id, at.nivel + 1
        FROM areas a
        INNER JOIN area_tree at ON a.area_padre_id = at.id
        WHERE a.activo = true
      )
      SELECT * FROM area_tree ORDER BY nivel, nombre
    `);
    
    return result.rows;
  }

  // Obtener área por ID
  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM areas WHERE id = $1 AND activo = true',
      [id]
    );
    
    return result.rows[0];
  }
}

module.exports = Area;