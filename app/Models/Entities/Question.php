<?php
namespace App\Models\Entities;

/**
 * Question Entity
 */
class Question {
    private int $questionId;
    private int $assessmentId;
    private string $questionText;
    private string $questionType;
    private float $points;
    private int $displayOrder;
    private array $options = [];

    public function __construct(array $data = []) {
        if (!empty($data)) {
            $this->questionId = $data['question_id'] ?? 0;
            $this->assessmentId = $data['assessment_id'] ?? 0;
            $this->questionText = $data['question_text'] ?? '';
            $this->questionType = $data['question_type'] ?? 'mc-single';
            $this->points = $data['points'] ?? 1.0;
            $this->displayOrder = $data['display_order'] ?? 0;
        }
    }

    // Getters
    public function getQuestionId(): int { return $this->questionId; }
    public function getAssessmentId(): int { return $this->assessmentId; }
    public function getQuestionText(): string { return $this->questionText; }
    public function getQuestionType(): string { return $this->questionType; }
    public function getPoints(): float { return $this->points; }
    public function getDisplayOrder(): int { return $this->displayOrder; }
    public function getOptions(): array { return $this->options; }

    // Setters
    public function setOptions(array $options): void { $this->options = $options; }

    public function toArray(): array {
        return [
            'question_id' => $this->questionId,
            'assessment_id' => $this->assessmentId,
            'question_text' => $this->questionText,
            'question_type' => $this->questionType,
            'points' => $this->points,
            'display_order' => $this->displayOrder,
            'options' => $this->options,
        ];
    }
}
