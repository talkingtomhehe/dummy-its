<?php
namespace App\Models\Services;

use App\Models\Entities\Instructor;
use App\Models\Entities\Student;
use App\Models\Entities\User;
use App\Models\Interfaces\IUserRepository;

/**
 * UserService
 * Business logic for user operations
 * 
 * SOLID: Single Responsibility Principle (SRP)
 * Only handles user-related business logic
 */
class UserService {
    private IUserRepository $userRepo;

    public function __construct(IUserRepository $userRepo) {
        // SOLID: Dependency Inversion Principle (DIP)
        // High-level service now depends on an abstraction instead of a concrete repository
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

        if (!password_verify($password, $userData['password_hash'] ?? '')) {
            return null;
        }

        return $this->mapToEntity($userData);
    }

    /**
     * Get user by ID with proper entity type
     */
    public function getUserById(int $userId): ?User {
        $userData = $this->userRepo->findById($userId);

        if (!$userData) {
            return null;
        }

        return $this->mapToEntity($userData);
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

    /**
     * Map raw database row to the appropriate user entity.
     *
     * @param array $userData
     */
    private function mapToEntity(array $userData): User {
        // SOLID: LSP - callers receive a User subtype that honours the same contract
        return match ($userData['role'] ?? '') {
            'student' => new Student($userData),
            'instructor' => new Instructor($userData),
            default => new User($userData),
        };
    }
}
