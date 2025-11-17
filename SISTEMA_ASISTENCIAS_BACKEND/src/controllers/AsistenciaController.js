const Asistencia = require('../models/Asistencia');
const pool = require('../config/database');

class AsistenciaController {
  // Marcar entrada biométrica
  static async marcarEntradaBiometrica(req, res) {
    try {
      const { usuario_id, dni_codigo, match_score, calidad_lectura = 80 } = req.body;
      
      // Validaciones
      if (!usuario_id || !dni_codigo || match_score === undefined) {
        return res.status(400).json({ error: 'Datos incompletos' });
      }

      if (match_score < 0 || match_score > 100) {
        return res.status(400).json({ error: 'Score de coincidencia inválido' });
      }

      // Verificar si ya marcó entrada
      const yaMarcoEntrada = await Asistencia.yaMarcoEntradaHoy(usuario_id);
      if (yaMarcoEntrada) {
        return res.status(400).json({ error: 'Ya marcó entrada hoy' });
      }

      const hora_actual = new Date().toTimeString().split(' ')[0];

      // Registrar entrada
      const asistencia = await Asistencia.registrarEntradaBiometrica({
        usuario_id,
        hora_entrada: hora_actual,
        match_score,
        calidad_lectura,
        dni_codigo,
        ip_entrada: req.ip
      });

      res.status(201).json({
        message: 'Entrada registrada exitosamente',
        asistencia
      });

    } catch (error) {
      console.error('Error marcando entrada:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Marcar salida biométrica
  static async marcarSalidaBiometrica(req, res) {
    try {
      const { usuario_id, dni_codigo, match_score, calidad_lectura = 80 } = req.body;
      
      // Validaciones
      if (!usuario_id || !dni_codigo || match_score === undefined) {
        return res.status(400).json({ error: 'Datos incompletos' });
      }

      // Verificar si tiene entrada
      const registroHoy = await Asistencia.getRegistroHoy(usuario_id);
      if (!registroHoy) {
        return res.status(400).json({ error: 'No tiene registro de entrada hoy' });
      }

      if (registroHoy.hora_salida) {
        return res.status(400).json({ error: 'Ya marcó salida hoy' });
      }

      const hora_actual = new Date().toTimeString().split(' ')[0];

      // Registrar salida
      const asistencia = await Asistencia.registrarSalidaBiometrica({
        usuario_id,
        hora_salida: hora_actual,
        match_score,
        calidad_lectura,
        dni_codigo,
        ip_salida: req.ip
      });

      res.json({
        message: 'Salida registrada exitosamente',
        asistencia
      });

    } catch (error) {
      console.error('Error marcando salida:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Obtener asistencias de hoy
  static async getAsistenciasHoy(req, res) {
    try {
      const asistencias = await Asistencia.getAsistenciasHoy();
      
      res.json({
        fecha: new Date().toISOString().split('T')[0],
        asistencias
      });

    } catch (error) {
      console.error('Error obteniendo asistencias:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Obtener mis asistencias
  static async getMisAsistencias(req, res) {
    try {
      const { fecha_inicio, fecha_fin } = req.query;
      const usuario_id = req.usuario.rol === 'practicante' ? req.usuario.id : req.query.usuario_id;

      if (!usuario_id) {
        return res.status(400).json({ error: 'ID de usuario requerido' });
      }

      const asistencias = await Asistencia.getByUsuarioYFechas(usuario_id, fecha_inicio, fecha_fin);

      res.json({
        usuario_id,
        total_registros: asistencias.length,
        asistencias
      });

    } catch (error) {
      console.error('Error obteniendo asistencias:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // ✅ NUEVO: Registro manual de asistencia (Solo admin)
  static async registrarAsistenciaManual(req, res) {
    try {
      const { usuario_id, fecha, hora_entrada, hora_salida, turno, observaciones } = req.body;
      
      // Validar que sea admin
      if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ error: 'Solo administradores pueden registrar asistencias manuales' });
      }

      if (!usuario_id || !fecha || !turno) {
        return res.status(400).json({ error: 'Usuario ID, fecha y turno son requeridos' });
      }

      // Calcular estado automáticamente
      const { estado, minutos_tardanza } = Asistencia.calcularEstadoYMinutos(hora_entrada, turno);

      const result = await pool.query(
        `INSERT INTO asistencias (
          usuario_id, fecha, hora_entrada, hora_salida, 
          tipo_registro_entrada, tipo_registro_salida,
          estado, minutos_tardanza, turno, observaciones,
          registrado_por_entrada, registrado_por_salida
        ) VALUES ($1, $2, $3, $4, 'manual', 'manual', $5, $6, $7, $8, $9, $10)
        RETURNING *`,
        [usuario_id, fecha, hora_entrada, hora_salida, estado, minutos_tardanza, turno, observaciones, req.usuario.id, req.usuario.id]
      );

      res.status(201).json({
        message: 'Asistencia registrada manualmente',
        asistencia: result.rows[0]
      });

    } catch (error) {
      console.error('Error registrando asistencia manual:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // ✅ NUEVO: Eliminar asistencia (Solo admin)
  static async eliminarAsistencia(req, res) {
    try {
      const { id } = req.params;

      // Solo admin puede eliminar asistencias
      if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ error: 'Solo administradores pueden eliminar asistencias' });
      }

      const result = await pool.query(
        'DELETE FROM asistencias WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Asistencia no encontrada' });
      }

      res.json({
        message: 'Asistencia eliminada exitosamente',
        asistencia: result.rows[0]
      });

    } catch (error) {
      console.error('Error eliminando asistencia:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = AsistenciaController;