<?php
namespace App\Models\Entities;

/**
 * Option Entity (for quiz questions)
 */
class Option {
    private int $optionId;
    private int $questionId;
    private string $optionText;
    private bool $isCorrect;
    private int $displayOrder;

    public function __construct(array $data = []) {
        if (!empty($data)) {
            $this->optionId = $data['option_id'] ?? 0;
            $this->questionId = $data['question_id'] ?? 0;
            $this->optionText = $data['option_text'] ?? '';
            $this->isCorrect = $data['is_correct'] ?? false;
            $this->displayOrder = $data['display_order'] ?? 0;
        }
    }

    // Getters
    public function getOptionId(): int { return $this->optionId; }
    public function getQuestionId(): int { return $this->questionId; }
    public function getOptionText(): string { return $this->optionText; }
    public function isCorrect(): bool { return $this->isCorrect; }
    public function getDisplayOrder(): int { return $this->displayOrder; }

    public function toArray(): array {
        return [
            'option_id' => $this->optionId,
            'question_id' => $this->questionId,
            'option_text' => $this->optionText,
            'is_correct' => $this->isCorrect,
            'display_order' => $this->displayOrder,
        ];
    }
}
