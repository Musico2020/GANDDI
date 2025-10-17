-- =============================================
-- BASE DE DATOS: ganddi_dashboard
-- DESCRIPCIÓN: Sistema de gestión de archivos para EPS
-- AUTOR: GandDI Team
-- FECHA: Noviembre 2023
-- =============================================

CREATE DATABASE IF NOT EXISTS ganddi_dashboard;
USE ganddi_dashboard;

-- =============================================
-- TABLA: roles
-- DESCRIPCIÓN: Almacena los tipos de roles del sistema
-- =============================================
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    permisos JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- TABLA: eps
-- DESCRIPCIÓN: Entidades Promotoras de Salud
-- =============================================
CREATE TABLE eps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nit VARCHAR(20) UNIQUE,
    direccion TEXT,
    telefono VARCHAR(20),
    email VARCHAR(255),
    contacto_principal VARCHAR(255),
    estado ENUM('activa', 'inactiva', 'suspendida') DEFAULT 'activa',
    logo_url VARCHAR(500),
    configuracion JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_eps_estado (estado),
    INDEX idx_eps_codigo (codigo)
);

-- =============================================
-- TABLA: usuarios
-- DESCRIPCIÓN: Usuarios del sistema
-- =============================================
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255),
    telefono VARCHAR(20),
    avatar_url VARCHAR(500),
    rol_id INT NOT NULL,
    eps_id INT,
    estado ENUM('activo', 'inactivo', 'bloqueado') DEFAULT 'activo',
    ultimo_acceso TIMESTAMP NULL,
    intentos_login INT DEFAULT 0,
    fecha_bloqueo TIMESTAMP NULL,
    preferencias JSON,
    token_recuperacion VARCHAR(255),
    token_expiracion TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE RESTRICT,
    FOREIGN KEY (eps_id) REFERENCES eps(id) ON DELETE SET NULL,
    INDEX idx_usuario_email (email),
    INDEX idx_usuario_estado (estado),
    INDEX idx_usuario_rol (rol_id),
    INDEX idx_usuario_eps (eps_id)
);

-- =============================================
-- TABLA: categorias_archivos
-- DESCRIPCIÓN: Categorías para organizar los archivos
-- =============================================
CREATE TABLE categorias_archivos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(50),
    color VARCHAR(7) DEFAULT '#0fce7c',
    eps_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (eps_id) REFERENCES eps(id) ON DELETE CASCADE,
    INDEX idx_categoria_eps (eps_id)
);

-- =============================================
-- TABLA: archivos
-- DESCRIPCIÓN: Archivos subidos al sistema
-- =============================================
CREATE TABLE archivos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_original VARCHAR(500) NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL UNIQUE,
    ruta_archivo VARCHAR(1000) NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    extension VARCHAR(10) NOT NULL,
    tamanio BIGINT NOT NULL,
    categoria_id INT,
    eps_id INT NOT NULL,
    usuario_id INT NOT NULL,
    estado ENUM('pendiente', 'revision', 'radicado', 'rechazado') DEFAULT 'pendiente',
    descripcion TEXT,
    etiquetas JSON,
    metadata JSON,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_revision TIMESTAMP NULL,
    fecha_radicado TIMESTAMP NULL,
    motivo_rechazo TEXT,
    revisado_por INT NULL,
    version INT DEFAULT 1,
    archivo_padre_id INT NULL,
    checksum VARCHAR(64),
    descargas INT DEFAULT 0,
    FOREIGN KEY (categoria_id) REFERENCES categorias_archivos(id) ON DELETE SET NULL,
    FOREIGN KEY (eps_id) REFERENCES eps(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (revisado_por) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (archivo_padre_id) REFERENCES archivos(id) ON DELETE SET NULL,
    INDEX idx_archivo_eps (eps_id),
    INDEX idx_archivo_usuario (usuario_id),
    INDEX idx_archivo_estado (estado),
    INDEX idx_archivo_fecha (fecha_subida),
    INDEX idx_archivo_tipo (tipo),
    INDEX idx_archivo_categoria (categoria_id)
);

-- =============================================
-- TABLA: historial_archivos
-- DESCRIPCIÓN: Historial de cambios en archivos
-- =============================================
CREATE TABLE historial_archivos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    archivo_id INT NOT NULL,
    usuario_id INT NOT NULL,
    accion ENUM('creacion', 'actualizacion', 'cambio_estado', 'descarga', 'rechazo') NOT NULL,
    estado_anterior VARCHAR(50),
    estado_nuevo VARCHAR(50),
    descripcion TEXT,
    metadata JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (archivo_id) REFERENCES archivos(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_historial_archivo (archivo_id),
    INDEX idx_historial_usuario (usuario_id),
    INDEX idx_historial_fecha (created_at)
);

-- =============================================
-- TABLA: sesiones
-- DESCRIPCIÓN: Sesiones activas de usuarios
-- =============================================
CREATE TABLE sesiones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    dispositivo VARCHAR(255),
    navegador VARCHAR(255),
    sistema_operativo VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    ubicacion JSON,
    expires_at TIMESTAMP NOT NULL,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_sesiones_usuario (usuario_id),
    INDEX idx_sesiones_token (token),
    INDEX idx_sesiones_expiracion (expires_at)
);

-- =============================================
-- TABLA: notificaciones
-- DESCRIPCIÓN: Sistema de notificaciones
-- =============================================
CREATE TABLE notificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    tipo ENUM('info', 'success', 'warning', 'error', 'sistema') DEFAULT 'info',
    leida BOOLEAN DEFAULT FALSE,
    accion_url VARCHAR(500),
    metadata JSON,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_notificaciones_usuario (usuario_id),
    INDEX idx_notificaciones_leida (leida),
    INDEX idx_notificaciones_fecha (created_at)
);

-- =============================================
-- TABLA: configuraciones
-- DESCRIPCIÓN: Configuraciones del sistema
-- =============================================
CREATE TABLE configuraciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clave VARCHAR(255) UNIQUE NOT NULL,
    valor TEXT,
    tipo ENUM('string', 'number', 'boolean', 'json', 'array') DEFAULT 'string',
    descripcion TEXT,
    categoria VARCHAR(100) DEFAULT 'general',
    editable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_configuracion_clave (clave),
    INDEX idx_configuracion_categoria (categoria)
);

-- =============================================
-- TABLA: logs_sistema
-- DESCRIPCIÓN: Logs de actividad del sistema
-- =============================================
CREATE TABLE logs_sistema (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nivel ENUM('debug', 'info', 'warning', 'error', 'critical') DEFAULT 'info',
    mensaje TEXT NOT NULL,
    contexto JSON,
    usuario_id INT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    url VARCHAR(500),
    metodo VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_logs_nivel (nivel),
    INDEX idx_logs_usuario (usuario_id),
    INDEX idx_logs_fecha (created_at)
);

-- =============================================
-- TABLA: backups
-- DESCRIPCIÓN: Registro de backups del sistema
-- =============================================
CREATE TABLE backups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL,
    tamanio BIGINT NOT NULL,
    tipo ENUM('completo', 'base_datos', 'archivos') DEFAULT 'completo',
    estado ENUM('en_progreso', 'completado', 'fallido') DEFAULT 'en_progreso',
    usuario_id INT NULL,
    notas TEXT,
    checksum VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_backups_tipo (tipo),
    INDEX idx_backups_estado (estado),
    INDEX idx_backups_fecha (created_at)
);

-- =============================================
-- INSERCIÓN DE DATOS INICIALES
-- =============================================

-- Insertar roles del sistema
INSERT INTO roles (id, nombre, descripcion, permisos) VALUES 
(1, 'administrador', 'Administrador del sistema con acceso completo', '{"usuarios": ["crear", "leer", "actualizar", "eliminar"], "archivos": ["crear", "leer", "actualizar", "eliminar", "radicar"], "eps": ["crear", "leer", "actualizar", "eliminar"], "configuracion": ["leer", "actualizar"], "reportes": ["generar"]}'),
(2, 'eps', 'Usuario de EPS con permisos limitados', '{"archivos": ["crear", "leer", "descargar"], "perfil": ["leer", "actualizar"]}'),
(3, 'auditor', 'Rol para auditoría del sistema', '{"archivos": ["leer"], "reportes": ["generar"], "logs": ["leer"]}');

-- Insertar EPS de ejemplo
INSERT INTO eps (id, nombre, codigo, nit, direccion, telefono, email, contacto_principal, estado) VALUES 
(1, 'EPS Sanitas', 'SANITAS', '860.000.123-4', 'Calle 100 # 10-20, Bogotá', '+57 1 1234567', 'contacto@epssanitas.com', 'María González', 'activa'),
(2, 'EPS Sura', 'SURA', '860.000.234-5', 'Av. El Dorado # 68-30, Bogotá', '+57 1 2345678', 'info@epssura.com', 'Carlos Rodríguez', 'activa'),
(3, 'EPS Coomeva', 'COOMEVA', '860.000.345-6', 'Carrera 50 # 10-30, Medellín', '+57 4 3456789', 'servicio@coomeva.com', 'Ana Martínez', 'activa'),
(4, 'EPS Nueva EPS', 'NUEVA_EPS', '860.000.456-7', 'Calle 24 # 10-40, Cali', '+57 2 4567890', 'atencion@nuevaeps.com', 'Pedro López', 'activa'),
(5, 'EPS Salud Total', 'SALUD_TOTAL', '860.000.567-8', 'Av. 68 # 10-50, Barranquilla', '+57 5 5678901', 'contacto@saludtotal.com', 'Laura García', 'activa');

-- Insertar categorías de archivos por defecto
INSERT INTO categorias_archivos (nombre, descripcion, icono, color) VALUES 
('Reportes Epidemiológicos', 'Reportes y análisis de datos epidemiológicos', '📊', '#0fce7c'),
('Indicadores de Gestión', 'Métricas e indicadores de desempeño', '📈', '#ffd700'),
('Documentos Administrativos', 'Documentación administrativa y legal', '📋', '#4cc9f0'),
('Estadísticas Mensuales', 'Estadísticas y reportes mensuales', '📅', '#f72585'),
('Proyecciones y Pronósticos', 'Análisis predictivo y proyecciones', '🔮', '#7209b7'),
('Auditorías', 'Documentos de auditoría y control', '🔍', '#f8961e');

-- Insertar usuarios demo (contraseñas: 'password123')
INSERT INTO usuarios (id, email, password, nombre, apellido, telefono, rol_id, eps_id, estado, preferencias) VALUES 
(1, 'admin@ganddi.com', '$2y$10$r3B2uV5sW8qL9mN1cX7pz.FfG6hJ8kL2mN4bV6cX8zM9nL1pQ3rT5y', 'Admin', 'Principal', '+57 1 1111111', 1, NULL, 'activo', '{"tema_oscuro": true, "notificaciones_email": true, "idioma": "es", "timezone": "America/Bogota"}'),
(2, 'sanitas@ganddi.com', '$2y$10$r3B2uV5sW8qL9mN1cX7pz.FfG6hJ8kL2mN4bV6cX8zM9nL1pQ3rT5y', 'Carlos', 'Mendoza', '+57 1 2222222', 2, 1, 'activo', '{"tema_oscuro": false, "notificaciones_email": true, "idioma": "es", "timezone": "America/Bogota"}'),
(3, 'sura@ganddi.com', '$2y$10$r3B2uV5sW8qL9mN1cX7pz.FfG6hJ8kL2mN4bV6cX8zM9nL1pQ3rT5y', 'Ana', 'Rodríguez', '+57 1 3333333', 2, 2, 'activo', '{"tema_oscuro": true, "notificaciones_email": false, "idioma": "es", "timezone": "America/Bogota"}'),
(4, 'coomeva@ganddi.com', '$2y$10$r3B2uV5sW8qL9mN1cX7pz.FfG6hJ8kL2mN4bV6cX8zM9nL1pQ3rT5y', 'Miguel', 'Torres', '+57 4 4444444', 2, 3, 'activo', '{"tema_oscuro": false, "notificaciones_email": true, "idioma": "es", "timezone": "America/Bogota"}'),
(5, 'auditor@ganddi.com', '$2y$10$r3B2uV5sW8qL9mN1cX7pz.FfG6hJ8kL2mN4bV6cX8zM9nL1pQ3rT5y', 'Laura', 'Fernández', '+57 1 5555555', 3, NULL, 'activo', '{"tema_oscuro": true, "notificaciones_email": true, "idioma": "es", "timezone": "America/Bogota"}');

-- Insertar archivos de ejemplo
INSERT INTO archivos (nombre_original, nombre_archivo, ruta_archivo, tipo, extension, tamanio, categoria_id, eps_id, usuario_id, estado, descripcion, fecha_radicado) VALUES 
('Reporte_Epidemiologico_Q3_2023.pdf', 'reporte_epid_q3_2023_12345.pdf', 'uploads/eps_1/reporte_epid_q3_2023_12345.pdf', 'application/pdf', 'pdf', 2450000, 1, 1, 2, 'radicado', 'Reporte epidemiológico del tercer trimestre 2023 para EPS Sanitas', '2023-11-15 10:30:00'),
('Indicadores_Gestion_Octubre.xlsx', 'indicadores_gestion_oct_67890.xlsx', 'uploads/eps_1/indicadores_gestion_oct_67890.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'xlsx', 1850000, 2, 1, 2, 'pendiente', 'Indicadores de gestión del mes de octubre 2023', NULL),
('Analisis_Datos_Septiembre.pdf', 'analisis_datos_sep_54321.pdf', 'uploads/eps_2/analisis_datos_sep_54321.pdf', 'application/pdf', 'pdf', 3200000, 1, 2, 3, 'radicado', 'Análisis de datos del mes de septiembre 2023', '2023-11-10 14:20:00'),
('Proyecciones_2024.xlsx', 'proyecciones_2024_98765.xlsx', 'uploads/eps_3/proyecciones_2024_98765.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'xlsx', 1500000, 5, 3, 4, 'revision', 'Proyecciones estadísticas para el año 2024', NULL),
('Auditoria_Q2_2023.pdf', 'auditoria_q2_2023_13579.pdf', 'uploads/eps_2/auditoria_q2_2023_13579.pdf', 'application/pdf', 'pdf', 4100000, 6, 2, 3, 'radicado', 'Informe de auditoría del segundo trimestre 2023', '2023-11-12 09:15:00');

-- Insertar configuraciones del sistema
INSERT INTO configuraciones (clave, valor, tipo, descripcion, categoria) VALUES 
('app_nombre', 'GandDI Dashboard', 'string', 'Nombre de la aplicación', 'general'),
('app_descripcion', 'Sistema de gestión de archivos para EPS', 'string', 'Descripción de la aplicación', 'general'),
('app_version', '1.0.0', 'string', 'Versión de la aplicación', 'general'),
('upload_max_size', '10485760', 'number', 'Tamaño máximo de archivos en bytes', 'archivos'),
('upload_allowed_types', '["pdf", "doc", "docx", "xls", "xlsx", "jpg", "jpeg", "png", "txt"]', 'json', 'Tipos de archivo permitidos', 'archivos'),
('session_timeout', '3600', 'number', 'Tiempo de expiración de sesión en segundos', 'seguridad'),
('login_attempts_limit', '5', 'number', 'Límite de intentos de login fallidos', 'seguridad'),
('password_min_length', '8', 'number', 'Longitud mínima de contraseña', 'seguridad'),
('notifications_enabled', 'true', 'boolean', 'Habilitar notificaciones del sistema', 'notificaciones'),
('backup_auto', 'true', 'boolean', 'Backup automático habilitado', 'backup'),
('backup_frequency', 'daily', 'string', 'Frecuencia de backups automáticos', 'backup'),
('maintenance_mode', 'false', 'boolean', 'Modo mantenimiento del sistema', 'general');

-- Insertar notificaciones de ejemplo
INSERT INTO notificaciones (usuario_id, titulo, mensaje, tipo, accion_url) VALUES 
(2, 'Archivo Radicado', 'Su archivo "Reporte_Epidemiologico_Q3_2023.pdf" ha sido radicado exitosamente', 'success', '/dashboard/archivos/1'),
(3, 'Nuevo Archivo Pendiente', 'Tiene un nuevo archivo pendiente de revisión: "Analisis_Datos_Septiembre.pdf"', 'info', '/dashboard/archivos/3'),
(1, 'Backup Completado', 'El backup automático del sistema se ha completado exitosamente', 'success', '/admin/backups');

-- Insertar logs del sistema
INSERT INTO logs_sistema (nivel, mensaje, usuario_id, ip_address, url) VALUES 
('info', 'Usuario admin@ganddi.com inició sesión exitosamente', 1, '190.120.45.67', '/login'),
('info', 'Archivo subido: Reporte_Epidemiologico_Q3_2023.pdf', 2, '190.120.45.68', '/dashboard/upload'),
('info', 'Archivo radicado: Reporte_Epidemiologico_Q3_2023.pdf', 1, '190.120.45.67', '/admin/archivos/1/radicar');

-- =============================================
-- VISTAS ÚTILES
-- =============================================

-- Vista para estadísticas de archivos por EPS
CREATE VIEW vista_estadisticas_eps AS
SELECT 
    e.id,
    e.nombre as eps_nombre,
    e.codigo as eps_codigo,
    COUNT(a.id) as total_archivos,
    SUM(CASE WHEN a.estado = 'radicado' THEN 1 ELSE 0 END) as archivos_radicados,
    SUM(CASE WHEN a.estado = 'pendiente' THEN 1 ELSE 0 END) as archivos_pendientes,
    SUM(CASE WHEN a.estado = 'revision' THEN 1 ELSE 0 END) as archivos_revision,
    SUM(CASE WHEN a.estado = 'rechazado' THEN 1 ELSE 0 END) as archivos_rechazados,
    COALESCE(SUM(a.tamanio), 0) as total_tamanio,
    COUNT(DISTINCT a.usuario_id) as usuarios_activos,
    MAX(a.fecha_subida) as ultima_actividad
FROM eps e
LEFT JOIN archivos a ON e.id = a.eps_id
GROUP BY e.id, e.nombre, e.codigo;

-- Vista para dashboard de usuario
CREATE VIEW vista_dashboard_usuario AS
SELECT 
    u.id as usuario_id,
    u.email,
    u.nombre,
    u.rol_id,
    r.nombre as rol_nombre,
    u.eps_id,
    e.nombre as eps_nombre,
    COUNT(a.id) as total_archivos,
    SUM(CASE WHEN a.estado = 'radicado' THEN 1 ELSE 0 END) as archivos_radicados,
    SUM(CASE WHEN a.estado = 'pendiente' THEN 1 ELSE 0 END) as archivos_pendientes,
    COALESCE(SUM(a.tamanio), 0) as total_tamanio,
    MAX(a.fecha_subida) as ultima_subida
FROM usuarios u
LEFT JOIN roles r ON u.rol_id = r.id
LEFT JOIN eps e ON u.eps_id = e.id
LEFT JOIN archivos a ON u.id = a.usuario_id
GROUP BY u.id, u.email, u.nombre, u.rol_id, r.nombre, u.eps_id, e.nombre;

-- =============================================
-- PROCEDIMIENTOS ALMACENADOS
-- =============================================

-- Procedimiento para generar reporte mensual
DELIMITER //
CREATE PROCEDURE generar_reporte_mensual(IN mes INT, IN anio INT)
BEGIN
    SELECT 
        e.nombre as eps_nombre,
        COUNT(a.id) as total_archivos,
        SUM(CASE WHEN a.estado = 'radicado' THEN 1 ELSE 0 END) as radicados,
        SUM(CASE WHEN a.estado = 'pendiente' THEN 1 ELSE 0 END) as pendientes,
        COALESCE(SUM(a.tamanio), 0) as tamanio_total,
        COUNT(DISTINCT a.usuario_id) as usuarios_activos
    FROM eps e
    LEFT JOIN archivos a ON e.id = a.eps_id 
        AND MONTH(a.fecha_subida) = mes 
        AND YEAR(a.fecha_subida) = anio
    GROUP BY e.id, e.nombre
    ORDER BY total_archivos DESC;
END //
DELIMITER ;

-- Procedimiento para limpiar sesiones expiradas
DELIMITER //
CREATE PROCEDURE limpiar_sesiones_expiradas()
BEGIN
    DELETE FROM sesiones WHERE expires_at < NOW();
END //
DELIMITER ;

-- =============================================
-- TRIGGERS
-- =============================================

-- Trigger para actualizar fecha de último acceso
DELIMITER //
CREATE TRIGGER actualizar_ultimo_acceso 
AFTER INSERT ON sesiones
FOR EACH ROW
BEGIN
    UPDATE usuarios 
    SET ultimo_acceso = NOW() 
    WHERE id = NEW.usuario_id;
END //
DELIMITER ;

-- Trigger para registrar cambios en archivos
DELIMITER //
CREATE TRIGGER registrar_cambio_archivo
AFTER UPDATE ON archivos
FOR EACH ROW
BEGIN
    IF OLD.estado != NEW.estado THEN
        INSERT INTO historial_archivos (archivo_id, usuario_id, accion, estado_anterior, estado_nuevo, descripcion)
        VALUES (NEW.id, NEW.usuario_id, 'cambio_estado', OLD.estado, NEW.estado, CONCAT('Cambio de estado: ', OLD.estado, ' → ', NEW.estado));
    END IF;
END //
DELIMITER ;

-- =============================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- =============================================

CREATE INDEX idx_archivos_fecha_estado ON archivos(fecha_subida, estado);
CREATE INDEX idx_usuarios_rol_estado ON usuarios(rol_id, estado);
CREATE INDEX idx_notificaciones_usuario_leida ON notificaciones(usuario_id, leida);
CREATE INDEX idx_historial_fecha_accion ON historial_archivos(created_at, accion);

-- =============================================
-- PERMISOS DE USUARIO DE LA BASE DE DATOS
-- =============================================

-- Crear usuario para la aplicación (reemplazar 'password_segura' con una contraseña real)
CREATE USER 'ganddi_app'@'localhost' IDENTIFIED BY 'password_segura';
GRANT SELECT, INSERT, UPDATE, DELETE ON ganddi_dashboard.* TO 'ganddi_app'@'localhost';
FLUSH PRIVILEGES;

-- =============================================
-- SCRIPT DE MIGRACIÓN (OPCIONAL)
-- =============================================

-- Este script puede ser ejecutado para actualizar la base de datos en futuras versiones
-- ALTER TABLE tabla ADD COLUMN nueva_columna TIPO_DATO AFTER columna_existente;

-- =============================================
-- COMENTARIOS FINALES
-- =============================================

-- La base de datos está diseñada para ser escalable y mantener integridad referencial
-- Todas las tablas incluyen timestamps para auditoría
-- Se utilizan índices apropiados para optimizar consultas frecuentes
-- Los JSON fields permiten flexibilidad para datos adicionales

SELECT 'Base de datos GandDI creada exitosamente' as mensaje;