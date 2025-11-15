<?php

namespace App\Controllers;

use App\Core\Database;
use App\Core\Session;

class AssignmentController
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    /**
     * Show assignment status page
     */
    public function showStatus($params)
    {
        $assignmentId = $params['id'] ?? null;
        $studentId = Session::get('user_id');

        if (!$assignmentId) {
            redirect_to('/dashboard');
            return;
        }

        // Get assignment details
        $stmt = $this->db->prepare("
            SELECT a.*, ci.title, ci.content_id
            FROM assessments a
            JOIN content_items ci ON a.content_id = ci.content_id
            WHERE a.assessment_id = ? AND a.assessment_type = 'assignment'
        ");
        $stmt->execute([$assignmentId]);
        $assignment = $stmt->fetch();

        if ($assignment) {
            $assignment['id'] = $assignment['assessment_id'];
        }

        if (!$assignment) {
            redirect_to('/dashboard');
            return;
        }

        // Get student submission
        $stmt = $this->db->prepare("
            SELECT * FROM assessment_results
            WHERE assessment_id = ? AND student_id = ?
            ORDER BY submitted_at DESC
            LIMIT 1
        ");
        $stmt->execute([$assignmentId, $studentId]);
        $submission = $stmt->fetch();

        include_once __DIR__ . '/../Views/assignment/assignment_status.php';
    }

    /**
     * Show submission form
     */
    public function showSubmit($params)
    {
        $assignmentId = $params['id'] ?? null;
        $studentId = Session::get('user_id');

        if (!$assignmentId) {
            redirect_to('/dashboard');
            return;
        }

        // Get assignment details
        $stmt = $this->db->prepare("
            SELECT a.*, ci.title
            FROM assessments a
            JOIN content_items ci ON a.content_id = ci.content_id
            WHERE a.assessment_id = ? AND a.assessment_type = 'assignment'
        ");
        $stmt->execute([$assignmentId]);
        $assignment = $stmt->fetch();

        if ($assignment) {
            $assignment['id'] = $assignment['assessment_id'];
        }

        if (!$assignment) {
            redirect_to('/dashboard');
            return;
        }

        // Get existing submission
        $stmt = $this->db->prepare("
            SELECT * FROM assessment_results
            WHERE assessment_id = ? AND student_id = ?
        ");
        $stmt->execute([$assignmentId, $studentId]);
        $submission = $stmt->fetch();

        include_once __DIR__ . '/../Views/assignment/add_submission.php';
    }

    /**
     * Upload assignment submission
     */
    public function uploadSubmission($params)
    {
        $assignmentId = $params['id'] ?? null;
        $studentId = Session::get('user_id');

        if (!$assignmentId || !isset($_FILES['submission_file'])) {
            redirect_to('/assignment/' . $assignmentId . '/status');
            return;
        }

        $file = $_FILES['submission_file'];
        
        // Validate file
        $allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/x-rar-compressed'];
        
        if (!in_array($file['type'], $allowedTypes)) {
            Session::set('error', 'Invalid file type. Only PDF, DOC, DOCX, ZIP, RAR are allowed.');
            redirect_to('/assignment/' . $assignmentId . '/submit');
            return;
        }

        // Create upload directory if not exists
        $uploadDir = __DIR__ . '/../../public/uploads/assignments/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // Generate unique filename
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = 'assignment_' . $assignmentId . '_student_' . $studentId . '_' . time() . '.' . $extension;
        $filepath = $uploadDir . $filename;

        // Move uploaded file
        if (move_uploaded_file($file['tmp_name'], $filepath)) {
            // Check if submission exists
            $stmt = $this->db->prepare("
                SELECT * FROM assessment_results
                WHERE assessment_id = ? AND student_id = ?
            ");
            $stmt->execute([$assignmentId, $studentId]);
            $existing = $stmt->fetch();

            if ($existing) {
                // Update existing submission
                $stmt = $this->db->prepare("
                    UPDATE assessment_results
                    SET file_path = ?, submitted_at = NOW()
                    WHERE assessment_id = ? AND student_id = ?
                ");
                $stmt->execute([$filename, $assignmentId, $studentId]);
            } else {
                // Insert new submission
                $stmt = $this->db->prepare("
                    INSERT INTO assessment_results (assessment_id, student_id, file_path, submitted_at, status)
                    VALUES (?, ?, ?, NOW(), 'submitted')
                ");
                $stmt->execute([$assignmentId, $studentId, $filename]);
            }

            Session::set('success', 'Assignment submitted successfully!');
        } else {
            Session::set('error', 'Failed to upload file. Please try again.');
        }

        redirect_to('/assignment/' . $assignmentId . '/status');
    }
}
