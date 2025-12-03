// src/services/reporteService.js
import api from './api'

export const reporteService = {
  async generarReportePDF(filtros) {
    try {
      console.log('📊 Generando reporte PDF con filtros:', filtros)
      
      // Opción 1: Si tu backend devuelve un PDF
      const response = await api.post('/reportes/pdf', filtros, {
        responseType: 'blob'
      })
      
      // Crear enlace para descargar
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `reporte-asistencias-${new Date().toISOString().split('T')[0]}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      return { success: true }
      
    } catch (error) {
      console.error('❌ Error generando PDF:', error)
      
      // Opción 2: Si el backend no está listo, generar PDF en frontend temporalmente
      alert('El backend de reportes PDF está en desarrollo. Por ahora, usa la exportación Excel.')
      
      return { success: false, error: 'Servicio de PDF no disponible' }
    }
  },
  
  async generarReporteExcel(filtros) {
    try {
      const response = await api.post('/reportes/excel', filtros, {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `reporte-asistencias-${new Date().toISOString().split('T')[0]}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      return { success: true }
      
    } catch (error) {
      console.error('❌ Error generando Excel:', error)
      
      // Generar Excel simple en frontend como fallback
      this.generarExcelFrontend(filtros)
      
      return { success: false, error: error.message }
    }
  },
  
  generarExcelFrontend(filtros) {
    // Lógica simple para generar Excel en frontend (usando sheetjs o similar)
    console.log('📝 Generando Excel en frontend con filtros:', filtros)
    
    // Ejemplo simple con tabla HTML
    const table = document.getElementById('tabla-reporte')
    if (table) {
      const html = table.outerHTML
      const blob = new Blob([html], { type: 'application/vnd.ms-excel' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'reporte-temp.xls')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } else {
      alert('Para exportar a Excel, primero muestra los datos en la tabla.')
    }
  }
}