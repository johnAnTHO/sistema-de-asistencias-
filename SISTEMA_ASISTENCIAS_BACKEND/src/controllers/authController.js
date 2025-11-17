const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

class AuthController {
  // Login de usuarios
  static async login(req, res) {
    try {
      const { dni, password } = req.body;

      // Validaciones básicas
      if (!dni || !password) {
        return res.status(400).json({ error: 'DNI y contraseña son requeridos' });
      }

      // Buscar usuario
      const usuario = await Usuario.findByDni(dni);
      if (!usuario) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // Verificar contraseña
      const passwordValido = await bcrypt.compare(password, usuario.password);
      if (!passwordValido) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // Generar token
      const token = jwt.sign(
        { 
          id: usuario.id, 
          dni: usuario.dni, 
          rol: usuario.rol,
          area_id: usuario.area_id
        },
        process.env.JWT_SECRET || 'secret_key_muni_sjb',
        { expiresIn: '8h' }
      );

      res.json({
        message: 'Login exitoso',
        token,
        usuario: {
          id: usuario.id,
          dni: usuario.dni,
          nombres: usuario.nombres,
          apellidos: usuario.apellidos,
          email: usuario.email,
          rol: usuario.rol,
          area_id: usuario.area_id,
          area_nombre: usuario.area_nombre
        }
      });

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Verificar token
  static async verifyToken(req, res) {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_muni_sjb');
      
      // Verificar que usuario aún existe
      const usuario = await Usuario.findById(decoded.id);
      if (!usuario) {
        return res.status(401).json({ error: 'Usuario no encontrado' });
      }

      res.json({ 
        valid: true, 
        usuario: {
          id: usuario.id,
          dni: usuario.dni,
          nombres: usuario.nombres,
          apellidos: usuario.apellidos,
          rol: usuario.rol,
          area_id: usuario.area_id
        }
      });

    } catch (error) {
      res.status(401).json({ error: 'Token inválido' });
    }
  }
}

module.exports = AuthController;