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
            SELECT ci.*, a.assessment_id, a.assessment_type
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
        $stmt = $this->db->prepare("DELETE FROM topics WHERE topic_id = :topic_id");
        return $stmt->execute(['topic_id' => $topicId]);
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
        
        return $stmt->execute([
            'content_id' => $contentId,
            'title' => $data['title'],
            'content_type' => $data['content_type'],
            'content_data' => $data['content_data'] ?? null,
            'file_path' => $data['file_path'] ?? null,
            'is_visible' => $data['is_visible'] ?? true,
            'display_order' => $data['display_order'] ?? 0,
        ]);
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
}
