<?php
namespace App\Models\Entities;

/**
 * User Entity (Base Class)
 * Represents a user in the system
 * 
 * SOLID: Liskov Substitution Principle (LSP)
 * Student and Instructor extend this class and can be used interchangeably
 */
class User {
    protected int $userId;
    protected string $username;
    protected string $passwordHash;
    protected string $fullName;
    protected string $email;
    protected string $role;

    public function __construct(array $data = []) {
        if (!empty($data)) {
            $this->userId = $data['user_id'] ?? 0;
            $this->username = $data['username'] ?? '';
            $this->passwordHash = $data['password_hash'] ?? '';
            $this->fullName = $data['full_name'] ?? '';
            $this->email = $data['email'] ?? '';
            $this->role = $data['role'] ?? '';
        }
    }

    // Getters
    public function getUserId(): int {
        return $this->userId;
    }

    public function getUsername(): string {
        return $this->username;
    }

    public function getFullName(): string {
        return $this->fullName;
    }

    public function getEmail(): string {
        return $this->email;
    }

    public function getRole(): string {
        return $this->role;
    }

    // Setters
    public function setUserId(int $userId): void {
        $this->userId = $userId;
    }

    public function setUsername(string $username): void {
        $this->username = $username;
    }

    public function setFullName(string $fullName): void {
        $this->fullName = $fullName;
    }

    public function setEmail(string $email): void {
        $this->email = $email;
    }

    public function setRole(string $role): void {
        $this->role = $role;
    }

    /**
     * Verify password
     */
    public function verifyPassword(string $password): bool {
        return password_verify($password, $this->passwordHash);
    }

    /**
     * Convert to array
     */
    public function toArray(): array {
        return [
            'user_id' => $this->userId,
            'username' => $this->username,
            'full_name' => $this->fullName,
            'email' => $this->email,
            'role' => $this->role,
        ];
    }
}
