<?php

namespace App\Controllers;

use App\Core\Database;
use App\Core\Session;

class QuizController
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    /**
     * Show quiz start page
     */
    public function show($params)
    {
        $quizId = $params['id'] ?? null;
        $studentId = Session::get('user_id');

        if (!$quizId) {
            redirect_to('/dashboard');
            return;
        }

        // Get quiz details
        $stmt = $this->db->prepare("
            SELECT a.*, ci.title, ci.subject_id
            FROM assessments a
            JOIN content_items ci ON a.content_id = ci.content_id
            WHERE a.assessment_id = ? AND a.assessment_type = 'quiz'
        ");
        $stmt->execute([$quizId]);
        $quiz = $stmt->fetch();

        if ($quiz) {
            $quiz['id'] = $quiz['assessment_id'];
        }

        if (!$quiz) {
            redirect_to('/dashboard');
            return;
        }

        // Check if student has attempt
        $stmt = $this->db->prepare("
            SELECT * FROM assessment_results
            WHERE assessment_id = ? AND student_id = ?
        ");
        $stmt->execute([$quizId, $studentId]);
        $hasAttempt = $stmt->fetch() ? true : false;

        // Check if quiz is available
        $now = time();
        $openTime = strtotime($quiz['open_time']);
        $closeTime = strtotime($quiz['close_time']);
        $canTake = ($now >= $openTime && $now <= $closeTime);

        include_once __DIR__ . '/../Views/quiz/quiz_start.php';
    }

    /**
     * Take quiz page
     */
    public function take($params)
    {
        $quizId = $params['id'] ?? null;
        $studentId = Session::get('user_id');

        if (!$quizId) {
            redirect_to('/dashboard');
            return;
        }

        // Get quiz details
        $stmt = $this->db->prepare("
            SELECT a.*, ci.title, ci.subject_id
            FROM assessments a
            JOIN content_items ci ON a.content_id = ci.content_id
            WHERE a.assessment_id = ? AND a.assessment_type = 'quiz'
        ");
        $stmt->execute([$quizId]);
        $quiz = $stmt->fetch();

        if ($quiz) {
            $quiz['id'] = $quiz['assessment_id'];
        }

        if (!$quiz) {
            redirect_to('/dashboard');
            return;
        }

        // Get questions with options
        $questionStmt = $this->db->prepare("
            SELECT * FROM quiz_questions
            WHERE assessment_id = ?
            ORDER BY question_order
        ");
        $questionStmt->execute([$quizId]);
        $questions = $questionStmt->fetchAll();

        // Get options for each question
        $optionStmt = $this->db->prepare("
            SELECT * FROM quiz_options
            WHERE question_id = ?
            ORDER BY option_order
        ");

        foreach ($questions as &$question) {
            $question['id'] = $question['question_id'];
            $optionStmt->execute([$question['question_id']]);
            $options = $optionStmt->fetchAll();
            foreach ($options as &$option) {
                $option['id'] = $option['option_id'];
            }
            $question['options'] = $options;
        }

        // Start attempt
        $stmt = $this->db->prepare("
            INSERT INTO assessment_results (assessment_id, student_id, started_at, status)
            VALUES (?, ?, NOW(), 'in_progress')
            ON DUPLICATE KEY UPDATE started_at = NOW(), status = 'in_progress'
        ");
        $stmt->execute([$quizId, $studentId]);

        include_once __DIR__ . '/../Views/quiz/take_quiz.php';
    }

    /**
     * Submit quiz answers
     */
    public function submitAnswers($params)
    {
        $quizId = $params['id'] ?? null;
        $studentId = Session::get('user_id');

        if (!$quizId) {
            redirect_to('/dashboard');
            return;
        }

        // Get submitted answers
        $answers = [];
        foreach ($_POST as $key => $value) {
            if (strpos($key, 'answer_') === 0) {
                $questionId = str_replace('answer_', '', $key);
                $answers[$questionId] = is_array($value) ? $value : [$value];
            }
        }

        // Calculate score
        $stmt = $this->db->prepare("SELECT * FROM quiz_questions WHERE assessment_id = ?");
        $stmt->execute([$quizId]);
        $questions = $stmt->fetchAll();

        $totalQuestions = count($questions);
        $correctCount = 0;

        foreach ($questions as $question) {
            $questionId = $question['question_id'];
            $studentAnswers = $answers[$questionId] ?? [];

            // Get correct options
            $stmt = $this->db->prepare("
                SELECT option_id FROM quiz_options
                WHERE question_id = ? AND is_correct = 1
            ");
            $stmt->execute([$questionId]);
            $correctOptions = array_column($stmt->fetchAll(), 'option_id');

            // Check if answers match
            sort($studentAnswers);
            sort($correctOptions);
            
            if ($studentAnswers == array_map('strval', $correctOptions)) {
                $correctCount++;
            }
        }

        $score = ($totalQuestions > 0) ? ($correctCount / $totalQuestions) * 10 : 0;

        // Update result
        $stmt = $this->db->prepare("
            UPDATE assessment_results
            SET score = ?, completed_at = NOW(), status = 'completed'
            WHERE assessment_id = ? AND student_id = ?
        ");
        $stmt->execute([$score, $quizId, $studentId]);

        redirect_to('/quiz/' . $quizId . '/results');
    }

    /**
     * Show quiz results
     */
    public function results($params)
    {
        $quizId = $params['id'] ?? null;
        $studentId = Session::get('user_id');

        if (!$quizId) {
            redirect_to('/dashboard');
            return;
        }

        // Get quiz details
        $stmt = $this->db->prepare("
            SELECT a.*, ci.title, ci.subject_id
            FROM assessments a
            JOIN content_items ci ON a.content_id = ci.content_id
            WHERE a.assessment_id = ? AND a.assessment_type = 'quiz'
        ");
        $stmt->execute([$quizId]);
        $quiz = $stmt->fetch();

        if ($quiz) {
            $quiz['id'] = $quiz['assessment_id'];
        }

        // Get result
        $stmt = $this->db->prepare("
            SELECT * FROM assessment_results
            WHERE assessment_id = ? AND student_id = ?
        ");
        $stmt->execute([$quizId, $studentId]);
        $result = $stmt->fetch();

        if (!$result) {
            Session::set('error', 'Chưa có kết quả cho lần làm bài này.');
            redirect_to('/quiz/' . $quizId);
            return;
        }

        // Calculate stats
        $stmt = $this->db->prepare("SELECT COUNT(*) as total FROM quiz_questions WHERE assessment_id = ?");
        $stmt->execute([$quizId]);
        $totalQuestions = $stmt->fetch()['total'];
        
        $correctAnswers = round(($result['score'] / 10) * $totalQuestions);
        $courseId = $quiz['subject_id'];

        include_once __DIR__ . '/../Views/quiz/results.php';
    }

    /**
     * Manage quiz (instructor)
     */
    public function manage($params)
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

        if ($quiz) {
            $quiz['id'] = $quiz['assessment_id'];
        }

        // Get questions
        $stmt = $this->db->prepare("
            SELECT * FROM quiz_questions
            WHERE assessment_id = ?
            ORDER BY question_order
        ");
        $stmt->execute([$quizId]);
        $questions = $stmt->fetchAll();

        foreach ($questions as &$question) {
            $question['id'] = $question['question_id'];
        }

        include_once __DIR__ . '/../Views/quiz/manage_quiz.php';
    }

    /**
     * Edit question page
     */
    public function editQuestion($params)
    {
        $questionId = $params['id'] ?? 'new';
        $quizId = $_GET['quiz_id'] ?? null;

        $question = null;
        if ($questionId !== 'new') {
            $stmt = $this->db->prepare("SELECT * FROM quiz_questions WHERE question_id = ?");
            $stmt->execute([$questionId]);
            $question = $stmt->fetch();

            if ($question) {
                $question['id'] = $question['question_id'];
                // Get options
                $stmt = $this->db->prepare("
                    SELECT * FROM quiz_options
                    WHERE question_id = ?
                    ORDER BY option_order
                ");
                $stmt->execute([$questionId]);
                $question['options'] = $stmt->fetchAll();
                $quizId = $question['assessment_id'];
            }
        }

        include_once __DIR__ . '/../Views/quiz/edit_question.php';
    }

    /**
     * Save question
     */
    public function saveQuestion($params)
    {
        $questionId = $params['id'] ?? 'new';
        $quizId = $_POST['quiz_id'] ?? null;
        $questionText = $_POST['question_text'] ?? '';
        $questionType = $_POST['question_type'] ?? 'multiple_choice';
        $options = $_POST['options'] ?? [];
        $correctAnswers = $_POST['correct_answer'] ?? [];

        if (!is_array($correctAnswers)) {
            $correctAnswers = [$correctAnswers];
        }

        if ($questionId === 'new') {
            // Insert new question
            $stmt = $this->db->prepare("
                INSERT INTO quiz_questions (assessment_id, question_text, question_type, question_order)
                VALUES (?, ?, ?, (SELECT COALESCE(MAX(question_order), 0) + 1 FROM quiz_questions WHERE assessment_id = ?))
            ");
            $stmt->execute([$quizId, $questionText, $questionType, $quizId]);
            $questionId = $this->db->lastInsertId();
        } else {
            // Update existing question
            $stmt = $this->db->prepare("
                UPDATE quiz_questions
                SET question_text = ?, question_type = ?
                WHERE question_id = ?
            ");
            $stmt->execute([$questionText, $questionType, $questionId]);

            // Delete old options
            $stmt = $this->db->prepare("DELETE FROM quiz_options WHERE question_id = ?");
            $stmt->execute([$questionId]);
        }

        // Insert options
        foreach ($options as $index => $optionText) {
            if (empty($optionText)) continue;

            $isCorrect = in_array((string)$index, $correctAnswers) ? 1 : 0;
            
            $stmt = $this->db->prepare("
                INSERT INTO quiz_options (question_id, option_text, is_correct, option_order)
                VALUES (?, ?, ?, ?)
            ");
            $stmt->execute([$questionId, $optionText, $isCorrect, $index]);
        }

        redirect_to('/quiz/' . $quizId . '/manage');
    }

    /**
     * Delete question
     */
    public function deleteQuestion($params)
    {
        $questionId = $params['id'] ?? null;

        if ($questionId) {
            // Get quiz ID first
            $stmt = $this->db->prepare("SELECT assessment_id FROM quiz_questions WHERE question_id = ?");
            $stmt->execute([$questionId]);
            $quiz = $stmt->fetch();

            // Delete options
            $stmt = $this->db->prepare("DELETE FROM quiz_options WHERE question_id = ?");
            $stmt->execute([$questionId]);

            // Delete question
            $stmt = $this->db->prepare("DELETE FROM quiz_questions WHERE question_id = ?");
            $stmt->execute([$questionId]);

            if ($quiz) {
                redirect_to('/quiz/' . $quiz['assessment_id'] . '/manage');
            } else {
                redirect_to('/dashboard');
            }
        }
    }
}
