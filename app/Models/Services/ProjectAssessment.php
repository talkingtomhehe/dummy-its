<?php
namespace App\Models\Services;

use App\Models\Interfaces\IAssessment;

/**
 * ProjectAssessment
 * Implements IAssessment for Project/Assignment grading logic
 * 
 * SOLID: Open/Closed Principle (OCP)
 * System is extensible - new assessment types implement same interface
 */
class ProjectAssessment implements IAssessment {
    
    public function calculateGrade(array $answers, array $correctAnswers): float {
        // Projects/Assignments are manually graded by instructors
        // This method returns 0 until instructor grades it
        return 0.0;
    }

    public function validateSubmission(array $submission): bool {
        // Validate that file was uploaded
        return isset($submission['assessment_id']) 
            && isset($submission['user_id']) 
            && (isset($submission['submission_file']) || isset($submission['answers']));
    }

    public function getAssessmentType(): string {
        return 'assignment';
    }
}
