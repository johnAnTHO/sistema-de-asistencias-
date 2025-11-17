const pool = require('../config/database');

class Asistencia {
  // ✅ CORREGIDO: Registrar entrada biométrica
  static async registrarEntradaBiometrica(entradaData) {
    const { usuario_id, hora_entrada, match_score, calidad_lectura, dni_codigo, ip_entrada } = entradaData;
    
    const result = await pool.query(
      `INSERT INTO asistencias (
        usuario_id, fecha, hora_entrada, tipo_registro_entrada,
        dni_leido_entrada, huella_verificada_entrada, match_score_entrada,
        calidad_lectura_entrada, dni_codigo_entrada, ip_entrada
      ) VALUES ($1, CURRENT_DATE, $2, 'biometrico', true, true, $3, $4, $5, $6)
      RETURNING *`,
      [usuario_id, hora_entrada, match_score, calidad_lectura, dni_codigo, ip_entrada]
    );
    
    return result.rows[0];
  }

  // ✅ CORREGIDO: Registrar salida biométrica
  static async registrarSalidaBiometrica(salidaData) {
    const { usuario_id, hora_salida, match_score, calidad_lectura, dni_codigo, ip_salida } = salidaData;
    
    const result = await pool.query(
      `UPDATE asistencias SET 
        hora_salida = $1,
        tipo_registro_salida = 'biometrico',
        dni_leido_salida = true,
        huella_verificada_salida = true,
        match_score_salida = $2,
        calidad_lectura_salida = $3,
        dni_codigo_salida = $4,
        ip_salida = $5
      WHERE usuario_id = $6 AND fecha = CURRENT_DATE
      RETURNING *`,
      [hora_salida, match_score, calidad_lectura, dni_codigo, ip_salida, usuario_id]
    );
    
    if (result.rows.length === 0) {
      throw new Error('No se encontró registro de entrada para hoy');
    }
    
    return result.rows[0];
  }

  // Obtener asistencias de hoy
  static async getAsistenciasHoy() {
    const result = await pool.query(`
      SELECT * FROM vista_asistencias_hoy 
      ORDER BY area_nombre, nombre_completo
    `);
    
    return result.rows;
  }

  // Obtener asistencias por usuario y rango de fechas
  static async getByUsuarioYFechas(usuario_id, fecha_inicio, fecha_fin) {
    let query = `
      SELECT a.*, u.nombres, u.apellidos 
      FROM asistencias a
      JOIN usuarios u ON a.usuario_id = u.id
      WHERE a.usuario_id = $1
    `;
    let params = [usuario_id];

    if (fecha_inicio && fecha_fin) {
      query += ' AND a.fecha BETWEEN $2 AND $3';
      params.push(fecha_inicio, fecha_fin);
    } else {
      query += ' AND a.fecha >= CURRENT_DATE - INTERVAL \'30 days\'';
    }

    query += ' ORDER BY a.fecha DESC';

    const result = await pool.query(query, params);
    return result.rows;
  }

  // Verificar si ya marcó entrada hoy
  static async yaMarcoEntradaHoy(usuario_id) {
    const result = await pool.query(
      'SELECT id FROM asistencias WHERE usuario_id = $1 AND fecha = CURRENT_DATE AND hora_entrada IS NOT NULL',
      [usuario_id]
    );
    
    return result.rows.length > 0;
  }

  // Obtener registro de hoy del usuario
  static async getRegistroHoy(usuario_id) {
    const result = await pool.query(
      'SELECT * FROM asistencias WHERE usuario_id = $1 AND fecha = CURRENT_DATE',
      [usuario_id]
    );
    
    return result.rows[0];
  }

  // ✅ NUEVO: Calcular estado y minutos de tardanza con soporte para múltiples horarios
  static calcularEstadoYMinutos(hora_entrada, turno) {
    if (!hora_entrada) return { estado: 'falta', minutos_tardanza: 0 };
    
    // Definir horarios según turno
    const horarios = {
      'maniana': { entrada: '08:00:00', tolerancia: 10, salida: '12:00:00' },
      'tarde': { entrada: '14:00:00', tolerancia: 10, salida: '17:00:00' }
    };
    
    const horario = horarios[turno];
    if (!horario) return { estado: 'falta', minutos_tardanza: 0 };
    
    const [h_ent, m_ent, s_ent] = hora_entrada.split(':').map(Number);
    const [h_lim, m_lim, s_lim] = horario.entrada.split(':').map(Number);
    
    const entradaMinutos = h_ent * 60 + m_ent;
    const limiteMinutos = h_lim * 60 + m_lim;
    const diferencia = entradaMinutos - limiteMinutos;
    
    if (diferencia <= horario.tolerancia) {
      return { estado: 'puntual', minutos_tardanza: 0 };
    } else if (diferencia <= 180) { // Máximo 3 horas de tardanza
      return { estado: 'tardanza', minutos_tardanza: diferencia };
    } else {
      return { estado: 'falta', minutos_tardanza: 0 };
    }
  }
}

module.exports = Asistencia;