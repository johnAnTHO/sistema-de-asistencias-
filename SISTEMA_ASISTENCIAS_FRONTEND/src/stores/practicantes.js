import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const usePracticantesStore = defineStore('practicantes', () => {
  const practicantes = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Cargar todos los practicantes
  const cargarPracticantes = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${API_URL}/practicantes`);
      practicantes.value = response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar practicantes';
    } finally {
      loading.value = false;
    }
  };

  // Agregar nuevo practicante
  const agregarPracticante = async (practicanteData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post(`${API_URL}/practicantes`, practicanteData);
      practicantes.value.push(response.data);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al agregar practicante';
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // Actualizar practicante
  const actualizarPracticante = async (id, practicanteData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.put(`${API_URL}/practicantes/${id}`, practicanteData);
      const index = practicantes.value.findIndex(p => p.id === id);
      if (index !== -1) {
        practicantes.value[index] = response.data;
      }
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al actualizar practicante';
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // Eliminar practicante
  const eliminarPracticante = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      await axios.delete(`${API_URL}/practicantes/${id}`);
      practicantes.value = practicantes.value.filter(p => p.id !== id);
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al eliminar practicante';
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // Obtener estadísticas
  const obtenerEstadisticas = async () => {
    try {
      const response = await axios.get(`${API_URL}/practicantes/estadisticas`);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar estadísticas';
      throw error;
    }
  };

  return {
    practicantes,
    loading,
    error,
    cargarPracticantes,
    agregarPracticante,
    actualizarPracticante,
    eliminarPracticante,
    obtenerEstadisticas
  };
});