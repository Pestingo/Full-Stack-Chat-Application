<?php
require_once 'config.php';

try {
    // Create users table
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    // Create messages table
    $pdo->exec("CREATE TABLE IF NOT EXISTS messages (
        id VARCHAR(36) PRIMARY KEY,
        content TEXT NOT NULL,
        sender_id VARCHAR(36) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(id)
    )");

    echo json_encode(['message' => 'Database setup completed successfully']);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}