<?php

namespace App\Controllers;

use App\Core\Session;
use App\Core\View;
use App\Models\Repositories\QuizRepository;
use App\Models\Repositories\ResultRepository;
use App\Models\Services\QuizAssessment;
use App\Models\Services\QuizService;

class QuizController
{
    private QuizService $quizService;

    public function __construct(?QuizService $quizService = null)
    {
        $this->quizService = $quizService ?? new QuizService(
            new QuizRepository(),
            new ResultRepository(),
            new QuizAssessment()
        );
    }

    public function show($params): void
    {
        $quizId = isset($params['id']) ? (int)$params['id'] : 0;
        
        if ($quizId <= 0) {
            View::redirect('/dashboard');
            return;
        }

        // If instructor, redirect to instructor view page
        if (Session::isInstructor()) {
            $this->instructorView($params);
            return;
        }

        // Student view
        $studentId = (int)Session::get('user_id');
        if (!$studentId) {
            View::redirect('/dashboard');
            return;
        }

        try {
            $overview = $this->quizService->getQuizOverview($quizId, $studentId);
            $quiz = $this->formatQuizForView($overview['quiz'] ?? []);
            $latestResult = $overview['latest_result'] ?? null;
            
            // Get all attempts for the student
            $allAttempts = $this->quizService->getAllStudentAttempts($quizId, $studentId);

            View::render('quiz/quiz_start', [
                'quiz' => $quiz,
                'hasAttempt' => !empty($latestResult),
                'canTake' => (bool)($overview['can_attempt'] ?? false),
                'attemptCount' => $overview['attempt_count'] ?? 0,
                'maxAttempts' => $overview['max_attempts'] ?? 1,
                'remainingAttempts' => $overview['remaining_attempts'] ?? 0,
                'gradingMethod' => $overview['grading_method'] ?? 'last',
                'finalGrade' => $overview['final_grade'] ?? null,
                'latestScore' => $latestResult['score'] ?? null,
                'allAttempts' => $allAttempts,
                'courseId' => $quiz['subject_id'] ?? null,
            ]);
        } catch (\Throwable $exception) {
            Session::flash('error', $exception->getMessage());
            View::redirect('/dashboard');
        }
    }

    public function instructorView($params): void
    {
        $quizId = isset($params['id']) ? (int)$params['id'] : 0;

        if ($quizId <= 0) {
            View::redirect('/dashboard');
            return;
        }

        try {
            $payload = $this->quizService->getQuizManagementData($quizId);
            $quiz = $this->formatQuizForView($payload['quiz'] ?? []);
            $questions = $this->formatQuestionsForView($payload['questions'] ?? []);
            
            // Get quiz statistics
            $totalQuestions = count($questions);
            $statistics = $this->quizService->getQuizStatistics($quizId);

            View::render('quiz/instructor_view', [
                'quiz' => $quiz,
                'totalStudents' => $statistics['total_students'],
                'completedCount' => $statistics['completed_count'],
                'notCompletedCount' => $statistics['not_completed_count'],
                'totalQuestions' => $totalQuestions,
                'courseId' => $quiz['subject_id'] ?? null,
            ]);
        } catch (\Throwable $exception) {
            Session::flash('error', $exception->getMessage());
            View::redirect('/dashboard');
        }
    }

    public function take($params): void
    {
        $quizId = isset($params['id']) ? (int)$params['id'] : 0;
        $studentId = (int)Session::get('user_id');

        if ($quizId <= 0 || !$studentId) {
            View::redirect('/dashboard');
            return;
        }

        try {
            $payload = $this->quizService->getQuizForTaking($quizId, $studentId);
            $quiz = $this->formatQuizForView($payload['quiz'] ?? []);
            $questions = $this->formatQuestionsForView($quiz['questions'] ?? []);

            View::render('quiz/take_quiz', [
                'quiz' => $quiz,
                'questions' => $questions,
                'courseId' => $quiz['subject_id'] ?? null,
            ]);
        } catch (\Throwable $exception) {
            Session::flash('error', $exception->getMessage());
            View::redirect('/quiz/' . $quizId);
        }
    }

    public function submitAnswers($params): void
    {
        $quizId = isset($params['id']) ? (int)$params['id'] : 0;
        $studentId = (int)Session::get('user_id');

        if ($quizId <= 0 || !$studentId) {
            View::redirect('/dashboard');
            return;
        }

        $answers = $this->extractAnswersFromRequest($_POST ?? []);
        $timeTaken = isset($_POST['time_taken']) ? (int)$_POST['time_taken'] : null;
        $startedAt = $_POST['started_at'] ?? null;

        try {
            $result = $this->quizService->submitQuiz($quizId, $studentId, $answers, $timeTaken, $startedAt);
            $resultId = $result['result_id'] ?? null;
            $redirectUrl = '/quiz/' . $quizId . '/results' . ($resultId ? '?result_id=' . $resultId : '');
            View::redirect($redirectUrl);
        } catch (\Throwable $exception) {
            Session::flash('error', $exception->getMessage());
            View::redirect('/quiz/' . $quizId . '/take');
        }
    }

    public function results($params): void
    {
        $quizId = isset($params['id']) ? (int)$params['id'] : 0;
        $studentId = (int)Session::get('user_id');
        $requestedResultId = isset($_GET['result_id']) ? (int)$_GET['result_id'] : null;

        if ($quizId <= 0 || !$studentId) {
            View::redirect('/dashboard');
            return;
        }

        try {
            $payload = $this->quizService->getQuizResult($quizId, $studentId, $requestedResultId);
            $quiz = $this->formatQuizForView($payload['quiz'] ?? []);
            $questions = $this->formatQuestionsForView($payload['questions'] ?? []);
            $result = $payload['result'] ?? [];

            $stats = $this->calculateResultStatistics(
                $questions,
                $payload['answers'] ?? [],
                (float)($result['score'] ?? 0),
                (float)($payload['max_score'] ?? 10)
            );

            View::render('quiz/results', [
                'quiz' => $quiz,
                'result' => $result,
                'totalQuestions' => $stats['total_questions'],
                'correctAnswers' => $stats['correct_answers'],
                'courseId' => $quiz['subject_id'] ?? null,
                'allAttempts' => $payload['all_attempts'] ?? [],
                'finalGrade' => $payload['final_grade'] ?? null,
                'gradingMethod' => $payload['grading_method'] ?? 'last',
            ]);
        } catch (\Throwable $exception) {
            Session::flash('error', $exception->getMessage());
            View::redirect('/quiz/' . $quizId);
        }
    }

    public function review($params): void
    {
        $quizId = isset($params['id']) ? (int)$params['id'] : 0;
        $studentId = (int)Session::get('user_id');
        $requestedResultId = isset($_GET['result_id']) ? (int)$_GET['result_id'] : null;

        if ($quizId <= 0 || !$studentId) {
            View::redirect('/dashboard');
            return;
        }

        try {
            $payload = $this->quizService->getQuizResult($quizId, $studentId, $requestedResultId);
            $quiz = $this->formatQuizForView($payload['quiz'] ?? []);
            $questions = $this->formatQuestionsForView($payload['questions'] ?? []);
            $result = $payload['result'] ?? [];

            $stats = $this->calculateResultStatistics(
                $questions,
                $payload['answers'] ?? [],
                (float)($result['score'] ?? 0),
                (float)($payload['max_score'] ?? 10)
            );

            View::render('quiz/review_quiz', [
                'quiz' => $quiz,
                'result' => $result,
                'questions' => $questions,
                'answers' => $payload['answers'] ?? [],
                'totalQuestions' => $stats['total_questions'],
                'correctAnswers' => $stats['correct_answers'],
                'courseId' => $quiz['subject_id'] ?? null,
                'allAttempts' => $payload['all_attempts'] ?? [],
                'finalGrade' => $payload['final_grade'] ?? null,
                'gradingMethod' => $payload['grading_method'] ?? 'last',
            ]);
        } catch (\Throwable $exception) {
            Session::flash('error', $exception->getMessage());
            View::redirect('/quiz/' . $quizId . '/results');
        }
    }

    public function manage($params): void
    {
        $quizId = isset($params['id']) ? (int)$params['id'] : 0;

        if ($quizId <= 0) {
            View::redirect('/dashboard');
            return;
        }

        try {
            $payload = $this->quizService->getQuizManagementData($quizId);
            $quiz = $this->formatQuizForView($payload['quiz'] ?? []);
            $questions = $this->formatQuestionsForView($payload['questions'] ?? []);

            View::render('quiz/manage_quiz', [
                'quiz' => $quiz,
                'questions' => $questions,
                'courseId' => $quiz['subject_id'] ?? null,
            ]);
        } catch (\Throwable $exception) {
            Session::flash('error', $exception->getMessage());
            View::redirect('/dashboard');
        }
    }

    public function editQuestion($params): void
    {
        $questionId = $params['id'] ?? 'new';
        $quizId = isset($_GET['quiz_id']) ? (int)$_GET['quiz_id'] : null;
        $question = null;

        if ($questionId !== 'new') {
            try {
                $questionData = $this->quizService->getQuestionForEdit((int)$questionId);

                if (!$questionData) {
                    Session::flash('error', 'Question not found.');
                    View::redirect('/quiz/' . ($quizId ?? '') . '/manage');
                    return;
                }

                $quizId = $questionData['assessment_id'];
                $question = $this->formatQuestionForEdit($questionData);
            } catch (\Throwable $exception) {
                Session::flash('error', $exception->getMessage());
                View::redirect('/quiz/' . ($quizId ?? '') . '/manage');
                return;
            }
        }

        View::render('quiz/edit_question', [
            'question' => $question,
            'quizId' => $quizId,
            'courseId' => null, // Can be fetched from quiz if needed
        ]);
    }

    public function saveQuestion($params): void
    {
        $questionId = $params['id'] ?? 'new';
        $quizId = isset($_POST['quiz_id']) ? (int)$_POST['quiz_id'] : 0;

        if ($quizId <= 0) {
            View::redirect('/dashboard');
            return;
        }

        $questionData = [
            'question_text' => trim($_POST['question_text'] ?? ''),
            'question_type' => $this->mapQuestionTypeForStorage($_POST['question_type'] ?? ''),
            'points' => isset($_POST['points']) ? (float)$_POST['points'] : 1,
        ];

        $options = $this->buildOptionsFromRequest($_POST ?? []);

        try {
            if ($questionId === 'new') {
                $this->quizService->createQuestion($quizId, $questionData, $options);
            } else {
                $this->quizService->updateQuestionWithOptions((int)$questionId, $questionData, $options);
            }

            View::redirect('/quiz/' . $quizId . '/manage');
        } catch (\Throwable $exception) {
            Session::flash('error', $exception->getMessage());
            View::redirect('/quiz/' . $quizId . '/manage');
        }
    }

    public function deleteQuestion($params): void
    {
        $questionId = isset($params['id']) ? (int)$params['id'] : 0;

        if ($questionId <= 0) {
            View::json(['success' => false, 'message' => 'Invalid question id'], 400);
        }

        try {
            $this->quizService->deleteQuestion($questionId);
            View::json(['success' => true]);
        } catch (\Throwable $exception) {
            View::json(['success' => false, 'message' => $exception->getMessage()], 500);
        }
    }

    public function updateSettings($params): void
    {
        $quizId = isset($params['id']) ? (int)$params['id'] : 0;

        if ($quizId <= 0) {
            View::json(['success' => false, 'message' => 'Invalid quiz id'], 400);
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        $maxAttempts = isset($input['max_attempts']) ? (int)$input['max_attempts'] : 1;
        $gradingMethod = $input['grading_method'] ?? 'last';

        try {
            $quiz = $this->quizService->getQuizWithQuestions($quizId);
            $updateData = [
                'title' => $quiz['title'],
                'description' => $quiz['description'] ?? '',
                'time_limit' => $quiz['time_limit'] ?? 0,
                'open_time' => $quiz['open_time'],
                'close_time' => $quiz['close_time'],
                'max_score' => $quiz['max_score'] ?? 10,
                'is_visible' => $quiz['is_visible'] ?? 1,
                'display_order' => $quiz['display_order'] ?? 0,
                'max_attempts' => $maxAttempts,
                'grading_method' => $gradingMethod,
            ];

            $this->quizService->updateQuiz($quizId, $updateData);
            View::json(['success' => true]);
        } catch (\Throwable $exception) {
            View::json(['success' => false, 'message' => $exception->getMessage()], 500);
        }
    }

    private function formatQuizForView(array $quiz): array
    {
        if (!empty($quiz)) {
            $quiz['id'] = $quiz['assessment_id'] ?? $quiz['id'] ?? null;
        }

        return $quiz;
    }

    private function formatQuestionsForView(array $questions): array
    {
        foreach ($questions as &$question) {
            $question['id'] = $question['question_id'] ?? $question['id'] ?? null;
            $question['question_type'] = $this->mapQuestionTypeForView($question['question_type'] ?? '');

            if (!empty($question['options'])) {
                foreach ($question['options'] as &$option) {
                    $option['id'] = $option['option_id'] ?? $option['id'] ?? null;
                }
            }
        }

        return $questions;
    }

    private function formatQuestionForEdit(array $question): array
    {
        $question['id'] = $question['question_id'] ?? null;
        $question['question_type'] = $this->mapQuestionTypeForView($question['question_type'] ?? '');

        if (!empty($question['options'])) {
            foreach ($question['options'] as &$option) {
                $option['id'] = $option['option_id'] ?? null;
            }
        }

        return $question;
    }

    private function extractAnswersFromRequest(array $post): array
    {
        $answers = [];

        foreach ($post as $key => $value) {
            if (strpos($key, 'answer_') !== 0) {
                continue;
            }

            $questionId = (int)str_replace('answer_', '', $key);

            if (is_array($value)) {
                $answers[$questionId] = array_values($value);
            } else {
                $answers[$questionId] = $value;
            }
        }

        return $answers;
    }

    private function calculateResultStatistics(array $questions, array $answers, float $score, float $maxScore): array
    {
        $totalQuestions = count($questions);
        $correctAnswers = 0;

        foreach ($questions as $question) {
            $questionId = $question['id'];
            $expected = [];

            foreach ($question['options'] as $option) {
                if (!empty($option['is_correct'])) {
                    $expected[] = (string)$option['id'];
                }
            }

            $submitted = $answers[$questionId] ?? [];
            $submittedValues = is_array($submitted) ? array_map('strval', $submitted) : [(string)$submitted];

            sort($expected);
            sort($submittedValues);

            if ($expected === $submittedValues && !empty($expected)) {
                $correctAnswers++;
            }
        }

        if ($totalQuestions && $maxScore > 0 && $correctAnswers === 0 && $score > 0) {
            $ratio = $score / $maxScore;
            $correctAnswers = (int)round($ratio * $totalQuestions);
        }

        return [
            'total_questions' => $totalQuestions,
            'correct_answers' => $correctAnswers,
        ];
    }

    private function mapQuestionTypeForView(string $type): string
    {
        return match ($type) {
            'mc-multi' => 'multiple_answer',
            'tf' => 'true_false',
            default => 'multiple_choice',
        };
    }

    private function mapQuestionTypeForStorage(string $type): string
    {
        return match ($type) {
            'multiple_answer' => 'mc-multi',
            'true_false' => 'tf',
            default => 'mc-single',
        };
    }

    private function buildOptionsFromRequest(array $post): array
    {
        $texts = $post['options'] ?? [];
        $correct = $post['correct_answer'] ?? [];

        if (!is_array($correct)) {
            $correct = [$correct];
        }

        $correct = array_map('strval', $correct);
        $options = [];

        foreach ($texts as $index => $text) {
            $text = trim($text);

            if ($text === '') {
                continue;
            }

            $options[] = [
                'option_text' => $text,
                'is_correct' => in_array((string)$index, $correct, true),
                'display_order' => $index,
            ];
        }

        return $options;
    }
}
