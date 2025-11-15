<?php

namespace App\Controllers;

use App\Core\Database;
use App\Core\Session;

class GradeController
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    /**
     * Show student grades page
     */
    public function studentGrades($params)
    {
        $courseId = $params['id'] ?? null;
        $studentId = Session::get('user_id');

        if (!$courseId) {
            redirect_to('/dashboard');
            return;
        }

        // Get course name
        $stmt = $this->db->prepare("SELECT subject_name FROM subjects WHERE subject_id = ?");
        $stmt->execute([$courseId]);
        $course = $stmt->fetch();
        $courseName = $course['subject_name'] ?? 'Course';

        // Get all assessments with grades for this student
        $stmt = $this->db->prepare("
            SELECT 
                ci.title,
                a.assessment_type as type,
                a.assessment_id,
                ar.score,
                ar.feedback
            FROM content_items ci
            JOIN assessments a ON ci.content_id = a.content_id
            LEFT JOIN assessment_results ar ON a.assessment_id = ar.assessment_id AND ar.student_id = ?
            WHERE ci.subject_id = ?
            ORDER BY ci.order_index
        ");
        $stmt->execute([$studentId, $courseId]);
        $grades = $stmt->fetchAll();

        include_once __DIR__ . '/../Views/grade/student_grades.php';
    }

    /**
     * Show instructor grades page
     */
    public function instructorGrades($params)
    {
        $courseId = $params['id'] ?? null;

        if (!$courseId) {
            redirect_to('/dashboard');
            return;
        }

        // Get course name
        $stmt = $this->db->prepare("SELECT subject_name FROM subjects WHERE subject_id = ?");
        $stmt->execute([$courseId]);
        $course = $stmt->fetch();
        $courseName = $course['subject_name'] ?? 'Course';

        // Get all assessments with statistics
        $stmt = $this->db->prepare("
            SELECT 
                ci.title,
                a.assessment_type as type,
                a.assessment_id as id,
                AVG(ar.score) as average_score
            FROM content_items ci
            JOIN assessments a ON ci.content_id = ci.content_id
            LEFT JOIN assessment_results ar ON a.assessment_id = ar.assessment_id
            WHERE ci.subject_id = ?
            GROUP BY a.assessment_id
            ORDER BY ci.order_index
        ");
        $stmt->execute([$courseId]);
        $assessments = $stmt->fetchAll();

        include_once __DIR__ . '/../Views/grade/instructor_grades.php';
    }

    /**
     * Grade assignment (instructor)
     */
    public function gradeAssignment($params)
    {
        $assignmentId = $params['id'] ?? null;

        if (!$assignmentId) {
            redirect_to('/dashboard');
            return;
        }

        // Get assignment details
        $stmt = $this->db->prepare("
            SELECT a.*, ci.title, ci.subject_id
            FROM assessments a
            JOIN content_items ci ON a.content_id = ci.content_id
            WHERE a.assessment_id = ? AND a.assessment_type = 'assignment'
        ");
        $stmt->execute([$assignmentId]);
        $assignment = $stmt->fetch();

        if (!$assignment) {
            redirect_to('/dashboard');
            return;
        }

        // Get all student submissions
        $stmt = $this->db->prepare("
            SELECT 
                u.user_id as student_id,
                CONCAT(u.first_name, ' ', u.last_name) as student_name,
                ar.file_path,
                ar.score as grade,
                ar.feedback,
                ar.submitted_at
            FROM users u
            WHERE u.role = 'student'
            ORDER BY u.last_name, u.first_name
        ");
        $stmt->execute();
        $allStudents = $stmt->fetchAll();

        // Enrich with submission data
        $stmt = $this->db->prepare("
            SELECT * FROM assessment_results
            WHERE assessment_id = ? AND student_id = ?
        ");

        foreach ($allStudents as &$student) {
            $stmt->execute([$assignmentId, $student['student_id']]);
            $submission = $stmt->fetch();
            
            if ($submission) {
                $student['file_path'] = $submission['file_path'];
                $student['grade'] = $submission['score'];
                $student['feedback'] = $submission['feedback'];
            }
        }

        $submissions = $allStudents;

        include_once __DIR__ . '/../Views/grade/grade_item.php';
    }


    /**
     * Save assignment grades
     */
    public function saveAssignmentGrades($params)
    {
        $assignmentId = $params['id'] ?? null;

        if (!$assignmentId || !isset($_POST['grade'])) {
            redirect_to('/grade/assignment/' . $assignmentId);
            return;
        }

        $grades = $_POST['grade'];
        $feedbacks = $_POST['feedback'] ?? [];

        foreach ($grades as $studentId => $grade) {
            if ($grade === '') continue;

            $feedback = $feedbacks[$studentId] ?? null;

            // Check if result exists
            $stmt = $this->db->prepare("
                SELECT * FROM assessment_results
                WHERE assessment_id = ? AND student_id = ?
            ");
            $stmt->execute([$assignmentId, $studentId]);
            $existing = $stmt->fetch();

            if ($existing) {
                // Update
                $stmt = $this->db->prepare("
                    UPDATE assessment_results
                    SET score = ?, feedback = ?, graded_at = NOW(), status = 'graded'
                    WHERE assessment_id = ? AND student_id = ?
                ");
                $stmt->execute([$grade, $feedback, $assignmentId, $studentId]);
            } else {
                // Insert
                $stmt = $this->db->prepare("
                    INSERT INTO assessment_results (assessment_id, student_id, score, feedback, graded_at, status)
                    VALUES (?, ?, ?, ?, NOW(), 'graded')
                ");
                $stmt->execute([$assignmentId, $studentId, $grade, $feedback]);
            }
        }

        Session::set('success', 'Grades saved successfully!');
        redirect_to('/grade/assignment/' . $assignmentId);
    }

    /**
     * Quiz grade report (instructor)
     */
    public function quizGradeReport($params)
    {
        $quizId = $params['id'] ?? null;

        if (!$quizId) {
            redirect_to('/dashboard');
            return;
        }

        // Get quiz details
        $stmt = $this->db->prepare("
            SELECT a.*, ci.title
            FROM assessments a
            JOIN content_items ci ON a.content_id = ci.content_id
            WHERE a.assessment_id = ? AND a.assessment_type = 'quiz'
        ");
        $stmt->execute([$quizId]);
        $quiz = $stmt->fetch();

        if (!$quiz) {
            redirect_to('/dashboard');
            return;
        }

        // Get all student results
        $stmt = $this->db->prepare("
            SELECT 
                u.user_id as student_id,
                CONCAT(u.first_name, ' ', u.last_name) as student_name,
                ar.score,
                ar.started_at,
                ar.completed_at
            FROM users u
            LEFT JOIN assessment_results ar ON u.user_id = ar.student_id AND ar.assessment_id = ?
            WHERE u.role = 'student'
            ORDER BY u.last_name, u.first_name
        ");
        $stmt->execute([$quizId]);
        $results = $stmt->fetchAll();

        include_once __DIR__ . '/../Views/grade/quiz_grade_report.php';
    }
}
