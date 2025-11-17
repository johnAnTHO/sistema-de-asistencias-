import api from './api';

export const asistenciaService = {
  // Registrar entrada biométrica
  async marcarEntradaBiometrica(datosBiometricos) {
    const response = await api.post('/asistencias/entrada/biometrica', datosBiometricos);
    return response.data;
  },

  // Registrar salida biométrica  
  async marcarSalidaBiometrica(datosBiometricos) {
    const response = await api.post('/asistencias/salida/biometrica', datosBiometricos);
    return response.data;
  },

  // Obtener asistencias del día
  async getAsistenciasHoy() {
    const response = await api.get('/asistencias/hoy');
    return response.data;
  },

  // Obtener mis asistencias
  async getMisAsistencias() {
    const response = await api.get('/asistencias/mis-asistencias');
    return response.data;
  }
};