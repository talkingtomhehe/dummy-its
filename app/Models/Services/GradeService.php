<?php
namespace App\Models\Services;

use App\Models\Interfaces\IResultRepository;

/**
 * GradeService
 * Business logic for grading operations
 * 
 * SOLID: Single Responsibility Principle (SRP) - Grading business logic only
 * SOLID: Dependency Inversion Principle (DIP) - Depends on IResultRepository interface
 */
class GradeService {
    private IResultRepository $resultRepo;

    public function __construct(IResultRepository $resultRepo) {
        // SOLID: DIP - Injecting interface, not concrete class
        $this->resultRepo = $resultRepo;
    }

    /**
     * Get all grades for a student in a subject
     */
    public function getStudentGrades(int $userId, int $subjectId): array {
        return $this->resultRepo->getGradesBySubject($subjectId, $userId);
    }

    /**
     * Get all results for an assessment (Instructor view)
     */
    public function getAssessmentResults(int $assessmentId): array {
        return $this->resultRepo->getResultsByAssessment($assessmentId);
    }

    /**
     * Get grade statistics for an assessment
     */
    public function getGradeStatistics(int $assessmentId): array {
        $stats = $this->resultRepo->getGradeStatistics($assessmentId);
        
        // Business logic: format statistics for charts
        return [
            'total_submissions' => $stats['total_submissions'] ?? 0,
            'average' => round($stats['average_score'] ?? 0, 2),
            'highest' => $stats['highest_score'] ?? 0,
            'lowest' => $stats['lowest_score'] ?? 0,
            'distribution' => [
                $stats['range_0_2'] ?? 0,
                $stats['range_2_4'] ?? 0,
                $stats['range_4_6'] ?? 0,
                $stats['range_6_8'] ?? 0,
                $stats['range_8_10'] ?? 0,
            ],
        ];
    }

    /**
     * Update grade and feedback (Instructor)
     */
    public function updateGrade(int $resultId, float $score, string $feedback = null): bool {
        // Business logic: validate score range
        if ($score < 0 || $score > 10) {
            throw new \Exception("Score must be between 0 and 10");
        }

        return $this->resultRepo->updateResult($resultId, [
            'score' => $score,
            'feedback' => $feedback,
        ]);
    }

    /**
     * Submit assignment
     */
    public function submitAssignment(int $assessmentId, int $userId, string $filePath): int {
        return $this->resultRepo->submitAssignment([
            'assessment_id' => $assessmentId,
            'user_id' => $userId,
            'submission_file' => $filePath,
        ]);
    }

    /**
     * Check if student has submitted an assessment
     */
    public function hasSubmitted(int $userId, int $assessmentId): bool {
        $results = $this->resultRepo->getResultsByStudent($userId, $assessmentId);
        return !empty($results);
    }

    /**
     * Calculate overall subject grade
     */
    public function calculateSubjectGrade(int $userId, int $subjectId): array {
        $grades = $this->resultRepo->getGradesBySubject($subjectId, $userId);
        
        if (empty($grades)) {
            return [
                'average' => 0,
                'total_assessments' => 0,
                'completed' => 0,
            ];
        }

        $total = 0;
        $count = 0;
        
        foreach ($grades as $grade) {
            if ($grade['score'] !== null) {
                $total += $grade['score'];
                $count++;
            }
        }

        return [
            'average' => $count > 0 ? round($total / $count, 2) : 0,
            'total_assessments' => count($grades),
            'completed' => $count,
        ];
    }
}
