<?php
namespace App\Models\Interfaces;

/**
 * IAssignmentRepository contract isolates assignment persistence concerns.
 *
 * SOLID: Dependency Inversion Principle (DIP)
 * Controllers/Services depend on this abstraction instead of concrete storage.
 */
interface IAssignmentRepository {
    /**
     * Fetch assignment metadata by assessment identifier.
     */
    public function findById(int $assessmentId): ?array;

    /**
     * Fetch latest submission for the given student and assignment.
     */
    public function getStudentSubmission(int $assessmentId, int $studentId): ?array;

    /**
     * Get submission statistics for an assignment (total, submitted, not submitted counts).
     */
    public function getSubmissionStatistics(int $assessmentId): array;
}
