<?php
namespace App\Models\Interfaces;

/**
 * IContentWriter Interface
 * 
 * SOLID: Interface Segregation Principle (ISP)
 * Instructors need write operations for content management
 * This interface defines only write methods for content
 */
interface IContentWriter {
    /**
     * Create a new topic
     */
    public function createTopic(array $data): int;

    /**
     * Update an existing topic
     */
    public function updateTopic(int $topicId, array $data): bool;

    /**
     * Delete a topic
     */
    public function deleteTopic(int $topicId): bool;

    /**
     * Create a content item
     */
    public function createContentItem(array $data): int;

    /**
     * Update a content item
     */
    public function updateContentItem(int $contentId, array $data): bool;

    /**
     * Delete a content item
     */
    public function deleteContentItem(int $contentId): bool;

    /**
     * Toggle content visibility
     */
    public function toggleContentVisibility(int $contentId): bool;

    /**
     * Create assessment record for quiz or assignment
     */
    public function createAssessment(array $data): int;

    public function updateAssessmentByContentId(int $contentId, array $data): bool;

    /**
     * Move topic up in display order
     */
    public function moveTopicUp(int $topicId): bool;

    /**
     * Move topic down in display order
     */
    public function moveTopicDown(int $topicId): bool;

    /**
     * Get student IDs for a subject
     */
    public function getStudentIdsBySubject(int $subjectId): array;
}
