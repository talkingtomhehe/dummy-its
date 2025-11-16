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

        if (!isset($_FILES['submission_file'])) {
            Session::flash('error', 'Please choose a file before submitting.');
            View::redirect('/assignment/' . $assignmentId . '/submit');
            return;
        }

        try {
            $payload = $this->assignmentService->getAssignmentForSubmission($assignmentId, $studentId);

            if (!$payload['can_submit']) {
                Session::flash('error', 'This assignment is not currently accepting submissions.');
                View::redirect('/assignment/' . $assignmentId . '/status');
                return;
            }

            $existingFile = $payload['submission']['submission_file'] ?? null;
            $storedFile = $this->assignmentService->processSubmissionUpload(
                $_FILES['submission_file'],
                $assignmentId,
                $studentId,
                $existingFile
            );

            $this->assignmentService->recordSubmission($assignmentId, $studentId, $storedFile);

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
            ]);
        } catch (\Throwable $exception) {
            Session::flash('error', $exception->getMessage());
            View::redirect('/dashboard');
        }
    }
}
