<?php
namespace App\Models\Interfaces;

/**
 * IAssessment Interface
 * 
 * SOLID: Open/Closed Principle (OCP)
 * System is extensible for new assessment types without modifying existing code
 * Each assessment type implements this interface with its own grading logic
 */
interface IAssessment {
    /**
     * Calculate grade for an assessment submission
     * 
     * @param array $answers Student's submitted answers
     * @param array $correctAnswers Correct answers from database
     * @return float Calculated score
     */
    public function calculateGrade(array $answers, array $correctAnswers): float;

    /**
     * Validate assessment submission
     * 
     * @param array $submission Submission data
     * @return bool Whether submission is valid
     */
    public function validateSubmission(array $submission): bool;

    /**
     * Get assessment type
     * 
     * @return string Assessment type identifier
     */
    public function getAssessmentType(): string;
}
