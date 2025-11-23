<?php

namespace App\Controllers;

use App\Core\Session;
use App\Core\View;
use App\Models\Repositories\ContentRepository;
use App\Models\Repositories\ResultRepository;
use App\Models\Services\ContentService;
use App\Models\Services\GradeService;

class GradeController
{
    private GradeService $gradeService;
    private ContentService $contentService;

    public function __construct(?GradeService $gradeService = null, ?ContentService $contentService = null)
    {
        $this->gradeService = $gradeService ?? new GradeService(new ResultRepository());
        $this->contentService = $contentService ?? new ContentService(new ContentRepository());
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
            $this->gradeService->saveAssignmentGrades($assignmentId, $grades, is_array($feedbacks) ? $feedbacks : []);
            Session::flash('success', 'Grades saved successfully!');
        } catch (\Throwable $throwable) {
            Session::flash('error', 'Không thể lưu điểm. Vui lòng thử lại: ' . $throwable->getMessage());
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
            View::json(['success' => true]);
        } catch (\Throwable $throwable) {
            View::json([
                'success' => false,
                'error' => $throwable->getMessage(),
            ], 400);
        }
    }
}
