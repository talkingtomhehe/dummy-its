<?php
namespace App\Models\Services;

use App\Models\Interfaces\IAssessment;

/**
 * QuizAssessment
 * Implements IAssessment for Quiz grading logic
 * 
 * SOLID: Open/Closed Principle (OCP)
 * New assessment types can be added without modifying existing code
 */
class QuizAssessment implements IAssessment {
    
    public function calculateGrade(array $answers, array $correctAnswers): float {
        $totalPoints = 0;
        $earnedPoints = 0;

        foreach ($correctAnswers as $questionId => $questionData) {
            $totalPoints += $questionData['points'];
            
            if (!isset($answers[$questionId])) {
                continue; // No answer provided
            }

            $studentAnswer = $answers[$questionId];
            $questionType = $questionData['type'];
            
            if ($questionType === 'mc-single' || $questionType === 'tf') {
                // Single choice or True/False
                if ($studentAnswer === $questionData['correct']) {
                    $earnedPoints += $questionData['points'];
                }
            } elseif ($questionType === 'mc-multi') {
                // Multiple choice - must select ALL correct answers
                $correctOptions = $questionData['correct'];
                $studentOptions = is_array($studentAnswer) ? $studentAnswer : [$studentAnswer];
                
                sort($correctOptions);
                sort($studentOptions);
                
                if ($correctOptions === $studentOptions) {
                    $earnedPoints += $questionData['points'];
                }
            }
        }

        // Calculate percentage and scale to maxScore (typically 10)
        $percentage = $totalPoints > 0 ? ($earnedPoints / $totalPoints) : 0;
        $maxScore = 10.0;
        
        return round($percentage * $maxScore, 2);
    }

    public function validateSubmission(array $submission): bool {
        // Validate that all required fields are present
        return isset($submission['assessment_id']) 
            && isset($submission['user_id']) 
            && isset($submission['answers']);
    }

    public function getAssessmentType(): string {
        return 'quiz';
    }
}
