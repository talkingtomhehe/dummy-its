<?php
namespace App\Models\Entities;

/**
 * Instructor Entity
 * Extends User class
 * 
 * SOLID: Liskov Substitution Principle (LSP)
 * Can be used anywhere a User is expected
 */
class Instructor extends User {
    
    public function __construct(array $data = []) {
        parent::__construct($data);
        $this->role = 'instructor';
    }

    /**
     * Check if instructor owns a subject
     */
    public function ownsSubject(int $subjectId): bool {
        // Would check database in full implementation
        return true;
    }

    /**
     * Get instructor-specific data
     */
    public function getInstructorInfo(): array {
        return array_merge($this->toArray(), [
            'teaching_courses' => [], // Would fetch from database
        ]);
    }
}
