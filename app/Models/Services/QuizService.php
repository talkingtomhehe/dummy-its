<?php
namespace App\Models\Services;

use App\Models\Interfaces\IAssessment;
use App\Models\Interfaces\IQuizRepository;
use App\Models\Interfaces\IResultRepository;

/**
 * QuizService centralises quiz business logic (fetching, grading, management).
 */
class QuizService {
    private IQuizRepository $quizRepo;
    private IResultRepository $resultRepo;
    private IAssessment $quizAssessment;

    public function __construct(IQuizRepository $quizRepo, IResultRepository $resultRepo, IAssessment $quizAssessment) {
        $this->quizRepo = $quizRepo;
        $this->resultRepo = $resultRepo;
        $this->quizAssessment = $quizAssessment;
    }

    public function getQuizOverview(int $assessmentId, int $userId): array {
        $quiz = $this->quizRepo->getQuizById($assessmentId);

        if (!$quiz) {
            throw new \RuntimeException('Quiz not found');
        }

        $questions = $this->quizRepo->getQuizQuestions($assessmentId);
        $questionCount = count($questions);
        $totalPoints = array_reduce($questions, static function (float $carry, array $item): float {
            return $carry + (float)($item['points'] ?? 0);
        }, 0.0);

        $latestResult = $this->getLatestResultForUser($assessmentId, $userId);
        $attemptCount = $this->quizRepo->getAttemptCount($assessmentId, $userId);
        $maxAttempts = (int)($quiz['max_attempts'] ?? 1);
        $gradingMethod = $quiz['grading_method'] ?? 'last';

        $now = new \DateTimeImmutable('now');
        $openTime = $quiz['open_time'] ? new \DateTimeImmutable($quiz['open_time']) : null;
        $closeTime = $quiz['close_time'] ? new \DateTimeImmutable($quiz['close_time']) : null;

        $canAttempt = true;
        if ($openTime && $now < $openTime) {
            $canAttempt = false;
        }
        if ($closeTime && $now > $closeTime) {
            $canAttempt = false;
        }
        
        // Check if student has reached max attempts (0 = unlimited)
        if ($maxAttempts > 0 && $attemptCount >= $maxAttempts) {
            $canAttempt = false;
        }

        // Calculate final grade based on grading method
        $finalGrade = null;
        if ($attemptCount > 0) {
            $finalGrade = $this->quizRepo->calculateFinalGrade($assessmentId, $userId, $gradingMethod);
        }

        return [
            'quiz' => $quiz,
            'question_count' => $questionCount,
            'total_points' => $totalPoints,
            'latest_result' => $latestResult,
            'can_attempt' => $canAttempt,
            'open_time' => $openTime,
            'close_time' => $closeTime,
            'max_score' => (float)($quiz['max_score'] ?? 10),
            'attempt_count' => $attemptCount,
            'max_attempts' => $maxAttempts,
            'remaining_attempts' => $maxAttempts > 0 ? max(0, $maxAttempts - $attemptCount) : -1,
            'grading_method' => $gradingMethod,
            'final_grade' => $finalGrade,
        ];
    }

    public function getQuizForTaking(int $assessmentId, int $userId): array {
        $overview = $this->getQuizOverview($assessmentId, $userId);

        if (!$overview['can_attempt']) {
            throw new \RuntimeException('Quiz is not available at this time');
        }

        $questions = $this->quizRepo->getQuizQuestions($assessmentId);
        $normalisedQuestions = $this->normaliseQuestions($questions);

        $overview['quiz']['questions'] = $normalisedQuestions;
        $overview['quiz']['question_count'] = count($normalisedQuestions);
        $overview['quiz']['total_points'] = $overview['total_points'];

        return $overview;
    }

    public function submitQuiz(int $assessmentId, int $userId, array $answers, ?int $timeTaken = null, ?string $startedAt = null): array {
        $quiz = $this->quizRepo->getQuizById($assessmentId);

        if (!$quiz) {
            throw new \RuntimeException('Quiz not found');
        }

        if (!$this->quizAssessment->validateSubmission($answers)) {
            throw new \InvalidArgumentException('No answers submitted');
        }

        $questions = $this->quizRepo->getQuizQuestions($assessmentId);
        $normalisedQuestions = $this->normaliseQuestions($questions);

        $correctAnswers = [];
        foreach ($normalisedQuestions as $question) {
            $correctOptions = [];
            foreach ($question['options'] as $option) {
                if ($option['is_correct']) {
                    $correctOptions[] = (string)$option['option_id'];
                }
            }

            $correctAnswers[$question['question_id']] = [
                'type' => $question['question_type'],
                'correct' => $question['question_type'] === 'mc-multi' ? $correctOptions : ($correctOptions[0] ?? ''),
                'points' => (float)$question['points'],
            ];
        }

        $rawScore = $this->quizAssessment->calculateGrade($answers, $correctAnswers);
        $totalPoints = array_reduce($normalisedQuestions, static function (float $carry, array $item): float {
            return $carry + (float)$item['points'];
        }, 0.0);
        $maxScore = (float)($quiz['max_score'] ?? $totalPoints ?: 10);

        $finalScore = $totalPoints > 0
            ? round(($rawScore / $totalPoints) * $maxScore, 2)
            : 0.0;

        $resultData = [
            'assessment_id' => $assessmentId,
            'user_id' => $userId,
            'score' => $finalScore,
            'answers' => $answers,
            'time_taken' => $timeTaken,
            'started_at' => $startedAt,
        ];

        $resultId = $this->resultRepo->submitQuizResult($resultData);

        return [
            'result_id' => $resultId,
            'score' => $finalScore,
            'raw_score' => $rawScore,
            'total_points' => $totalPoints,
            'max_score' => $maxScore,
        ];
    }

    public function getQuizResult(int $assessmentId, int $userId, ?int $resultId = null): array {
        $quiz = $this->quizRepo->getQuizById($assessmentId);

        if (!$quiz) {
            throw new \RuntimeException('Quiz not found');
        }

        $result = null;

        if ($resultId) {
            $result = $this->resultRepo->getResultById($resultId);
            if ($result && (int)$result['assessment_id'] !== $assessmentId) {
                $result = null;
            }
            if ($result && (int)$result['user_id'] !== $userId) {
                $result = null;
            }
        }

        if (!$result) {
            $result = $this->getLatestResultForUser($assessmentId, $userId);
        }

        if (!$result) {
            throw new \RuntimeException('No quiz attempt found');
        }

        $answers = $result['answers'] ? json_decode($result['answers'], true) : [];
        if (!is_array($answers)) {
            $answers = [];
        }

        $questions = $this->normaliseQuestions($this->quizRepo->getQuizQuestions($assessmentId));
        $questions = $this->markSelections($questions, $answers);

        $totalPoints = array_reduce($questions, static function (float $carry, array $item): float {
            return $carry + (float)$item['points'];
        }, 0.0);

        // Get all attempts and calculate final grade
        $allAttempts = $this->quizRepo->getAllAttempts($assessmentId, $userId);
        $gradingMethod = $quiz['grading_method'] ?? 'last';
        $finalGrade = $this->quizRepo->calculateFinalGrade($assessmentId, $userId, $gradingMethod);

        return [
            'quiz' => $quiz,
            'result' => $result,
            'questions' => $questions,
            'answers' => $answers,
            'total_points' => $totalPoints,
            'max_score' => (float)($quiz['max_score'] ?? 10),
            'all_attempts' => $allAttempts,
            'final_grade' => $finalGrade,
            'grading_method' => $gradingMethod,
        ];
    }

    public function getQuizManagementData(int $assessmentId): array {
        $quiz = $this->quizRepo->getQuizById($assessmentId);

        if (!$quiz) {
            throw new \RuntimeException('Quiz not found');
        }

        $questions = $this->normaliseQuestions($this->quizRepo->getQuizQuestions($assessmentId));

        return [
            'quiz' => $quiz,
            'questions' => $questions,
        ];
    }

    public function getQuestionForEdit(int $questionId): ?array {
        $question = $this->quizRepo->getQuestionWithOptions($questionId);

        if (!$question) {
            return null;
        }

        $question['options'] = $this->sortOptions($question['options']);

        return $question;
    }

    public function updateQuestionWithOptions(int $questionId, array $questionData, array $options): bool {
        $this->quizRepo->updateQuestion($questionId, $questionData);
        $this->quizRepo->createOptions($questionId, $this->normaliseOptions($options));

        return true;
    }

    public function deleteQuestion(int $questionId): bool {
        return $this->quizRepo->deleteQuestion($questionId);
    }

    public function createQuiz(array $data): int {
        if (!empty($data['open_time']) && !empty($data['close_time']) && strtotime($data['close_time']) < strtotime($data['open_time'])) {
            throw new \InvalidArgumentException('Close time must be after open time');
        }

        return $this->quizRepo->createQuiz($data);
    }

    public function updateQuiz(int $assessmentId, array $data): bool {
        if (!empty($data['open_time']) && !empty($data['close_time']) && strtotime($data['close_time']) < strtotime($data['open_time'])) {
            throw new \InvalidArgumentException('Close time must be after open time');
        }

        return $this->quizRepo->updateQuiz($assessmentId, $data);
    }

    public function createQuestion(int $assessmentId, array $questionData, array $options): int {
        $questionData['assessment_id'] = $assessmentId;
        $questionId = $this->quizRepo->createQuestion($questionData);

        if (!empty($options)) {
            $this->quizRepo->createOptions($questionId, $this->normaliseOptions($options));
        }

        return $questionId;
    }

    public function getQuizWithQuestions(int $assessmentId): array {
        $quiz = $this->quizRepo->getQuizById($assessmentId);
        if (!$quiz) {
            throw new \RuntimeException('Quiz not found');
        }

        $quiz['questions'] = $this->normaliseQuestions($this->quizRepo->getQuizQuestions($assessmentId));

        return $quiz;
    }

    public function getStudentQuizResult(int $userId, int $assessmentId): ?array {
        $results = $this->resultRepo->getResultsByStudent($userId, $assessmentId);
        return $results[0] ?? null;
    }

    public function getQuizDeadlines(int $subjectId = null): array {
        return [];
    }

    public function getQuizStatistics(int $assessmentId): array {
        return $this->quizRepo->getQuizStatistics($assessmentId);
    }

    public function getAllStudentAttempts(int $assessmentId, int $userId): array {
        return $this->quizRepo->getAllAttempts($assessmentId, $userId);
    }

    private function getLatestResultForUser(int $assessmentId, int $userId): ?array {
        $results = $this->resultRepo->getResultsByStudent($userId, $assessmentId);
        return $results[0] ?? null;
    }

    private function normaliseQuestions(array $questions): array {
        foreach ($questions as &$question) {
            $question['question_id'] = (int)$question['question_id'];
            $question['points'] = (float)$question['points'];
            $question['display_order'] = (int)($question['display_order'] ?? 0);
            $question['options'] = $this->sortOptions($question['options'] ?? []);
        }

        usort($questions, static function (array $a, array $b): int {
            return ($a['display_order'] ?? 0) <=> ($b['display_order'] ?? 0);
        });

        return $questions;
    }

    private function sortOptions(array $options): array {
        foreach ($options as &$option) {
            $option['option_id'] = (int)($option['option_id'] ?? 0);
            $option['is_correct'] = !empty($option['is_correct']);
            $option['display_order'] = (int)($option['display_order'] ?? 0);
        }

        usort($options, static function (array $a, array $b): int {
            return ($a['display_order'] ?? 0) <=> ($b['display_order'] ?? 0);
        });

        return $options;
    }

    private function normaliseOptions(array $options): array {
        $normalised = [];

        foreach ($options as $index => $option) {
            $text = $option['option_text'] ?? $option['text'] ?? null;
            if ($text === null || $text === '') {
                continue;
            }

            $normalised[] = [
                'option_text' => $text,
                'is_correct' => !empty($option['is_correct']),
                'display_order' => $option['display_order'] ?? $index,
            ];
        }

        return $normalised;
    }

    private function markSelections(array $questions, array $answers): array {
        foreach ($questions as &$question) {
            $selected = $answers[$question['question_id']] ?? [];
            $selectedValues = is_array($selected) ? array_map('strval', $selected) : [(string)$selected];

            foreach ($question['options'] as &$option) {
                $option['is_selected'] = in_array((string)$option['option_id'], $selectedValues, true);
            }
        }

        return $questions;
    }
}
