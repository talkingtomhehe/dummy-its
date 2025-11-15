<?php
namespace App\Models\Entities;

/**
 * Topic Entity
 */
class Topic {
    private int $topicId;
    private int $subjectId;
    private string $topicTitle;
    private string $description;
    private int $displayOrder;

    public function __construct(array $data = []) {
        if (!empty($data)) {
            $this->topicId = $data['topic_id'] ?? 0;
            $this->subjectId = $data['subject_id'] ?? 0;
            $this->topicTitle = $data['topic_title'] ?? '';
            $this->description = $data['description'] ?? '';
            $this->displayOrder = $data['display_order'] ?? 0;
        }
    }

    // Getters
    public function getTopicId(): int { return $this->topicId; }
    public function getSubjectId(): int { return $this->subjectId; }
    public function getTopicTitle(): string { return $this->topicTitle; }
    public function getDescription(): string { return $this->description; }
    public function getDisplayOrder(): int { return $this->displayOrder; }

    // Setters
    public function setTopicId(int $id): void { $this->topicId = $id; }
    public function setSubjectId(int $id): void { $this->subjectId = $id; }
    public function setTopicTitle(string $title): void { $this->topicTitle = $title; }
    public function setDescription(string $desc): void { $this->description = $desc; }
    public function setDisplayOrder(int $order): void { $this->displayOrder = $order; }

    public function toArray(): array {
        return [
            'topic_id' => $this->topicId,
            'subject_id' => $this->subjectId,
            'topic_title' => $this->topicTitle,
            'description' => $this->description,
            'display_order' => $this->displayOrder,
        ];
    }
}
