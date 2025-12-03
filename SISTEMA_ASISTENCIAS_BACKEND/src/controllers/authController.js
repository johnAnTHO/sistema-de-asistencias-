// CORRIGE tu AuthController.js - VERSIÓN SIN CAMBIAR LA BD
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

class AuthController {
  static async login(req, res) {
    try {
      const { dni, password } = req.body;

      if (!dni || !password) {
        return res.status(400).json({ 
          success: false,
          error: 'DNI y contraseña son requeridos' 
        });
      }

      const usuario = await Usuario.findByDni(dni);
      if (!usuario) {
        return res.status(401).json({ 
          success: false,
          error: 'Credenciales inválidas' 
        });
      }

      const passwordValido = await bcrypt.compare(password, usuario.password);
      if (!passwordValido) {
        return res.status(401).json({ 
          success: false,
          error: 'Credenciales inválidas' 
        });
      }

      // 🎯 CRÍTICO: Calcular es_admin basado en rol
      const es_admin = usuario.rol === 'admin'; // true/false

      const token = jwt.sign(
        { 
          id: usuario.id, 
          dni: usuario.dni, 
          rol: usuario.rol,
          es_admin: es_admin  // ← Ahora sí es boolean
        },
        process.env.JWT_SECRET || 'secret_key_muni_sjb',
        { expiresIn: '8h' }
      );

      // 🎯 RESPUESTA EXACTA QUE EL FRONTEND NECESITA
      const response = {
        success: true,
        token: token,
        user: {
          id: usuario.id,
          dni: usuario.dni,
          nombres: usuario.nombres,
          apellidos: usuario.apellidos,
          email: usuario.email,
          rol: usuario.rol,
          es_admin: es_admin,  // ← boolean calculado
          area_id: usuario.area_id,
          area_nombre: usuario.area_nombre
        },
        message: 'Login exitoso'
      };

      console.log('✅ Login exitoso - Datos enviados:', {
        dni: response.user.dni,
        rol: response.user.rol,
        es_admin: response.user.es_admin,
        tipo: typeof response.user.es_admin
      });

      res.json(response);

    } catch (error) {
      console.error('🔥 Error en login:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error interno del servidor' 
      });
    }
  }

  static async verifyToken(req, res) {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ 
          success: false,
          error: 'Token no proporcionado' 
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_muni_sjb');
      
      const usuario = await Usuario.findById(decoded.id);
      if (!usuario) {
        return res.status(401).json({ 
          success: false,
          error: 'Usuario no encontrado' 
        });
      }

      // 🎯 Calcular es_admin aquí también
      const es_admin = usuario.rol === 'admin';

      res.json({ 
        valid: true,
        success: true,
        user: {
          id: usuario.id,
          dni: usuario.dni,
          nombres: usuario.nombres,
          apellidos: usuario.apellidos,
          rol: usuario.rol,
          es_admin: es_admin,  // ← boolean
          area_id: usuario.area_id
        }
      });

    } catch (error) {
      res.status(401).json({ 
        success: false,
        error: 'Token inválido' 
      });
    }
  }
}

module.exports = AuthController;