<?php
// includes/config.php
session_start();

$host = 'localhost';
$dbname = 'ganddi_dashboard';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // ← AQUÍ ESTÁ LA CORRECCIÓN
} catch(PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}

// Definir roles
define('ROL_ADMIN', 1);
define('ROL_EPS', 2);
?>