<?php
namespace App\Controllers;

use App\Core\Session;
use App\Core\View;
use App\Models\Repositories\ContentRepository;
use App\Models\Services\ContentService;

/**
 * DashboardController
 * Handles dashboard and home page requests
 * 
 * SOLID: Single Responsibility Principle (SRP)
 * Only handles HTTP requests for dashboard
 */
class DashboardController {
    private ContentService $contentService;

    public function __construct(?ContentService $contentService = null) {
        $this->contentService = $contentService ?? new ContentService(new ContentRepository());
    }

    /**
     * Show dashboard
     */
    public function index(): void {
        if (!Session::isAuthenticated()) {
            View::redirect('/');
            return;
        }

        $calendarEvents = $this->getCalendarEvents();
        
        // Get all subjects for the sidebar
        $allSubjects = $this->contentService->getAllSubjects();
        $courses = array_map(function($subject) {
            return [
                'id' => $subject['subject_id'],
                'name' => $subject['subject_name'],
                'code' => $subject['subject_code'] ?? '',
            ];
        }, $allSubjects);

        $data = [
            'userId' => Session::getUserId(),
            'userRole' => Session::getUserRole(),
            'userName' => Session::get('full_name'),
            'isInstructor' => Session::isInstructor(),
            'courses' => $courses,
            'quizEvents' => $calendarEvents,
            'calendarEventsUrl' => BASE_URL . '/dashboard/events',
        ];

        View::render('user/dashboard', $data);
    }

    /**
     * Show landing page (for unauthenticated users)
     */
    public function landing(): void {
        if (Session::isAuthenticated()) {
            View::redirect('/dashboard');
            return;
        }
        View::render('user/landing');
    }

    /**
     * Provide dashboard calendar events as JSON
     */
    public function events(): void {
        if (!Session::isAuthenticated()) {
            View::json(['error' => 'Unauthorized'], 401);
            return;
        }

        $events = $this->getCalendarEvents();

        View::json(['data' => $events]);
    }

    /**
     * Build calendar events from scheduled assessments
     */
    private function getCalendarEvents(): array {
        try {
            $assessments = $this->contentService->getAssessmentsWithSchedule();
        } catch (\Throwable $throwable) {
            // Avoid breaking the dashboard if data fails to load
            return [];
        }

        $events = [];

        foreach ($assessments as $assessment) {
            $type = strtolower($assessment['assessment_type'] ?? 'assessment');
            $label = ucfirst($type);
            $assessmentTitle = trim($assessment['title'] ?? '');
            $suffix = $assessmentTitle !== '' ? ': ' . $assessmentTitle : '';
            $assessmentId = $assessment['assessment_id'] ?? '';
            $description = $assessment['description'] ?? '';
            $timeLimit = $assessment['time_limit'] ?? 0;
            $maxScore = $assessment['max_score'] ?? 10;
            $openTime = $assessment['open_time'] ?? null;
            $closeTime = $assessment['close_time'] ?? null;

            if (!empty($openTime)) {
                $events[] = [
                    'date' => date('Y-m-d', strtotime($openTime)),
                    'title' => sprintf('%s Opens%s', $label, $suffix),
                    'type' => sprintf('%s-open', $type),
                    'id' => $assessmentId,
                    'assessment_type' => $type,
                    'assessment_title' => $assessmentTitle,
                    'description' => $description,
                    'time_limit' => $timeLimit,
                    'max_score' => $maxScore,
                    'open_time' => $openTime,
                    'close_time' => $closeTime,
                ];
            }

            if (!empty($closeTime)) {
                $events[] = [
                    'date' => date('Y-m-d', strtotime($closeTime)),
                    'title' => sprintf('%s Closes%s', $label, $suffix),
                    'type' => sprintf('%s-close', $type),
                    'id' => $assessmentId,
                    'assessment_type' => $type,
                    'assessment_title' => $assessmentTitle,
                    'description' => $description,
                    'time_limit' => $timeLimit,
                    'max_score' => $maxScore,
                    'open_time' => $openTime,
                    'close_time' => $closeTime,
                ];
            }
        }

        return $events;
    }
}
