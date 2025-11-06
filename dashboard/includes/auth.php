<?php
// includes/auth.php
require_once 'config.php';

class Auth {
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    public function login($email, $password) {
        $stmt = $this->pdo->prepare("SELECT * FROM usuarios WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['user_role'] = $user['rol_id'];
            $_SESSION['user_eps'] = $user['eps_id'];
            $_SESSION['user_nombre'] = $user['nombre'];
            return true;
        }
        return false;
    }
    
    public function isLoggedIn() {
        return isset($_SESSION['user_id']);
    }
    
    public function isAdmin() {
        return isset($_SESSION['user_role']) && $_SESSION['user_role'] == ROL_ADMIN;
    }
    
    public function isEPS() {
        return isset($_SESSION['user_role']) && $_SESSION['user_role'] == ROL_EPS;
    }
    
    public function logout() {
        session_destroy();
        header('Location: index.php');
        exit;
    }
    
    public function getUserEPS() {
        return $_SESSION['user_eps'] ?? null;
    }
}

$auth = new Auth($pdo);
?>