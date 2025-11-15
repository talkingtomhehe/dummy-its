<?php
namespace App\Models\Entities;

/**
 * Student Entity
 * Extends User class
 * 
 * SOLID: Liskov Substitution Principle (LSP)
 * Can be used anywhere a User is expected
 */
class Student extends User {
    
    public function __construct(array $data = []) {
        parent::__construct($data);
        $this->role = 'student';
    }

    /**
     * Check if student can access content
     */
    public function canAccessContent(int $subjectId): bool {
        // In a full implementation, check enrollment
        return true;
    }

    /**
     * Get student-specific data
     */
    public function getStudentInfo(): array {
        return array_merge($this->toArray(), [
            'enrolled_courses' => [], // Would fetch from database
        ]);
    }
}
