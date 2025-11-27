<?php
namespace App\Models\Interfaces;

/**
 * IQuizRepository Interface
 * 
 * SOLID: Dependency Inversion Principle (DIP)
 * Services depend on this abstraction for quiz operations
 */
interface IQuizRepository {
    /**
     * Get quiz by ID
     */
    public function getQuizById(int $assessmentId): ?array;

    /**
     * Get all questions for a quiz
     */
    public function getQuizQuestions(int $assessmentId): array;

    /**
     * Get question with options
     */
    public function getQuestionWithOptions(int $questionId): ?array;

    /**
     * Create a quiz
     */
    public function createQuiz(array $data): int;

    /**
     * Update a quiz
     */
    public function updateQuiz(int $assessmentId, array $data): bool;

    /**
     * Delete a quiz
     */
    public function deleteQuiz(int $assessmentId): bool;

    /**
     * Create a question
     */
    public function createQuestion(array $data): int;

    /**
     * Update a question
     */
    public function updateQuestion(int $questionId, array $data): bool;

    /**
     * Delete a question
     */
    public function deleteQuestion(int $questionId): bool;

    /**
     * Create question options
     */
    public function createOptions(int $questionId, array $options): bool;

    /**
     * Get quizzes by topic
     */
    public function getQuizzesByTopic(int $topicId): array;

    /**
     * Get quiz statistics (total students, completed count, etc.)
     */
    public function getQuizStatistics(int $assessmentId): array;

    /**
     * Get the number of attempts a user has made for a quiz
     */
    public function getAttemptCount(int $assessmentId, int $userId): int;

    /**
     * Get all attempts for a quiz by a user
     */
    public function getAllAttempts(int $assessmentId, int $userId): array;

    /**
     * Calculate final grade based on grading method (highest, average, first, last)
     */
    public function calculateFinalGrade(int $assessmentId, int $userId, string $gradingMethod): ?float;
}
