<?php
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_GET['action'] ?? '';
    
    if ($action === 'login') {
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
        
        $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?');
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if ($user && password_verify($password, $user['password'])) {
            echo json_encode([
                'user' => [
                    'id' => $user['id'],
                    'email' => $user['email'],
                    'username' => $user['username']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials']);
        }
    } 
    elseif ($action === 'register') {
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
        $username = explode('@', $email)[0];
        $id = uniqid();
        
        try {
            $stmt = $pdo->prepare('INSERT INTO users (id, email, password, username) VALUES (?, ?, ?, ?)');
            $stmt->execute([$id, $email, password_hash($password, PASSWORD_DEFAULT), $username]);
            
            echo json_encode([
                'user' => [
                    'id' => $id,
                    'email' => $email,
                    'username' => $username
                ]
            ]);
        } catch (\PDOException $e) {
            http_response_code(400);
            echo json_encode(['error' => 'User already exists']);
        }
    }
}