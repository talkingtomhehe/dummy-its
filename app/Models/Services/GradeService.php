<?php
namespace App\Models\Services;

use App\Models\Interfaces\IResultRepository;

/**
 * GradeService
 * Business logic for grading operations
 */
class GradeService
{
    private IResultRepository $resultRepo;

    public function __construct(IResultRepository $resultRepo)
    {
        $this->resultRepo = $resultRepo;
    }

    /**
     * Get all grades for a student within a course subject.
     */
    public function getStudentGrades(int $studentId, int $courseId): array
    {
        $rows = $this->resultRepo->getStudentGrades($courseId, $studentId);

        return array_map(static function (array $row): array {
            $hasScore = array_key_exists('score', $row) && $row['score'] !== null;

            return [
                'assessment_id' => (int) ($row['assessment_id'] ?? 0),
                'title' => $row['title'] ?? '',
                'type' => $row['assessment_type'] ?? ($row['type'] ?? ''),
                'max_score' => $row['max_score'] ?? null,
                'score' => $hasScore ? (float) $row['score'] : null,
                'feedback' => $row['feedback'] ?? null,
                'status' => $row['status'] ?? null,
                'submitted_at' => $row['submitted_at'] ?? null,
                'submission_file' => $row['submission_file'] ?? null,
            ];
        }, $rows);
    }

    /**
     * Get instructor overview across assessments for a course.
     */
    public function getInstructorGrades(int $courseId): array
    {
        $rows = $this->resultRepo->getInstructorGrades($courseId);

        $assessments = array_map(static function (array $row): array {
            $average = array_key_exists('average_score', $row) && $row['average_score'] !== null
                ? (float) $row['average_score']
                : null;

            return [
                'id' => (int) ($row['assessment_id'] ?? 0),
                'title' => $row['title'] ?? '',
                'type' => $row['assessment_type'] ?? ($row['type'] ?? ''),
                'max_score' => $row['max_score'] ?? null,
                'average_score' => $average,
                'graded_count' => (int) ($row['graded_count'] ?? 0),
                'submission_count' => (int) ($row['submission_count'] ?? 0),
            ];
        }, $rows);

        return [
            'assessments' => $assessments,
            'statistics' => $this->buildInstructorStatistics($assessments),
        ];
    }

    /**
     * Get assignment submissions and metadata for grading.
     */
    public function getAssignmentSubmissions(int $assessmentId): array
    {
        $data = $this->resultRepo->getAssignmentSubmissions($assessmentId);
        $assignment = $data['assignment'] ?? [];
        $submissions = $data['submissions'] ?? [];

        $assignmentPayload = [];
        if (!empty($assignment)) {
            $assignmentPayload = [
                'id' => (int) ($assignment['assessment_id'] ?? $assessmentId),
                'title' => $assignment['title'] ?? $assignment['content_title'] ?? '',
                'max_score' => $assignment['max_score'] ?? null,
                'subject_id' => $assignment['subject_id'] ?? null,
                'subject_name' => $assignment['subject_name'] ?? null,
            ];
        }

        $submissionPayload = array_map(static function (array $row): array {
            $hasScore = array_key_exists('score', $row) && $row['score'] !== null;
            
            // Decode file paths and original names if JSON
            $filePath = $row['submission_file'] ?? $row['file_path'] ?? null;
            $originalNames = $row['original_filenames'] ?? null;
            
            if ($filePath && $filePath[0] === '[') {
                $filePath = json_decode($filePath, true);
            }
            if ($originalNames && $originalNames[0] === '[') {
                $originalNames = json_decode($originalNames, true);
            }

            return [
                'result_id' => isset($row['result_id']) ? (int) $row['result_id'] : null,
                'student_id' => isset($row['student_id']) ? (int) $row['student_id'] : null,
                'student_name' => $row['student_name'] ?? '',
                'file_path' => $filePath,
                'original_filenames' => $originalNames,
                'grade' => $hasScore ? (float) $row['score'] : null,
                'feedback' => $row['feedback'] ?? null,
                'submitted_at' => $row['submitted_at'] ?? null,
                'status' => $row['status'] ?? null,
            ];
        }, $submissions);

        return [
            'assignment' => $assignmentPayload,
            'submissions' => $submissionPayload,
        ];
    }

    /**
     * Persist assignment grading updates.
     */
    public function saveAssignmentGrades(int $assessmentId, array $grades, array $feedback): void
    {
        $this->resultRepo->saveAssignmentGrades($assessmentId, $grades, $feedback);
    }

    /**
     * Get quiz results for instructor reporting.
     */
    public function getQuizResults(int $quizId): array
    {
        $data = $this->resultRepo->getQuizResults($quizId);
        $quiz = $data['quiz'] ?? [];
        $results = $data['results'] ?? [];

        $quizPayload = [];
        if (!empty($quiz)) {
            $quizPayload = [
                'id' => (int) ($quiz['assessment_id'] ?? $quizId),
                'title' => $quiz['title'] ?? '',
                'max_score' => $quiz['max_score'] ?? null,
                'subject_id' => $quiz['subject_id'] ?? null,
                'subject_name' => $quiz['subject_name'] ?? null,
            ];
        }

        $resultPayload = array_map(static function (array $row): array {
            $hasScore = array_key_exists('score', $row) && $row['score'] !== null;

            return [
                'result_id' => isset($row['result_id']) ? (int) $row['result_id'] : null,
                'student_id' => isset($row['student_id']) ? (int) $row['student_id'] : null,
                'student_name' => $row['student_name'] ?? '',
                'score' => $hasScore ? (float) $row['score'] : null,
                'feedback' => $row['feedback'] ?? null,
                'started_at' => $row['started_at'] ?? null,
                'completed_at' => $row['completed_at'] ?? null,
                'status' => $row['status'] ?? null,
            ];
        }, $results);

        return [
            'quiz' => $quizPayload,
            'results' => $resultPayload,
        ];
    }

    /**
     * Get all results for an assessment (Instructor view).
     */
    public function getAssessmentResults(int $assessmentId): array
    {
        return $this->resultRepo->getResultsByAssessment($assessmentId);
    }

    /**
     * Get grade statistics for an assessment.
     */
    public function getGradeStatistics(int $assessmentId): array
    {
        $stats = $this->resultRepo->getGradeStatistics($assessmentId);

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
     * Update grade and feedback (Instructor).
     */
    public function updateGrade(int $resultId, float $score, string $feedback = null): bool
    {
        if ($score < 0 || $score > 10) {
            throw new \InvalidArgumentException('Score must be between 0 and 10.');
        }

        return $this->resultRepo->updateResult($resultId, [
            'score' => $score,
            'feedback' => $feedback,
        ]);
    }

    /**
     * Update textual feedback without changing the existing score.
     */
    public function updateFeedback(int $resultId, ?string $feedback): bool
    {
        $result = $this->resultRepo->getResultById($resultId);

        if (!$result) {
            throw new \InvalidArgumentException('Result not found.');
        }

        return $this->resultRepo->updateResult($resultId, [
            'score' => $result['score'] ?? null,
            'feedback' => $feedback,
        ]);
    }

    /**
     * Get result by ID
     */
    public function getResultById(int $resultId): ?array
    {
        return $this->resultRepo->getResultById($resultId);
    }

    /**
     * Delete a result/attempt
     */
    public function deleteResult(int $resultId): bool
    {
        $result = $this->resultRepo->getResultById($resultId);
        if (!$result) {
            throw new \InvalidArgumentException('Result not found.');
        }
        
        return $this->resultRepo->deleteResult($resultId);
    }

    /**
     * Submit assignment.
     */
    public function submitAssignment(int $assessmentId, int $userId, string $filePath): int
    {
        return $this->resultRepo->submitAssignment([
            'assessment_id' => $assessmentId,
            'user_id' => $userId,
            'submission_file' => $filePath,
        ]);
    }

    /**
     * Check if student has submitted an assessment.
     */
    public function hasSubmitted(int $userId, int $assessmentId): bool
    {
        $results = $this->resultRepo->getResultsByStudent($userId, $assessmentId);
        return !empty($results);
    }

    /**
     * Calculate overall subject grade.
     */
    public function calculateSubjectGrade(int $userId, int $subjectId): array
    {
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
            if (($grade['score'] ?? null) !== null) {
                $total += (float) $grade['score'];
                $count++;
            }
        }

        return [
            'average' => $count > 0 ? round($total / $count, 2) : 0,
            'total_assessments' => count($grades),
            'completed' => $count,
        ];
    }

    private function buildInstructorStatistics(array $assessments): array
    {
        if (empty($assessments)) {
            return [
                'average_score' => null,
                'total_submissions' => 0,
                'total_graded' => 0,
            ];
        }

        $averages = array_filter(
            array_column($assessments, 'average_score'),
            static fn($score) => $score !== null
        );

        $averageScore = null;
        if (!empty($averages)) {
            $averageScore = round(array_sum($averages) / count($averages), 2);
        }

        return [
            'average_score' => $averageScore,
            'total_submissions' => array_sum(array_column($assessments, 'submission_count')),
            'total_graded' => array_sum(array_column($assessments, 'graded_count')),
        ];
    }
}
