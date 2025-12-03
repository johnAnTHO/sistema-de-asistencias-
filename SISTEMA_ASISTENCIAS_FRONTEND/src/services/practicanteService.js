import api from './api';

export const practicanteService = {
  // CRUD de practicantes
  getPracticantes() {
    return api.get('/usuarios/practicantes');
  },

  createPracticante(data) {
    return api.post('/usuarios/practicantes', data);
  },

  updatePracticante(id, data) {
    return api.put(`/usuarios/practicantes/${id}`, data);
  },

  deletePracticante(id) {
    return api.delete(`/usuarios/practicantes/${id}`);
  },

  updateFoto(id, fotoBase64) {
    return api.patch(`/usuarios/${id}/foto`, { foto_base64: fotoBase64 });
  }
};