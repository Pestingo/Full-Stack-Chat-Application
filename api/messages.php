<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query('SELECT m.*, u.username FROM messages m JOIN users u ON m.sender_id = u.id ORDER BY created_at ASC');
    $messages = $stmt->fetchAll();
    echo json_encode(['messages' => $messages]);
}
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $content = $data['content'] ?? '';
    $senderId = $data['sender_id'] ?? '';
    $id = uniqid();
    
    try {
        $stmt = $pdo->prepare('INSERT INTO messages (id, content, sender_id) VALUES (?, ?, ?)');
        $stmt->execute([$id, $content, $senderId]);
        
        $stmt = $pdo->prepare('SELECT m.*, u.username FROM messages m JOIN users u ON m.sender_id = u.id WHERE m.id = ?');
        $stmt->execute([$id]);
        $message = $stmt->fetch();
        
        echo json_encode(['message' => $message]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to send message']);
    }
}