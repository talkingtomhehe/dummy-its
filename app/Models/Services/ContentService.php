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
     * Delete topic and associated content
     */
    public function deleteTopic(int $topicId): bool {
        if ($topicId <= 0) {
            throw new \InvalidArgumentException('Invalid topic identifier');
        }

        return $this->contentRepo->deleteTopic($topicId);
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

        $contentId = $this->contentRepo->createContentItem($data);
        
        // If creating a quiz or assignment, also create the assessment record
        if (in_array($data['content_type'], ['quiz', 'assignment'])) {
            $assessmentData = [
                'topic_id' => $data['topic_id'],
                'content_id' => $contentId,
                'title' => $data['title'],
                'assessment_type' => $data['content_type'] === 'quiz' ? 'quiz' : 'assignment',
                'description' => $data['content_data'] ?? null,
                'time_limit' => $data['time_limit'] ?? 0,
                'open_time' => $data['open_time'] ?? null,
                'close_time' => $data['close_time'] ?? null,
                'max_score' => 10.00,
                'is_visible' => $data['is_visible'] ?? 1,
                'display_order' => $data['display_order'] ?? 0,
            ];
            
            // Add quiz-specific fields
            if ($data['content_type'] === 'quiz') {
                $assessmentData['max_attempts'] = $data['max_attempts'] ?? 1;
                $assessmentData['grading_method'] = $data['grading_method'] ?? 'last';
            }
            
            $this->contentRepo->createAssessment($assessmentData);
        }
        
        return $contentId;
    }

    /**
     * Update content item
     */
    public function updateContentItem(int $contentId, array $data): bool {
        $result = $this->contentRepo->updateContentItem($contentId, $data);
        
        // If updating quiz or assignment, also update the assessment table
        if ($result && isset($data['content_type']) && in_array($data['content_type'], ['quiz', 'assignment'])) {
            $assessmentData = [];
            if (isset($data['open_time'])) {
                $assessmentData['open_time'] = $data['open_time'];
            }
            if (isset($data['close_time'])) {
                $assessmentData['close_time'] = $data['close_time'];
            }
            if (isset($data['time_limit'])) {
                $assessmentData['time_limit'] = $data['time_limit'];
            }
            
            // Add quiz-specific fields
            if ($data['content_type'] === 'quiz') {
                if (isset($data['max_attempts'])) {
                    $assessmentData['max_attempts'] = $data['max_attempts'];
                }
                if (isset($data['grading_method'])) {
                    $assessmentData['grading_method'] = $data['grading_method'];
                }
            }
            
            // Only update assessment if there's data to update
            if (!empty($assessmentData)) {
                $this->contentRepo->updateAssessmentByContentId($contentId, $assessmentData);
            }
        }
        
        return $result;
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

    /**
     * Get assessments that have open or close times
     */
    public function getAssessmentsWithSchedule(): array {
        return $this->contentRepo->getAssessmentsWithSchedule();
    }

    /**
     * Move topic up in display order
     */
    public function moveTopicUp(int $topicId): bool {
        return $this->contentRepo->moveTopicUp($topicId);
    }

    /**
     * Move topic down in display order
     */
    public function moveTopicDown(int $topicId): bool {
        return $this->contentRepo->moveTopicDown($topicId);
    }

    /**
     * Get student IDs for a subject
     */
    public function getStudentIdsBySubject(int $subjectId): array {
        return $this->contentRepo->getStudentIdsBySubject($subjectId);
    }

    /**
     * Get topic details for notifications
     */
    public function getTopicDetails(int $topicId): ?array {
        return $this->contentRepo->getTopicById($topicId);
    }

    /**
     * Get subject by ID
     */
    public function getSubjectById(int $subjectId): ?array {
        return $this->contentRepo->getSubjectById($subjectId);
    }

    /**
     * Get topic count by subject
     */
    public function getTopicCountBySubject(int $subjectId): int {
        return $this->contentRepo->getTopicCountBySubject($subjectId);
    }

    /**
     * Get content count by subject
     */
    public function getContentCountBySubject(int $subjectId): int {
        return $this->contentRepo->getContentCountBySubject($subjectId);
    }
}
