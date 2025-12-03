const pool = require('../config/database');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

class ReporteController {
  
  // 📊 GENERAR REPORTE DE ASISTENCIAS (PDF O EXCEL)
  static async generarReporteAsistencias(req, res) {
    try {
      if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ error: 'Solo administradores pueden generar reportes' });
      }

      const { formato, fecha_inicio, fecha_fin, turno, area_id } = req.query;

      // Validar fechas
      if (!fecha_inicio || !fecha_fin) {
        return res.status(400).json({ error: 'Las fechas inicio y fin son requeridas' });
      }

      // Construir query base
      let query = `
        SELECT 
          a.fecha, a.turno,
          u.dni, u.nombres, u.apellidos,
          a.hora_entrada, a.hora_salida,
          a.minutos_tardanza, a.estado,
          a.tipo_registro_entrada, a.tipo_registro_salida,
          ar.nombre as area_nombre
        FROM asistencias a
        JOIN usuarios u ON a.usuario_id = u.id
        LEFT JOIN areas ar ON u.area_id = ar.id
        WHERE a.fecha BETWEEN $1 AND $2
        AND u.rol = 'practicante'
      `;

      const params = [fecha_inicio, fecha_fin];

      // Agregar filtros opcionales
      if (turno && turno !== 'todos') {
        query += ' AND a.turno = $3';
        params.push(turno);
      }

      if (area_id && area_id !== 'todas') {
        query += ' AND u.area_id = $' + (params.length + 1);
        params.push(area_id);
      }

      query += ' ORDER BY a.fecha DESC, u.apellidos, u.nombres';

      const result = await pool.query(query, params);
      const asistencias = result.rows;

      if (formato === 'excel') {
        await ReporteController.generarExcel(asistencias, res, fecha_inicio, fecha_fin);
      } else if (formato === 'pdf') {
        await ReporteController.generarPDF(asistencias, res, fecha_inicio, fecha_fin);
      } else {
        res.json({
          reporte: 'formato_no_soportado',
          message: 'Formato no soportado. Use "excel" o "pdf"',
          datos: asistencias
        });
      }

    } catch (error) {
      console.error('Error generando reporte:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // 📊 GENERAR EXCEL
  static async generarExcel(asistencias, res, fecha_inicio, fecha_fin) {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Asistencias');

      // Estilos
      worksheet.columns = [
        { header: 'Fecha', key: 'fecha', width: 12 },
        { header: 'DNI', key: 'dni', width: 12 },
        { header: 'Nombres', key: 'nombres', width: 20 },
        { header: 'Apellidos', key: 'apellidos', width: 20 },
        { header: 'Área', key: 'area_nombre', width: 15 },
        { header: 'Turno', key: 'turno', width: 10 },
        { header: 'Entrada', key: 'hora_entrada', width: 10 },
        { header: 'Salida', key: 'hora_salida', width: 10 },
        { header: 'Tardanza (min)', key: 'minutos_tardanza', width: 12 },
        { header: 'Estado', key: 'estado', width: 12 },
        { header: 'Tipo Registro', key: 'tipo_registro', width: 15 }
      ];

      // Encabezados
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4472C4' }
      };

      // Datos
      asistencias.forEach(asistencia => {
        worksheet.addRow({
          fecha: asistencia.fecha,
          dni: asistencia.dni,
          nombres: asistencia.nombres,
          apellidos: asistencia.apellidos,
          area_nombre: asistencia.area_nombre || 'Sin área',
          turno: asistencia.turno,
          hora_entrada: asistencia.hora_entrada || '-',
          hora_salida: asistencia.hora_salida || '-',
          minutos_tardanza: asistencia.minutos_tardanza || 0,
          estado: asistencia.estado || 'sin registro',
          tipo_registro: `${asistencia.tipo_registro_entrada || 'N/A'}`
        });
      });

      // Configurar respuesta
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=reporte-asistencias-${fecha_inicio}-a-${fecha_fin}.xlsx`);

      await workbook.xlsx.write(res);
      res.end();

    } catch (error) {
      throw new Error('Error generando Excel: ' + error.message);
    }
  }

  // 📊 GENERAR PDF (VERSIÓN SIMPLIFICADA)
  static async generarPDF(asistencias, res, fecha_inicio, fecha_fin) {
    return res.status(501).json({ 
      error: 'Generación de PDF temporalmente no disponible',
      message: 'Use el formato Excel por ahora'
    });
  }
}

module.exports = ReporteController;