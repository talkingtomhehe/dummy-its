<?php
namespace App\Core;

/**
 * View Rendering Class
 * Handles rendering of view files with data
 */
class View {
    
    /**
     * Render a view
     * @param string $view Path to view file relative to app/Views directory
     * @param array $data Data to pass to the view
     */
    public static function render(string $view, array $data = []): void {
        extract($data);
        
        $viewPath = __DIR__ . '/../Views/' . $view . '.php';
        
        if (!file_exists($viewPath)) {
            die("View not found: {$view} (Expected: {$viewPath})");
        }
        
        require_once $viewPath;
    }

    /**
     * Render JSON response
     */
    public static function json($data, int $statusCode = 200): void {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }

    /**
     * Redirect to a URL
     */
    public static function redirect(string $url): void {
        // If URL doesn't start with http or /, prepend BASE_URL
        if (!preg_match('#^(https?://|/)#', $url)) {
            $url = BASE_URL . '/' . ltrim($url, '/');
        } elseif (strpos($url, '/') === 0 && strpos($url, BASE_URL) !== 0) {
            // If it's a relative URL starting with / but doesn't include BASE_URL
            $url = BASE_URL . $url;
        }
        
        header("Location: {$url}");
        exit;
    }
}
