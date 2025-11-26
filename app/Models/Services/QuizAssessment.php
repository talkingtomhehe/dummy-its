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
        $earnedPoints = 0.0;

        foreach ($correctAnswers as $questionId => $questionData) {
            if (!array_key_exists($questionId, $answers)) {
                continue;
            }

            $questionType = $questionData['type'];
            $points = (float)($questionData['points'] ?? 0);
            $expected = $questionData['correct'];
            $response = $answers[$questionId];

            if ($questionType === 'mc-multi') {
                $studentOptions = is_array($response) ? array_map('strval', $response) : [];
                $correctOptions = array_map('strval', (array)$expected);
                
                if (empty($correctOptions)) {
                    continue;
                }
                
                // Check if student selected any wrong option
                $hasWrongOption = false;
                foreach ($studentOptions as $selected) {
                    if (!in_array($selected, $correctOptions, true)) {
                        $hasWrongOption = true;
                        break;
                    }
                }
                
                // If any wrong option selected, score is 0
                if ($hasWrongOption) {
                    continue; // No points earned
                }
                
                // If only correct options selected, award proportional points
                $numCorrect = count($correctOptions);
                $numCorrectSelected = 0;
                
                foreach ($studentOptions as $selected) {
                    if (in_array($selected, $correctOptions, true)) {
                        $numCorrectSelected++;
                    }
                }
                
                // Award points proportional to correct selections
                if ($numCorrectSelected > 0) {
                    $pointsPerCorrect = $points / $numCorrect;
                    $earnedForQuestion = $numCorrectSelected * $pointsPerCorrect;
                    $earnedPoints += $earnedForQuestion;
                }

                continue;
            }

            $studentChoice = is_array($response) ? reset($response) : $response;
            $correctChoice = is_array($expected) ? reset($expected) : $expected;

            if ((string)$studentChoice === (string)$correctChoice) {
                $earnedPoints += $points;
            }
        }

        return round($earnedPoints, 2);
    }

    public function validateSubmission(array $submission): bool {
        if (empty($submission)) {
            return false;
        }

        foreach ($submission as $value) {
            if (is_array($value) && !empty($value)) {
                return true;
            }

            if (!is_array($value) && $value !== '' && $value !== null) {
                return true;
            }
        }

        return false;
    }

    public function getAssessmentType(): string {
        return 'quiz';
    }
}
