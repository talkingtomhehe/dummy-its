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
        if (!isset($submission['assessment_id'], $submission['user_id'])) {
            return false;
        }

        if (isset($submission['submission_file'])) {
            $file = $submission['submission_file'];
            if (is_string($file) && trim($file) !== '') {
                return true;
            }
        }

        if (isset($submission['answers']) && !empty($submission['answers'])) {
            return true;
        }

        return false;
    }

    public function getAssessmentType(): string {
        return 'assignment';
    }
}
