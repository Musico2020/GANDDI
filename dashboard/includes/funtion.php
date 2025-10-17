<?php
// includes/functions.php
require_once 'config.php';

class Functions {
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    public function getEPSList() {
        $stmt = $this->pdo->query("SELECT * FROM eps ORDER BY nombre");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function getEPSName($eps_id) {
        $stmt = $this->pdo->prepare("SELECT nombre FROM eps WHERE id = ?");
        $stmt->execute([$eps_id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ? $result['nombre'] : 'Desconocida';
    }
    
    public function getFilesByEPS($eps_id = null) {
        if ($eps_id) {
            $stmt = $this->pdo->prepare("
                SELECT f.*, u.nombre as usuario_nombre, e.nombre as eps_nombre 
                FROM archivos f 
                JOIN usuarios u ON f.usuario_id = u.id 
                JOIN eps e ON f.eps_id = e.id 
                WHERE f.eps_id = ? 
                ORDER BY f.fecha_subida DESC
            ");
            $stmt->execute([$eps_id]);
        } else {
            $stmt = $this->pdo->query("
                SELECT f.*, u.nombre as usuario_nombre, e.nombre as eps_nombre 
                FROM archivos f 
                JOIN usuarios u ON f.usuario_id = u.id 
                JOIN eps e ON f.eps_id = e.id 
                ORDER BY f.fecha_subida DESC
            ");
        }
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function updateFileStatus($file_id, $status) {
        $stmt = $this->pdo->prepare("UPDATE archivos SET estado = ? WHERE id = ?");
        return $stmt->execute([$status, $file_id]);
    }
    
    public function getFileTypes() {
        return [
            'pdf' => 'Documento PDF',
            'doc' => 'Documento Word',
            'docx' => 'Documento Word',
            'xls' => 'Hoja de cálculo',
            'xlsx' => 'Hoja de cálculo',
            'jpg' => 'Imagen',
            'png' => 'Imagen',
            'txt' => 'Archivo de texto'
        ];
    }
}

$functions = new Functions($pdo);
?>