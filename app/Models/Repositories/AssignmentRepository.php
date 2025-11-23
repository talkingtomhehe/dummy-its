<?php
namespace App\Models\Repositories;

use App\Core\Database;
use App\Models\Interfaces\IAssignmentRepository;
use PDO;

/**
 * AssignmentRepository
 * Encapsulates persistence for assignment assessments.
 *
 * SOLID: Single Responsibility Principle (SRP)
 * Handles only data access responsibilities for assignments.
 */
class AssignmentRepository implements IAssignmentRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function findById(int $assessmentId): ?array {
        $stmt = $this->db->prepare('
            SELECT a.*, ci.title AS content_title, ci.content_data,
                   t.topic_title, t.subject_id, s.subject_name
            FROM assessments a
            LEFT JOIN content_items ci ON a.content_id = ci.content_id
            LEFT JOIN topics t ON a.topic_id = t.topic_id
            LEFT JOIN subjects s ON t.subject_id = s.subject_id
            WHERE a.assessment_id = :assessment_id
              AND a.assessment_type IN ("assignment", "project")
            LIMIT 1
        ');
        $stmt->execute(['assessment_id' => $assessmentId]);
        $assignment = $stmt->fetch();

        return $assignment ?: null;
    }

    public function getStudentSubmission(int $assessmentId, int $studentId): ?array {
                $stmt = $this->db->prepare('
                        SELECT *
                        FROM assessment_results
                        WHERE assessment_id = :assessment_id
                            AND (user_id = :user_id OR student_id = :student_id)
                        ORDER BY submitted_at DESC
                        LIMIT 1
                ');
        $stmt->execute([
            'assessment_id' => $assessmentId,
            'user_id' => $studentId,
            'student_id' => $studentId,
        ]);
        $submission = $stmt->fetch();

        return $submission ?: null;
    }

    public function getSubmissionStatistics(int $assessmentId): array {
        // Get count of all students in the system
        $stmt = $this->db->prepare('
            SELECT COUNT(*) as total_students
            FROM users
            WHERE role = "student"
        ');
        $stmt->execute();
        $totalStudents = (int)($stmt->fetch()['total_students'] ?? 0);

        // Get count of students who have submitted
        $stmt = $this->db->prepare('
            SELECT COUNT(DISTINCT ar.user_id) as submitted_count
            FROM assessment_results ar
            WHERE ar.assessment_id = :assessment_id
              AND ar.status = "submitted"
        ');
        $stmt->execute(['assessment_id' => $assessmentId]);
        $submittedCount = (int)($stmt->fetch()['submitted_count'] ?? 0);

        $notSubmittedCount = max(0, $totalStudents - $submittedCount);

        return [
            'total_students' => $totalStudents,
            'submitted_count' => $submittedCount,
            'not_submitted_count' => $notSubmittedCount,
        ];
    }
}
