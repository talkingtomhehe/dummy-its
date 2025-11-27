<?php
/**
 * Front Controller - Single Entry Point
 * All requests are routed through this file
 */

// Define base URL constant for use throughout the application
require_once __DIR__ . '/../app/Core/config.php';

// Start session
session_start();

// Autoloader
spl_autoload_register(function ($class) {
    $prefix = 'App\\';
    $base_dir = __DIR__ . '/../app/';
    
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }
    
    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';
    
    if (file_exists($file)) {
        require $file;
    }
});

// Error reporting (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Load helper functions
require_once __DIR__ . '/../app/Core/helpers.php';

// Import necessary classes
use App\Core\Router;
use App\Core\Session;

// Initialize router
$router = new Router();

// ========== PUBLIC ROUTES ==========
$router->get('/', function() {
    (new \App\Controllers\DashboardController())->landing();
});

// Two-step login flow
$router->get('/select-role', 'AuthController@showSelectRole');
$router->post('/select-role', 'AuthController@selectRole');
$router->get('/login', 'AuthController@showLogin');
$router->post('/login', 'AuthController@login');
$router->get('/logout', 'AuthController@logout');

// ========== PROTECTED ROUTES ==========
// Dashboard
$router->get('/dashboard', function() {
    if (!Session::isAuthenticated()) {
        header('Location: /its/');
        exit;
    }
    (new \App\Controllers\DashboardController())->index();
});

$router->get('/dashboard/events', function() {
    if (!Session::isAuthenticated()) {
        \App\Core\View::json(['error' => 'Unauthorized'], 401);
    }
    (new \App\Controllers\DashboardController())->events();
});

// Course/Content routes
$router->post('/toggle-editing', function() {
    if (!Session::isInstructor()) {
        \App\Core\View::json(['success' => false, 'message' => 'Unauthorized'], 403);
        return;
    }
    (new \App\Controllers\AuthController())->toggleEditing();
});

$router->get('/course', function() {
    if (!Session::isAuthenticated()) {
        header('Location: /its/');
        exit;
    }
    (new \App\Controllers\ContentController())->listCourses();
});

$router->get('/course/{id}', function($id) {
    if (!Session::isAuthenticated()) {
        header('Location: /its/');
        exit;
    }
    (new \App\Controllers\ContentController())->showCourse((int)$id);
});

$router->get('/content/{id}', function($id) {
    if (!Session::isAuthenticated()) {
        header('Location: /its/');
        exit;
    }
    (new \App\Controllers\ContentController())->viewContent((int)$id);
});

$router->post('/content/create', 'ContentController@createContent');
$router->post('/content/{id}/update', function($id) {
    (new \App\Controllers\ContentController())->updateContent(['id' => (int) $id]);
});
$router->post('/content/toggle/{id}', function($id) {
    (new \App\Controllers\ContentController())->toggleVisibility((int)$id);
});
$router->post('/content/delete/{id}', function($id) {
    (new \App\Controllers\ContentController())->deleteContent((int)$id);
});

$router->post('/topic/create', 'ContentController@createTopic');
$router->post('/topic/delete/{id}', function($id) {
    (new \App\Controllers\ContentController())->deleteTopic(['id' => (int) $id]);
});
$router->post('/topic/{id}/move-up', function($id) {
    (new \App\Controllers\ContentController())->moveTopicUp(['id' => (int) $id]);
});
$router->post('/topic/{id}/move-down', function($id) {
    (new \App\Controllers\ContentController())->moveTopicDown(['id' => (int) $id]);
});

// Quiz routes
$router->get('/quiz/{id}', function($id) {
    if (!Session::isAuthenticated()) {
        header('Location: /its/');
        exit;
    }
    (new \App\Controllers\QuizController())->show(['id' => $id]);
});

$router->get('/quiz/{id}/take', function($id) {
    if (!Session::isAuthenticated()) {
        header('Location: /its/');
        exit;
    }
    (new \App\Controllers\QuizController())->take(['id' => $id]);
});

$router->post('/quiz/{id}/submit', function($id) {
    if (!Session::isAuthenticated()) {
        header('Location: /its/');
        exit;
    }
    (new \App\Controllers\QuizController())->submitAnswers(['id' => $id]);
});

$router->get('/quiz/{id}/results', function($id) {
    if (!Session::isAuthenticated()) {
        header('Location: /its/');
        exit;
    }
    (new \App\Controllers\QuizController())->results(['id' => $id]);
});

$router->get('/quiz/{id}/review', function($id) {
    if (!Session::isAuthenticated()) {
        header('Location: /its/');
        exit;
    }
    (new \App\Controllers\QuizController())->review(['id' => $id]);
});

$router->get('/quiz/{id}/manage', function($id) {
    if (!Session::isInstructor()) {
        header('Location: /its/course');
        exit;
    }
    (new \App\Controllers\QuizController())->manage(['id' => $id]);
});

$router->get('/quiz/{quizId}/question/new', function($quizId) {
    if (!Session::isInstructor()) {
        header('Location: /its/course');
        exit;
    }
    $_GET['quiz_id'] = $quizId;
    (new \App\Controllers\QuizController())->editQuestion(['id' => 'new']);
});

$router->get('/quiz/question/{id}/edit', function($id) {
    if (!Session::isInstructor()) {
        header('Location: /its/course');
        exit;
    }
    (new \App\Controllers\QuizController())->editQuestion(['id' => $id]);
});

$router->get('/quiz/question/{id}/edit', function($id) {
    if (!Session::isInstructor()) {
        header('Location: /its/course');
        exit;
    }
    (new \App\Controllers\QuizController())->editQuestion(['id' => $id]);
});

$router->post('/quiz/question/{id}/save', function($id) {
    if (!Session::isInstructor()) {
        header('Location: /its/course');
        exit;
    }
    (new \App\Controllers\QuizController())->saveQuestion(['id' => $id]);
});

$router->post('/quiz/question/{id}/delete', function($id) {
    if (!Session::isInstructor()) {
        header('Location: /its/course');
        exit;
    }
    (new \App\Controllers\QuizController())->deleteQuestion(['id' => $id]);
});

$router->post('/quiz/{id}/update-settings', function($id) {
    if (!Session::isInstructor()) {
        header('Location: /its/course');
        exit;
    }
    (new \App\Controllers\QuizController())->updateSettings(['id' => $id]);
});

// Content viewing route
$router->get('/content/{id}/view', function($id) {
    if (!Session::isAuthenticated()) {
        header('Location: /its/');
        exit;
    }
    (new \App\Controllers\ContentController())->viewContentPage(['id' => $id]);
});

// Assignment routes
$router->get('/assignment/{id}/status', function($id) {
    if (!Session::isAuthenticated()) {
        header('Location: /its/');
        exit;
    }
    (new \App\Controllers\AssignmentController())->showStatus(['id' => $id]);
});

$router->get('/assignment/{id}/instructor', function($id) {
    if (!Session::isInstructor()) {
        header('Location: /its/course');
        exit;
    }
    (new \App\Controllers\AssignmentController())->showInstructorView(['id' => $id]);
});

$router->get('/assignment/{id}/submit', function($id) {
    if (!Session::isAuthenticated()) {
        header('Location: /its/');
        exit;
    }
    (new \App\Controllers\AssignmentController())->showSubmit(['id' => $id]);
});

$router->post('/assignment/{id}/upload', function($id) {
    if (!Session::isAuthenticated()) {
        header('Location: /its/');
        exit;
    }
    (new \App\Controllers\AssignmentController())->uploadSubmission(['id' => $id]);
});

$router->post('/assignment/{id}/remove', function($id) {
    if (!Session::isAuthenticated()) {
        header('Location: /its/');
        exit;
    }
    (new \App\Controllers\AssignmentController())->removeSubmission(['id' => $id]);
});

// Grading routes
$router->get('/grades/{id}', function($id) {
    if (!Session::isAuthenticated()) {
        header('Location: /its/');
        exit;
    }
    if (Session::isStudent()) {
        (new \App\Controllers\GradeController())->studentGrades(['id' => $id]);
    } else {
        (new \App\Controllers\GradeController())->instructorGrades(['id' => $id]);
    }
});

$router->get('/grade/assignment/{id}', function($id) {
    if (!Session::isInstructor()) {
        header('Location: /its/course');
        exit;
    }
    (new \App\Controllers\GradeController())->gradeAssignment(['id' => $id]);
});

$router->post('/grade/assignment/{id}/save', function($id) {
    if (!Session::isInstructor()) {
        header('Location: /its/course');
        exit;
    }
    (new \App\Controllers\GradeController())->saveAssignmentGrades(['id' => $id]);
});

$router->post('/grade/result/{id}/feedback', function($id) {
    if (!Session::isInstructor()) {
        \App\Core\View::json(['success' => false, 'error' => 'Unauthorized'], 403);
    }
    (new \App\Controllers\GradeController())->saveResultFeedback(['id' => $id]);
});

$router->post('/grade/result/{id}/delete', function($id) {
    if (!Session::isInstructor()) {
        \App\Core\View::json(['success' => false, 'error' => 'Unauthorized'], 403);
    }
    (new \App\Controllers\GradeController())->deleteQuizAttempt(['id' => $id]);
});

$router->get('/grade/quiz/{id}', function($id) {
    if (!Session::isInstructor()) {
        header('Location: /its/course');
        exit;
    }
    (new \App\Controllers\GradeController())->quizGradeReport(['id' => $id]);
});

// Notification routes
$router->get('/notifications', function() {
    if (!Session::isAuthenticated()) {
        \App\Core\View::json(['success' => false, 'error' => 'Unauthorized'], 401);
        return;
    }
    (new \App\Controllers\NotificationController())->getNotifications();
});

$router->get('/notifications/unread-count', function() {
    if (!Session::isAuthenticated()) {
        \App\Core\View::json(['success' => false, 'error' => 'Unauthorized'], 401);
        return;
    }
    (new \App\Controllers\NotificationController())->getUnreadCount();
});

$router->post('/notifications/{id}/read', function($id) {
    if (!Session::isAuthenticated()) {
        \App\Core\View::json(['success' => false, 'error' => 'Unauthorized'], 401);
        return;
    }
    (new \App\Controllers\NotificationController())->markAsRead(['id' => $id]);
});

$router->post('/notifications/read-all', function() {
    if (!Session::isAuthenticated()) {
        \App\Core\View::json(['success' => false, 'error' => 'Unauthorized'], 401);
        return;
    }
    (new \App\Controllers\NotificationController())->markAllAsRead();
});

$router->post('/notifications/{id}/delete', function($id) {
    if (!Session::isAuthenticated()) {
        \App\Core\View::json(['success' => false, 'error' => 'Unauthorized'], 401);
        return;
    }
    (new \App\Controllers\NotificationController())->deleteNotification(['id' => $id]);
});

// Dispatch the request
$router->dispatch();
