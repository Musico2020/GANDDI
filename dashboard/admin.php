<?php
// admin.php
require_once 'includes/auth.php';
require_once 'includes/functions.php';

if (!$auth->isLoggedIn() || !$auth->isAdmin()) {
    header('Location: dashboard.php');
    exit;
}

$eps_list = $functions->getEPSList();
$files_by_eps = [];

foreach ($eps_list as $eps) {
    $files_by_eps[$eps['id']] = $functions->getFilesByEPS($eps['id']);
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administración - GandDI</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header>
        <div class="container">
            <nav class="navbar">
                <div class="logo">
                    <div class="logo-main">GandDI</div>
                    <div class="logo-tagline">Gestiona - Analiza - Decide</div>
                </div>
                <div class="nav-links">
                    <a href="dashboard.php">Dashboard</a>
                    <a href="admin.php" class="active">Administración</a>
                    <a href="profile.php">Perfil</a>
                    <a href="?logout=true">Cerrar Sesión</a>
                </div>
            </nav>
        </div>
    </header>

    <main class="container">
        <div class="dashboard-header">
            <h1>Panel de Administración</h1>
            <p>Gestión completa del sistema</p>
        </div>

        <div class="admin-stats">
            <div class="stat-card">
                <div class="stat-number"><?php echo count($eps_list); ?></div>
                <div class="stat-label">EPS Registradas</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">
                    <?php 
                    $total_files = 0;
                    foreach ($files_by_eps as $files) {
                        $total_files += count($files);
                    }
                    echo $total_files;
                    ?>
                </div>
                <div class="stat-label">Total Archivos</div>
            </div>
        </div>

        <div class="section">
            <h2>Archivos por EPS</h2>
            
            <?php foreach ($eps_list as $eps): ?>
            <div class="eps-section">
                <h3><?php echo $eps['nombre']; ?></h3>
                <div class="files-grid">
                    <?php foreach ($files_by_eps[$eps['id']] as $file): ?>
                    <div class="file-card">
                        <div class="file-header">
                            <span class="file-icon">📄</span>
                            <span class="file-name"><?php echo $file['nombre_original']; ?></span>
                        </div>
                        <div class="file-info">
                            <span class="file-type"><?php echo strtoupper($file['tipo']); ?></span>
                            <span class="file-size"><?php echo formatFileSize($file['tamanio']); ?></span>
                        </div>
                        <div class="file-status">
                            <span class="status-badge status-<?php echo $file['estado']; ?>">
                                <?php echo ucfirst($file['estado']); ?>
                            </span>
                        </div>
                        <div class="file-actions">
                            <a href="uploads/<?php echo $file['nombre_archivo']; ?>" download class="btn-download">Descargar</a>
                            <?php if ($file['estado'] === 'pendiente'): ?>
                                <button onclick="updateStatus(<?php echo $file['id']; ?>, 'radicado')" class="btn-success">Radicar</button>
                            <?php endif; ?>
                        </div>
                    </div>
                    <?php endforeach; ?>
                    
                    <?php if (empty($files_by_eps[$eps['id']])): ?>
                        <div class="no-files">No hay archivos subidos</div>
                    <?php endif; ?>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </main>

    <script>
        function updateStatus(fileId, status) {
            if (confirm('¿Estás seguro de cambiar el estado del archivo?')) {
                fetch('update_status.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        file_id: fileId,
                        status: status
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        location.reload();
                    } else {
                        alert('Error al actualizar el estado');
                    }
                });
            }
        }
    </script>
</body>
</html>

<?php
function formatFileSize($bytes) {
    if ($bytes == 0) return '0 Bytes';
    $k = 1024;
    $sizes = ['Bytes', 'KB', 'MB', 'GB'];
    $i = floor(log($bytes) / log($k));
    return round($bytes / pow($k, $i), 2) . ' ' . $sizes[$i];
}
?>