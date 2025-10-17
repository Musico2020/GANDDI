// Datos del usuario
// Datos del usuario
let userData = {
    id: 1,
    fullName: "Juan Carlos Pérez Rodríguez",
    email: "juan.perez@epssanitas.com",
    eps: "EPS Sanitas",
    role: "Usuario EPS",
    registrationDate: "15 de Marzo, 2023",
    lastAccess: "Hoy, 14:30",
    avatar: "👤",
    stats: {
        totalUploads: 24,
        radicados: 18,
        pendientes: 6,
        efficiency: 75
    },
    preferences: {
        emailNotifications: true,
        weeklyReminders: false,
        darkTheme: true,
        language: "es",
        timezone: "-5",
        twoFactor: false
    },
    sessions: [
        {
            id: 1,
            device: "Chrome en Windows",
            location: "Bogotá, CO",
            ip: "190.120.45.67",
            lastActive: "Activa ahora",
            current: true
        },
        {
            id: 2,
            device: "Safari en iPhone",
            location: "Bogotá, CO",
            ip: "190.120.45.68",
            lastActive: "Hace 2 horas",
            current: false
        },
        {
            id: 3,
            device: "Firefox en MacOS",
            location: "Medellín, CO",
            ip: "181.120.45.120",
            lastActive: "Hace 3 días",
            current: false
        }
    ]
};

// Estado de la aplicación
let currentUser = {
    role: 'eps',
    name: 'Usuario EPS',
    eps: 'EPS Sanitas'
};

let isEditing = false;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando módulo de perfil...');
    initializeProfile();
    setupEventListeners();
    loadUserData();
});

function initializeProfile() {
    console.log('Perfil inicializado');
    // Determinar el rol del usuario
    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get('role') || 'eps';
    
    currentUser.role = role;
    updateUIForRole(role);
}

function updateUIForRole(role) {
    const isAdmin = role === 'admin';
    
    // Actualizar elementos según el rol
    const userRoleElement = document.getElementById('userRole');
    const userRoleInfoElement = document.getElementById('userRoleInfo');
    
    if (userRoleElement) userRoleElement.textContent = isAdmin ? 'Administrador' : userData.eps;
    if (userRoleInfoElement) userRoleInfoElement.textContent = isAdmin ? 'Administrador' : 'Usuario EPS';
    
    // Mostrar/ocultar elementos según el rol
    const uploadLink = document.getElementById('uploadLink');
    const adminLink = document.getElementById('adminLink');
    
    if (uploadLink) uploadLink.style.display = isAdmin ? 'none' : 'block';
    if (adminLink) adminLink.style.display = isAdmin ? 'block' : 'none';
}

function setupEventListeners() {
    console.log('Configurando event listeners...');
    
    // Edición de perfil
    const editProfileBtn = document.getElementById('editProfileBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    
    if (editProfileBtn) editProfileBtn.addEventListener('click', enableProfileEdit);
    if (cancelEditBtn) cancelEditBtn.addEventListener('click', cancelProfileEdit);
    if (saveProfileBtn) saveProfileBtn.addEventListener('click', saveProfile);
    
    // Cambio de avatar
    const avatarUpload = document.getElementById('avatarUpload');
    if (avatarUpload) avatarUpload.addEventListener('change', handleAvatarUpload);
    
    // Modal de contraseña
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const closePasswordModal = document.getElementById('closePasswordModal');
    const cancelPasswordBtn = document.getElementById('cancelPasswordBtn');
    const passwordForm = document.getElementById('passwordForm');
    
    if (changePasswordBtn) changePasswordBtn.addEventListener('click', openPasswordModal);
    if (closePasswordModal) closePasswordModal.addEventListener('click', closePasswordModal);
    if (cancelPasswordBtn) cancelPasswordBtn.addEventListener('click', closePasswordModal);
    if (passwordForm) passwordForm.addEventListener('submit', handlePasswordChange);
    
    // Modal de sesiones
    const manageSessionsBtn = document.getElementById('manageSessionsBtn');
    const closeSessionsModal = document.getElementById('closeSessionsModal');
    const logoutAllBtn = document.getElementById('logoutAllBtn');
    
    if (manageSessionsBtn) manageSessionsBtn.addEventListener('click', openSessionsModal);
    if (closeSessionsModal) closeSessionsModal.addEventListener('click', closeSessionsModal);
    if (logoutAllBtn) logoutAllBtn.addEventListener('click', logoutAllSessions);
    
    // Preferencias
    const emailNotifications = document.getElementById('emailNotifications');
    const weeklyReminders = document.getElementById('weeklyReminders');
    const darkTheme = document.getElementById('darkTheme');
    const languageSelect = document.getElementById('languageSelect');
    const timezoneSelect = document.getElementById('timezoneSelect');
    const twoFactorToggle = document.getElementById('twoFactorToggle');
    
    if (emailNotifications) emailNotifications.addEventListener('change', savePreferences);
    if (weeklyReminders) weeklyReminders.addEventListener('change', savePreferences);
    if (darkTheme) darkTheme.addEventListener('change', savePreferences);
    if (languageSelect) languageSelect.addEventListener('change', savePreferences);
    if (timezoneSelect) timezoneSelect.addEventListener('change', savePreferences);
    if (twoFactorToggle) twoFactorToggle.addEventListener('change', savePreferences);
    
    // Zona de peligro
    const exportDataBtn = document.getElementById('exportDataBtn');
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    
    if (exportDataBtn) exportDataBtn.addEventListener('click', exportUserData);
    if (deleteAccountBtn) deleteAccountBtn.addEventListener('click', confirmAccountDeletion);
    
    // Toggles de contraseña
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            if (input) {
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                this.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
            }
        });
    });
    
    // Validación de contraseña en tiempo real
    const newPasswordInput = document.getElementById('newPassword');
    if (newPasswordInput) newPasswordInput.addEventListener('input', validatePasswordStrength);
    
    console.log('Event listeners configurados correctamente');
}

function loadUserData() {
    console.log('Cargando datos del usuario...');
    
    // Cargar datos del usuario
    const userFullName = document.getElementById('userFullName');
    const userFullNameInput = document.getElementById('userFullNameInput');
    const userEmail = document.getElementById('userEmail');
    const userEmailInput = document.getElementById('userEmailInput');
    const userEPS = document.getElementById('userEPS');
    const userRoleInfo = document.getElementById('userRoleInfo');
    const userRegistrationDate = document.getElementById('userRegistrationDate');
    const userLastAccess = document.getElementById('userLastAccess');
    const userAvatar = document.getElementById('userAvatar');
    
    if (userFullName) userFullName.textContent = userData.fullName;
    if (userFullNameInput) userFullNameInput.value = userData.fullName;
    if (userEmail) userEmail.textContent = userData.email;
    if (userEmailInput) userEmailInput.value = userData.email;
    if (userEPS) userEPS.textContent = userData.eps;
    if (userRoleInfo) userRoleInfo.textContent = userData.role;
    if (userRegistrationDate) userRegistrationDate.textContent = userData.registrationDate;
    if (userLastAccess) userLastAccess.textContent = userData.lastAccess;
    if (userAvatar) userAvatar.textContent = userData.avatar;
    
    // Cargar estadísticas
    const totalUploads = document.getElementById('totalUploads');
    const radicadosCount = document.getElementById('radicadosCount');
    const pendientesCount = document.getElementById('pendientesCount');
    const efficiencyRate = document.getElementById('efficiencyRate');
    
    if (totalUploads) totalUploads.textContent = userData.stats.totalUploads;
    if (radicadosCount) radicadosCount.textContent = userData.stats.radicados;
    if (pendientesCount) pendientesCount.textContent = userData.stats.pendientes;
    if (efficiencyRate) efficiencyRate.textContent = userData.stats.efficiency + '%';
    
    // Cargar preferencias
    const emailNotifications = document.getElementById('emailNotifications');
    const weeklyReminders = document.getElementById('weeklyReminders');
    const darkTheme = document.getElementById('darkTheme');
    const languageSelect = document.getElementById('languageSelect');
    const timezoneSelect = document.getElementById('timezoneSelect');
    const twoFactorToggle = document.getElementById('twoFactorToggle');
    
    if (emailNotifications) emailNotifications.checked = userData.preferences.emailNotifications;
    if (weeklyReminders) weeklyReminders.checked = userData.preferences.weeklyReminders;
    if (darkTheme) darkTheme.checked = userData.preferences.darkTheme;
    if (languageSelect) languageSelect.value = userData.preferences.language;
    if (timezoneSelect) timezoneSelect.value = userData.preferences.timezone;
    if (twoFactorToggle) twoFactorToggle.checked = userData.preferences.twoFactor;
    
    console.log('Datos del usuario cargados correctamente');
}

// =============================================
// FUNCIONES DE EDICIÓN DE PERFIL
// =============================================

function enableProfileEdit() {
    console.log('Habilitando edición de perfil...');
    isEditing = true;
    
    // Ocultar textos y mostrar inputs
    const userFullName = document.getElementById('userFullName');
    const userFullNameInput = document.getElementById('userFullNameInput');
    const userEmail = document.getElementById('userEmail');
    const userEmailInput = document.getElementById('userEmailInput');
    const profileActions = document.getElementById('profileActions');
    const editProfileBtn = document.getElementById('editProfileBtn');
    
    if (userFullName) userFullName.style.display = 'none';
    if (userFullNameInput) userFullNameInput.style.display = 'block';
    if (userEmail) userEmail.style.display = 'none';
    if (userEmailInput) userEmailInput.style.display = 'block';
    if (profileActions) profileActions.style.display = 'flex';
    if (editProfileBtn) editProfileBtn.style.display = 'none';
    
    // Enfocar el primer campo
    if (userFullNameInput) userFullNameInput.focus();
}

function cancelProfileEdit() {
    console.log('Cancelando edición...');
    isEditing = false;
    
    // Ocultar inputs y mostrar textos
    const userFullName = document.getElementById('userFullName');
    const userFullNameInput = document.getElementById('userFullNameInput');
    const userEmail = document.getElementById('userEmail');
    const userEmailInput = document.getElementById('userEmailInput');
    const profileActions = document.getElementById('profileActions');
    const editProfileBtn = document.getElementById('editProfileBtn');
    
    if (userFullName) userFullName.style.display = 'block';
    if (userFullNameInput) userFullNameInput.style.display = 'none';
    if (userEmail) userEmail.style.display = 'block';
    if (userEmailInput) userEmailInput.style.display = 'none';
    if (profileActions) profileActions.style.display = 'none';
    if (editProfileBtn) editProfileBtn.style.display = 'block';
    
    // Restaurar valores originales
    if (userFullNameInput) userFullNameInput.value = userData.fullName;
    if (userEmailInput) userEmailInput.value = userData.email;
}

function saveProfile() {
    console.log('Guardando perfil...');
    
    const userFullNameInput = document.getElementById('userFullNameInput');
    const userEmailInput = document.getElementById('userEmailInput');
    
    if (!userFullNameInput || !userEmailInput) {
        showNotification('Error: No se pudieron obtener los datos del formulario', 'error');
        return;
    }
    
    const newFullName = userFullNameInput.value.trim();
    const newEmail = userEmailInput.value.trim();
    
    // Validaciones básicas
    if (!newFullName) {
        showNotification('El nombre completo es obligatorio', 'error');
        userFullNameInput.focus();
        return;
    }
    
    if (!newEmail || !isValidEmail(newEmail)) {
        showNotification('Por favor ingresa un email válido', 'error');
        userEmailInput.focus();
        return;
    }
    
    // Simular guardado (en un sistema real, aquí iría una petición AJAX)
    userData.fullName = newFullName;
    userData.email = newEmail;
    
    // Actualizar la UI
    const userFullName = document.getElementById('userFullName');
    const userEmail = document.getElementById('userEmail');
    
    if (userFullName) userFullName.textContent = newFullName;
    if (userEmail) userEmail.textContent = newEmail;
    
    // Deshabilitar edición
    cancelProfileEdit();
    
    showNotification('Perfil actualizado correctamente', 'success');
}

function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
        showNotification('Solo se permiten imágenes JPEG, PNG o GIF', 'error');
        return;
    }
    
    // Validar tamaño (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
        showNotification('La imagen debe ser menor a 2MB', 'error');
        return;
    }
    
    // Simular subida de avatar (en un sistema real, aquí subirías el archivo)
    const reader = new FileReader();
    reader.onload = function(e) {
        const userAvatar = document.getElementById('userAvatar');
        if (userAvatar) {
            userAvatar.textContent = ''; // Limpiar emoji
            userAvatar.style.backgroundImage = `url(${e.target.result})`;
            userAvatar.style.backgroundSize = 'cover';
            userAvatar.style.backgroundPosition = 'center';
        }
        showNotification('Avatar actualizado correctamente', 'success');
    };
    reader.readAsDataURL(file);
}

// =============================================
// FUNCIONES DE MODALES
// =============================================

function openPasswordModal() {
    console.log('Abriendo modal de contraseña...');
    const passwordModal = document.getElementById('passwordModal');
    if (passwordModal) {
        passwordModal.style.display = 'block';
        // Limpiar formulario
        const passwordForm = document.getElementById('passwordForm');
        if (passwordForm) passwordForm.reset();
        validatePasswordStrength(); // Resetear validación
    }
}

function closePasswordModal() {
    const passwordModal = document.getElementById('passwordModal');
    if (passwordModal) passwordModal.style.display = 'none';
}

function openSessionsModal() {
    console.log('Abriendo modal de sesiones...');
    const sessionsModal = document.getElementById('sessionsModal');
    if (sessionsModal) {
        sessionsModal.style.display = 'block';
        loadSessionsList();
    }
}

function closeSessionsModal() {
    const sessionsModal = document.getElementById('sessionsModal');
    if (sessionsModal) sessionsModal.style.display = 'none';
}

// =============================================
// FUNCIONES DE CONTRASEÑA
// =============================================

function handlePasswordChange(event) {
    event.preventDefault();
    console.log('Cambiando contraseña...');
    
    const currentPassword = document.getElementById('currentPassword');
    const newPassword = document.getElementById('newPassword');
    const confirmNewPassword = document.getElementById('confirmNewPassword');
    
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        showNotification('Error: No se pudieron obtener los datos del formulario', 'error');
        return;
    }
    
    const currentPass = currentPassword.value;
    const newPass = newPassword.value;
    const confirmPass = confirmNewPassword.value;
    
    // Validaciones
    if (!currentPass) {
        showNotification('Por favor ingresa tu contraseña actual', 'error');
        currentPassword.focus();
        return;
    }
    
    if (!newPass) {
        showNotification('Por favor ingresa la nueva contraseña', 'error');
        newPassword.focus();
        return;
    }
    
    if (newPass !== confirmPass) {
        showNotification('Las contraseñas no coinciden', 'error');
        confirmNewPassword.focus();
        return;
    }
    
    if (!isPasswordStrong(newPass)) {
        showNotification('La contraseña no cumple con los requisitos de seguridad', 'error');
        return;
    }
    
    // Simular cambio de contraseña (en un sistema real, aquí iría una petición AJAX)
    setTimeout(() => {
        showNotification('Contraseña actualizada correctamente', 'success');
        closePasswordModal();
        
        // Limpiar formulario
        if (currentPassword) currentPassword.value = '';
        if (newPassword) newPassword.value = '';
        if (confirmNewPassword) confirmNewPassword.value = '';
    }, 1000);
}

function validatePasswordStrength() {
    const password = document.getElementById('newPassword')?.value || '';
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (!strengthFill || !strengthText) return;
    
    let strength = 0;
    let message = 'Muy débil';
    let color = '#dc3545'; // Rojo
    
    // Verificar longitud
    if (password.length >= 8) strength += 25;
    
    // Verificar mayúsculas
    if (/[A-Z]/.test(password)) strength += 25;
    
    // Verificar minúsculas
    if (/[a-z]/.test(password)) strength += 25;
    
    // Verificar números y caracteres especiales
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    
    // Determinar nivel de fortaleza
    if (strength >= 75) {
        message = 'Muy fuerte';
        color = '#28a745'; // Verde
    } else if (strength >= 50) {
        message = 'Fuerte';
        color = '#20c997'; // Verde azulado
    } else if (strength >= 25) {
        message = 'Moderada';
        color = '#ffc107'; // Amarillo
    }
    
    // Actualizar UI
    strengthFill.style.width = strength + '%';
    strengthFill.style.backgroundColor = color;
    strengthText.textContent = message;
    strengthText.style.color = color;
    
    // Actualizar requisitos
    updatePasswordRequirements(password);
}

function updatePasswordRequirements(password) {
    const requirements = {
        reqLength: password.length >= 8,
        reqUppercase: /[A-Z]/.test(password),
        reqLowercase: /[a-z]/.test(password),
        reqNumber: /[0-9]/.test(password),
        reqSpecial: /[^A-Za-z0-9]/.test(password)
    };
    
    Object.keys(requirements).forEach(reqId => {
        const element = document.getElementById(reqId);
        if (element) {
            if (requirements[reqId]) {
                element.classList.add('valid');
            } else {
                element.classList.remove('valid');
            }
        }
    });
}

function isPasswordStrong(password) {
    return password.length >= 8 &&
           /[A-Z]/.test(password) &&
           /[a-z]/.test(password) &&
           /[0-9]/.test(password) &&
           /[^A-Za-z0-9]/.test(password);
}

// =============================================
// FUNCIONES DE SESIONES
// =============================================

function loadSessionsList() {
    const sessionsList = document.getElementById('sessionsList');
    if (!sessionsList) return;
    
    sessionsList.innerHTML = userData.sessions.map(session => `
        <div class="session-item ${session.current ? 'session-current' : ''}">
            <div class="session-info">
                <h4>${session.device}</h4>
                <p>📍 ${session.location} • 🌐 ${session.ip}</p>
                <small>Última actividad: ${session.lastActive}</small>
            </div>
            ${!session.current ? `
                <button class="btn btn-outline btn-small" onclick="logoutSession(${session.id})">
                    Cerrar Sesión
                </button>
            ` : '<span class="status-badge status-radicado">Actual</span>'}
        </div>
    `).join('');
}

function logoutSession(sessionId) {
    if (confirm('¿Estás seguro de que deseas cerrar esta sesión?')) {
        // Simular cierre de sesión
        userData.sessions = userData.sessions.filter(session => session.id !== sessionId);
        loadSessionsList();
        showNotification('Sesión cerrada correctamente', 'success');
    }
}

function logoutAllSessions() {
    if (confirm('¿Estás seguro de que deseas cerrar todas las sesiones excepto la actual?')) {
        // Simular cierre de todas las sesiones excepto la actual
        userData.sessions = userData.sessions.filter(session => session.current);
        loadSessionsList();
        showNotification('Todas las sesiones han sido cerradas', 'success');
    }
}

// =============================================
// FUNCIONES DE PREFERENCIAS
// =============================================

function savePreferences() {
    console.log('Guardando preferencias...');
    
    const emailNotifications = document.getElementById('emailNotifications');
    const weeklyReminders = document.getElementById('weeklyReminders');
    const darkTheme = document.getElementById('darkTheme');
    const languageSelect = document.getElementById('languageSelect');
    const timezoneSelect = document.getElementById('timezoneSelect');
    const twoFactorToggle = document.getElementById('twoFactorToggle');
    
    if (emailNotifications) userData.preferences.emailNotifications = emailNotifications.checked;
    if (weeklyReminders) userData.preferences.weeklyReminders = weeklyReminders.checked;
    if (darkTheme) userData.preferences.darkTheme = darkTheme.checked;
    if (languageSelect) userData.preferences.language = languageSelect.value;
    if (timezoneSelect) userData.preferences.timezone = timezoneSelect.value;
    if (twoFactorToggle) userData.preferences.twoFactor = twoFactorToggle.checked;
    
    // Aplicar tema oscuro/claro inmediatamente
    applyTheme();
    
    showNotification('Preferencias guardadas correctamente', 'success');
}

function applyTheme() {
    if (userData.preferences.darkTheme) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
}

// =============================================
// FUNCIONES DE ZONA DE PELIGRO
// =============================================

function exportUserData() {
    if (confirm('¿Estás seguro de que deseas exportar todos tus datos? Esto puede tomar unos minutos.')) {
        // Simular exportación
        showNotification('Preparando exportación de datos...', 'info');
        
        setTimeout(() => {
            // Crear y descargar archivo de ejemplo
            const dataStr = JSON.stringify(userData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `ganddi_datos_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            showNotification('Datos exportados correctamente', 'success');
        }, 2000);
    }
}

function confirmAccountDeletion() {
    const confirmation = prompt(`Para confirmar la eliminación permanente de tu cuenta, escribe "ELIMINAR CUENTA":`);
    
    if (confirmation === "ELIMINAR CUENTA") {
        showNotification('Tu cuenta será eliminada permanentemente. Esta acción no se puede deshacer.', 'error');
        
        // En un sistema real, aquí iría una petición AJAX para eliminar la cuenta
        setTimeout(() => {
            alert('Cuenta eliminada permanentemente. Serás redirigido a la página principal.');
            window.location.href = '../../index.html';
        }, 3000);
    } else if (confirmation !== null) {
        showNotification('La frase de confirmación no coincide. La cuenta no fue eliminada.', 'error');
    }
}

// =============================================
// FUNCIONES UTILITARIAS
// =============================================

function showNotification(message, type = 'info') {
    // Crear notificación temporal
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // Estilos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    return colors[type] || colors.info;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// =============================================
// ESTILOS CSS PARA ANIMACIONES
// =============================================

// Agregar estilos CSS dinámicamente para las animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-icon {
        font-size: 1.2rem;
    }
    
    .notification-message {
        flex: 1;
    }
    
    .password-requirements li.valid {
        color: #28a745;
    }
    
    .password-requirements li.valid:before {
        content: "✓";
        color: #28a745;
    }
    
    .session-current {
        border-color: var(--accent) !important;
        background: rgba(15, 206, 124, 0.1) !important;
    }
`;
document.head.appendChild(style);

console.log('Módulo de perfil cargado completamente');