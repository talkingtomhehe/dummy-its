<?php
namespace App\Models\Entities;

/**
 * Course (Subject) Entity
 */
class Course {
    private int $subjectId;
    private string $subjectName;
    private string $subjectCode;
    private string $description;
    private int $instructorId;

    public function __construct(array $data = []) {
        if (!empty($data)) {
            $this->subjectId = $data['subject_id'] ?? 0;
            $this->subjectName = $data['subject_name'] ?? '';
            $this->subjectCode = $data['subject_code'] ?? '';
            $this->description = $data['description'] ?? '';
            $this->instructorId = $data['instructor_id'] ?? 0;
        }
    }

    // Getters
    public function getSubjectId(): int { return $this->subjectId; }
    public function getSubjectName(): string { return $this->subjectName; }
    public function getSubjectCode(): string { return $this->subjectCode; }
    public function getDescription(): string { return $this->description; }
    public function getInstructorId(): int { return $this->instructorId; }

    // Setters
    public function setSubjectId(int $id): void { $this->subjectId = $id; }
    public function setSubjectName(string $name): void { $this->subjectName = $name; }
    public function setSubjectCode(string $code): void { $this->subjectCode = $code; }
    public function setDescription(string $desc): void { $this->description = $desc; }
    public function setInstructorId(int $id): void { $this->instructorId = $id; }

    public function toArray(): array {
        return [
            'subject_id' => $this->subjectId,
            'subject_name' => $this->subjectName,
            'subject_code' => $this->subjectCode,
            'description' => $this->description,
            'instructor_id' => $this->instructorId,
        ];
    }
}
