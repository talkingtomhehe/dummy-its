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

        $data = [
            'userId' => Session::getUserId(),
            'userRole' => Session::getUserRole(),
            'userName' => Session::get('full_name'),
            'isInstructor' => Session::isInstructor(),
            'courses' => [], // TODO: Fetch from ContentService
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

            if (!empty($assessment['open_time'])) {
                $events[] = [
                    'date' => date('Y-m-d', strtotime($assessment['open_time'])),
                    'title' => sprintf('%s Opens%s', $label, $suffix),
                    'type' => sprintf('%s-open', $type),
                ];
            }

            if (!empty($assessment['close_time'])) {
                $events[] = [
                    'date' => date('Y-m-d', strtotime($assessment['close_time'])),
                    'title' => sprintf('%s Closes%s', $label, $suffix),
                    'type' => sprintf('%s-close', $type),
                ];
            }
        }

        return $events;
    }
}
