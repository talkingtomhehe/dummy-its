<?php
namespace App\Controllers;

use App\Core\Session;
use App\Core\View;
use App\Models\Repositories\UserRepository;
use App\Models\Services\UserService;

/**
 * AuthController
 * Handles authentication requests
 * 
 * SOLID: Single Responsibility Principle (SRP)
 * Only handles HTTP requests for authentication, delegates business logic to UserService
 */
class AuthController {
    private UserService $userService;

    public function __construct(?UserService $userService = null) {
        // Manual dependency injection; fall back to default wiring when not provided
        $this->userService = $userService ?? new UserService(new UserRepository());
    }

    /**
     * Show role selection page (step 1 of login)
     */
    public function showSelectRole(): void {
        if (Session::isAuthenticated()) {
            View::redirect('/dashboard');
            return;
        }

        // Reset any previous role selection so the flow always starts fresh
        if (Session::has('login_role')) {
            Session::remove('login_role');
        }

        View::render('user/select_role');
    }

    /**
     * Handle role selection POST request (step 1 of login)
     */
    public function selectRole(): void {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            View::redirect('/select-role');
            return;
        }

        $role = $_POST['role'] ?? '';

        if (!in_array($role, ['student', 'instructor'], true)) {
            View::json(['success' => false, 'message' => 'Invalid role selection.'], 400);
        }

        // Store selected role in session temporarily
        Session::set('login_role', $role);

        View::json(['success' => true, 'redirect' => base_url('login')]);
    }

    /**
     * Show login page (step 2 of login)
     */
    public function showLogin(): void {
        if (Session::isAuthenticated()) {
            View::redirect('/dashboard');
            return;
        }

        // Check if role was selected
        $selectedRole = Session::get('login_role');
        if (!$selectedRole) {
            View::redirect('/select-role');
            return;
        }

        $data = [
            'error' => Session::getFlash('error'),
            'roleLabel' => ucfirst($selectedRole)
        ];

        View::render('user/login', $data);
    }

    /**
     * Handle login POST request (step 2 of login)
     */
    public function login(): void {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            View::redirect('/login');
            return;
        }

        // Get role from session (selected in step 1)
        $selectedRole = Session::get('login_role');
        if (!$selectedRole) {
            View::redirect('/select-role');
            return;
        }

        // Controller validates basic input
        $username = $_POST['username'] ?? '';
        $password = $_POST['password'] ?? '';

        if (empty($username) || empty($password)) {
            Session::flash('error', 'Username and password are required');
            View::redirect('/login');
            return;
        }

        try {
            // Service handles business logic
            $user = $this->userService->authenticate($username, $password);

            if (!$user) {
                Session::flash('error', 'Invalid username or password');
                View::redirect('/login');
                return;
            }

            // Verify role matches selected role
            if ($user->getRole() !== $selectedRole) {
                Session::flash('error', 'Invalid credentials for selected role');
                View::redirect('/login');
                return;
            }

            // Clear temporary login role
            Session::remove('login_role');

            // Set session
            Session::setAuth($user->getUserId(), $user->getRole());
            Session::set('full_name', $user->getFullName());

            View::redirect('/dashboard');
        } catch (\Exception $e) {
            Session::flash('error', 'Login failed: ' . $e->getMessage());
            View::redirect('/login');
        }
    }

    /**
     * Handle logout
     */
    public function logout(): void {
        Session::destroy();
        View::redirect('/');
    }

    /**
     * Toggle instructor editing mode flag in session
     */
    public function toggleEditing(): void {
        if (!Session::isInstructor()) {
            View::json(['success' => false, 'message' => 'Unauthorized'], 403);
            return;
        }

        $current = (bool)Session::get('is_editing', false);
        $newState = !$current;
        Session::set('is_editing', $newState);

        View::json([
            'success' => true,
            'is_editing' => $newState,
        ]);
    }

    /**
     * Check authentication middleware
     */
    public static function checkAuth(): bool {
        if (!Session::isAuthenticated()) {
            View::redirect('/');
            return false;
        }
        return true;
    }
}
