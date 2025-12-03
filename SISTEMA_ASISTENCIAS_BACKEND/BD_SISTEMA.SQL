-- ============================================
-- TABLA: AREAS
-- ============================================
CREATE TABLE areas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    area_padre_id INTEGER REFERENCES areas(id) ON DELETE SET NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: USUARIOS
-- ============================================
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    
    -- DATOS PERSONALES
    dni VARCHAR(8) UNIQUE NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    telefono VARCHAR(15),
    foto_perfil TEXT,
    
    -- CREDENCIALES
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'practicante', -- 'admin' o 'practicante'
    
    -- ÁREA
    area_id INTEGER NOT NULL REFERENCES areas(id) ON DELETE RESTRICT,
    
    -- DATOS DEL DNI ELECTRÓNICO (leídos del chip)
    dni_nombres_reniec VARCHAR(100),     -- Nombres según RENIEC
    dni_apellidos_reniec VARCHAR(100),   -- Apellidos según RENIEC
    dni_fecha_nacimiento DATE,
    dni_sexo CHAR(1),
    dni_direccion TEXT,
    dni_fecha_emision DATE,
    dni_fecha_caducidad DATE,
    dni_codigo_verificacion VARCHAR(20), -- CUI
    dni_foto TEXT,                       -- Foto del DNI (base64)
    dni_firma TEXT,                      -- Firma del DNI (base64)
    dni_leido BOOLEAN DEFAULT FALSE,     -- TRUE si se leyó del chip
    dni_fecha_lectura TIMESTAMP,
    
    -- HUELLAS DACTILARES (Templates en formato ISO/ANSI)
    huella_registrada TEXT,              -- Template principal de huella
    dedo_registrado VARCHAR(50),         -- Ejemplo: 'indice_derecho'
    calidad_huella INTEGER,              -- Score 0-100
    huella_fecha_registro TIMESTAMP,
    
    -- ESTADO Y FECHAS
    activo BOOLEAN DEFAULT TRUE,
    requiere_registro_manual BOOLEAN DEFAULT FALSE, -- TRUE si no puede usar biométrico
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_inicio_practicas DATE,
    fecha_fin_practicas DATE,
    
    CONSTRAINT check_calidad_huella CHECK (calidad_huella IS NULL OR (calidad_huella >= 0 AND calidad_huella <= 100))
);

-- ============================================
-- TABLA: ASISTENCIAS (Sistema Dual)
-- ============================================
CREATE TABLE asistencias (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    
    -- ===== ENTRADA =====
    hora_entrada TIME,
    tipo_registro_entrada VARCHAR(20), -- 'biometrico', 'manual'
    
    -- Si es BIOMÉTRICO (DNI + Huella)
    dni_leido_entrada BOOLEAN DEFAULT FALSE,
    huella_verificada_entrada BOOLEAN DEFAULT FALSE,
    match_score_entrada INTEGER,       -- Score de coincidencia huella (0-100)
    calidad_lectura_entrada INTEGER,   -- Calidad de la lectura
    dni_codigo_entrada VARCHAR(20),    -- Código de verificación del DNI
    
    -- Si es MANUAL
    registrado_por_entrada INTEGER REFERENCES usuarios(id), -- ID del admin que registró
    motivo_manual_entrada TEXT,        -- Por qué se registró manual
    
    -- DATOS ADICIONALES
    ip_entrada VARCHAR(45),
    dispositivo_entrada VARCHAR(200),
    observaciones_entrada TEXT,
    
    -- ===== SALIDA =====
    hora_salida TIME,
    tipo_registro_salida VARCHAR(20),  -- 'biometrico', 'manual'
    
    -- Si es BIOMÉTRICO
    dni_leido_salida BOOLEAN DEFAULT FALSE,
    huella_verificada_salida BOOLEAN DEFAULT FALSE,
    match_score_salida INTEGER,
    calidad_lectura_salida INTEGER,
    dni_codigo_salida VARCHAR(20),
    
    -- Si es MANUAL
    registrado_por_salida INTEGER REFERENCES usuarios(id),
    motivo_manual_salida TEXT,
    
    -- DATOS ADICIONALES
    ip_salida VARCHAR(45),
    dispositivo_salida VARCHAR(200),
    observaciones_salida TEXT,
    
    -- ===== CONTROL =====
    estado VARCHAR(20) DEFAULT 'incompleto', -- 'completo', 'incompleto', 'falta', 'tardanza'
    minutos_tardanza INTEGER DEFAULT 0,
    justificacion TEXT,
    
    -- METADATOS
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(usuario_id, fecha),
    
    CONSTRAINT check_tipo_entrada CHECK (tipo_registro_entrada IN ('biometrico', 'manual')),
    CONSTRAINT check_tipo_salida CHECK (tipo_registro_salida IN ('biometrico', 'manual'))
);

-- ============================================
-- TABLA: DISPOSITIVOS BIOMÉTRICOS
-- ============================================
CREATE TABLE dispositivos_biometricos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL,         -- 'lector_huella', 'lector_dni'
    modelo VARCHAR(100),
    numero_serie VARCHAR(100) UNIQUE,
    ubicacion VARCHAR(200),            -- Dónde está físicamente
    ip VARCHAR(45),
    puerto INTEGER,
    
    -- ESTADO
    activo BOOLEAN DEFAULT TRUE,
    en_linea BOOLEAN DEFAULT FALSE,
    ultimo_ping TIMESTAMP,
    
    -- CONFIGURACIÓN
    configuracion JSONB,               -- Parámetros específicos del dispositivo
    
    fecha_instalacion DATE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: CONFIGURACIÓN
-- ============================================
CREATE TABLE configuracion (
    id SERIAL PRIMARY KEY,
    clave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT,
    descripcion TEXT,
    tipo VARCHAR(50),
    categoria VARCHAR(50),             -- Para agrupar configuraciones
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Configuraciones iniciales
INSERT INTO configuracion (clave, valor, descripcion, tipo, categoria) VALUES
-- MODO DE REGISTRO
('permitir_registro_biometrico', 'true', 'Permitir marcado con DNI + Huella', 'boolean', 'modo_registro'),
('permitir_registro_manual', 'true', 'Permitir marcado manual por admin', 'boolean', 'modo_registro'),
('modo_preferido', 'biometrico', 'Modo preferido de registro', 'text', 'modo_registro'),

-- VALIDACIÓN BIOMÉTRICA
('requiere_dni_y_huella', 'true', 'Requiere AMBOS (DNI + Huella) para marcar', 'boolean', 'validacion'),
('umbral_match_huella', '70', 'Score mínimo de coincidencia de huella', 'number', 'validacion'),
('umbral_calidad_huella', '60', 'Calidad mínima de huella aceptada', 'number', 'validacion'),
('verificar_codigo_dni', 'true', 'Verificar código de verificación del DNI', 'boolean', 'validacion'),

-- HORARIOS
('hora_entrada_inicio', '07:00:00', 'Hora desde que se puede marcar entrada', 'time', 'horarios'),
('hora_entrada_limite', '09:00:00', 'Hora límite sin tardanza', 'time', 'horarios'),
('hora_entrada_max', '10:00:00', 'Hora máxima para marcar entrada', 'time', 'horarios'),
('hora_salida_min', '13:00:00', 'Hora mínima para marcar salida', 'time', 'horarios'),
('tolerancia_minutos', '10', 'Minutos de tolerancia para tardanza', 'number', 'horarios'),

-- SEGURIDAD
('intentos_maximos_huella', '3', 'Intentos máximos de huella antes de requerir manual', 'number', 'seguridad'),
('tiempo_bloqueo_minutos', '15', 'Minutos de espera tras intentos fallidos', 'number', 'seguridad'),
('registrar_ip', 'true', 'Registrar dirección IP en cada marcado', 'boolean', 'seguridad'),

-- NOTIFICACIONES
('notificar_tardanzas', 'true', 'Notificar al supervisor sobre tardanzas', 'boolean', 'notificaciones'),
('notificar_faltas', 'true', 'Notificar al supervisor sobre faltas', 'boolean', 'notificaciones'),
('email_rrhh', 'rrhh@munisjb.gob.pe', 'Email de recursos humanos', 'text', 'notificaciones');

-- ============================================
-- TABLA: AUDITORÍA
-- ============================================
CREATE TABLE auditoria (
    id SERIAL PRIMARY KEY,
    tabla VARCHAR(50) NOT NULL,
    registro_id INTEGER NOT NULL,
    usuario_id INTEGER REFERENCES usuarios(id),
    accion VARCHAR(20) NOT NULL,       -- 'INSERT', 'UPDATE', 'DELETE'
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    ip VARCHAR(45),
    descripcion TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INSERTAR ÁREAS (28 áreas)
-- ============================================

INSERT INTO areas (nombre, tipo, area_padre_id, descripcion) VALUES
('Alcaldía', 'ALCALDIA', NULL, 'Despacho de Alcaldía'),
('Oficina General de Atención al Ciudadano y Gestión Documentaria', 'OFICINA', NULL, 'Atención y gestión documentaria'),
('Oficina General de Administración', 'OFICINA', NULL, 'Administración general'),
('Oficina General de Asesoría Jurídica', 'OFICINA', NULL, 'Asesoría legal'),
('Oficina General de Planeamiento y Presupuesto', 'OFICINA', NULL, 'Planeamiento y presupuesto'),
('Oficina de Administración Financiera', 'SUBOFICINA', 3, 'Gestión financiera'),
('Oficina de Gestión de Recursos Humanos', 'SUBOFICINA', 3, 'Recursos humanos'),
('Oficina de Abastecimiento', 'SUBOFICINA', 3, 'Logística y abastecimiento'),
('Oficina TIC', 'SUBOFICINA', 3, 'Tecnologías de información'),
('Oficina de Planeamiento, Modernización e Inversiones', 'SUBOFICINA', 5, 'Planeamiento estratégico'),
('Oficina de Presupuesto', 'SUBOFICINA', 5, 'Gestión presupuestal'),
('Gerencia de Recaudación y Administración Tributaria', 'GERENCIA', NULL, 'Gestión tributaria municipal'),
('Subgerencia de Rentas', 'SUBGERENCIA', 12, 'Recaudación de rentas'),
('Subgerencia de Fiscalización Administrativa y Tributaria', 'SUBGERENCIA', 12, 'Fiscalización tributaria'),
('Subgerencia de Ejecución Coactiva', 'SUBGERENCIA', 12, 'Cobranza coactiva'),
('Gerencia de Desarrollo Territorial e Infraestructura', 'GERENCIA', NULL, 'Desarrollo urbano y obras'),
('Subgerencia de Desarrollo Territorial y Licencias', 'SUBGERENCIA', 16, 'Licencias y habilitaciones'),
('Subgerencia de Formulación de Estudios y Proyectos', 'SUBGERENCIA', 16, 'Estudios y proyectos'),
('Subgerencia de Infraestructura', 'SUBGERENCIA', 16, 'Obras de infraestructura'),
('Subgerencia de Supervisión y Liquidación de Proyectos', 'SUBGERENCIA', 16, 'Supervisión de obras'),
('Gerencia de Servicios Municipales y Gestión Ambiental', 'GERENCIA', NULL, 'Servicios públicos y ambiente'),
('Subgerencia de Participación y Seguridad Ciudadana', 'SUBGERENCIA', 21, 'Seguridad ciudadana'),
('Subgerencia de Servicios Municipales y Gestión Ambiental', 'SUBGERENCIA', 21, 'Limpieza y ambiente'),
('Subgerencia de Transportes y Seguridad Vial', 'SUBGERENCIA', 21, 'Transporte y tránsito'),
('Gerencia de Desarrollo Económico y Social', 'GERENCIA', NULL, 'Desarrollo social y económico'),
('Subgerencia de Desarrollo Económico y Productivo', 'SUBGERENCIA', 25, 'Desarrollo económico local'),
('Subgerencia de Comercio, Licencias y Control Sanitario', 'SUBGERENCIA', 25, 'Comercio y sanidad'),
('Subgerencia de Servicios y Programas Sociales', 'SUBGERENCIA', 25, 'Programas sociales');

-- ============================================
-- USUARIO ADMINISTRADOR INICIAL
-- ============================================
INSERT INTO usuarios (dni, nombres, apellidos, email, password, rol, area_id) VALUES
('00000000', 'Administrador', 'Sistema', 'admin@munisjb.gob.pe', 
'$2b$10$rKZJQQx0EqE3oJ6xqHGZM.YvL8YxZ8vK9Jq9mJKZ8vK9Jq9mJKZ8v', 
'admin', 7);

-- ============================================
-- DISPOSITIVOS BIOMÉTRICOS DE EJEMPLO
-- ============================================
INSERT INTO dispositivos_biometricos (nombre, tipo, modelo, numero_serie, ubicacion, activo) VALUES
('Lector DNI Principal', 'lector_dni', 'ACR122U', 'SN001', 'Recepción Principal', true),
('Lector Huella Principal', 'lector_huella', 'DigitalPersona U.are.U 4500', 'SN002', 'Recepción Principal', true);

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX idx_usuarios_dni ON usuarios(dni);
CREATE INDEX idx_usuarios_area ON usuarios(area_id);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_usuarios_activo ON usuarios(activo);

CREATE INDEX idx_asistencias_usuario ON asistencias(usuario_id);
CREATE INDEX idx_asistencias_fecha ON asistencias(fecha);
CREATE INDEX idx_asistencias_usuario_fecha ON asistencias(usuario_id, fecha);
CREATE INDEX idx_asistencias_estado ON asistencias(estado);
CREATE INDEX idx_asistencias_tipo_entrada ON asistencias(tipo_registro_entrada);
CREATE INDEX idx_asistencias_tipo_salida ON asistencias(tipo_registro_salida);

CREATE INDEX idx_areas_tipo ON areas(tipo);
CREATE INDEX idx_areas_activo ON areas(activo);

CREATE INDEX idx_auditoria_tabla ON auditoria(tabla);
CREATE INDEX idx_auditoria_fecha ON auditoria(fecha);

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista: Usuarios completa
CREATE VIEW vista_usuarios_completa AS
SELECT 
    u.id,
    u.dni,
    u.nombres,
    u.apellidos,
    u.nombres || ' ' || u.apellidos AS nombre_completo,
    u.email,
    u.telefono,
    u.rol,
    u.area_id,
    a.nombre AS area_nombre,
    a.tipo AS area_tipo,
    u.activo,
    u.dni_leido,
    u.fecha_inicio_practicas,
    u.fecha_fin_practicas,
    CASE WHEN u.huella_registrada IS NOT NULL THEN TRUE ELSE FALSE END AS tiene_huella,
    CASE WHEN u.dni_foto IS NOT NULL THEN TRUE ELSE FALSE END AS tiene_foto_dni,
    u.requiere_registro_manual
FROM usuarios u
LEFT JOIN areas a ON u.area_id = a.id;

-- Vista: Asistencias del día
CREATE VIEW vista_asistencias_hoy AS
SELECT 
    u.dni,
    u.nombres || ' ' || u.apellidos AS nombre_completo,
    a.nombre AS area_nombre,
    asis.hora_entrada,
    asis.hora_salida,
    asis.tipo_registro_entrada,
    asis.tipo_registro_salida,
    asis.estado,
    asis.minutos_tardanza,
    CASE 
        WHEN asis.hora_entrada IS NULL THEN '⏳ Sin marcar'
        WHEN asis.hora_salida IS NULL THEN '🟢 En curso'
        WHEN asis.estado = 'completo' THEN '✅ Completo'
        WHEN asis.estado = 'tardanza' THEN '⚠️ Tardanza'
        ELSE '❓ Revisar'
    END AS estado_visual,
    CASE 
        WHEN asis.tipo_registro_entrada = 'biometrico' THEN '🔐 DNI+Huella'
        WHEN asis.tipo_registro_entrada = 'manual' THEN '✍️ Manual'
        ELSE '-'
    END AS metodo_entrada
FROM usuarios u
LEFT JOIN areas a ON u.area_id = a.id
LEFT JOIN asistencias asis ON u.id = asis.usuario_id AND asis.fecha = CURRENT_DATE
WHERE u.rol = 'practicante' AND u.activo = TRUE
ORDER BY a.nombre, u.apellidos;

-- Vista: Resumen de asistencias
CREATE VIEW vista_resumen_asistencias AS
SELECT 
    u.id AS usuario_id,
    u.dni,
    u.nombres || ' ' || u.apellidos AS nombre_completo,
    a.nombre AS area_nombre,
    COUNT(asis.id) AS total_dias,
    COUNT(CASE WHEN asis.estado = 'completo' THEN 1 END) AS dias_completos,
    COUNT(CASE WHEN asis.estado = 'tardanza' THEN 1 END) AS tardanzas,
    COUNT(CASE WHEN asis.estado = 'falta' THEN 1 END) AS faltas,
    COUNT(CASE WHEN asis.tipo_registro_entrada = 'biometrico' THEN 1 END) AS marcados_biometrico,
    COUNT(CASE WHEN asis.tipo_registro_entrada = 'manual' THEN 1 END) AS marcados_manual,
    SUM(CASE 
        WHEN asis.hora_salida IS NOT NULL THEN 
            EXTRACT(EPOCH FROM (asis.hora_salida - asis.hora_entrada))/3600
        ELSE 0 
    END) AS total_horas
FROM usuarios u
LEFT JOIN areas a ON u.area_id = a.id
LEFT JOIN asistencias asis ON u.id = asis.usuario_id
WHERE u.rol = 'practicante' AND u.activo = TRUE
GROUP BY u.id, u.dni, u.nombres, u.apellidos, a.nombre;

-- ============================================
-- FUNCIONES
-- ============================================

-- Verificar si puede marcar entrada
CREATE OR REPLACE FUNCTION puede_marcar_entrada(p_usuario_id INTEGER)
RETURNS TABLE(puede BOOLEAN, mensaje TEXT) AS $$
DECLARE
    ya_marco BOOLEAN;
    hora_actual TIME;
    hora_max TIME;
BEGIN
    hora_actual := CURRENT_TIME;
    SELECT valor::TIME INTO hora_max FROM configuracion WHERE clave = 'hora_entrada_max';
    
    SELECT EXISTS(
        SELECT 1 FROM asistencias 
        WHERE usuario_id = p_usuario_id 
        AND fecha = CURRENT_DATE 
        AND hora_entrada IS NOT NULL
    ) INTO ya_marco;
    
    IF ya_marco THEN
        RETURN QUERY SELECT FALSE, 'Ya marcó entrada hoy';
    ELSIF hora_actual > hora_max THEN
        RETURN QUERY SELECT FALSE, 'Fuera del horario permitido';
    ELSE
        RETURN QUERY SELECT TRUE, 'Puede marcar entrada';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Verificar si puede marcar salida
CREATE OR REPLACE FUNCTION puede_marcar_salida(p_usuario_id INTEGER)
RETURNS TABLE(puede BOOLEAN, mensaje TEXT) AS $$
DECLARE
    tiene_entrada BOOLEAN;
    ya_marco_salida BOOLEAN;
BEGIN
    SELECT 
        EXISTS(SELECT 1 FROM asistencias 
               WHERE usuario_id = p_usuario_id 
               AND fecha = CURRENT_DATE 
               AND hora_entrada IS NOT NULL),
        EXISTS(SELECT 1 FROM asistencias 
               WHERE usuario_id = p_usuario_id 
               AND fecha = CURRENT_DATE 
               AND hora_salida IS NOT NULL)
    INTO tiene_entrada, ya_marco_salida;
    
    IF NOT tiene_entrada THEN
        RETURN QUERY SELECT FALSE, 'Debe marcar entrada primero';
    ELSIF ya_marco_salida THEN
        RETURN QUERY SELECT FALSE, 'Ya marcó salida hoy';
    ELSE
        RETURN QUERY SELECT TRUE, 'Puede marcar salida';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Calcular tardanza
CREATE OR REPLACE FUNCTION calcular_tardanza(p_hora_entrada TIME)
RETURNS INTEGER AS $$
DECLARE
    hora_limite TIME;
    tolerancia INTEGER;
    minutos_diff INTEGER;
BEGIN
    SELECT valor::TIME INTO hora_limite FROM configuracion WHERE clave = 'hora_entrada_limite';
    SELECT valor::INTEGER INTO tolerancia FROM configuracion WHERE clave = 'tolerancia_minutos';
    
    IF p_hora_entrada <= hora_limite THEN
        RETURN 0;
    END IF;
    
    minutos_diff := EXTRACT(EPOCH FROM (p_hora_entrada - hora_limite))/60;
    
    IF minutos_diff <= tolerancia THEN
        RETURN 0;
    ELSE
        RETURN minutos_diff - tolerancia;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Actualizar fecha de modificación
CREATE OR REPLACE FUNCTION actualizar_fecha_modificacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_asistencia
BEFORE UPDATE ON asistencias
FOR EACH ROW
EXECUTE FUNCTION actualizar_fecha_modificacion();

-- Calcular estado y tardanza automáticamente
CREATE OR REPLACE FUNCTION actualizar_estado_asistencia()
RETURNS TRIGGER AS $$
DECLARE
    tardanza INTEGER;
BEGIN
    -- Calcular tardanza si hay hora de entrada
    IF NEW.hora_entrada IS NOT NULL THEN
        NEW.minutos_tardanza := calcular_tardanza(NEW.hora_entrada);
    END IF;
    
    -- Actualizar estado
    IF NEW.hora_entrada IS NOT NULL AND NEW.hora_salida IS NOT NULL THEN
        IF NEW.minutos_tardanza > 0 THEN
            NEW.estado := 'tardanza';
        ELSE
            NEW.estado := 'completo';
        END IF;
    ELSIF NEW.hora_entrada IS NOT NULL AND NEW.hora_salida IS NULL THEN
        NEW.estado := 'incompleto';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_estado_asistencia
BEFORE INSERT OR UPDATE ON asistencias
FOR EACH ROW
EXECUTE FUNCTION actualizar_estado_asistencia();

-- Auditoría
CREATE OR REPLACE FUNCTION registrar_auditoria()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO auditoria (tabla, registro_id, accion, datos_nuevos, descripcion)
        VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', row_to_json(NEW), 'Registro creado');
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO auditoria (tabla, registro_id, accion, datos_anteriores, datos_nuevos, descripcion)
        VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', row_to_json(OLD), row_to_json(NEW), 'Registro actualizado');
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO auditoria (tabla, registro_id, accion, datos_anteriores, descripcion)
        VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', row_to_json(OLD), 'Registro eliminado');
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auditoria_usuarios
AFTER INSERT OR UPDATE OR DELETE ON usuarios
FOR EACH ROW EXECUTE FUNCTION registrar_auditoria();

CREATE TRIGGER trigger_auditoria_asistencias
AFTER INSERT OR UPDATE OR DELETE ON asistencias
FOR EACH ROW EXECUTE FUNCTION registrar_auditoria();

-- ============================================
-- FIN DEL SCRIPT
-- ============================================

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;


SELECT table_schema, table_name, table_type
FROM information_schema.tables
WHERE table_schema NOT IN ('pg_catalog', 'information_schema');

SELECT COUNT(*) AS total_tablas
FROM information_schema.tables
WHERE table_schema = 'public';