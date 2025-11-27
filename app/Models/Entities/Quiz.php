<?php
namespace App\Models\Entities;

/**
 * Quiz Entity
 * Represents an assessment of type 'quiz'
 */
class Quiz {
    private int $assessmentId;
    private int $topicId;
    private string $title;
    private string $description;
    private int $timeLimit;
    private ?string $openTime;
    private ?string $closeTime;
    private float $maxScore;
    private bool $isVisible;
    private int $maxAttempts;
    private string $gradingMethod;

    public function __construct(array $data = []) {
        if (!empty($data)) {
            $this->assessmentId = $data['assessment_id'] ?? 0;
            $this->topicId = $data['topic_id'] ?? 0;
            $this->title = $data['title'] ?? '';
            $this->description = $data['description'] ?? '';
            $this->timeLimit = $data['time_limit'] ?? 0;
            $this->openTime = $data['open_time'] ?? null;
            $this->closeTime = $data['close_time'] ?? null;
            $this->maxScore = $data['max_score'] ?? 10.0;
            $this->isVisible = $data['is_visible'] ?? true;
            $this->maxAttempts = $data['max_attempts'] ?? 1;
            $this->gradingMethod = $data['grading_method'] ?? 'last';
        }
    }

    // Getters
    public function getAssessmentId(): int { return $this->assessmentId; }
    public function getTopicId(): int { return $this->topicId; }
    public function getTitle(): string { return $this->title; }
    public function getDescription(): string { return $this->description; }
    public function getTimeLimit(): int { return $this->timeLimit; }
    public function getOpenTime(): ?string { return $this->openTime; }
    public function getCloseTime(): ?string { return $this->closeTime; }
    public function getMaxScore(): float { return $this->maxScore; }
    public function isVisible(): bool { return $this->isVisible; }
    public function getMaxAttempts(): int { return $this->maxAttempts; }
    public function getGradingMethod(): string { return $this->gradingMethod; }

    public function toArray(): array {
        return [
            'assessment_id' => $this->assessmentId,
            'topic_id' => $this->topicId,
            'title' => $this->title,
            'description' => $this->description,
            'time_limit' => $this->timeLimit,
            'open_time' => $this->openTime,
            'close_time' => $this->closeTime,
            'max_score' => $this->maxScore,
            'is_visible' => $this->isVisible,
            'max_attempts' => $this->maxAttempts,
            'grading_method' => $this->gradingMethod,
        ];
    }
}
