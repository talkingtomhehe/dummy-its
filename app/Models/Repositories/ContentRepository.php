<?php
namespace App\Models\Repositories;

use App\Core\Database;
use App\Models\Interfaces\IContentRepository;
use PDO;

/**
 * ContentRepository
 * Implements both IContentReader and IContentWriter through IContentRepository
 * 
 * SOLID: Interface Segregation Principle (ISP)
 * Implements both read and write interfaces
 * Student services will depend only on IContentReader
 * Instructor services can use the full IContentRepository
 */
class ContentRepository implements IContentRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    // ========== READ OPERATIONS (IContentReader) ==========

    public function getSubjectById(int $subjectId): ?array {
        $stmt = $this->db->prepare("
            SELECT s.*, u.full_name as instructor_name
            FROM subjects s
            LEFT JOIN users u ON s.instructor_id = u.user_id
            WHERE s.subject_id = :subject_id
        ");
        $stmt->execute(['subject_id' => $subjectId]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public function getAllSubjects(): array {
        $stmt = $this->db->query("
            SELECT s.*, u.full_name as instructor_name
            FROM subjects s
            LEFT JOIN users u ON s.instructor_id = u.user_id
            ORDER BY s.subject_name
        ");
        return $stmt->fetchAll();
    }

    public function getTopicById(int $topicId): ?array {
        $stmt = $this->db->prepare("
            SELECT * FROM topics WHERE topic_id = :topic_id
        ");
        $stmt->execute(['topic_id' => $topicId]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public function getTopicsBySubject(int $subjectId): array {
        $stmt = $this->db->prepare("
            SELECT * FROM topics 
            WHERE subject_id = :subject_id
            ORDER BY display_order, topic_id
        ");
        $stmt->execute(['subject_id' => $subjectId]);
        return $stmt->fetchAll();
    }

    public function getContentItemsByTopic(int $topicId): array {
        $stmt = $this->db->prepare("
            SELECT ci.*, a.assessment_id, a.assessment_type
            FROM content_items ci
            LEFT JOIN assessments a ON a.content_id = ci.content_id
            WHERE ci.topic_id = :topic_id
            ORDER BY ci.display_order, ci.content_id
        ");
        $stmt->execute(['topic_id' => $topicId]);
        return $stmt->fetchAll();
    }

    public function getContentItemById(int $contentId): ?array {
        $stmt = $this->db->prepare("
            SELECT ci.*, a.assessment_id, a.assessment_type, a.open_time, a.close_time, a.time_limit, a.max_attempts, a.grading_method
            FROM content_items ci
            LEFT JOIN assessments a ON a.content_id = ci.content_id
            WHERE ci.content_id = :content_id
        ");
        $stmt->execute(['content_id' => $contentId]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    // ========== WRITE OPERATIONS (IContentWriter) ==========

    public function createTopic(array $data): int {
        $stmt = $this->db->prepare("
            INSERT INTO topics (subject_id, topic_title, description, display_order)
            VALUES (:subject_id, :topic_title, :description, :display_order)
        ");
        
        $stmt->execute([
            'subject_id' => $data['subject_id'],
            'topic_title' => $data['topic_title'],
            'description' => $data['description'] ?? '',
            'display_order' => $data['display_order'] ?? 0,
        ]);
        
        return (int) $this->db->lastInsertId();
    }

    public function updateTopic(int $topicId, array $data): bool {
        $stmt = $this->db->prepare("
            UPDATE topics 
            SET topic_title = :topic_title, 
                description = :description,
                display_order = :display_order
            WHERE topic_id = :topic_id
        ");
        
        return $stmt->execute([
            'topic_id' => $topicId,
            'topic_title' => $data['topic_title'],
            'description' => $data['description'] ?? '',
            'display_order' => $data['display_order'] ?? 0,
        ]);
    }

    public function deleteTopic(int $topicId): bool {
        try {
            $this->db->beginTransaction();

            $deleteAssessments = $this->db->prepare('DELETE FROM assessments WHERE topic_id = :topic_id');
            $deleteAssessments->execute(['topic_id' => $topicId]);

            $deleteContent = $this->db->prepare('DELETE FROM content_items WHERE topic_id = :topic_id');
            $deleteContent->execute(['topic_id' => $topicId]);

            $deleteTopic = $this->db->prepare('DELETE FROM topics WHERE topic_id = :topic_id');
            $deleteTopic->execute(['topic_id' => $topicId]);

            $this->db->commit();
            return $deleteTopic->rowCount() > 0;
        } catch (\Throwable $throwable) {
            $this->db->rollBack();
            throw $throwable;
        }
    }

    public function createContentItem(array $data): int {
        $stmt = $this->db->prepare("
            INSERT INTO content_items 
            (topic_id, title, content_type, content_data, file_path, is_visible, display_order)
            VALUES 
            (:topic_id, :title, :content_type, :content_data, :file_path, :is_visible, :display_order)
        ");
        
        $stmt->execute([
            'topic_id' => $data['topic_id'],
            'title' => $data['title'],
            'content_type' => $data['content_type'],
            'content_data' => $data['content_data'] ?? null,
            'file_path' => $data['file_path'] ?? null,
            'is_visible' => $data['is_visible'] ?? true,
            'display_order' => $data['display_order'] ?? 0,
        ]);
        
        return (int) $this->db->lastInsertId();
    }

    public function updateContentItem(int $contentId, array $data): bool {
        try {
            $this->db->beginTransaction();
            
            $stmt = $this->db->prepare("
                UPDATE content_items 
                SET title = :title,
                    content_type = :content_type,
                    content_data = :content_data,
                    file_path = :file_path,
                    is_visible = :is_visible,
                    display_order = :display_order
                WHERE content_id = :content_id
            ");
            
            $result = $stmt->execute([
                'content_id' => $contentId,
                'title' => $data['title'],
                'content_type' => $data['content_type'],
                'content_data' => $data['content_data'] ?? null,
                'file_path' => $data['file_path'] ?? null,
                'is_visible' => $data['is_visible'] ?? true,
                'display_order' => $data['display_order'] ?? 0,
            ]);
            
            // Also update the title in the assessment table if this is a quiz/assignment
            if ($result && in_array($data['content_type'], ['quiz', 'assignment'], true)) {
                $assessmentStmt = $this->db->prepare("
                    UPDATE assessments 
                    SET title = :title
                    WHERE content_id = :content_id
                ");
                $assessmentStmt->execute([
                    'title' => $data['title'],
                    'content_id' => $contentId,
                ]);
            }
            
            $this->db->commit();
            return $result;
        } catch (\Throwable $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    public function updateAssessmentByContentId(int $contentId, array $data): bool {
        // Build dynamic UPDATE query based on provided fields
        $fields = [];
        $params = ['content_id' => $contentId];
        
        if (isset($data['open_time'])) {
            $fields[] = 'open_time = :open_time';
            $params['open_time'] = $data['open_time'];
        }
        if (isset($data['close_time'])) {
            $fields[] = 'close_time = :close_time';
            $params['close_time'] = $data['close_time'];
        }
        if (isset($data['time_limit'])) {
            $fields[] = 'time_limit = :time_limit';
            $params['time_limit'] = $data['time_limit'];
        }
        if (isset($data['max_attempts'])) {
            $fields[] = 'max_attempts = :max_attempts';
            $params['max_attempts'] = $data['max_attempts'];
        }
        if (isset($data['grading_method'])) {
            $fields[] = 'grading_method = :grading_method';
            $params['grading_method'] = $data['grading_method'];
        }
        
        if (empty($fields)) {
            return true; // Nothing to update
        }
        
        $sql = "UPDATE assessments SET " . implode(', ', $fields) . " WHERE content_id = :content_id";
        $stmt = $this->db->prepare($sql);
        
        return $stmt->execute($params);
    }

    public function deleteContentItem(int $contentId): bool {
        $stmt = $this->db->prepare("DELETE FROM content_items WHERE content_id = :content_id");
        return $stmt->execute(['content_id' => $contentId]);
    }

    public function toggleContentVisibility(int $contentId): bool {
        $stmt = $this->db->prepare("
            UPDATE content_items 
            SET is_visible = NOT is_visible
            WHERE content_id = :content_id
        ");
        return $stmt->execute(['content_id' => $contentId]);
    }

    public function getAssessmentsWithSchedule(): array {
        $stmt = $this->db->prepare(
            "
            SELECT assessment_id, title, assessment_type, description, time_limit, open_time, close_time, max_score
            FROM assessments
            WHERE open_time IS NOT NULL OR close_time IS NOT NULL
            ORDER BY COALESCE(open_time, close_time)
            "
        );
        $stmt->execute();

        return $stmt->fetchAll();
    }

    public function createAssessment(array $data): int {
        $stmt = $this->db->prepare("
            INSERT INTO assessments 
            (topic_id, content_id, title, assessment_type, description, time_limit, open_time, close_time, max_score, is_visible, display_order, max_attempts, grading_method)
            VALUES 
            (:topic_id, :content_id, :title, :assessment_type, :description, :time_limit, :open_time, :close_time, :max_score, :is_visible, :display_order, :max_attempts, :grading_method)
        ");
        
        $stmt->execute([
            'topic_id' => $data['topic_id'],
            'content_id' => $data['content_id'] ?? null,
            'title' => $data['title'],
            'assessment_type' => $data['assessment_type'],
            'description' => $data['description'] ?? null,
            'time_limit' => $data['time_limit'] ?? 0,
            'open_time' => $data['open_time'] ?? null,
            'close_time' => $data['close_time'] ?? null,
            'max_score' => $data['max_score'] ?? 10.00,
            'is_visible' => $data['is_visible'] ?? 1,
            'display_order' => $data['display_order'] ?? 0,
            'max_attempts' => $data['max_attempts'] ?? 1,
            'grading_method' => $data['grading_method'] ?? 'last',
        ]);
        
        return (int) $this->db->lastInsertId();
    }

    public function moveTopicUp(int $topicId): bool {
        $topic = $this->getTopicById($topicId);
        if (!$topic) return false;

        // Get the previous topic with lower display_order in the same subject
        $stmt = $this->db->prepare("
            SELECT * FROM topics 
            WHERE subject_id = :subject_id AND display_order < :current_order
            ORDER BY display_order DESC
            LIMIT 1
        ");
        $stmt->execute([
            'subject_id' => $topic['subject_id'],
            'current_order' => $topic['display_order']
        ]);
        $prevTopic = $stmt->fetch();

        if (!$prevTopic) return false;

        // Swap display_order
        $this->db->beginTransaction();
        try {
            $tempOrder = -999999;
            $update1 = $this->db->prepare("UPDATE topics SET display_order = :order WHERE topic_id = :id");
            $update1->execute(['order' => $tempOrder, 'id' => $topicId]);
            $update1->execute(['order' => $topic['display_order'], 'id' => $prevTopic['topic_id']]);
            $update1->execute(['order' => $prevTopic['display_order'], 'id' => $topicId]);
            
            $this->db->commit();
            return true;
        } catch (\Exception $e) {
            $this->db->rollBack();
            return false;
        }
    }

    public function moveTopicDown(int $topicId): bool {
        $topic = $this->getTopicById($topicId);
        if (!$topic) return false;

        // Get the next topic with higher display_order in the same subject
        $stmt = $this->db->prepare("
            SELECT * FROM topics 
            WHERE subject_id = :subject_id AND display_order > :current_order
            ORDER BY display_order ASC
            LIMIT 1
        ");
        $stmt->execute([
            'subject_id' => $topic['subject_id'],
            'current_order' => $topic['display_order']
        ]);
        $nextTopic = $stmt->fetch();

        if (!$nextTopic) return false;

        // Swap display_order
        $this->db->beginTransaction();
        try {
            $tempOrder = -999999;
            $update1 = $this->db->prepare("UPDATE topics SET display_order = :order WHERE topic_id = :id");
            $update1->execute(['order' => $tempOrder, 'id' => $topicId]);
            $update1->execute(['order' => $topic['display_order'], 'id' => $nextTopic['topic_id']]);
            $update1->execute(['order' => $nextTopic['display_order'], 'id' => $topicId]);
            
            $this->db->commit();
            return true;
        } catch (\Exception $e) {
            $this->db->rollBack();
            return false;
        }
    }

    public function getStudentIdsBySubject(int $subjectId): array {
        // For now, return all students. In a real app, this would return enrolled students
        $stmt = $this->db->prepare("SELECT user_id FROM users WHERE role = 'student'");
        $stmt->execute();
        $users = $stmt->fetchAll();
        return array_column($users, 'user_id');
    }

    public function getTopicCountBySubject(int $subjectId): int {
        $stmt = $this->db->prepare("SELECT COUNT(*) as count FROM topics WHERE subject_id = :subject_id");
        $stmt->execute(['subject_id' => $subjectId]);
        $result = $stmt->fetch();
        return (int)($result['count'] ?? 0);
    }

    public function getContentCountBySubject(int $subjectId): int {
        $stmt = $this->db->prepare("
            SELECT COUNT(*) as count 
            FROM content_items ci
            JOIN topics t ON ci.topic_id = t.topic_id
            WHERE t.subject_id = :subject_id
        ");
        $stmt->execute(['subject_id' => $subjectId]);
        $result = $stmt->fetch();
        return (int)($result['count'] ?? 0);
    }
}
