<?php

namespace App\Controllers;

use App\Core\Session;
use App\Core\View;
use App\Models\Repositories\AssignmentRepository;
use App\Models\Repositories\ResultRepository;
use App\Models\Services\AssignmentService;
use App\Models\Services\ProjectAssessment;

class AssignmentController
{
    private AssignmentService $assignmentService;

    public function __construct(?AssignmentService $assignmentService = null)
    {
        $this->assignmentService = $assignmentService ?? new AssignmentService(
            new AssignmentRepository(),
            new ResultRepository(),
            new ProjectAssessment()
        );
    }

    public function showStatus($params): void
    {
        $assignmentId = isset($params['id']) ? (int)$params['id'] : 0;

        if ($assignmentId <= 0) {
            View::redirect('/dashboard');
            return;
        }

        // If instructor, redirect to instructor view showing submission statistics
        if (Session::isInstructor()) {
            View::redirect('/assignment/' . $assignmentId . '/instructor');
            return;
        }

        // Student view
        $studentId = (int)(Session::getUserId() ?? 0);
        if ($studentId <= 0) {
            View::redirect('/dashboard');
            return;
        }

        try {
            $status = $this->assignmentService->getAssignmentForSubmission($assignmentId, $studentId);

            View::render('assignment/assignment_status', [
                'assignment' => $status['assignment'],
                'submission' => $status['submission'],
                'canSubmit' => $status['can_submit'],
                'successMessage' => Session::getFlash('success'),
                'errorMessage' => Session::getFlash('error'),
                'courseId' => $status['assignment']['subject_id'] ?? null,
            ]);
        } catch (\Throwable $exception) {
            Session::flash('error', $exception->getMessage());
            View::redirect('/dashboard');
        }
    }

    public function showSubmit($params): void
    {
        $assignmentId = isset($params['id']) ? (int)$params['id'] : 0;
        $studentId = (int)(Session::getUserId() ?? 0);

        if ($assignmentId <= 0 || $studentId <= 0) {
            View::redirect('/dashboard');
            return;
        }

        try {
            $payload = $this->assignmentService->getAssignmentForSubmission($assignmentId, $studentId);

            if (!$payload['can_submit']) {
                Session::flash('error', 'This assignment is not currently accepting submissions.');
                View::redirect('/assignment/' . $assignmentId . '/status');
                return;
            }

            View::render('assignment/add_submission', [
                'assignment' => $payload['assignment'],
                'submission' => $payload['submission'],
                'errorMessage' => Session::getFlash('error'),
            ]);
        } catch (\Throwable $exception) {
            Session::flash('error', $exception->getMessage());
            View::redirect('/assignment/' . $assignmentId . '/status');
        }
    }

    public function uploadSubmission($params): void
    {
        $assignmentId = isset($params['id']) ? (int)$params['id'] : 0;
        $studentId = (int)(Session::getUserId() ?? 0);

        if ($assignmentId <= 0 || $studentId <= 0) {
            View::redirect('/dashboard');
            return;
        }

        try {
            $payload = $this->assignmentService->getAssignmentForSubmission($assignmentId, $studentId);

            if (!$payload['can_submit']) {
                Session::flash('error', 'This assignment is not currently accepting submissions.');
                View::redirect('/assignment/' . $assignmentId . '/status');
                return;
            }

            // Get existing files that should be kept
            $existingFilesToKeep = [];
            if (isset($_POST['existing_files']) && !empty($_POST['existing_files'])) {
                $existingFilesToKeep = json_decode($_POST['existing_files'], true) ?? [];
            }

            // Process new file uploads
            $uploadResult = null;
            if (isset($_FILES['submission_file']) && !empty($_FILES['submission_file']['name'][0])) {
                $uploadResult = $this->assignmentService->processSubmissionUpload(
                    $_FILES['submission_file'],
                    $assignmentId,
                    $studentId,
                    null
                );
            }

            // Combine existing files with new uploads
            $finalFiles = $existingFilesToKeep;
            $finalOriginalNames = [];
            
            // Get original names for existing files
            if (!empty($payload['submission']['original_filenames'])) {
                $existingFiles = is_array($payload['submission']['submission_file']) 
                    ? $payload['submission']['submission_file'] 
                    : [$payload['submission']['submission_file']];
                $existingOriginals = is_array($payload['submission']['original_filenames']) 
                    ? $payload['submission']['original_filenames'] 
                    : [$payload['submission']['original_filenames']];
                    
                foreach ($existingFiles as $idx => $file) {
                    if (in_array($file, $existingFilesToKeep)) {
                        $finalOriginalNames[] = $existingOriginals[$idx] ?? $file;
                    }
                }
            }
            
            // Add new files
            if ($uploadResult) {
                if (is_array($uploadResult['filename'])) {
                    $finalFiles = array_merge($finalFiles, $uploadResult['filename']);
                    $finalOriginalNames = array_merge($finalOriginalNames, $uploadResult['original_names']);
                } else {
                    $finalFiles[] = $uploadResult['filename'];
                    $finalOriginalNames[] = $uploadResult['original_name'];
                }
            }

            // Check if we have any files
            if (empty($finalFiles)) {
                Session::flash('error', 'Please choose at least one file before submitting.');
                View::redirect('/assignment/' . $assignmentId . '/submit');
                return;
            }

            // Record submission with combined files
            $this->assignmentService->recordSubmission($assignmentId, $studentId, [
                'filename' => $finalFiles,
                'original_names' => $finalOriginalNames
            ]);

            Session::flash('success', 'Assignment submitted successfully.');
            View::redirect('/assignment/' . $assignmentId . '/status');
        } catch (\Throwable $exception) {
            Session::flash('error', $exception->getMessage());
            View::redirect('/assignment/' . $assignmentId . '/submit');
        }
    }

    public function showInstructorView($params): void
    {
        $assignmentId = isset($params['id']) ? (int)$params['id'] : 0;

        if ($assignmentId <= 0 || !Session::isInstructor()) {
            View::redirect('/dashboard');
            return;
        }

        try {
            // Get assignment details and submission counts
            $assignmentData = $this->assignmentService->getAssignmentSubmissionStats($assignmentId);

            View::render('assignment/instructor_view', [
                'assignment' => $assignmentData['assignment'],
                'submittedCount' => $assignmentData['submitted_count'],
                'notSubmittedCount' => $assignmentData['not_submitted_count'],
                'totalStudents' => $assignmentData['total_students'],
                'courseId' => $assignmentData['assignment']['subject_id'] ?? null,
            ]);
        } catch (\Throwable $exception) {
            Session::flash('error', $exception->getMessage());
            View::redirect('/dashboard');
        }
    }

    public function removeSubmission($params): void
    {
        $assignmentId = isset($params['id']) ? (int)$params['id'] : 0;
        $studentId = (int)(Session::getUserId() ?? 0);

        if ($assignmentId <= 0 || $studentId <= 0) {
            View::redirect('/dashboard');
            return;
        }

        try {
            $payload = $this->assignmentService->getAssignmentForSubmission($assignmentId, $studentId);

            if (!$payload['can_submit']) {
                Session::flash('error', 'This assignment is not currently accepting changes.');
                View::redirect('/assignment/' . $assignmentId . '/status');
                return;
            }

            // Delete the submission
            $this->assignmentService->deleteSubmission($assignmentId, $studentId);

            Session::flash('success', 'Submission removed successfully.');
            View::redirect('/assignment/' . $assignmentId . '/status');
        } catch (\Throwable $exception) {
            Session::flash('error', $exception->getMessage());
            View::redirect('/assignment/' . $assignmentId . '/status');
        }
    }
}
