<?php
namespace App\Controllers;

use App\Core\Session;
use App\Core\View;

/**
 * DashboardController
 * Handles dashboard and home page requests
 * 
 * SOLID: Single Responsibility Principle (SRP)
 * Only handles HTTP requests for dashboard
 */
class DashboardController {

    /**
     * Show dashboard
     */
    public function index(): void {
        if (!Session::isAuthenticated()) {
            View::redirect('/');
            return;
        }

        $dummyEvents = [
            [
                'date' => date('Y-m-d'),
                'title' => 'Orientation Session',
                'type' => 'quiz-open',
            ],
            [
                'date' => date('Y-m-d', strtotime('+2 days')),
                'title' => 'Algebra Quiz Closes',
                'type' => 'quiz-close',
            ],
            [
                'date' => date('Y-m-d', strtotime('+1 week')),
                'title' => 'Project Checkpoint',
                'type' => 'quiz-open',
            ],
        ];

        $data = [
            'userId' => Session::getUserId(),
            'userRole' => Session::getUserRole(),
            'userName' => Session::get('full_name'),
            'isInstructor' => Session::isInstructor(),
            'courses' => [], // TODO: Fetch from ContentService
            'quizEvents' => $dummyEvents,
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
        }

        $events = [
            [
                'date' => date('Y-m-d'),
                'title' => 'Orientation Session',
                'type' => 'quiz-open',
            ],
            [
                'date' => date('Y-m-d', strtotime('+3 days')),
                'title' => 'Calculus Quiz Deadline',
                'type' => 'quiz-close',
            ],
            [
                'date' => date('Y-m-d', strtotime('+6 days')),
                'title' => 'Group Project Kickoff',
                'type' => 'quiz-open',
            ],
            [
                'date' => date('Y-m-d', strtotime('-1 day')),
                'title' => 'Reflective Essay Due',
                'type' => 'quiz-close',
            ],
        ];

        View::json(['data' => $events]);
    }
}
