<?php
// upload.php
require_once 'includes/auth.php';
require_once 'includes/functions.php';

if (!$auth->isLoggedIn() || !$auth->isEPS()) {
    header('Location: dashboard.php');
    exit;
}

$upload_dir = 'uploads/';
$allowed_types = $functions->getFileTypes();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['archivo'])) {
    $file = $_FILES['archivo'];
    
    // Validaciones
    $file_type = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($file_type, array_keys($allowed_types))) {
        $error = "Tipo de archivo no permitido";
    } elseif ($file['size'] > 10 * 1024 * 1024) { // 10MB max
        $error = "El archivo es demasiado grande (máximo 10MB)";
    } else {
        // Generar nombre único
        $new_filename = uniqid() . '_' . time() . '.' . $file_type;
        $file_path = $upload_dir . $new_filename;
        
        if (move_uploaded_file($file['tmp_name'], $file_path)) {
            // Guardar en base de datos
            $stmt = $pdo->prepare("
                INSERT INTO archivos (nombre_original, nombre_archivo, tipo, tamanio, eps_id, usuario_id, estado) 
                VALUES (?, ?, ?, ?, ?, ?, 'pendiente')
            ");
            $stmt->execute([
                $file['name'],
                $new_filename,
                $file_type,
                $file['size'],
                $auth->getUserEPS(),
                $_SESSION['user_id']
            ]);
            
            $success = "Archivo subido correctamente";
        } else {
            $error = "Error al subir el archivo";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subir Archivo - GandDI</title>
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
                    <a href="upload.php" class="active">Subir Archivo</a>
                    <a href="profile.php">Perfil</a>
                    <a href="?logout=true">Cerrar Sesión</a>
                </div>
            </nav>
        </div>
    </header>

    <main class="container">
        <div class="section">
            <h1>Subir Nuevo Archivo</h1>
            
            <?php if (isset($error)): ?>
                <div class="alert alert-error"><?php echo $error; ?></div>
            <?php endif; ?>
            
            <?php if (isset($success)): ?>
                <div class="alert alert-success"><?php echo $success; ?></div>
            <?php endif; ?>

            <form class="upload-form" method="POST" enctype="multipart/form-data">
                <div class="form-group">
                    <label for="archivo">Seleccionar Archivo</label>
                    <input type="file" id="archivo" name="archivo" class="form-control" required accept="<?php echo '.' . implode(',.', array_keys($allowed_types)); ?>">
                    <small>Tipos permitidos: <?php echo implode(', ', array_values($allowed_types)); ?> (Máximo 10MB)</small>
                </div>

                <div class="form-group">
                    <label for="descripcion">Descripción (Opcional)</label>
                    <textarea id="descripcion" name="descripcion" class="form-control" rows="3" placeholder="Breve descripción del archivo..."></textarea>
                </div>

                <button type="submit" class="btn">Subir Archivo</button>
            </form>

            <div class="file-types-info">
                <h3>Tipos de Archivo Permitidos</h3>
                <div class="file-types-grid">
                    <?php foreach ($allowed_types as $ext => $desc): ?>
                        <div class="file-type-item">
                            <span class="file-icon">📄</span>
                            <span class="file-ext">.<?php echo $ext; ?></span>
                            <span class="file-desc"><?php echo $desc; ?></span>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    </main>
</body>
</html>