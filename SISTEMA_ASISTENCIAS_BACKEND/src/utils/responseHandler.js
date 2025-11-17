// Utilidades para respuestas estandarizadas
class ResponseHandler {
  static success(res, data, message = 'Operación exitosa', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  static error(res, message = 'Error interno del servidor', statusCode = 500, details = null) {
    const response = {
      success: false,
      error: message
    };

    if (details && process.env.NODE_ENV === 'development') {
      response.details = details;
    }

    return res.status(statusCode).json(response);
  }

  static validationError(res, errors) {
    return res.status(400).json({
      success: false,
      error: 'Error de validación',
      details: errors
    });
  }
}

module.exports = ResponseHandler;