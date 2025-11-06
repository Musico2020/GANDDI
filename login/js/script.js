// Variables globales
let currentStep = 1;
let userEmail = '';

// Elementos del DOM
const recoveryModal = document.getElementById('recoveryModal');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const closeModal = document.getElementById('closeModal');
const cancelRecovery = document.getElementById('cancelRecovery');

// Toggle para mostrar/ocultar contraseña en login
document.getElementById('togglePassword').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
});

// Abrir modal de recuperación
forgotPasswordLink.addEventListener('click', function() {
    recoveryModal.style.display = 'block';
    resetRecoveryProcess();
});

// Cerrar modal
closeModal.addEventListener('click', closeRecoveryModal);
cancelRecovery.addEventListener('click', closeRecoveryModal);

function closeRecoveryModal() {
    recoveryModal.style.display = 'none';
    resetRecoveryProcess();
}

// Resetear proceso de recuperación
function resetRecoveryProcess() {
    currentStep = 1;
    updateSteps();
    document.getElementById('step1Form').style.display = 'flex';
    document.getElementById('step2Form').style.display = 'none';
    document.getElementById('step3Form').style.display = 'none';
    document.getElementById('successMessage').style.display = 'none';
    document.getElementById('recoveryEmail').value = '';
    document.getElementById('verificationCode').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
}

// Actualizar pasos visualmente
function updateSteps() {
    for (let i = 1; i <= 3; i++) {
        const step = document.getElementById(`step${i}`);
        if (i < currentStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (i === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    }
}

// Paso 1: Enviar código
document.getElementById('sendCode').addEventListener('click', function() {
    const email = document.getElementById('recoveryEmail').value;
    
    if (!validateEmail(email)) {
        alert('Por favor, ingresa un correo electrónico válido.');
        return;
    }

    // Simular envío de código
    userEmail = email;
    document.getElementById('emailPreview').textContent = email;
    
    // Mostrar loading
    const btn = this;
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Enviando...';
    btn.disabled = true;

    setTimeout(() => {
        currentStep = 2;
        updateSteps();
        document.getElementById('step1Form').style.display = 'none';
        document.getElementById('step2Form').style.display = 'flex';
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        // Simular código (en producción esto vendría del backend)
        alert(`Código de verificación enviado a ${email}\n\nCódigo de prueba: 123456`);
    }, 2000);
});

// Paso 2: Verificar código
document.getElementById('verifyCode').addEventListener('click', function() {
    const code = document.getElementById('verificationCode').value;
    
    if (code.length !== 6) {
        alert('Por favor, ingresa el código de 6 dígitos.');
        return;
    }

    // Simular verificación (en producción esto se validaría con el backend)
    if (code === '123456') {
        currentStep = 3;
        updateSteps();
        document.getElementById('step2Form').style.display = 'none';
        document.getElementById('step3Form').style.display = 'flex';
    } else {
        alert('Código incorrecto. Por favor, intenta nuevamente.');
    }
});

// Paso 3: Actualizar contraseña
document.getElementById('updatePassword').addEventListener('click', function() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres.');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('Las contraseñas no coinciden.');
        return;
    }

    // Simular actualización
    const btn = this;
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Actualizando...';
    btn.disabled = true;

    setTimeout(() => {
        document.getElementById('step3Form').style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 1500);
});

// Navegación entre pasos
document.getElementById('backToStep1').addEventListener('click', function() {
    currentStep = 1;
    updateSteps();
    document.getElementById('step2Form').style.display = 'none';
    document.getElementById('step1Form').style.display = 'flex';
});

document.getElementById('backToStep2').addEventListener('click', function() {
    currentStep = 2;
    updateSteps();
    document.getElementById('step3Form').style.display = 'none';
    document.getElementById('step2Form').style.display = 'flex';
});

// Ir al login después del éxito
document.getElementById('goToLogin').addEventListener('click', function() {
    closeRecoveryModal();
    alert('¡Ahora puedes iniciar sesión con tu nueva contraseña!');
});

// Toggles para nuevas contraseñas
document.getElementById('toggleNewPassword').addEventListener('click', function() {
    const input = document.getElementById('newPassword');
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    this.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
});

document.getElementById('toggleConfirmPassword').addEventListener('click', function() {
    const input = document.getElementById('confirmPassword');
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    this.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
});

// Validación de email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Manejo del formulario de login principal
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (email && password) {
        const submitBtn = this.querySelector('.btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Verificando credenciales...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('¡Acceso concedido! Redirigiendo al dashboard...');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            // Redirigir al dashboard
            window.location.href = '../dashboard/dashboard.php';
        }, 1500);
    }
});

// Demo Login
function demoLogin(role) {
    const email = role === 'admin' ? 'admin@ganddi.com' : 'eps@ganddi.com';
    document.getElementById('email').value = email;
    document.getElementById('password').value = 'demo123';
    
    setTimeout(() => {
        alert(`Acceso demo como ${role.toUpperCase()}\n\nEmail: ${email}\nContraseña: demo123\n\nRedirigiendo al dashboard...`);
        // Redirigir al dashboard
        window.location.href = '../dashboard/dashboard.php';
    }, 500);
}

// Efectos visuales adicionales
document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});