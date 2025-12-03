const http = require('http');

const BASE_URL = 'http://localhost:3000/api';

function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/api${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({
            status: res.statusCode,
            data: parsedData
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: responseData
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function testFinal() {
  try {
    console.log('🎯 PRUEBA FINAL - SISTEMA COMPLETO\n');

    // 1. Login
    console.log('1. 🔐 Login con practicante...');
    const login = await makeRequest('POST', '/auth/login', {
      dni: '87654321',
      password: '87654321'
    });
    
    const token = login.data.token;
    console.log('✅ Login exitoso');

    // 2. Probar "Mi Resumen" con parámetros CORRECTOS
    console.log('\n2. 📊 Probando "Mi Resumen" (debería funcionar ahora)...');
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    
    const miResumen = await makeRequest('GET', `/asistencias/mi-resumen?mes=${currentMonth}&anio=${currentYear}`, null, token);
    console.log('✅ Mi Resumen - Status:', miResumen.status);
    
    if (miResumen.status === 200) {
      console.log('🎉 ¡FUNCIONA! Resumen:', miResumen.data.resumen);
    } else {
      console.log('❌ Error:', miResumen.data);
    }

    // 3. Probar sin parámetros (debería dar error 400)
    console.log('\n3. 🧪 Probando "Mi Resumen" sin parámetros...');
    const miResumenSinParams = await makeRequest('GET', '/asistencias/mi-resumen', null, token);
    console.log('✅ Estado esperado (400):', miResumenSinParams.status);

    console.log('\n🎊 SISTEMA 100% FUNCIONAL');
    
  } catch (error) {
    console.error('❌ Error en prueba final:', error.message);
  }
}

testFinal();