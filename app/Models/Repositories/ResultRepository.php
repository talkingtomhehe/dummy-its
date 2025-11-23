<?php

namespace App\Models\Repositories;

use App\Core\Database;
use App\Models\Interfaces\IResultRepository;
use PDO;

class ResultRepository implements IResultRepository
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function getStudentGrades(int $courseId, int $studentId): array
    {
        $stmt = $this->db->prepare(
            'SELECT a.assessment_id, a.title, a.assessment_type, a.max_score,
                    t.subject_id, s.subject_name,
                    ar.score, ar.feedback, ar.status, ar.submitted_at,
                    ar.submission_file, ar.original_filenames
             FROM assessments a
             INNER JOIN topics t ON a.topic_id = t.topic_id
             INNER JOIN subjects s ON t.subject_id = s.subject_id
             LEFT JOIN assessment_results ar ON ar.assessment_id = a.assessment_id
                AND (ar.student_id = :student_id1 OR ar.user_id = :user_id1)
                AND ar.submitted_at = (
                    SELECT MAX(ar2.submitted_at)
                    FROM assessment_results ar2
                    WHERE ar2.assessment_id = a.assessment_id
                      AND (ar2.student_id = :student_id2 OR ar2.user_id = :user_id2)
                )
             WHERE t.subject_id = :course_id
             ORDER BY a.display_order, a.title'
        );

        $stmt->execute([
            'course_id' => $courseId,
            'student_id1' => $studentId,
            'user_id1' => $studentId,
            'student_id2' => $studentId,
            'user_id2' => $studentId,
        ]);

        return $stmt->fetchAll();
    }

    public function getInstructorGrades(int $courseId): array
    {
        $stmt = $this->db->prepare(
            'SELECT a.assessment_id, a.title, a.assessment_type, a.max_score,
                    t.subject_id, s.subject_name,
                    AVG(ar.score) AS average_score,
                    COUNT(ar.score) AS graded_count,
                    COUNT(ar.result_id) AS submission_count
             FROM assessments a
             INNER JOIN topics t ON a.topic_id = t.topic_id
             INNER JOIN subjects s ON t.subject_id = s.subject_id
             LEFT JOIN assessment_results ar ON ar.assessment_id = a.assessment_id
             WHERE t.subject_id = :course_id
             GROUP BY a.assessment_id, a.title, a.assessment_type, a.max_score,
                      t.subject_id, s.subject_name
             ORDER BY a.display_order, a.title'
        );

        $stmt->execute(['course_id' => $courseId]);
        return $stmt->fetchAll();
    }

    public function getAssignmentSubmissions(int $assessmentId): array
    {
        $assignmentStmt = $this->db->prepare(
            'SELECT a.*, ci.title AS content_title, t.subject_id, s.subject_name
             FROM assessments a
             LEFT JOIN content_items ci ON a.content_id = ci.content_id
             INNER JOIN topics t ON a.topic_id = t.topic_id
             INNER JOIN subjects s ON t.subject_id = s.subject_id
             WHERE a.assessment_id = :assessment_id AND a.assessment_type IN (\'assignment\', \'project\')'
        );
        $assignmentStmt->execute(['assessment_id' => $assessmentId]);
        $assignment = $assignmentStmt->fetch();

        $submissionsStmt = $this->db->prepare(
            'SELECT ar.result_id,
                    COALESCE(ar.student_id, ar.user_id) AS student_id,
                    u.full_name AS student_name,
                    ar.submission_file,
                    ar.original_filenames,
                    ar.score,
                    ar.feedback,
                    ar.submitted_at,
                    ar.status
             FROM assessment_results ar
             LEFT JOIN users u ON u.user_id = COALESCE(ar.student_id, ar.user_id)
             WHERE ar.assessment_id = :assessment_id
             ORDER BY u.full_name ASC, ar.submitted_at DESC'
        );
        $submissionsStmt->execute(['assessment_id' => $assessmentId]);
        $submissions = $submissionsStmt->fetchAll();

        return [
            'assignment' => $assignment ?: [],
            'submissions' => $submissions,
        ];
    }

    public function getQuizResults(int $assessmentId): array
    {
        $quizStmt = $this->db->prepare(
            'SELECT a.*, t.subject_id, s.subject_name
             FROM assessments a
             INNER JOIN topics t ON a.topic_id = t.topic_id
             INNER JOIN subjects s ON t.subject_id = s.subject_id
             WHERE a.assessment_id = :assessment_id AND a.assessment_type = \'quiz\''
        );
        $quizStmt->execute(['assessment_id' => $assessmentId]);
        $quiz = $quizStmt->fetch();

        $resultsStmt = $this->db->prepare(
            'SELECT ar.result_id,
                    COALESCE(ar.student_id, ar.user_id) AS student_id,
                    u.full_name AS student_name,
                    ar.score,
                    ar.feedback,
                    ar.started_at,
                    ar.completed_at,
                    ar.status
             FROM assessment_results ar
             LEFT JOIN users u ON u.user_id = COALESCE(ar.student_id, ar.user_id)
             WHERE ar.assessment_id = :assessment_id
             ORDER BY ar.completed_at IS NULL, ar.completed_at DESC, ar.started_at DESC'
        );
        $resultsStmt->execute(['assessment_id' => $assessmentId]);
        $results = $resultsStmt->fetchAll();

        return [
            'quiz' => $quiz ?: [],
            'results' => $results,
        ];
    }

    public function saveAssignmentGrades(int $assessmentId, array $grades, array $feedback): void
    {
        $select = $this->db->prepare(
            'SELECT result_id
             FROM assessment_results
             WHERE assessment_id = :assessment_id
               AND (student_id = :student_id OR user_id = :user_id)
             ORDER BY submitted_at DESC
             LIMIT 1'
        );

        $update = $this->db->prepare(
            'UPDATE assessment_results
             SET score = :score,
                 feedback = :feedback,
                 graded_at = NOW(),
                 status = CASE WHEN :score_check IS NULL THEN status ELSE \'graded\' END
             WHERE result_id = :result_id'
        );

        foreach ($grades as $studentId => $scoreValue) {
            $studentId = (int)$studentId;
            $score = $scoreValue === '' ? null : (float)$scoreValue;
            $textFeedback = $feedback[$studentId] ?? null;

            $select->execute([
                'assessment_id' => $assessmentId,
                'student_id' => $studentId,
                'user_id' => $studentId,
            ]);

            $row = $select->fetch();
            if (!$row) {
                continue;
            }
            
            $update->execute([
                'score' => $score,
                'score_check' => $score,
                'feedback' => $textFeedback,
                'result_id' => $row['result_id'],
            ]);
        }
    }

    public function submitQuizResult(array $data): int
    {
        if (!isset($data['assessment_id'], $data['user_id'], $data['score'])) {
            throw new \InvalidArgumentException('assessment_id, user_id, and score are required to record a quiz result.');
        }

        $stmt = $this->db->prepare(
            'INSERT INTO assessment_results (
                 assessment_id,
                 user_id,
                 student_id,
                 score,
                 answers,
                 time_taken,
                 status,
                 submitted_at,
                 completed_at
             ) VALUES (
                 :assessment_id,
                 :user_id,
                 :student_id,
                 :score,
                 :answers,
                 :time_taken,
                 :status,
                 NOW(),
                 NOW()
             )'
        );

        $stmt->execute([
            'assessment_id' => $data['assessment_id'],
            'user_id' => $data['user_id'],
            'student_id' => $data['student_id'] ?? $data['user_id'],
            'score' => $data['score'],
            'answers' => json_encode($data['answers'] ?? []),
            'time_taken' => $data['time_taken'] ?? null,
            'status' => $data['status'] ?? 'completed',
        ]);

        return (int)$this->db->lastInsertId();
    }

    public function submitAssignment(array $data): int
    {
        if (!isset($data['assessment_id'], $data['user_id'])) {
            throw new \InvalidArgumentException('assessment_id and user_id are required to record an assignment submission.');
        }

        $assessmentId = (int)$data['assessment_id'];
        $userId = (int)$data['user_id'];

        $lookup = $this->db->prepare(
            'SELECT result_id
             FROM assessment_results
             WHERE assessment_id = :assessment_id
               AND (user_id = :user_id OR student_id = :student_id)
             ORDER BY submitted_at DESC
             LIMIT 1'
        );
        $lookup->execute([
            'assessment_id' => $assessmentId,
            'user_id' => $userId,
            'student_id' => $userId,
        ]);

        $existingId = $lookup->fetchColumn();

        if ($existingId) {
            $update = $this->db->prepare(
                'UPDATE assessment_results
                 SET submission_file = :submission_file,
                     original_filenames = :original_filenames,
                     status = :status,
                     student_id = :student_id,
                     submitted_at = NOW()
                 WHERE result_id = :result_id'
            );
            $update->execute([
                'submission_file' => $data['submission_file'] ?? null,
                'original_filenames' => $data['original_filenames'] ?? null,
                'status' => $data['status'] ?? 'submitted',
                'student_id' => $userId,
                'result_id' => $existingId,
            ]);

            return (int)$existingId;
        }

        $insert = $this->db->prepare(
            'INSERT INTO assessment_results (
                 assessment_id,
                 user_id,
                 student_id,
                 submission_file,
                 original_filenames,
                 status,
                 submitted_at
             ) VALUES (
                 :assessment_id,
                 :user_id,
                 :student_id,
                 :submission_file,
                 :original_filenames,
                 :status,
                 NOW()
             )'
        );
        $insert->execute([
            'assessment_id' => $assessmentId,
            'user_id' => $userId,
            'student_id' => $userId,
            'submission_file' => $data['submission_file'] ?? null,
            'original_filenames' => $data['original_filenames'] ?? null,
            'status' => $data['status'] ?? 'submitted',
        ]);

        return (int)$this->db->lastInsertId();
    }

    public function getResultById(int $resultId): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT *
             FROM assessment_results
             WHERE result_id = :result_id'
        );
        $stmt->execute(['result_id' => $resultId]);
        $row = $stmt->fetch();

        return $row ?: null;
    }

    public function getResultsByStudent(int $userId, ?int $assessmentId = null): array
    {
        if ($assessmentId !== null) {
            $stmt = $this->db->prepare(
                'SELECT r.*, a.title, a.assessment_type, a.max_score
                 FROM assessment_results r
                 INNER JOIN assessments a ON r.assessment_id = a.assessment_id
                 WHERE (r.user_id = :user_id OR r.student_id = :student_id)
                   AND r.assessment_id = :assessment_id
                 ORDER BY r.submitted_at DESC'
            );

            $stmt->execute([
                'user_id' => $userId,
                'student_id' => $userId,
                'assessment_id' => $assessmentId,
            ]);
        } else {
            $stmt = $this->db->prepare(
                'SELECT r.*, a.title, a.assessment_type, a.max_score
                 FROM assessment_results r
                 INNER JOIN assessments a ON r.assessment_id = a.assessment_id
                 WHERE (r.user_id = :user_id OR r.student_id = :student_id)
                 ORDER BY r.submitted_at DESC'
            );
            $stmt->execute([
                'user_id' => $userId,
                'student_id' => $userId,
            ]);
        }

        return $stmt->fetchAll();
    }

    public function getResultsByAssessment(int $assessmentId): array
    {
        $stmt = $this->db->prepare(
            'SELECT r.*, u.full_name, u.username
             FROM assessment_results r
             LEFT JOIN users u ON u.user_id = COALESCE(r.student_id, r.user_id)
             WHERE r.assessment_id = :assessment_id
             ORDER BY r.submitted_at DESC'
        );
        $stmt->execute(['assessment_id' => $assessmentId]);

        return $stmt->fetchAll();
    }

    public function updateResult(int $resultId, array $data): bool
    {
        $stmt = $this->db->prepare(
            'UPDATE assessment_results
             SET score = :score,
                 feedback = :feedback,
                 graded_at = NOW(),
                 status = CASE WHEN :score_check IS NULL THEN status ELSE \'graded\' END
             WHERE result_id = :result_id'
        );

        return $stmt->execute([
            'result_id' => $resultId,
            'score' => $data['score'] ?? null,
            'score_check' => $data['score'] ?? null,
            'feedback' => $data['feedback'] ?? null,
        ]);
    }

    public function getGradeStatistics(int $assessmentId): array
    {
        $stmt = $this->db->prepare(
            'SELECT
                 COUNT(*) AS total_submissions,
                 AVG(score) AS average_score,
                 MAX(score) AS highest_score,
                 MIN(score) AS lowest_score,
                 SUM(CASE WHEN score >= 0 AND score < 2 THEN 1 ELSE 0 END) AS range_0_2,
                 SUM(CASE WHEN score >= 2 AND score < 4 THEN 1 ELSE 0 END) AS range_2_4,
                 SUM(CASE WHEN score >= 4 AND score < 6 THEN 1 ELSE 0 END) AS range_4_6,
                 SUM(CASE WHEN score >= 6 AND score < 8 THEN 1 ELSE 0 END) AS range_6_8,
                 SUM(CASE WHEN score >= 8 AND score <= 10 THEN 1 ELSE 0 END) AS range_8_10
             FROM assessment_results
             WHERE assessment_id = :assessment_id AND score IS NOT NULL'
        );
        $stmt->execute(['assessment_id' => $assessmentId]);

        $row = $stmt->fetch();

        return $row ?: [];
    }

    public function getGradesBySubject(int $subjectId, ?int $userId = null): array
    {
        if ($userId !== null) {
            $stmt = $this->db->prepare(
                'SELECT r.*, a.title, a.assessment_type, a.max_score, t.topic_title
                 FROM assessment_results r
                 INNER JOIN assessments a ON r.assessment_id = a.assessment_id
                 INNER JOIN topics t ON a.topic_id = t.topic_id
                 WHERE t.subject_id = :subject_id
                   AND (r.user_id = :user_id OR r.student_id = :user_id)
                 ORDER BY t.display_order, a.display_order, r.submitted_at DESC'
            );
            $stmt->execute([
                'subject_id' => $subjectId,
                'user_id' => $userId,
            ]);
        } else {
            $stmt = $this->db->prepare(
                'SELECT r.*, a.title, a.assessment_type, a.max_score,
                        t.topic_title, u.full_name
                 FROM assessment_results r
                 INNER JOIN assessments a ON r.assessment_id = a.assessment_id
                 INNER JOIN topics t ON a.topic_id = t.topic_id
                 LEFT JOIN users u ON u.user_id = COALESCE(r.student_id, r.user_id)
                 WHERE t.subject_id = :subject_id
                 ORDER BY t.display_order, a.display_order, u.full_name'
            );
            $stmt->execute(['subject_id' => $subjectId]);
        }

        return $stmt->fetchAll();
    }
}
