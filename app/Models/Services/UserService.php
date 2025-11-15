<?php
namespace App\Models\Services;

use App\Models\Repositories\UserRepository;
use App\Models\Entities\User;
use App\Models\Entities\Student;
use App\Models\Entities\Instructor;

/**
 * UserService
 * Business logic for user operations
 * 
 * SOLID: Single Responsibility Principle (SRP)
 * Only handles user-related business logic
 */
class UserService {
    private UserRepository $userRepo;

    public function __construct(UserRepository $userRepo) {
        // SOLID: Dependency Inversion Principle (DIP)
        // Depends on concrete UserRepository (could be abstracted further)
        $this->userRepo = $userRepo;
    }

    /**
     * Authenticate user
     */
    public function authenticate(string $username, string $password): ?User {
        $userData = $this->userRepo->findByUsername($username);
        
        if (!$userData) {
            return null;
        }

        // Create User entity
        $user = new User($userData);
        
        if (!$user->verifyPassword($password)) {
            return null;
        }

        return $user;
    }

    /**
     * Get user by ID with proper entity type
     */
    public function getUserById(int $userId): ?User {
        $userData = $this->userRepo->findById($userId);
        
        if (!$userData) {
            return null;
        }

        // SOLID: Liskov Substitution Principle (LSP)
        // Return appropriate subclass based on role
        if ($userData['role'] === 'student') {
            return new Student($userData);
        } elseif ($userData['role'] === 'instructor') {
            return new Instructor($userData);
        }
        
        return new User($userData);
    }

    /**
     * Register new user
     */
    public function registerUser(array $data): int {
        // Business logic: validate email format
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            throw new \Exception("Invalid email format");
        }

        // Business logic: check username uniqueness
        if ($this->userRepo->findByUsername($data['username'])) {
            throw new \Exception("Username already exists");
        }

        return $this->userRepo->create($data);
    }

    /**
     * Get all students
     */
    public function getAllStudents(): array {
        return $this->userRepo->getAllStudents();
    }
}
