<?php
namespace App\Models\Entities;

/**
 * Result Entity
 * Represents an assessment submission/result
 */
class Result {
    private int $resultId;
    private int $assessmentId;
    private int $userId;
    private ?float $score;
    private ?string $answers;
    private ?string $feedback;
    private ?string $submissionFile;
    private string $submittedAt;
    private ?string $gradedAt;
    private ?int $timeTaken;

    public function __construct(array $data = []) {
        if (!empty($data)) {
            $this->resultId = $data['result_id'] ?? 0;
            $this->assessmentId = $data['assessment_id'] ?? 0;
            $this->userId = $data['user_id'] ?? 0;
            $this->score = $data['score'] ?? null;
            $this->answers = $data['answers'] ?? null;
            $this->feedback = $data['feedback'] ?? null;
            $this->submissionFile = $data['submission_file'] ?? null;
            $this->submittedAt = $data['submitted_at'] ?? '';
            $this->gradedAt = $data['graded_at'] ?? null;
            $this->timeTaken = $data['time_taken'] ?? null;
        }
    }

    // Getters
    public function getResultId(): int { return $this->resultId; }
    public function getAssessmentId(): int { return $this->assessmentId; }
    public function getUserId(): int { return $this->userId; }
    public function getScore(): ?float { return $this->score; }
    public function getAnswers(): ?string { return $this->answers; }
    public function getFeedback(): ?string { return $this->feedback; }
    public function getSubmissionFile(): ?string { return $this->submissionFile; }
    public function getSubmittedAt(): string { return $this->submittedAt; }
    public function getGradedAt(): ?string { return $this->gradedAt; }
    public function getTimeTaken(): ?int { return $this->timeTaken; }

    public function toArray(): array {
        return [
            'result_id' => $this->resultId,
            'assessment_id' => $this->assessmentId,
            'user_id' => $this->userId,
            'score' => $this->score,
            'answers' => $this->answers,
            'feedback' => $this->feedback,
            'submission_file' => $this->submissionFile,
            'submitted_at' => $this->submittedAt,
            'graded_at' => $this->gradedAt,
            'time_taken' => $this->timeTaken,
        ];
    }
}
