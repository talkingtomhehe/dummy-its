<?php
namespace App\Models\Repositories;

use App\Core\Database;
use App\Models\Interfaces\IQuizRepository;
use PDO;

/**
 * QuizRepository
 * Implements IQuizRepository for quiz-related database operations
 * 
 * SOLID: Single Responsibility Principle (SRP)
 * Dependency Inversion Principle (DIP) - implements interface
 */
class QuizRepository implements IQuizRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getQuizById(int $assessmentId): ?array {
        $stmt = $this->db->prepare("
            SELECT * FROM assessments 
            WHERE assessment_id = :assessment_id 
            AND assessment_type = 'quiz'
        ");
        $stmt->execute(['assessment_id' => $assessmentId]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public function getQuizzesByTopic(int $topicId): array {
        $stmt = $this->db->prepare("
            SELECT * FROM assessments 
            WHERE topic_id = :topic_id 
            AND assessment_type = 'quiz'
            ORDER BY display_order, assessment_id
        ");
        $stmt->execute(['topic_id' => $topicId]);
        return $stmt->fetchAll();
    }

    public function getQuizQuestions(int $assessmentId): array {
        $stmt = $this->db->prepare("
            SELECT * FROM quiz_questions 
            WHERE assessment_id = :assessment_id
            ORDER BY display_order, question_id
        ");
        $stmt->execute(['assessment_id' => $assessmentId]);
        return $stmt->fetchAll();
    }

    public function getQuestionWithOptions(int $questionId): ?array {
        // Get question
        $stmt = $this->db->prepare("
            SELECT * FROM quiz_questions WHERE question_id = :question_id
        ");
        $stmt->execute(['question_id' => $questionId]);
        $question = $stmt->fetch();
        
        if (!$question) {
            return null;
        }

        // Get options
        $stmt = $this->db->prepare("
            SELECT * FROM quiz_options 
            WHERE question_id = :question_id
            ORDER BY display_order, option_id
        ");
        $stmt->execute(['question_id' => $questionId]);
        $question['options'] = $stmt->fetchAll();
        
        return $question;
    }

    public function createQuiz(array $data): int {
        $stmt = $this->db->prepare("
            INSERT INTO assessments 
            (topic_id, title, assessment_type, description, time_limit, open_time, close_time, max_score, is_visible)
            VALUES 
            (:topic_id, :title, 'quiz', :description, :time_limit, :open_time, :close_time, :max_score, :is_visible)
        ");
        
        $stmt->execute([
            'topic_id' => $data['topic_id'],
            'title' => $data['title'],
            'description' => $data['description'] ?? '',
            'time_limit' => $data['time_limit'] ?? 0,
            'open_time' => $data['open_time'] ?? null,
            'close_time' => $data['close_time'] ?? null,
            'max_score' => $data['max_score'] ?? 10.0,
            'is_visible' => $data['is_visible'] ?? true,
        ]);
        
        return (int) $this->db->lastInsertId();
    }

    public function updateQuiz(int $assessmentId, array $data): bool {
        $stmt = $this->db->prepare("
            UPDATE assessments 
            SET title = :title,
                description = :description,
                time_limit = :time_limit,
                open_time = :open_time,
                close_time = :close_time,
                max_score = :max_score,
                is_visible = :is_visible
            WHERE assessment_id = :assessment_id
        ");
        
        return $stmt->execute([
            'assessment_id' => $assessmentId,
            'title' => $data['title'],
            'description' => $data['description'] ?? '',
            'time_limit' => $data['time_limit'] ?? 0,
            'open_time' => $data['open_time'] ?? null,
            'close_time' => $data['close_time'] ?? null,
            'max_score' => $data['max_score'] ?? 10.0,
            'is_visible' => $data['is_visible'] ?? true,
        ]);
    }

    public function deleteQuiz(int $assessmentId): bool {
        $stmt = $this->db->prepare("DELETE FROM assessments WHERE assessment_id = :assessment_id");
        return $stmt->execute(['assessment_id' => $assessmentId]);
    }

    public function createQuestion(array $data): int {
        $stmt = $this->db->prepare("
            INSERT INTO quiz_questions 
            (assessment_id, question_text, question_type, points, display_order)
            VALUES 
            (:assessment_id, :question_text, :question_type, :points, :display_order)
        ");
        
        $stmt->execute([
            'assessment_id' => $data['assessment_id'],
            'question_text' => $data['question_text'],
            'question_type' => $data['question_type'],
            'points' => $data['points'] ?? 1.0,
            'display_order' => $data['display_order'] ?? 0,
        ]);
        
        return (int) $this->db->lastInsertId();
    }

    public function updateQuestion(int $questionId, array $data): bool {
        $stmt = $this->db->prepare("
            UPDATE quiz_questions 
            SET question_text = :question_text,
                question_type = :question_type,
                points = :points,
                display_order = :display_order
            WHERE question_id = :question_id
        ");
        
        return $stmt->execute([
            'question_id' => $questionId,
            'question_text' => $data['question_text'],
            'question_type' => $data['question_type'],
            'points' => $data['points'] ?? 1.0,
            'display_order' => $data['display_order'] ?? 0,
        ]);
    }

    public function deleteQuestion(int $questionId): bool {
        $stmt = $this->db->prepare("DELETE FROM quiz_questions WHERE question_id = :question_id");
        return $stmt->execute(['question_id' => $questionId]);
    }

    public function createOptions(int $questionId, array $options): bool {
        $stmt = $this->db->prepare("
            INSERT INTO quiz_options 
            (question_id, option_text, is_correct, display_order)
            VALUES 
            (:question_id, :option_text, :is_correct, :display_order)
        ");
        
        foreach ($options as $index => $option) {
            $stmt->execute([
                'question_id' => $questionId,
                'option_text' => $option['text'],
                'is_correct' => $option['is_correct'] ?? false,
                'display_order' => $index,
            ]);
        }
        
        return true;
    }
}
