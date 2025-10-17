<?php
// dashboard.php
require_once 'includes/auth.php';
require_once 'includes/funtion.php';

if (!$auth->isLoggedIn()) {
    header('Location: index.php');
    exit;
}

$user_eps = $auth->getUserEPS();
$files = $functions->getFilesByEPS($auth->isAdmin() ? null : $user_eps);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - GandDI</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <!-- Header -->
    <header>
        <div class="container">
            <nav class="navbar">
                <div class="logo">
                    <div class="logo-main">GandDI</div>
                    <div class="logo-tagline">Gestiona - Analiza - Decide</div>
                </div>
                <div class="nav-links">
                    <a href="dashboard.php" class="active">Dashboard</a>
                    <?php if ($auth->isEPS()): ?>
                        <a href="upload.php">Subir Archivo</a>
                    <?php endif; ?>
                    <?php if ($auth->isAdmin()): ?>
                        <a href="admin.php">Administración</a>
                    <?php endif; ?>
                    <a href="../profile/index.php">Perfil</a>
                    <a href="?logout=true">Cerrar Sesión</a>
                </div>
            </nav>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container">
        <div class="dashboard-header">
            <h1>Bienvenido, <?php echo $_SESSION['user_nombre']; ?></h1>
            <p>Dashboard de gestión de archivos <?php echo $auth->isAdmin() ? 'General' : 'EPS ' . $functions->getEPSName($user_eps); ?></p>
        </div>

        <!-- Estadísticas -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number"><?php echo count($files); ?></div>
                <div class="stat-label">Total Archivos</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo count(array_filter($files, fn($f) => $f['estado'] === 'radicado')); ?></div>
                <div class="stat-label">Radicados</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo count(array_filter($files, fn($f) => $f['estado'] === 'pendiente')); ?></div>
                <div class="stat-label">Pendientes</div>
            </div>
        </div>

        <!-- Lista de Archivos -->
        <div class="section">
            <h2>Archivos <?php echo $auth->isAdmin() ? 'por EPS' : 'de mi EPS'; ?></h2>
            
            <?php if ($auth->isAdmin()): ?>
                <div class="eps-filter">
                    <label for="epsFilter">Filtrar por EPS:</label>
                    <select id="epsFilter">
                        <option value="">Todas las EPS</option>
                        <?php foreach ($functions->getEPSList() as $eps): ?>
                            <option value="<?php echo $eps['id']; ?>"><?php echo $eps['nombre']; ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
            <?php endif; ?>

            <div class="files-table">
                <table>
                    <thead>
                        <tr>
                            <th>Archivo</th>
                            <th>Tipo</th>
                            <th>Tamaño</th>
                            <?php if ($auth->isAdmin()): ?>
                                <th>EPS</th>
                                <th>Usuario</th>
                            <?php endif; ?>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($files as $file): ?>
                        <tr>
                            <td>
                                <div class="file-info">
                                    <span class="file-icon">📄</span>
                                    <span class="file-name"><?php echo $file['nombre_original']; ?></span>
                                </div>
                            </td>
                            <td><?php echo strtoupper($file['tipo']); ?></td>
                            <td><?php echo formatFileSize($file['tamanio']); ?></td>
                            <?php if ($auth->isAdmin()): ?>
                                <td><?php echo $file['eps_nombre']; ?></td>
                                <td><?php echo $file['usuario_nombre']; ?></td>
                            <?php endif; ?>
                            <td><?php echo date('d/m/Y H:i', strtotime($file['fecha_subida'])); ?></td>
                            <td>
                                <span class="status-badge status-<?php echo $file['estado']; ?>">
                                    <?php echo ucfirst($file['estado']); ?>
                                </span>
                            </td>
                            <td>
                                <div class="action-buttons">
                                    <a href="uploads/<?php echo $file['nombre_archivo']; ?>" download class="btn-download">Descargar</a>
                                    <?php if ($auth->isAdmin() && $file['estado'] === 'pendiente'): ?>
                                        <button onclick="updateStatus(<?php echo $file['id']; ?>, 'radicado')" class="btn-success">Radicar</button>
                                    <?php endif; ?>
                                </div>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
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

        // Filtro por EPS para administradores
        document.getElementById('epsFilter')?.addEventListener('change', function() {
            const epsId = this.value;
            // Recargar la página con el filtro (implementación básica)
            if (epsId) {
                window.location.href = `dashboard.php?eps=${epsId}`;
            } else {
                window.location.href = 'dashboard.php';
            }
        });
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