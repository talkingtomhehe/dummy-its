<?php
namespace App\Models\Repositories;

use App\Core\Database;
use App\Models\Interfaces\IResultRepository;
use PDO;

/**
 * ResultRepository
 * Implements IResultRepository for grading and results operations
 * 
 * SOLID: Single Responsibility Principle (SRP)
 * Dependency Inversion Principle (DIP) - implements interface
 */
class ResultRepository implements IResultRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function submitQuizResult(array $data): int {
        $stmt = $this->db->prepare("
            INSERT INTO assessment_results 
            (assessment_id, user_id, student_id, score, answers, time_taken, status, submitted_at, completed_at)
            VALUES 
            (:assessment_id, :user_id, :student_id, :score, :answers, :time_taken, :status, NOW(), NOW())
        ");
        
        $stmt->execute([
            'assessment_id' => $data['assessment_id'],
            'user_id' => $data['user_id'],
            'student_id' => $data['user_id'],
            'score' => $data['score'],
            'answers' => json_encode($data['answers']),
            'time_taken' => $data['time_taken'] ?? null,
            'status' => $data['status'] ?? 'completed',
        ]);
        
        return (int) $this->db->lastInsertId();
    }

    public function submitAssignment(array $data): int {
        $stmt = $this->db->prepare("
            INSERT INTO assessment_results 
            (assessment_id, user_id, student_id, submission_file, status, submitted_at)
            VALUES 
            (:assessment_id, :user_id, :student_id, :submission_file, :status, NOW())
        ");
        
        $stmt->execute([
            'assessment_id' => $data['assessment_id'],
            'user_id' => $data['user_id'],
            'student_id' => $data['user_id'],
            'submission_file' => $data['submission_file'] ?? null,
            'status' => $data['status'] ?? 'submitted',
        ]);
        
        return (int) $this->db->lastInsertId();
    }

    public function getResultById(int $resultId): ?array {
        $stmt = $this->db->prepare("
            SELECT * FROM assessment_results WHERE result_id = :result_id
        ");
        $stmt->execute(['result_id' => $resultId]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public function getResultsByStudent(int $userId, int $assessmentId = null): array {
        if ($assessmentId) {
            $stmt = $this->db->prepare("
                SELECT r.*, a.title, a.assessment_type, a.max_score
                FROM assessment_results r
                JOIN assessments a ON r.assessment_id = a.assessment_id
                WHERE r.user_id = :user_id AND r.assessment_id = :assessment_id
                ORDER BY r.submitted_at DESC
            ");
            $stmt->execute(['user_id' => $userId, 'assessment_id' => $assessmentId]);
        } else {
            $stmt = $this->db->prepare("
                SELECT r.*, a.title, a.assessment_type, a.max_score
                FROM assessment_results r
                JOIN assessments a ON r.assessment_id = a.assessment_id
                WHERE r.user_id = :user_id
                ORDER BY r.submitted_at DESC
            ");
            $stmt->execute(['user_id' => $userId]);
        }
        
        return $stmt->fetchAll();
    }

    public function getResultsByAssessment(int $assessmentId): array {
        $stmt = $this->db->prepare("
            SELECT r.*, u.full_name, u.username
            FROM assessment_results r
            JOIN users u ON r.user_id = u.user_id
            WHERE r.assessment_id = :assessment_id
            ORDER BY r.submitted_at DESC
        ");
        $stmt->execute(['assessment_id' => $assessmentId]);
        return $stmt->fetchAll();
    }

    public function updateResult(int $resultId, array $data): bool {
        $stmt = $this->db->prepare("
            UPDATE assessment_results 
            SET score = :score,
                feedback = :feedback,
                graded_at = NOW()
            WHERE result_id = :result_id
        ");
        
        return $stmt->execute([
            'result_id' => $resultId,
            'score' => $data['score'] ?? null,
            'feedback' => $data['feedback'] ?? null,
        ]);
    }

    public function getGradeStatistics(int $assessmentId): array {
        $stmt = $this->db->prepare("
            SELECT 
                COUNT(*) as total_submissions,
                AVG(score) as average_score,
                MAX(score) as highest_score,
                MIN(score) as lowest_score,
                SUM(CASE WHEN score >= 0 AND score < 2 THEN 1 ELSE 0 END) as range_0_2,
                SUM(CASE WHEN score >= 2 AND score < 4 THEN 1 ELSE 0 END) as range_2_4,
                SUM(CASE WHEN score >= 4 AND score < 6 THEN 1 ELSE 0 END) as range_4_6,
                SUM(CASE WHEN score >= 6 AND score < 8 THEN 1 ELSE 0 END) as range_6_8,
                SUM(CASE WHEN score >= 8 AND score <= 10 THEN 1 ELSE 0 END) as range_8_10
            FROM assessment_results
            WHERE assessment_id = :assessment_id AND score IS NOT NULL
        ");
        $stmt->execute(['assessment_id' => $assessmentId]);
        $result = $stmt->fetch();
        return $result ?: [];
    }

    public function getGradesBySubject(int $subjectId, int $userId = null): array {
        if ($userId) {
            $stmt = $this->db->prepare("
                SELECT r.*, a.title, a.assessment_type, a.max_score, t.topic_title
                FROM assessment_results r
                JOIN assessments a ON r.assessment_id = a.assessment_id
                JOIN topics t ON a.topic_id = t.topic_id
                WHERE t.subject_id = :subject_id AND r.user_id = :user_id
                ORDER BY t.display_order, a.display_order
            ");
            $stmt->execute(['subject_id' => $subjectId, 'user_id' => $userId]);
        } else {
            $stmt = $this->db->prepare("
                SELECT r.*, a.title, a.assessment_type, a.max_score, 
                       t.topic_title, u.full_name
                FROM assessment_results r
                JOIN assessments a ON r.assessment_id = a.assessment_id
                JOIN topics t ON a.topic_id = t.topic_id
                JOIN users u ON r.user_id = u.user_id
                WHERE t.subject_id = :subject_id
                ORDER BY t.display_order, a.display_order, u.full_name
            ");
            $stmt->execute(['subject_id' => $subjectId]);
        }
        
        return $stmt->fetchAll();
    }
}
