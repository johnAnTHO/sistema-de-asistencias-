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

  // Obtener mis asistencias (VERSIÓN ÚNICA Y CORRECTA)
  static async getMisAsistencias(req, res) {
    try {
      const usuario_id = req.usuario.id;
      const { fecha_inicio, fecha_fin, limite = 30 } = req.query;

      let query = `
        SELECT 
          fecha, turno, hora_entrada, hora_salida,
          minutos_tardanza, estado, observaciones,
          tipo_registro_entrada, tipo_registro_salida
        FROM asistencias 
        WHERE usuario_id = $1
      `;

      const params = [usuario_id];

      if (fecha_inicio && fecha_fin) {
        query += ' AND fecha BETWEEN $2 AND $3';
        params.push(fecha_inicio, fecha_fin);
      } else {
        query += ' AND fecha >= CURRENT_DATE - INTERVAL \'' + limite + ' days\'';
      }

      query += ' ORDER BY fecha DESC';

      const result = await pool.query(query, params);

      res.json({
        total_registros: result.rows.length,
        asistencias: result.rows
      });

    } catch (error) {
      console.error('Error obteniendo mis asistencias:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Registro manual de asistencia
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
          estado, minutos_tardanza, turno, observaciones
        ) VALUES ($1, $2, $3, $4, 'manual', 'manual', $5, $6, $7, $8)
        RETURNING *`,
        [usuario_id, fecha, hora_entrada, hora_salida, estado, minutos_tardanza, turno, observaciones]
      );

      res.status(201).json({
        message: 'Asistencia registrada manualmente',
        asistencia: result.rows[0]
      });

    } catch (error) {
      console.error('Error registrando asistencia manual:', error);
      res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
    }
  }

  // Eliminar asistencia
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

  // 📋 REGISTRO POR DNI ELECTRÓNICO - ENTRADA
  static async marcarEntradaDNI(req, res) {
    try {
      const { dni_codigo, dispositivo_id } = req.body;
      
      // Validaciones
      if (!dni_codigo) {
        return res.status(400).json({ error: 'Código DNI requerido' });
      }

      // Buscar usuario por DNI
      const usuarioResult = await pool.query(
        `SELECT id, dni, nombres, apellidos, rol, 
                horario_maniana, horario_tarde,
                activo_horario_maniana, activo_horario_tarde
         FROM usuarios 
         WHERE dni = $1 AND activo = true`,
        [dni_codigo]
      );

      if (usuarioResult.rows.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado o inactivo' });
      }

      const usuario = usuarioResult.rows[0];
      const usuario_id = usuario.id;
      const fecha_actual = new Date().toISOString().split('T')[0];
      const hora_actual = new Date().toTimeString().split(' ')[0];

      // Determinar turno automáticamente
      const turno = hora_actual < '12:00:00' ? 'mañana' : 'tarde';
      
      // Verificar si el usuario tiene activo este turno
      if ((turno === 'mañana' && !usuario.activo_horario_maniana) ||
          (turno === 'tarde' && !usuario.activo_horario_tarde)) {
        return res.status(400).json({ 
          error: `Usuario no tiene activo el turno de ${turno}` 
        });
      }

      // Verificar si ya marcó entrada hoy
      const yaMarcoResult = await pool.query(
        'SELECT id FROM asistencias WHERE usuario_id = $1 AND fecha = $2 AND hora_entrada IS NOT NULL',
        [usuario_id, fecha_actual]
      );

      if (yaMarcoResult.rows.length > 0) {
        return res.status(400).json({ error: 'Ya registró entrada hoy' });
      }

      // Calcular tardanza
      const horario_referencia = turno === 'mañana' ? '08:00:00' : '14:00:00';
      const [hora_ref, min_ref] = horario_referencia.split(':').map(Number);
      const [hora_ent, min_ent] = hora_actual.split(':').map(Number);
      
      const minutos_referencia = hora_ref * 60 + min_ref;
      const minutos_entrada = hora_ent * 60 + min_ent;
      const minutos_tardanza = Math.max(0, minutos_entrada - minutos_referencia - 15); // 15 min tolerancia

      const estado = minutos_tardanza > 0 ? 'tardanza' : 'puntual';

      // Registrar entrada por DNI
      const result = await pool.query(
        `INSERT INTO asistencias (
          usuario_id, fecha, hora_entrada, tipo_registro_entrada,
          dni_leido_entrada, dni_codigo_entrada, ip_entrada,
          dispositivo_entrada, turno, minutos_tardanza, estado
        ) VALUES ($1, $2, $3, 'dni_electronico', true, $4, $5, $6, $7, $8, $9)
        RETURNING *`,
        [
          usuario_id, fecha_actual, hora_actual, dni_codigo,
          req.ip, dispositivo_id, turno, minutos_tardanza, estado
        ]
      );

      res.status(201).json({
        message: 'Entrada registrada con DNI electrónico',
        data: {
          usuario: `${usuario.nombres} ${usuario.apellidos}`,
          hora_entrada: hora_actual,
          turno: turno,
          estado: estado,
          tardanza: minutos_tardanza > 0 ? `${minutos_tardanza} minutos` : 'A tiempo'
        }
      });

    } catch (error) {
      console.error('Error en registro DNI entrada:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // 📋 REGISTRO POR DNI ELECTRÓNICO - SALIDA
  static async marcarSalidaDNI(req, res) {
    try {
      const { dni_codigo, dispositivo_id } = req.body;
      
      if (!dni_codigo) {
        return res.status(400).json({ error: 'Código DNI requerido' });
      }

      // Buscar usuario
      const usuarioResult = await pool.query(
        'SELECT id FROM usuarios WHERE dni = $1 AND activo = true',
        [dni_codigo]
      );

      if (usuarioResult.rows.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const usuario_id = usuarioResult.rows[0].id;
      const fecha_actual = new Date().toISOString().split('T')[0];
      const hora_actual = new Date().toTimeString().split(' ')[0];

      // Buscar registro de entrada de hoy
      const registroResult = await pool.query(
        'SELECT * FROM asistencias WHERE usuario_id = $1 AND fecha = $2',
        [usuario_id, fecha_actual]
      );

      if (registroResult.rows.length === 0) {
        return res.status(400).json({ error: 'No tiene registro de entrada hoy' });
      }

      const registro = registroResult.rows[0];

      if (registro.hora_salida) {
        return res.status(400).json({ error: 'Ya registró salida hoy' });
      }

      // Actualizar salida
      const updateResult = await pool.query(
        `UPDATE asistencias SET 
          hora_salida = $1,
          tipo_registro_salida = 'dni_electronico',
          dni_leido_salida = true,
          dni_codigo_salida = $2,
          ip_salida = $3,
          dispositivo_salida = $4,
          estado = 'completo'
        WHERE usuario_id = $5 AND fecha = $6
        RETURNING *`,
        [hora_actual, dni_codigo, req.ip, dispositivo_id, usuario_id, fecha_actual]
      );

      res.json({
        message: 'Salida registrada con DNI electrónico',
        data: {
          hora_salida: hora_actual,
          registro_completo: true
        }
      });

    } catch (error) {
      console.error('Error en registro DNI salida:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // 👤 OBTENER MI RESUMEN (PRACTICANTE) - VERSIÓN ÚNICA Y CORREGIDA
  static async getMiResumen(req, res) {
    try {
      const usuario_id = req.usuario.id;
      const { mes, anio } = req.query; // Cambié "año" por "anio" para evitar problemas con la ñ

      // Validar parámetros requeridos
      if (!mes || !anio) {
        return res.status(400).json({ 
          error: 'Los parámetros "mes" y "anio" son requeridos. Ejemplo: ?mes=11&anio=2024' 
        });
      }

      // Validar que mes y año sean números
      const mesNum = parseInt(mes);
      const anioNum = parseInt(anio);
      
      if (isNaN(mesNum) || mesNum < 1 || mesNum > 12) {
        return res.status(400).json({ error: 'El parámetro "mes" debe ser un número entre 1 y 12' });
      }

      if (isNaN(anioNum) || anioNum < 2020 || anioNum > 2030) {
        return res.status(400).json({ error: 'El parámetro "anio" debe ser un número válido' });
      }

      const fecha_inicio = `${anioNum}-${mesNum.toString().padStart(2, '0')}-01`;
      
      // Calcular último día del mes
      const ultimoDia = new Date(anioNum, mesNum, 0).getDate();
      const fecha_fin = `${anioNum}-${mesNum.toString().padStart(2, '0')}-${ultimoDia}`;

      const result = await pool.query(
        `SELECT 
          COUNT(*) as total_dias,
          COUNT(CASE WHEN estado = 'puntual' THEN 1 END) as puntual,
          COUNT(CASE WHEN estado = 'tardanza' THEN 1 END) as tardanzas,
          COUNT(CASE WHEN estado = 'falta' THEN 1 END) as faltas,
          COALESCE(SUM(minutos_tardanza), 0) as total_minutos_tardanza
        FROM asistencias 
        WHERE usuario_id = $1 AND fecha BETWEEN $2 AND $3`,
        [usuario_id, fecha_inicio, fecha_fin]
      );

      const resumen = result.rows[0];

      res.json({
        periodo: { 
          mes: mesNum, 
          anio: anioNum,
          fecha_inicio: fecha_inicio,
          fecha_fin: fecha_fin
        },
        resumen: {
          total_dias: parseInt(resumen.total_dias) || 0,
          puntual: parseInt(resumen.puntual) || 0,
          tardanzas: parseInt(resumen.tardanzas) || 0,
          faltas: parseInt(resumen.faltas) || 0,
          total_minutos_tardanza: parseInt(resumen.total_minutos_tardanza) || 0
        }
      });

    } catch (error) {
      console.error('Error obteniendo mi resumen:', error);
      res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
    }
  }
}

module.exports = AsistenciaController;