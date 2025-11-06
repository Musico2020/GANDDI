// Datos de ejemplo
const sampleFiles = [
    {
        id: 1,
        name: "Reporte_Epidemiologico_Q3_2023.pdf",
        type: "pdf",
        size: "2.4 MB",
        eps: "EPS Sanitas",
        user: "Juan Pérez",
        date: "2023-11-15",
        status: "radicado",
        description: "Reporte epidemiológico del tercer trimestre 2023"
    },
    {
        id: 2,
        name: "Indicadores_Gestion_Octubre.xlsx",
        type: "xlsx",
        size: "1.8 MB",
        eps: "EPS Sanitas",
        user: "María García",
        date: "2023-11-10",
        status: "pendiente",
        description: "Indicadores de gestión del mes de octubre"
    },
    {
        id: 3,
        name: "Analisis_Datos_Septiembre.pdf",
        type: "pdf",
        size: "3.2 MB",
        eps: "EPS Sura",
        user: "Carlos Rodríguez",
        date: "2023-11-05",
        status: "radicado",
        description: "Análisis de datos del mes de septiembre"
    },
    {
        id: 4,
        name: "Proyecciones_2024.xlsx",
        type: "xlsx",
        size: "1.5 MB",
        eps: "EPS Coomeva",
        user: "Ana Martínez",
        date: "2023-11-01",
        status: "pendiente",
        description: "Proyecciones estadísticas para el año 2024"
    }
];

const sampleEPS = [
    {
        id: 1,
        name: "EPS Sanitas",
        files: 24,
        radicados: 18,
        pendientes: 6
    },
    {
        id: 2,
        name: "EPS Sura",
        files: 18,
        radicados: 15,
        pendientes: 3
    },
    {
        id: 3,
        name: "EPS Coomeva",
        files: 15,
        radicados: 12,
        pendientes: 3
    }
];

// Estado de la aplicación
let currentUser = {
    role: 'eps', // 'admin' o 'eps'
    name: 'Usuario EPS',
    eps: 'EPS Sanitas'
};

let currentFilters = {
    eps: '',
    status: ''
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    loadSampleData();
});

function initializeDashboard() {
    // Determinar el rol del usuario (en un sistema real esto vendría del login)
    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get('role') || 'eps';
    
    currentUser.role = role;
    updateUIForRole();
}

function updateUIForRole() {
    const isAdmin = currentUser.role === 'admin';
    
    // Actualizar elementos de la UI según el rol
    document.getElementById('userRole').textContent = isAdmin ? 'Administrador' : currentUser.eps;
    document.getElementById('userName').textContent = isAdmin ? 'Administrador' : 'Usuario ' + currentUser.eps;
    document.getElementById('dashboardType').textContent = isAdmin ? 'General' : currentUser.eps;
    document.getElementById('sectionTitle').textContent = isAdmin ? 'por EPS' : 'de mi EPS';
    
    // Mostrar/ocultar elementos según el rol
    document.getElementById('uploadLink').style.display = isAdmin ? 'none' : 'block';
    document.getElementById('adminLink').style.display = isAdmin ? 'block' : 'none';
    document.getElementById('epsColumn').style.display = isAdmin ? 'table-cell' : 'none';
    document.getElementById('userColumn').style.display = isAdmin ? 'table-cell' : 'none';
    document.getElementById('epsSection').style.display = isAdmin ? 'block' : 'none';
    document.getElementById('uploadBtn').style.display = isAdmin ? 'none' : 'block';
    
    // Actualizar estadísticas
    updateStatistics();
}

function setupEventListeners() {
    // Filtros
    document.getElementById('epsFilter').addEventListener('change', function() {
        currentFilters.eps = this.value;
        filterFiles();
    });
    
    document.getElementById('statusFilter').addEventListener('change', function() {
        currentFilters.status = this.value;
        filterFiles();
    });
    
    document.getElementById('resetFilters').addEventListener('click', function() {
        document.getElementById('epsFilter').value = '';
        document.getElementById('statusFilter').value = '';
        currentFilters = { eps: '', status: '' };
        filterFiles();
    });
    
    // Botón de subir archivo
    document.getElementById('uploadBtn').addEventListener('click', function() {
        window.location.href = 'upload.html';
    });
    
    // Modal
    document.getElementById('closeFileModal').addEventListener('click', function() {
        document.getElementById('fileModal').style.display = 'none';
    });
    
    // Menú móvil
    document.querySelector('.mobile-menu').addEventListener('click', function() {
        document.querySelector('.nav-links').classList.toggle('active');
    });
}

function loadSampleData() {
    updateFilesTable(sampleFiles);
    updateEPSGrid(sampleEPS);
    updateStatistics();
}

function updateFilesTable(files) {
    const tbody = document.getElementById('filesTableBody');
    const noFilesMessage = document.getElementById('noFilesMessage');
    
    if (files.length === 0) {
        tbody.innerHTML = '';
        noFilesMessage.style.display = 'block';
        return;
    }
    
    noFilesMessage.style.display = 'none';
    
    tbody.innerHTML = files.map(file => `
        <tr>
            <td>
                <div class="file-info">
                    <span class="file-icon">${getFileIcon(file.type)}</span>
                    <span class="file-name">${file.name}</span>
                </div>
            </td>
            <td>${file.type.toUpperCase()}</td>
            <td>${file.size}</td>
            ${currentUser.role === 'admin' ? `<td>${file.eps}</td><td>${file.user}</td>` : ''}
            <td>${formatDate(file.date)}</td>
            <td><span class="status-badge status-${file.status}">${file.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-small btn-download" onclick="downloadFile(${file.id})">
                        Descargar
                    </button>
                    <button class="btn btn-small" onclick="showFileDetails(${file.id})">
                        Detalles
                    </button>
                    ${currentUser.role === 'admin' && file.status === 'pendiente' ? `
                    <button class="btn btn-small btn-success" onclick="updateFileStatus(${file.id}, 'radicado')">
                        Radicar
                    </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

function updateEPSGrid(epsList) {
    const epsGrid = document.getElementById('epsGrid');
    
    epsGrid.innerHTML = epsList.map(eps => `
        <div class="eps-card">
            <div class="eps-header">
                <div class="eps-name">${eps.name}</div>
                <span class="status-badge status-radicado">Activa</span>
            </div>
            <div class="eps-stats">
                <div class="eps-stat">
                    <div class="eps-stat-value">${eps.files}</div>
                    <div class="eps-stat-label">Archivos</div>
                </div>
                <div class="eps-stat">
                    <div class="eps-stat-value">${eps.radicados}</div>
                    <div class="eps-stat-label">Radicados</div>
                </div>
                <div class="eps-stat">
                    <div class="eps-stat-value">${eps.pendientes}</div>
                    <div class="eps-stat-label">Pendientes</div>
                </div>
                <div class="eps-stat">
                    <div class="eps-stat-value">${Math.round((eps.radicados / eps.files) * 100)}%</div>
                    <div class="eps-stat-label">Eficiencia</div>
                </div>
            </div>
            <button class="btn btn-small" onclick="viewEP