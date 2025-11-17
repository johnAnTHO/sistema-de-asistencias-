const pool = require('../config/database');

class Usuario {
  // Obtener usuario por ID
  static async findById(id) {
    const result = await pool.query(
      `SELECT u.*, a.nombre as area_nombre 
       FROM usuarios u 
       LEFT JOIN areas a ON u.area_id = a.id 
       WHERE u.id = $1 AND u.activo = true`,
      [id]
    );
    return result.rows[0];
  }

  // Obtener usuario por DNI
  static async findByDni(dni) {
    const result = await pool.query(
      `SELECT u.*, a.nombre as area_nombre 
       FROM usuarios u 
       LEFT JOIN areas a ON u.area_id = a.id 
       WHERE u.dni = $1 AND u.activo = true`,
      [dni]
    );
    return result.rows[0];
  }

  // Crear nuevo usuario
  static async create(usuarioData) {
    const { dni, nombres, apellidos, email, telefono, password, rol, area_id, fecha_inicio_practicas, fecha_fin_practicas } = usuarioData;
    
    const result = await pool.query(
      `INSERT INTO usuarios (
        dni, nombres, apellidos, email, telefono, password, rol, area_id,
        fecha_inicio_practicas, fecha_fin_practicas
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, dni, nombres, apellidos, email, rol, area_id`,
      [dni, nombres, apellidos, email, telefono, password, rol, area_id, fecha_inicio_practicas, fecha_fin_practicas]
    );
    
    return result.rows[0];
  }

  // Actualizar datos biométricos
  static async updateBiometricos(id, biometricData) {
    const { huella_registrada, dedo_registrado, calidad_huella } = biometricData;
    
    const result = await pool.query(
      `UPDATE usuarios SET 
        huella_registrada = $1,
        dedo_registrado = $2,
        calidad_huella = $3,
        huella_fecha_registro = CURRENT_TIMESTAMP
      WHERE id = $4 AND activo = true
      RETURNING id, dni, nombres, apellidos, dedo_registrado, calidad_huella`,
      [huella_registrada, dedo_registrado, calidad_huella, id]
    );
    
    return result.rows[0];
  }

  // Obtener todos los practicantes
  static async findAllPracticantes() {
    const result = await pool.query(`
      SELECT u.*, a.nombre as area_nombre 
      FROM usuarios u 
      LEFT JOIN areas a ON u.area_id = a.id 
      WHERE u.rol = 'practicante' AND u.activo = true
      ORDER BY u.apellidos, u.nombres
    `);
    
    return result.rows;
  }

  // Verificar si DNI existe
  static async dniExists(dni, excludeId = null) {
    let query = 'SELECT id FROM usuarios WHERE dni = $1 AND activo = true';
    let params = [dni];
    
    if (excludeId) {
      query += ' AND id != $2';
      params.push(excludeId);
    }
    
    const result = await pool.query(query, params);
    return result.rows.length > 0;
  }
}

module.exports = Usuario;