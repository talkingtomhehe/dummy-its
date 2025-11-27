<?php

namespace App\Controllers;

use App\Core\Session;
use App\Core\View;
use App\Models\Repositories\ContentRepository;
use App\Models\Repositories\ResultRepository;
use App\Models\Services\ContentService;
use App\Models\Services\GradeService;
use App\Models\Services\NotificationService;

class GradeController
{
    private GradeService $gradeService;
    private ContentService $contentService;
    private NotificationService $notificationService;

    public function __construct(?GradeService $gradeService = null, ?ContentService $contentService = null, ?NotificationService $notificationService = null)
    {
        $this->gradeService = $gradeService ?? new GradeService(new ResultRepository());
        $this->contentService = $contentService ?? new ContentService(new ContentRepository());
        $this->notificationService = $notificationService ?? new NotificationService();
    }

    /**
     * Show student grades page
     */
    public function studentGrades($params)
    {
        $courseId = isset($params['id']) ? (int) $params['id'] : null;
        $studentId = Session::getUserId();

        if (!$courseId) {
            redirect_to('/dashboard');
            return;
        }

        if (!$studentId) {
            redirect_to('/');
            return;
        }

        try {
            $courseData = $this->contentService->getCourseStructure($courseId);
        } catch (\Throwable $throwable) {
            Session::flash('error', 'Không thể tải khóa học đã chọn.');
            redirect_to('/dashboard');
            return;
        }

        $courseName = $courseData['subject']['subject_name'] ?? 'Course';
        $grades = $this->gradeService->getStudentGrades($studentId, $courseId);
        
        // Pass courseId to the view for back navigation
        $courseId = $courseId;

        include_once __DIR__ . '/../Views/grade/student_grades.php';
    }

    /**
     * Show instructor grades page
     */
    public function instructorGrades($params)
    {
        $courseId = isset($params['id']) ? (int) $params['id'] : null;

        if (!$courseId) {
            redirect_to('/dashboard');
            return;
        }

        try {
            $courseData = $this->contentService->getCourseStructure($courseId);
        } catch (\Throwable $throwable) {
            Session::flash('error', 'Không thể tải khóa học đã chọn.');
            redirect_to('/dashboard');
            return;
        }

        $courseName = $courseData['subject']['subject_name'] ?? 'Course';
        $gradeData = $this->gradeService->getInstructorGrades($courseId);
        $assessments = $gradeData['assessments'] ?? [];
        $statistics = $gradeData['statistics'] ?? [];
        
        // Pass courseId to the view for back navigation
        $courseId = $courseId;

        include_once __DIR__ . '/../Views/grade/instructor_grades.php';
    }

    /**
     * Grade assignment (instructor)
     */
    public function gradeAssignment($params)
    {
        $assignmentId = isset($params['id']) ? (int) $params['id'] : null;

        if (!$assignmentId) {
            redirect_to('/dashboard');
            return;
        }

        $data = $this->gradeService->getAssignmentSubmissions($assignmentId);
        $assignment = $data['assignment'] ?? [];

        if (empty($assignment)) {
            Session::flash('error', 'Không tìm thấy bài tập cần chấm.');
            redirect_to('/dashboard');
            return;
        }

        $submissions = $data['submissions'] ?? [];

        // Get courseId from assignment
        $courseId = $assignment['subject_id'] ?? null;

        include_once __DIR__ . '/../Views/grade/grade_item.php';
    }


    /**
     * Save assignment grades
     */
    public function saveAssignmentGrades($params)
    {
        $assignmentId = isset($params['id']) ? (int) $params['id'] : null;

        if (!$assignmentId) {
            redirect_to('/dashboard');
            return;
        }

        $grades = $_POST['grade'] ?? [];
        $feedbacks = $_POST['feedback'] ?? [];

        if (!is_array($grades) || empty($grades)) {
            redirect_to('/grade/assignment/' . $assignmentId);
            return;
        }

        try {
            // Get assignment details for notification
            $assignmentData = $this->gradeService->getAssignmentSubmissions($assignmentId);
            $assignmentTitle = $assignmentData['assignment']['title'] ?? 'Assignment';
            
            $this->gradeService->saveAssignmentGrades($assignmentId, $grades, is_array($feedbacks) ? $feedbacks : []);
            
            // Send notifications to students who were graded
            foreach ($grades as $studentId => $grade) {
                if ($grade !== null && $grade !== '') {
                    try {
                        $hasFeedback = isset($feedbacks[$studentId]) && !empty(trim($feedbacks[$studentId]));
                        $this->notificationService->notifyStudentGraded((int)$studentId, $assignmentTitle, 'assignment', true, $hasFeedback);
                    } catch (\Throwable $e) {
                        // Log notification error but don't fail the grading
                        error_log("Failed to send notification to student {$studentId}: " . $e->getMessage());
                    }
                }
            }
            
            Session::flash('success', 'Grades saved successfully!');
        } catch (\Throwable $throwable) {
            Session::flash('error', 'Không thể lưu điểm. Vui lòng thử lại: ' . $throwable->getMessage());
            
            // Send error notifications
            foreach ($grades as $studentId => $grade) {
                if ($grade !== null && $grade !== '') {
                    try {
                        $assignmentData = $this->gradeService->getAssignmentSubmissions($assignmentId);
                        $assignmentTitle = $assignmentData['assignment']['title'] ?? 'Assignment';
                        $this->notificationService->notifyStudentGraded((int)$studentId, $assignmentTitle, 'assignment', false);
                    } catch (\Throwable $e) {
                        error_log("Failed to send error notification to student {$studentId}: " . $e->getMessage());
                    }
                }
            }
        }

        redirect_to('/grade/assignment/' . $assignmentId);
    }

    /**
     * Quiz grade report (instructor)
     */
    public function quizGradeReport($params)
    {
        $quizId = isset($params['id']) ? (int) $params['id'] : null;

        if (!$quizId) {
            redirect_to('/dashboard');
            return;
        }

        $data = $this->gradeService->getQuizResults($quizId);
        $quiz = $data['quiz'] ?? [];

        if (empty($quiz)) {
            Session::flash('error', 'Không tìm thấy bài quiz cần báo cáo.');
            redirect_to('/dashboard');
            return;
        }

        $results = $data['results'] ?? [];

        // Get courseId from quiz
        $courseId = $quiz['subject_id'] ?? null;

        include_once __DIR__ . '/../Views/grade/quiz_grade_report.php';
    }

    /**
     * Save textual feedback for a specific assessment result (AJAX).
     */
    public function saveResultFeedback($params): void
    {
        if (!Session::isInstructor()) {
            View::json(['success' => false, 'error' => 'Unauthorized'], 403);
        }

        $resultId = isset($params['id']) ? (int)$params['id'] : 0;
        if ($resultId <= 0) {
            View::json(['success' => false, 'error' => 'Invalid assessment result identifier'], 400);
        }

        $feedback = trim($_POST['feedback'] ?? '');

        try {
            $this->gradeService->updateFeedback($resultId, $feedback === '' ? null : $feedback);
            
            // Get result details for notification
            $resultData = $this->gradeService->getResultById($resultId);
            if ($resultData && isset($resultData['user_id'])) {
                $assessmentTitle = $resultData['assessment_title'] ?? 'Assessment';
                $assessmentType = $resultData['assessment_type'] ?? 'quiz';
                $hasFeedback = !empty(trim($feedback));
                
                try {
                    $this->notificationService->notifyStudentGraded(
                        (int)$resultData['user_id'], 
                        $assessmentTitle, 
                        $assessmentType, 
                        true,
                        $hasFeedback
                    );
                } catch (\Throwable $e) {
                    error_log("Failed to send notification: " . $e->getMessage());
                }
            }
            
            View::json(['success' => true]);
        } catch (\Throwable $throwable) {
            View::json([
                'success' => false,
                'error' => $throwable->getMessage(),
            ], 400);
        }
    }

    /**
     * Delete a quiz attempt (AJAX).
     */
    public function deleteQuizAttempt($params): void
    {
        if (!Session::isInstructor()) {
            View::json(['success' => false, 'error' => 'Unauthorized'], 403);
            return;
        }

        $resultId = isset($params['id']) ? (int)$params['id'] : 0;
        if ($resultId <= 0) {
            View::json(['success' => false, 'error' => 'Invalid result ID'], 400);
            return;
        }

        try {
            // Get result info before deleting to recalculate final grade
            $resultData = $this->gradeService->getResultById($resultId);
            $assessmentId = $resultData['assessment_id'] ?? null;
            $userId = $resultData['user_id'] ?? null;
            
            // Delete the result
            $this->gradeService->deleteResult($resultId);
            
            // The final grade will be automatically recalculated when viewing grades
            // because the calculateFinalGrade method is called dynamically
            
            View::json(['success' => true]);
        } catch (\Throwable $throwable) {
            View::json([
                'success' => false,
                'error' => $throwable->getMessage(),
            ], 400);
        }
    }
}
