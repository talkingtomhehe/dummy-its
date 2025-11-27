<?php
namespace App\Models\Interfaces;

/**
 * IContentReader Interface
 * 
 * SOLID: Interface Segregation Principle (ISP)
 * Students only need read operations, not write operations
 * This interface defines only read methods for content
 */
interface IContentReader {
    /**
     * Get a single topic by ID
     */
    public function getTopicById(int $topicId): ?array;

    /**
     * Get all topics for a subject
     */
    public function getTopicsBySubject(int $subjectId): array;

    /**
     * Get content items for a topic
     */
    public function getContentItemsByTopic(int $topicId): array;

    /**
     * Get a single content item
     */
    public function getContentItemById(int $contentId): ?array;

    /**
     * Get subject by ID
     */
    public function getSubjectById(int $subjectId): ?array;

    /**
     * Get all subjects
     */
    public function getAllSubjects(): array;

    /**
     * Get assessments that have scheduling information
     */
    public function getAssessmentsWithSchedule(): array;

    /**
     * Get topic count for a subject
     */
    public function getTopicCountBySubject(int $subjectId): int;

    /**
     * Get content count for a subject
     */
    public function getContentCountBySubject(int $subjectId): int;
}
