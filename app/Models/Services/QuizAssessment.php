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
                
                // Calculate partial credit
                $numCorrect = count($correctOptions);
                $numCorrectSelected = 0;
                $numIncorrectSelected = 0;
                
                foreach ($studentOptions as $selected) {
                    if (in_array($selected, $correctOptions, true)) {
                        $numCorrectSelected++;
                    } else {
                        $numIncorrectSelected++;
                    }
                }
                
                // Award points: each correct answer is worth 1/n of total points
                // Subtract points for incorrect selections
                $pointsPerCorrect = $points / $numCorrect;
                $earnedForQuestion = ($numCorrectSelected * $pointsPerCorrect) - ($numIncorrectSelected * $pointsPerCorrect);
                $earnedPoints += max(0, $earnedForQuestion); // Don't allow negative points

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
