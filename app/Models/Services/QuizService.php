<?php
namespace App\Models\Services;

use App\Models\Interfaces\IQuizRepository;
use App\Models\Interfaces\IResultRepository;
use App\Models\Interfaces\IAssessment;

/**
 * QuizService
 * Business logic for quiz operations
 * 
 * SOLID: Single Responsibility Principle (SRP) - Quiz business logic only
 * SOLID: Dependency Inversion Principle (DIP) - Depends on interfaces
 * SOLID: Open/Closed Principle (OCP) - Uses IAssessment for extensible grading
 */
class QuizService {
    private IQuizRepository $quizRepo;
    private IResultRepository $resultRepo;
    private IAssessment $quizAssessment;

    public function __construct(
        IQuizRepository $quizRepo,
        IResultRepository $resultRepo,
        IAssessment $quizAssessment
    ) {
        // SOLID: DIP - Constructor-based Dependency Injection with interfaces
        $this->quizRepo = $quizRepo;
        $this->resultRepo = $resultRepo;
        $this->quizAssessment = $quizAssessment;
    }

    /**
     * Get quiz details with questions
     */
    public function getQuizWithQuestions(int $assessmentId): array {
        $quiz = $this->quizRepo->getQuizById($assessmentId);
        
        if (!$quiz) {
            throw new \Exception("Quiz not found");
        }

        $questions = $this->quizRepo->getQuizQuestions($assessmentId);
        
        // Fetch options for each question
        foreach ($questions as &$question) {
            $questionWithOptions = $this->quizRepo->getQuestionWithOptions($question['question_id']);
            $question['options'] = $questionWithOptions['options'] ?? [];
        }
        
        $quiz['questions'] = $questions;
        
        return $quiz;
    }

    /**
     * Submit quiz and calculate grade
     * 
     * SOLID: OCP - Uses IAssessment interface for grading
     */
    public function submitQuiz(int $assessmentId, int $userId, array $answers, int $timeTaken = null): array {
        // Business logic: Check if quiz is still open
        $quiz = $this->quizRepo->getQuizById($assessmentId);
        
        if (!$quiz) {
            throw new \Exception("Quiz not found");
        }

        $now = date('Y-m-d H:i:s');
        if ($quiz['close_time'] && $now > $quiz['close_time']) {
            throw new \Exception("Quiz submission deadline has passed");
        }

        // Get questions and correct answers
        $questions = $this->quizRepo->getQuizQuestions($assessmentId);
        $correctAnswers = [];
        
        foreach ($questions as $question) {
            $questionWithOptions = $this->quizRepo->getQuestionWithOptions($question['question_id']);
            $correctOptions = [];
            
            foreach ($questionWithOptions['options'] as $option) {
                if ($option['is_correct']) {
                    if ($question['question_type'] === 'mc-multi') {
                        $correctOptions[] = (string)$option['option_id'];
                    } else {
                        $correctOptions = (string)$option['option_id'];
                    }
                }
            }
            
            $correctAnswers[$question['question_id']] = [
                'type' => $question['question_type'],
                'correct' => $correctOptions,
                'points' => $question['points'],
            ];
        }

        // SOLID: OCP - Calculate grade using injected IAssessment implementation
        $score = $this->quizAssessment->calculateGrade($answers, $correctAnswers);

        // Save result
        $resultData = [
            'assessment_id' => $assessmentId,
            'user_id' => $userId,
            'score' => $score,
            'answers' => $answers,
            'time_taken' => $timeTaken,
        ];

        $resultId = $this->resultRepo->submitQuizResult($resultData);

        return [
            'result_id' => $resultId,
            'score' => $score,
            'max_score' => $quiz['max_score'],
        ];
    }

    /**
     * Get quiz result for student
     */
    public function getStudentQuizResult(int $userId, int $assessmentId): ?array {
        $results = $this->resultRepo->getResultsByStudent($userId, $assessmentId);
        return !empty($results) ? $results[0] : null;
    }

    /**
     * Create quiz (Instructor)
     */
    public function createQuiz(array $data): int {
        // Business logic: validate dates
        if (!empty($data['open_time']) && !empty($data['close_time'])) {
            if (strtotime($data['close_time']) < strtotime($data['open_time'])) {
                throw new \Exception("Close time must be after open time");
            }
        }

        return $this->quizRepo->createQuiz($data);
    }

    /**
     * Create question with options
     */
    public function createQuestion(int $assessmentId, array $questionData, array $options): int {
        $questionData['assessment_id'] = $assessmentId;
        $questionId = $this->quizRepo->createQuestion($questionData);
        
        if (!empty($options)) {
            $this->quizRepo->createOptions($questionId, $options);
        }
        
        return $questionId;
    }

    /**
     * Get quiz deadlines for calendar
     */
    public function getQuizDeadlines(int $subjectId = null): array {
        // This would fetch all quizzes with open/close dates
        // For now, returning empty array (would implement based on subject)
        return [];
    }
}
