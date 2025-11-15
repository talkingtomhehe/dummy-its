<?php
namespace App\Models\Services;

use App\Models\Interfaces\IContentRepository;
use App\Models\Interfaces\IContentReader;

/**
 * ContentService
 * Business logic for content management
 * 
 * SOLID: Single Responsibility Principle (SRP) - Content business logic only
 * SOLID: Dependency Inversion Principle (DIP) - Depends on IContentRepository interface
 * SOLID: Interface Segregation Principle (ISP) - Can work with just IContentReader for read-only operations
 */
class ContentService {
    private IContentRepository $contentRepo;

    public function __construct(IContentRepository $contentRepo) {
        // SOLID: DIP - Injecting interface, not concrete class
        $this->contentRepo = $contentRepo;
    }

    /**
     * Get full course structure with topics and content
     */
    public function getCourseStructure(int $subjectId): array {
        $subject = $this->contentRepo->getSubjectById($subjectId);
        
        if (!$subject) {
            throw new \Exception("Subject not found");
        }

        $topics = $this->contentRepo->getTopicsBySubject($subjectId);
        
        // Fetch content items for each topic
        foreach ($topics as &$topic) {
            $topic['content_items'] = $this->contentRepo->getContentItemsByTopic($topic['topic_id']);
        }
        
        return [
            'subject' => $subject,
            'topics' => $topics,
        ];
    }

    /**
     * Get content item details
     */
    public function getContentItem(int $contentId): ?array {
        return $this->contentRepo->getContentItemById($contentId);
    }

    /**
     * Create new topic (Instructor only)
     */
    public function createTopic(array $data): int {
        // Business logic: validate required fields
        if (empty($data['subject_id']) || empty($data['topic_title'])) {
            throw new \Exception("Subject ID and topic title are required");
        }

        return $this->contentRepo->createTopic($data);
    }

    /**
     * Create content item (Instructor only)
     */
    public function createContentItem(array $data): int {
        // Business logic: validate required fields
        if (empty($data['topic_id']) || empty($data['title']) || empty($data['content_type'])) {
            throw new \Exception("Topic ID, title, and content type are required");
        }

        // Business logic: validate content type
        $validTypes = ['text', 'page', 'video', 'url', 'link', 'file', 'quiz', 'assignment'];
        if (!in_array($data['content_type'], $validTypes)) {
            throw new \Exception("Invalid content type");
        }

        // Normalize synonymous types
        if ($data['content_type'] === 'url') {
            $data['content_type'] = 'link';
        }

        return $this->contentRepo->createContentItem($data);
    }

    /**
     * Update content item
     */
    public function updateContentItem(int $contentId, array $data): bool {
        return $this->contentRepo->updateContentItem($contentId, $data);
    }

    /**
     * Delete content item
     */
    public function deleteContentItem(int $contentId): bool {
        return $this->contentRepo->deleteContentItem($contentId);
    }

    /**
     * Toggle content visibility
     */
    public function toggleContentVisibility(int $contentId): bool {
        return $this->contentRepo->toggleContentVisibility($contentId);
    }

    /**
     * Get all subjects
     */
    public function getAllSubjects(): array {
        return $this->contentRepo->getAllSubjects();
    }
}
