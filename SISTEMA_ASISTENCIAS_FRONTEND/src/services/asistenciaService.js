import api from './api';

export const asistenciaService = {
  // Registro biométrico/DNI
  registrarEntradaBiometrica(data) {
    return api.post('/asistencias/entrada/biometrica', data);
  },

  registrarSalidaBiometrica(data) {
    return api.post('/asistencias/salida/biometrica', data);
  },

  registrarEntradaDNI(data) {
    return api.post('/asistencias/entrada/dni', data);
  },

  registrarSalidaDNI(data) {
    return api.post('/asistencias/salida/dni', data);
  },

  // Para practicantes
  getMisAsistencias(params = {}) {
    return api.get('/asistencias/mis-asistencias', { params });
  },

  getMiResumen(mes, anio) {
    return api.get(`/asistencias/mi-resumen?mes=${mes}&anio=${anio}`);
  },

  // Para administradores
  registrarAsistenciaManual(data) {
    return api.post('/asistencias/manual', data);
  },

  getAsistenciasHoy() {
    return api.get('/asistencias/hoy');
  }
};