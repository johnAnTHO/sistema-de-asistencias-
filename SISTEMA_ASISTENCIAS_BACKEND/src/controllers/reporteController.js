const pool = require('../config/database');

class ReporteController {
  // Reporte general de asistencias
  static async getReporteAsistencias(req, res) {
    try {
      const { fecha_inicio, fecha_fin, area_id } = req.query;

      let query = `
        SELECT 
          u.dni,
          u.nombres || ' ' || u.apellidos as nombre_completo,
          a.nombre as area_nombre,
          COUNT(asist.id) as total_dias,
          COUNT(CASE WHEN asist.estado = 'completo' THEN 1 END) as dias_completos,
          COUNT(CASE WHEN asist.estado = 'tardanza' THEN 1 END) as tardanzas,
          COUNT(CASE WHEN asist.estado = 'falta' THEN 1 END) as faltas,
          ROUND(AVG(asist.minutos_tardanza), 2) as avg_tardanza,
          SUM(CASE 
            WHEN asist.hora_salida IS NOT NULL THEN 
              EXTRACT(EPOCH FROM (asist.hora_salida - asist.hora_entrada))/3600
            ELSE 0 
          END) as total_horas
        FROM usuarios u
        LEFT JOIN areas a ON u.area_id = a.id
        LEFT JOIN asistencias asist ON u.id = asist.usuario_id
        WHERE u.rol = 'practicante' AND u.activo = true
      `;

      let params = [];
      let paramCount = 0;

      if (fecha_inicio && fecha_fin) {
        paramCount += 2;
        query += ` AND asist.fecha BETWEEN $${paramCount-1} AND $${paramCount}`;
        params.push(fecha_inicio, fecha_fin);
      } else {
        query += ` AND asist.fecha >= CURRENT_DATE - INTERVAL '30 days'`;
      }

      if (area_id) {
        paramCount += 1;
        query += ` AND u.area_id = $${paramCount}`;
        params.push(area_id);
      }

      query += `
        GROUP BY u.id, u.dni, u.nombres, u.apellidos, a.nombre
        ORDER BY a.nombre, u.apellidos, u.nombres
      `;

      const result = await pool.query(query, params);

      res.json({
        fecha_generacion: new Date().toISOString(),
        parametros: { fecha_inicio, fecha_fin, area_id },
        total_practicantes: result.rows.length,
        reporte: result.rows
      });

    } catch (error) {
      console.error('Error generando reporte:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Reporte de tardanzas
  static async getReporteTardanzas(req, res) {
    try {
      const { fecha_inicio, fecha_fin } = req.query;

      const result = await pool.query(`
        SELECT 
          u.dni,
          u.nombres || ' ' || u.apellidos as nombre_completo,
          a.nombre as area_nombre,
          ast.fecha,
          ast.hora_entrada,
          ast.minutos_tardanza,
          ast.tipo_registro_entrada
        FROM asistencias ast
        JOIN usuarios u ON ast.usuario_id = u.id
        JOIN areas a ON u.area_id = a.id
        WHERE ast.minutos_tardanza > 0 
          AND ast.fecha BETWEEN $1 AND $2
        ORDER BY ast.minutos_tardanza DESC, ast.fecha DESC
      `, [fecha_inicio || '2024-01-01', fecha_fin || '2024-12-31']);

      res.json({
        total_tardanzas: result.rows.length,
        tardanzas: result.rows
      });

    } catch (error) {
      console.error('Error generando reporte de tardanzas:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // ✅ NUEVO: Exportar reporte de asistencias por practicante
  static async exportarReportePracticante(req, res) {
    try {
      const { usuario_id, fecha_inicio, fecha_fin, formato = 'pdf' } = req.query;

      if (!usuario_id || !fecha_inicio || !fecha_fin) {
        return res.status(400).json({ error: 'Usuario ID, fecha inicio y fecha fin son requeridos' });
      }

      // Obtener datos del practicante
      const usuarioResult = await pool.query(
        `SELECT u.*, a.nombre as area_nombre 
         FROM usuarios u 
         LEFT JOIN areas a ON u.area_id = a.id 
         WHERE u.id = $1`,
        [usuario_id]
      );

      if (usuarioResult.rows.length === 0) {
        return res.status(404).json({ error: 'Practicante no encontrado' });
      }

      // Obtener asistencias en el rango de fechas
      const asistenciasResult = await pool.query(
        `SELECT fecha, hora_entrada, hora_salida, estado, minutos_tardanza, 
                turno, justificacion, observaciones, tipo_registro_entrada
         FROM asistencias 
         WHERE usuario_id = $1 AND fecha BETWEEN $2 AND $3
         ORDER BY fecha, turno`,
        [usuario_id, fecha_inicio, fecha_fin]
      );

      // Calcular estadísticas
      const estadisticas = {
        total_dias: asistenciasResult.rows.length,
        puntuales: asistenciasResult.rows.filter(a => a.estado === 'puntual').length,
        tardanzas: asistenciasResult.rows.filter(a => a.estado === 'tardanza').length,
        faltas: asistenciasResult.rows.filter(a => a.estado === 'falta').length,
        total_minutos_tardanza: asistenciasResult.rows.reduce((sum, a) => sum + (a.minutos_tardanza || 0), 0)
      };

      const reporte = {
        practicante: usuarioResult.rows[0],
        periodo: { fecha_inicio, fecha_fin },
        asistencias: asistenciasResult.rows,
        estadisticas,
        fecha_generacion: new Date().toISOString(),
        generado_por: req.usuario.nombres + ' ' + req.usuario.apellidos
      };

      // Dependiendo del formato, generar diferente respuesta
      if (formato === 'json') {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=reporte-${usuarioResult.rows[0].dni}.json`);
        res.json(reporte);
      } else {
        // Para PDF necesitarías una librería como pdfkit
        res.json({
          message: 'Reporte generado (formato PDF requeriría librería adicional)',
          reporte: reporte
        });
      }

    } catch (error) {
      console.error('Error generando reporte:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = ReporteController;