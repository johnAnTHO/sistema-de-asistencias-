const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const pool = require('../config/database');

class UsuarioController {
  // Obtener todos los practicantes
  static async getPracticantes(req, res) {
    try {
      const practicantes = await Usuario.findAllPracticantes();
      
      res.json({
        total: practicantes.length,
        practicantes
      });

    } catch (error) {
      console.error('Error obteniendo practicantes:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Crear nuevo practicante
  static async createPracticante(req, res) {
    try {
      const { dni, nombres, apellidos, email, telefono, area_id, fecha_inicio_practicas, fecha_fin_practicas } = req.body;

      // Validaciones
      if (!dni || !nombres || !apellidos || !area_id) {
        return res.status(400).json({ error: 'DNI, nombres, apellidos y área son requeridos' });
      }

      // Verificar si DNI ya existe
      const dniExiste = await Usuario.dniExists(dni);
      if (dniExiste) {
        return res.status(400).json({ error: 'El DNI ya está registrado' });
      }

      // Hash de contraseña (DNI por defecto)
      const passwordHash = await bcrypt.hash(dni, 10);

      // Crear usuario
      const usuario = await Usuario.create({
        dni,
        nombres,
        apellidos,
        email,
        telefono,
        password: passwordHash,
        rol: 'practicante',
        area_id,
        fecha_inicio_practicas,
        fecha_fin_practicas
      });

      res.status(201).json({
        message: 'Practicante registrado exitosamente',
        usuario,
        password_temporal: dni
      });

    } catch (error) {
      console.error('Error creando practicante:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Actualizar datos biométricos
  static async updateBiometricos(req, res) {
    try {
      const { id } = req.params;
      const { huella_registrada, dedo_registrado, calidad_huella } = req.body;

      if (!huella_registrada || !dedo_registrado) {
        return res.status(400).json({ error: 'Datos biométricos incompletos' });
      }

      const usuario = await Usuario.updateBiometricos(id, {
        huella_registrada,
        dedo_registrado,
        calidad_huella
      });

      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      res.json({
        message: 'Datos biométricos actualizados',
        usuario
      });

    } catch (error) {
      console.error('Error actualizando biométricos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Obtener perfil completo del practicante
  static async getPerfilPracticante(req, res) {
    try {
      const { id } = req.params;

      // Verificar permisos: practicante solo puede ver su propio perfil
      if (req.usuario.rol === 'practicante' && req.usuario.id != id) {
        return res.status(403).json({ error: 'Solo puedes ver tu propio perfil' });
      }

      // Obtener datos del usuario con foto
      const usuarioResult = await pool.query(
        `SELECT id, dni, nombres, apellidos, email, telefono, foto_perfil, 
                area_id, fecha_inicio_practicas, fecha_fin_practicas,
                horario_maniana, horario_tarde, activo_horario_maniana, activo_horario_tarde
         FROM usuarios WHERE id = $1 AND activo = true`,
        [id]
      );

      if (usuarioResult.rows.length === 0) {
        return res.status(404).json({ error: 'Practicante no encontrado' });
      }

      // Obtener área
      const areaResult = await pool.query(
        'SELECT nombre FROM areas WHERE id = $1',
        [usuarioResult.rows[0].area_id]
      );

      // Obtener asistencias del último mes
      const asistenciasResult = await pool.query(
        `SELECT fecha, hora_entrada, hora_salida, estado, minutos_tardanza, 
                turno, justificacion, observaciones, tipo_registro_entrada
         FROM asistencias 
         WHERE usuario_id = $1 AND fecha >= CURRENT_DATE - INTERVAL '30 days'
         ORDER BY fecha DESC, turno DESC`,
        [id]
      );

      // Obtener estadísticas del mes actual
      const estadisticasResult = await pool.query(`
        SELECT 
          COUNT(*) as total_registros,
          COUNT(CASE WHEN estado = 'puntual' THEN 1 END) as puntuales,
          COUNT(CASE WHEN estado = 'tardanza' THEN 1 END) as tardanzas,
          COUNT(CASE WHEN estado = 'falta' THEN 1 END) as faltas,
          SUM(minutos_tardanza) as total_minutos_tardanza,
          ROUND(AVG(minutos_tardanza), 2) as promedio_tardanza
        FROM asistencias 
        WHERE usuario_id = $1 
          AND EXTRACT(YEAR FROM fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
          AND EXTRACT(MONTH FROM fecha) = EXTRACT(MONTH FROM CURRENT_DATE)
      `, [id]);

      res.json({
        practicante: {
          ...usuarioResult.rows[0],
          area_nombre: areaResult.rows[0]?.nombre || 'Sin área'
        },
        asistencias: asistenciasResult.rows,
        estadisticas: estadisticasResult.rows[0],
        total_asistencias: asistenciasResult.rows.length
      });

    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Actualizar foto de perfil
  static async actualizarFotoPerfil(req, res) {
    try {
      const { id } = req.params;
      const { foto_base64 } = req.body;

      // Verificar permisos
      if (req.usuario.rol === 'practicante' && req.usuario.id != id) {
        return res.status(403).json({ error: 'Solo puedes actualizar tu propia foto' });
      }

      if (!foto_base64) {
        return res.status(400).json({ error: 'Foto en base64 es requerida' });
      }

      const result = await pool.query(
        'UPDATE usuarios SET foto_perfil = $1 WHERE id = $2 RETURNING id, dni, nombres, apellidos, foto_perfil',
        [foto_base64, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      res.json({
        message: 'Foto de perfil actualizada exitosamente',
        usuario: result.rows[0]
      });

    } catch (error) {
      console.error('Error actualizando foto:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // ✅ CORREGIDO: Eliminar practicante (solo admin)
  static async deletePracticante(req, res) {
    try {
      const { id } = req.params;

      // Verificar que sea admin
      if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ error: 'Solo administradores pueden eliminar practicantes' });
      }

      // Verificar si el usuario existe y es practicante
      const usuarioResult = await pool.query(
        'SELECT id, dni, nombres, apellidos FROM usuarios WHERE id = $1 AND rol = $2',
        [id, 'practicante']
      );

      if (usuarioResult.rows.length === 0) {
        return res.status(404).json({ error: 'Practicante no encontrado' });
      }

      const practicante = usuarioResult.rows[0];

      // Eliminación suave (solo marca como inactivo)
      await pool.query(
        'UPDATE usuarios SET activo = false WHERE id = $1',
        [id]
      );

      res.json({
        message: 'Practicante eliminado exitosamente',
        practicante_eliminado: {
          id: practicante.id,
          dni: practicante.dni,
          nombres: practicante.nombres,
          apellidos: practicante.apellidos,
          fecha_eliminacion: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Error eliminando practicante:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = UsuarioController;