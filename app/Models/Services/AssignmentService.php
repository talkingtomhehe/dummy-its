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

    public function processSubmissionUpload(array $files, int $assignmentId, int $studentId, $previousFiles = null): array {
        // Handle multiple file upload
        $isMultiple = isset($files['name']) && is_array($files['name']);
        
        if (!$isMultiple) {
            // Single file upload (legacy)
            $files = [
                'name' => [$files['name'] ?? ''],
                'type' => [$files['type'] ?? ''],
                'tmp_name' => [$files['tmp_name'] ?? ''],
                'error' => [$files['error'] ?? UPLOAD_ERR_NO_FILE],
                'size' => [$files['size'] ?? 0]
            ];
        }

        $uploadedFiles = [];
        $originalNames = [];
        $fileCount = count($files['name']);

        if (!is_dir($this->uploadDirectory)) {
            if (!mkdir($this->uploadDirectory, 0775, true) && !is_dir($this->uploadDirectory)) {
                throw new \RuntimeException('Failed to prepare assignment upload directory.');
            }
        }

        for ($i = 0; $i < $fileCount; $i++) {
            $error = $files['error'][$i] ?? UPLOAD_ERR_NO_FILE;
            
            if ($error !== UPLOAD_ERR_OK) {
                if ($error === UPLOAD_ERR_NO_FILE && $fileCount === 1) {
                    throw new \RuntimeException('No file uploaded or upload error occurred.');
                }
                continue; // Skip this file if multiple files
            }

            $size = (int)($files['size'][$i] ?? 0);
            if ($size <= 0) {
                throw new \RuntimeException('Uploaded file is empty.');
            }
            if ($size > self::MAX_FILE_BYTES) {
                throw new \RuntimeException('File "' . $files['name'][$i] . '" exceeds the maximum size of 10 MB.');
            }

            $originalName = $files['name'][$i] ?? '';
            $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
            if ($extension === '') {
                throw new \RuntimeException('Unable to determine file type for "' . $originalName . '".');
            }
            if (!in_array($extension, self::ALLOWED_EXTENSIONS, true)) {
                throw new \RuntimeException('Invalid file type for "' . $originalName . '". Allowed types: PDF, DOC, DOCX, ZIP, RAR.');
            }

            $tmpPath = $files['tmp_name'][$i] ?? null;
            if (!$tmpPath || !is_uploaded_file($tmpPath)) {
                throw new \RuntimeException('Temporary upload not found for "' . $originalName . '". Please retry.');
            }

            $filename = sprintf(
                'assignment_%d_student_%d_%s_%d.%s',
                $assignmentId,
                $studentId,
                date('YmdHis'),
                $i,
                $extension
            );
            $targetPath = $this->uploadDirectory . DIRECTORY_SEPARATOR . $filename;

            if (!move_uploaded_file($tmpPath, $targetPath)) {
                throw new \RuntimeException('Failed to store uploaded file "' . $originalName . '".');
            }

            $uploadedFiles[] = $filename;
            $originalNames[] = $originalName;
        }

        if (empty($uploadedFiles)) {
            throw new \RuntimeException('No valid files were uploaded.');
        }

        // Delete previous files if they exist and are not in the new upload
        if ($previousFiles) {
            $prevFileList = is_string($previousFiles) ? json_decode($previousFiles, true) : $previousFiles;
            if (!is_array($prevFileList)) {
                $prevFileList = [$previousFiles];
            }
            foreach ($prevFileList as $prevFile) {
                if ($prevFile && !in_array($prevFile, $uploadedFiles)) {
                    $this->deleteExistingFile($prevFile);
                }
            }
        }

        // Return with both 'filename' and 'files' keys for backwards compatibility
        return [
            'filename' => count($uploadedFiles) === 1 ? $uploadedFiles[0] : $uploadedFiles,
            'files' => $uploadedFiles,
            'original_name' => count($originalNames) === 1 ? $originalNames[0] : $originalNames,
            'original_names' => $originalNames
        ];
    }

    public function recordSubmission(int $assignmentId, int $studentId, array $uploadResult): int {
        // Handle both new format (files/original_names) and old format (filename/original_name)
        $files = $uploadResult['files'] ?? (isset($uploadResult['filename']) ? (is_array($uploadResult['filename']) ? $uploadResult['filename'] : [$uploadResult['filename']]) : []);
        $originalNames = $uploadResult['original_names'] ?? (isset($uploadResult['original_name']) ? (is_array($uploadResult['original_name']) ? $uploadResult['original_name'] : [$uploadResult['original_name']]) : []);
        
        $payload = [
            'assessment_id' => $assignmentId,
            'user_id' => $studentId,
            'submission_file' => json_encode($files),
            'original_filenames' => json_encode($originalNames),
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

    public function deleteSubmission(int $assignmentId, int $studentId): void {
        $submission = $this->assignmentRepo->getStudentSubmission($assignmentId, $studentId);
        
        if (!$submission) {
            throw new \RuntimeException('No submission found to delete.');
        }

        // Delete uploaded files
        $submissionFile = $submission['submission_file'] ?? null;
        if ($submissionFile) {
            // Decode JSON if it's an array
            if ($submissionFile[0] === '[') {
                $submissionFile = json_decode($submissionFile, true);
            } else {
                $submissionFile = [$submissionFile];
            }
            
            foreach ($submissionFile as $file) {
                $this->deleteExistingFile($file);
            }
        }

        // Delete the submission record
        $resultId = (int)$submission['result_id'];
        $this->resultRepo->deleteResult($resultId);
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
        $submissionFile = $submission['submission_file'] ?? null;
        $originalNames = $submission['original_filenames'] ?? null;
        
        // Decode JSON if it's an array
        if ($submissionFile && $submissionFile[0] === '[') {
            $submissionFile = json_decode($submissionFile, true);
        }
        if ($originalNames && $originalNames[0] === '[') {
            $originalNames = json_decode($originalNames, true);
        }
        
        return [
            'result_id' => isset($submission['result_id']) ? (int)$submission['result_id'] : null,
            'assessment_id' => isset($submission['assessment_id']) ? (int)$submission['assessment_id'] : null,
            'user_id' => isset($submission['user_id']) ? (int)$submission['user_id'] : null,
            'submission_file' => $submissionFile,
            'original_filenames' => $originalNames,
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
