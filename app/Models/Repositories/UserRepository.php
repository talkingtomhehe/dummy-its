<?php
namespace App\Models\Repositories;

use App\Core\Database;
use App\Models\Interfaces\IUserRepository;
use PDO;

/**
 * UserRepository
 * Handles all database operations for users
 * 
 * SOLID: Single Responsibility Principle (SRP)
 * Only responsible for user data persistence
 */
class UserRepository implements IUserRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    /**
     * Find user by username
     */
    public function findByUsername(string $username): ?array {
        $stmt = $this->db->prepare("
            SELECT * FROM users WHERE username = :username LIMIT 1
        ");
        $stmt->execute(['username' => $username]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    /**
     * Find user by ID
     */
    public function findById(int $userId): ?array {
        $stmt = $this->db->prepare("
            SELECT * FROM users WHERE user_id = :user_id LIMIT 1
        ");
        $stmt->execute(['user_id' => $userId]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    /**
     * Create a new user
     */
    public function create(array $data): int {
        $stmt = $this->db->prepare("
            INSERT INTO users (username, password_hash, full_name, email, role)
            VALUES (:username, :password_hash, :full_name, :email, :role)
        ");
        
        $stmt->execute([
            'username' => $data['username'],
            'password_hash' => password_hash($data['password'], PASSWORD_DEFAULT),
            'full_name' => $data['full_name'],
            'email' => $data['email'],
            'role' => $data['role'],
        ]);
        
        return (int) $this->db->lastInsertId();
    }

    /**
     * Get all students
     */
    public function getAllStudents(): array {
        $stmt = $this->db->query("
            SELECT user_id, username, full_name, email 
            FROM users 
            WHERE role = 'student'
            ORDER BY full_name
        ");
        return $stmt->fetchAll();
    }

    /**
     * Get all instructors
     */
    public function getAllInstructors(): array {
        $stmt = $this->db->query("
            SELECT user_id, username, full_name, email 
            FROM users 
            WHERE role = 'instructor'
            ORDER BY full_name
        ");
        return $stmt->fetchAll();
    }
}
