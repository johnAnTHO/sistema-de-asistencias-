const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (roles.length > 0 && !roles.includes(req.usuario.rol)) {
      return res.status(403).json({ 
        error: 'No tienes permisos para esta acción',
        rol_requerido: roles,
        tu_rol: req.usuario.rol
      });
    }

    next();
  };
};

// ✅ NUEVO: Middleware específico para practicantes (solo pueden acceder a sus datos)
const soloPropiosDatos = (req, res, next) => {
  if (req.usuario.rol === 'practicante' && req.usuario.id != req.params.id) {
    return res.status(403).json({ 
      error: 'Solo puedes acceder a tus propios datos' 
    });
  }
  next();
};

module.exports = { authorize, soloPropiosDatos };