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

        $data = [
            'userId' => Session::getUserId(),
            'userRole' => Session::getUserRole(),
            'userName' => Session::get('full_name'),
            'isInstructor' => Session::isInstructor(),
            'courses' => [], // TODO: Fetch from ContentService
            'quizEvents' => [] // TODO: Fetch from QuizService
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
}
