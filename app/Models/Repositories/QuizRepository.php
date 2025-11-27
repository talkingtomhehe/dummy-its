<?php
namespace App\Models\Repositories;

use App\Core\Database;
use App\Models\Interfaces\IQuizRepository;
use PDO;
use PDOException;

/**
 * QuizRepository wires quiz persistence behind the IQuizRepository contract.
 */
class QuizRepository implements IQuizRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getQuizById(int $assessmentId): ?array {
        $stmt = $this->db->prepare('
            SELECT a.*, 
                   COALESCE(ci.title, a.title) as title,
                   a.title as assessment_title,
                   ci.title as content_title,
                   t.topic_title, t.subject_id, s.subject_name
            FROM assessments a
            LEFT JOIN content_items ci ON a.content_id = ci.content_id
            JOIN topics t ON a.topic_id = t.topic_id
            JOIN subjects s ON t.subject_id = s.subject_id
            WHERE a.assessment_id = :assessment_id AND a.assessment_type = "quiz"
        ');
        $stmt->execute(['assessment_id' => $assessmentId]);
        $quiz = $stmt->fetch();

        return $quiz ?: null;
    }

    public function getQuizzesByTopic(int $topicId): array {
        $stmt = $this->db->prepare('
            SELECT *
            FROM assessments
            WHERE topic_id = :topic_id AND assessment_type = "quiz"
            ORDER BY display_order, assessment_id
        ');
        $stmt->execute(['topic_id' => $topicId]);

        return $stmt->fetchAll();
    }

    public function getQuizQuestions(int $assessmentId): array {
        $stmt = $this->db->prepare('
            SELECT q.*, o.option_id, o.option_text, o.is_correct, o.display_order AS option_display_order
            FROM quiz_questions q
            LEFT JOIN quiz_options o ON q.question_id = o.question_id
            WHERE q.assessment_id = :assessment_id
            ORDER BY q.display_order, q.question_id, o.display_order, o.option_id
        ');
        $stmt->execute(['assessment_id' => $assessmentId]);
        $rows = $stmt->fetchAll();

        if (!$rows) {
            return [];
        }

        $questions = [];

        foreach ($rows as $row) {
            $questionId = (int)$row['question_id'];

            if (!isset($questions[$questionId])) {
                $questions[$questionId] = [
                    'question_id' => $questionId,
                    'assessment_id' => (int)$row['assessment_id'],
                    'question_text' => $row['question_text'],
                    'question_type' => $row['question_type'],
                    'points' => (float)$row['points'],
                    'display_order' => (int)$row['display_order'],
                    'options' => [],
                ];
            }

            if (!empty($row['option_id'])) {
                $questions[$questionId]['options'][] = [
                    'option_id' => (int)$row['option_id'],
                    'option_text' => $row['option_text'],
                    'is_correct' => (int)$row['is_correct'] === 1,
                    'display_order' => (int)$row['option_display_order'],
                ];
            }
        }

        return array_values($questions);
    }

    public function getQuestionWithOptions(int $questionId): ?array {
        $stmt = $this->db->prepare('
            SELECT q.*, o.option_id, o.option_text, o.is_correct, o.display_order AS option_display_order
            FROM quiz_questions q
            LEFT JOIN quiz_options o ON q.question_id = o.question_id
            WHERE q.question_id = :question_id
            ORDER BY o.display_order, o.option_id
        ');
        $stmt->execute(['question_id' => $questionId]);
        $rows = $stmt->fetchAll();

        if (!$rows) {
            return null;
        }

        $question = [
            'question_id' => (int)$rows[0]['question_id'],
            'assessment_id' => (int)$rows[0]['assessment_id'],
            'question_text' => $rows[0]['question_text'],
            'question_type' => $rows[0]['question_type'],
            'points' => (float)$rows[0]['points'],
            'display_order' => (int)$rows[0]['display_order'],
            'options' => [],
        ];

        foreach ($rows as $row) {
            if (!empty($row['option_id'])) {
                $question['options'][] = [
                    'option_id' => (int)$row['option_id'],
                    'option_text' => $row['option_text'],
                    'is_correct' => (int)$row['is_correct'] === 1,
                    'display_order' => (int)$row['option_display_order'],
                ];
            }
        }

        return $question;
    }

    public function createQuiz(array $data): int {
        $stmt = $this->db->prepare('
            INSERT INTO assessments (
                topic_id,
                content_id,
                title,
                assessment_type,
                description,
                time_limit,
                open_time,
                close_time,
                max_score,
                is_visible,
                display_order,
                max_attempts,
                grading_method
            ) VALUES (
                :topic_id,
                :content_id,
                :title,
                "quiz",
                :description,
                :time_limit,
                :open_time,
                :close_time,
                :max_score,
                :is_visible,
                :display_order,
                :max_attempts,
                :grading_method
            )
        ');

        $stmt->execute([
            'topic_id' => $data['topic_id'],
            'content_id' => $data['content_id'] ?? null,
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'time_limit' => $data['time_limit'] ?? 0,
            'open_time' => $data['open_time'] ?? null,
            'close_time' => $data['close_time'] ?? null,
            'max_score' => $data['max_score'] ?? 10,
            'is_visible' => $data['is_visible'] ?? 1,
            'display_order' => $data['display_order'] ?? 0,
            'max_attempts' => $data['max_attempts'] ?? 1,
            'grading_method' => $data['grading_method'] ?? 'last',
        ]);

        return (int)$this->db->lastInsertId();
    }

    public function updateQuiz(int $assessmentId, array $data): bool {
        $stmt = $this->db->prepare('
            UPDATE assessments
            SET title = :title,
                description = :description,
                time_limit = :time_limit,
                open_time = :open_time,
                close_time = :close_time,
                max_score = :max_score,
                is_visible = :is_visible,
                display_order = :display_order,
                max_attempts = :max_attempts,
                grading_method = :grading_method
            WHERE assessment_id = :assessment_id AND assessment_type = "quiz"
        ');

        return $stmt->execute([
            'assessment_id' => $assessmentId,
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'time_limit' => $data['time_limit'] ?? 0,
            'open_time' => $data['open_time'] ?? null,
            'close_time' => $data['close_time'] ?? null,
            'max_score' => $data['max_score'] ?? 10,
            'is_visible' => $data['is_visible'] ?? 1,
            'display_order' => $data['display_order'] ?? 0,
            'max_attempts' => $data['max_attempts'] ?? 1,
            'grading_method' => $data['grading_method'] ?? 'last',
        ]);
    }

    public function deleteQuiz(int $assessmentId): bool {
        try {
            $this->db->beginTransaction();

            $questionIdStmt = $this->db->prepare('SELECT question_id FROM quiz_questions WHERE assessment_id = :assessment_id');
            $questionIdStmt->execute(['assessment_id' => $assessmentId]);
            $questionIds = $questionIdStmt->fetchAll(PDO::FETCH_COLUMN);

            if (!empty($questionIds)) {
                $placeholders = implode(',', array_fill(0, count($questionIds), '?'));
                $this->db->prepare("DELETE FROM quiz_options WHERE question_id IN ($placeholders)")->execute($questionIds);
                $this->db->prepare("DELETE FROM quiz_questions WHERE question_id IN ($placeholders)")->execute($questionIds);
            }

            $stmt = $this->db->prepare('DELETE FROM assessments WHERE assessment_id = :assessment_id AND assessment_type = "quiz"');
            $stmt->execute(['assessment_id' => $assessmentId]);

            $this->db->commit();
            return true;
        } catch (PDOException $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    public function createQuestion(array $data): int {
        $stmt = $this->db->prepare('
            INSERT INTO quiz_questions (
                assessment_id,
                question_text,
                question_type,
                points,
                display_order
            ) VALUES (
                :assessment_id,
                :question_text,
                :question_type,
                :points,
                :display_order
            )
        ');

        $stmt->execute([
            'assessment_id' => $data['assessment_id'],
            'question_text' => $data['question_text'],
            'question_type' => $data['question_type'],
            'points' => $data['points'] ?? 1,
            'display_order' => $data['display_order'] ?? 0,
        ]);

        return (int)$this->db->lastInsertId();
    }

    public function updateQuestion(int $questionId, array $data): bool {
        $stmt = $this->db->prepare('
            UPDATE quiz_questions
            SET question_text = :question_text,
                question_type = :question_type,
                points = :points,
                display_order = :display_order
            WHERE question_id = :question_id
        ');

        return $stmt->execute([
            'question_id' => $questionId,
            'question_text' => $data['question_text'],
            'question_type' => $data['question_type'],
            'points' => $data['points'] ?? 1,
            'display_order' => $data['display_order'] ?? 0,
        ]);
    }

    public function deleteQuestion(int $questionId): bool {
        try {
            $this->db->beginTransaction();
            $this->db->prepare('DELETE FROM quiz_options WHERE question_id = :question_id')->execute(['question_id' => $questionId]);
            $this->db->prepare('DELETE FROM quiz_questions WHERE question_id = :question_id')->execute(['question_id' => $questionId]);
            $this->db->commit();
            return true;
        } catch (PDOException $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    public function createOptions(int $questionId, array $options): bool {
        $this->db->prepare('DELETE FROM quiz_options WHERE question_id = :question_id')->execute(['question_id' => $questionId]);

        if (empty($options)) {
            return true;
        }

        $stmt = $this->db->prepare('
            INSERT INTO quiz_options (
                question_id,
                option_text,
                is_correct,
                display_order
            ) VALUES (
                :question_id,
                :option_text,
                :is_correct,
                :display_order
            )
        ');

        foreach ($options as $index => $option) {
            $stmt->execute([
                'question_id' => $questionId,
                'option_text' => $option['option_text'],
                'is_correct' => !empty($option['is_correct']) ? 1 : 0,
                'display_order' => $option['display_order'] ?? $index,
            ]);
        }

        return true;
    }

    public function getQuizStatistics(int $assessmentId): array {
        // Get total students in the system (since there's no enrollment table)
        // In a real application, this would query an enrollments table
        $stmt = $this->db->prepare('
            SELECT COUNT(*) as total_students
            FROM users
            WHERE role = \'student\'
        ');
        $stmt->execute();
        $totalStudents = (int)($stmt->fetch()['total_students'] ?? 0);

        // Get number of students who completed the quiz
        $stmt = $this->db->prepare('
            SELECT COUNT(DISTINCT COALESCE(ar.student_id, ar.user_id)) as completed_count
            FROM assessment_results ar
            WHERE ar.assessment_id = :assessment_id
            AND ar.status IN (\'completed\', \'graded\')
        ');
        $stmt->execute(['assessment_id' => $assessmentId]);
        $completedCount = (int)($stmt->fetch()['completed_count'] ?? 0);

        return [
            'total_students' => $totalStudents,
            'completed_count' => $completedCount,
            'not_completed_count' => $totalStudents - $completedCount,
        ];
    }

    public function getAttemptCount(int $assessmentId, int $userId): int {
        $stmt = $this->db->prepare('
            SELECT COUNT(*) as attempt_count
            FROM assessment_results
            WHERE assessment_id = :assessment_id
            AND user_id = :user_id
            AND status IN (\'completed\', \'graded\')
        ');
        $stmt->execute([
            'assessment_id' => $assessmentId,
            'user_id' => $userId,
        ]);
        return (int)($stmt->fetch()['attempt_count'] ?? 0);
    }

    public function getAllAttempts(int $assessmentId, int $userId): array {
        $stmt = $this->db->prepare('
            SELECT *
            FROM assessment_results
            WHERE assessment_id = :assessment_id
            AND user_id = :user_id
            AND status IN (\'completed\', \'graded\')
            ORDER BY attempt_number ASC
        ');
        $stmt->execute([
            'assessment_id' => $assessmentId,
            'user_id' => $userId,
        ]);
        return $stmt->fetchAll();
    }

    public function calculateFinalGrade(int $assessmentId, int $userId, string $gradingMethod): ?float {
        $attempts = $this->getAllAttempts($assessmentId, $userId);
        
        if (empty($attempts)) {
            return null;
        }

        $scores = array_map(function($attempt) {
            return (float)($attempt['score'] ?? 0);
        }, $attempts);

        switch ($gradingMethod) {
            case 'highest':
                return max($scores);
            case 'average':
                return array_sum($scores) / count($scores);
            case 'first':
                return $scores[0];
            case 'last':
            default:
                return end($scores);
        }
    }
}

