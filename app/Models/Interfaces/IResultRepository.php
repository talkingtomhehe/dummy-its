<?php

namespace App\Models\Interfaces;

interface IResultRepository
{
    public function getStudentGrades(int $courseId, int $studentId): array;

    public function getInstructorGrades(int $courseId): array;

    public function getAssignmentSubmissions(int $assessmentId): array;

    public function getQuizResults(int $assessmentId): array;

    public function saveAssignmentGrades(int $assessmentId, array $grades, array $feedback): void;

    public function submitQuizResult(array $data): int;

    public function submitAssignment(array $data): int;

    public function getResultById(int $resultId): ?array;

    public function getResultsByStudent(int $userId, ?int $assessmentId = null): array;

    public function getResultsByAssessment(int $assessmentId): array;

    public function updateResult(int $resultId, array $data): bool;

    public function getGradeStatistics(int $assessmentId): array;

    public function getGradesBySubject(int $subjectId, ?int $userId = null): array;

    public function deleteResult(int $resultId): bool;
}
