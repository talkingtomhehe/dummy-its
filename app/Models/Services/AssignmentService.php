<?php
namespace App\Models\Services;

use App\Models\Interfaces\IAssessment;
use App\Models\Interfaces\IAssignmentRepository;
use App\Models\Interfaces\IResultRepository;

/**
 * AssignmentService centralises assignment workflows (status, submission, uploads).
 */
class AssignmentService {
    private IAssignmentRepository $assignmentRepo;
    private IResultRepository $resultRepo;
    private IAssessment $projectAssessment;
    private string $uploadDirectory;

    private const MAX_FILE_BYTES = 10485760; // 10 MB
    private const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'zip', 'rar'];

    public function __construct(
        IAssignmentRepository $assignmentRepo,
        IResultRepository $resultRepo,
        IAssessment $projectAssessment,
        ?string $uploadDirectory = null
    ) {
        $this->assignmentRepo = $assignmentRepo;
        $this->resultRepo = $resultRepo;
        $this->projectAssessment = $projectAssessment;
        $this->uploadDirectory = $uploadDirectory ?? $this->resolveUploadDirectory();
    }

    public function getAssignmentStatus(int $assignmentId, int $studentId): array {
        $assignment = $this->getAssignmentOrFail($assignmentId);
        $submission = $this->assignmentRepo->getStudentSubmission($assignmentId, $studentId);

        return [
            'assignment' => $this->normaliseAssignment($assignment),
            'submission' => $submission ? $this->normaliseSubmission($submission) : null,
        ];
    }

    public function getAssignmentForSubmission(int $assignmentId, int $studentId): array {
        $status = $this->getAssignmentStatus($assignmentId, $studentId);
        $assignment = $status['assignment'];

        $now = new \DateTimeImmutable('now');
        $openTime = $assignment['open_time'] ? new \DateTimeImmutable($assignment['open_time']) : null;
        $closeTime = $assignment['due_time'] ? new \DateTimeImmutable($assignment['due_time']) : null;

        $isWithinWindow = true;
        if ($openTime && $now < $openTime) {
            $isWithinWindow = false;
        }
        if ($closeTime && $now > $closeTime) {
            $isWithinWindow = false;
        }

        $status['can_submit'] = $isWithinWindow;
        $status['open_time'] = $openTime;
        $status['close_time'] = $closeTime;

        return $status;
    }

    public function processSubmissionUpload(array $file, int $assignmentId, int $studentId, ?string $previousFile = null): string {
        if (isset($file['name']) && is_array($file['name'])) {
            throw new \RuntimeException('Multiple files detected. Please upload a single file.');
        }

        if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            throw new \RuntimeException('No file uploaded or upload error occurred.');
        }

        $size = (int)($file['size'] ?? 0);
        if (isset($file['size']) && is_array($file['size'])) {
            throw new \RuntimeException('Multiple files detected. Please upload a single file.');
        }
        if ($size <= 0) {
            throw new \RuntimeException('Uploaded file is empty.');
        }
        if ($size > self::MAX_FILE_BYTES) {
            throw new \RuntimeException('Uploaded file exceeds the maximum size of 10 MB.');
        }

        $extension = strtolower(pathinfo((string)($file['name'] ?? ''), PATHINFO_EXTENSION));
        if ($extension === '') {
            throw new \RuntimeException('Unable to determine file type.');
        }
        if (!in_array($extension, self::ALLOWED_EXTENSIONS, true)) {
            throw new \RuntimeException('Invalid file type. Allowed types: PDF, DOC, DOCX, ZIP, RAR.');
        }

        if (!is_dir($this->uploadDirectory)) {
            if (!mkdir($this->uploadDirectory, 0775, true) && !is_dir($this->uploadDirectory)) {
                throw new \RuntimeException('Failed to prepare assignment upload directory.');
            }
        }

        $tmpPath = $file['tmp_name'] ?? null;
        if (!$tmpPath || !is_uploaded_file($tmpPath)) {
            throw new \RuntimeException('Temporary upload not found. Please retry.');
        }

        $filename = sprintf(
            'assignment_%d_student_%d_%s.%s',
            $assignmentId,
            $studentId,
            date('YmdHis'),
            $extension
        );
        $targetPath = $this->uploadDirectory . DIRECTORY_SEPARATOR . $filename;

        if (!move_uploaded_file($tmpPath, $targetPath)) {
            throw new \RuntimeException('Failed to store uploaded file.');
        }

        if ($previousFile && $previousFile !== $filename) {
            $this->deleteExistingFile($previousFile);
        }

        return $filename;
    }

    public function recordSubmission(int $assignmentId, int $studentId, string $storedFilename): int {
        $payload = [
            'assessment_id' => $assignmentId,
            'user_id' => $studentId,
            'submission_file' => $storedFilename,
            'status' => 'submitted',
        ];

        if (!$this->projectAssessment->validateSubmission($payload)) {
            throw new \InvalidArgumentException('Submission payload is invalid.');
        }

        return $this->resultRepo->submitAssignment($payload);
    }

    public function getAssignmentSubmissionStats(int $assignmentId): array {
        $assignment = $this->getAssignmentOrFail($assignmentId);
        $stats = $this->assignmentRepo->getSubmissionStatistics($assignmentId);

        return [
            'assignment' => $this->normaliseAssignment($assignment),
            'submitted_count' => $stats['submitted_count'],
            'not_submitted_count' => $stats['not_submitted_count'],
            'total_students' => $stats['total_students'],
        ];
    }

    private function getAssignmentOrFail(int $assignmentId): array {
        $assignment = $this->assignmentRepo->findById($assignmentId);
        if (!$assignment) {
            throw new \RuntimeException('Assignment not found or unavailable.');
        }

        return $assignment;
    }

    private function normaliseAssignment(array $assignment): array {
        return [
            'id' => (int)$assignment['assessment_id'],
            'title' => (string)($assignment['title'] ?? ''),
            'description' => $assignment['description'] ?? null,
            'content_id' => isset($assignment['content_id']) ? (int)$assignment['content_id'] : null,
            'topic_id' => isset($assignment['topic_id']) ? (int)$assignment['topic_id'] : null,
            'subject_id' => isset($assignment['subject_id']) ? (int)$assignment['subject_id'] : null,
            'subject_name' => $assignment['subject_name'] ?? null,
            'topic_title' => $assignment['topic_title'] ?? null,
            'open_time' => $assignment['open_time'] ?? null,
            'due_time' => $assignment['close_time'] ?? null,
            'max_score' => isset($assignment['max_score']) ? (float)$assignment['max_score'] : null,
            'is_visible' => !empty($assignment['is_visible']),
        ];
    }

    private function normaliseSubmission(array $submission): array {
        return [
            'result_id' => isset($submission['result_id']) ? (int)$submission['result_id'] : null,
            'assessment_id' => isset($submission['assessment_id']) ? (int)$submission['assessment_id'] : null,
            'user_id' => isset($submission['user_id']) ? (int)$submission['user_id'] : null,
            'submission_file' => $submission['submission_file'] ?? null,
            'status' => $submission['status'] ?? null,
            'score' => $submission['score'] !== null ? (float)$submission['score'] : null,
            'feedback' => $submission['feedback'] ?? null,
            'submitted_at' => $submission['submitted_at'] ?? null,
            'graded_at' => $submission['graded_at'] ?? null,
        ];
    }

    private function resolveUploadDirectory(): string {
        return dirname(__DIR__, 3) . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . 'assignments';
    }

    private function deleteExistingFile(string $filename): void {
        $path = $this->uploadDirectory . DIRECTORY_SEPARATOR . $filename;
        if (is_file($path)) {
            @unlink($path);
        }
    }
}
