<?php
namespace App\Models\Interfaces;

/**
 * IResultRepository Interface
 * 
 * SOLID: Dependency Inversion Principle (DIP)
 * Services depend on this abstraction for result/grading operations
 */
interface IResultRepository {
    /**
     * Submit a quiz result
     */
    public function submitQuizResult(array $data): int;

    /**
     * Get result by ID
     */
    public function getResultById(int $resultId): ?array;

    /**
     * Get results for a student
     */
    public function getResultsByStudent(int $userId, int $assessmentId = null): array;

    /**
     * Get all results for an assessment
     */
    public function getResultsByAssessment(int $assessmentId): array;

    /**
     * Update result score and feedback
     */
    public function updateResult(int $resultId, array $data): bool;

    /**
     * Submit assignment file
     */
    public function submitAssignment(array $data): int;

    /**
     * Get grade statistics for an assessment
     */
    public function getGradeStatistics(int $assessmentId): array;

    /**
     * Get all grades for a subject
     */
    public function getGradesBySubject(int $subjectId, int $userId = null): array;
}
