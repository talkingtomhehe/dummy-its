<?php
namespace App\Core;

/**
 * Simple Router Class
 * Routes requests to appropriate controllers
 */
class Router {
    private array $routes = [];
    private array $middleware = [];

    /**
     * Add a GET route
     */
    public function get(string $path, $handler): void {
        $this->addRoute('GET', $path, $handler);
    }

    /**
     * Add a POST route
     */
    public function post(string $path, $handler): void {
        $this->addRoute('POST', $path, $handler);
    }

    /**
     * Add a route
     */
    private function addRoute(string $method, string $path, $handler): void {
        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'handler' => $handler
        ];
    }

    /**
     * Add middleware
     */
    public function addMiddleware(callable $middleware): void {
        $this->middleware[] = $middleware;
    }

    /**
     * Dispatch the request
     */
    public function dispatch(): void {
        $requestMethod = $_SERVER['REQUEST_METHOD'];
        $requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        
        // Remove base path if exists
        $basePath = '/its';
        if (strpos($requestUri, $basePath) === 0) {
            $requestUri = substr($requestUri, strlen($basePath));
        }
        
        // Default to home if empty
        if (empty($requestUri) || $requestUri === '/') {
            $requestUri = '/';
        }

        // Execute middleware
        foreach ($this->middleware as $mw) {
            if ($mw() === false) {
                return; // Middleware blocked the request
            }
        }

        // Find matching route
        foreach ($this->routes as $route) {
            if ($route['method'] === $requestMethod && $this->matchPath($route['path'], $requestUri, $params)) {
                $this->executeHandler($route['handler'], $params);
                return;
            }
        }

        // 404 Not Found
        http_response_code(404);
        echo "404 - Page Not Found";
    }

    /**
     * Match path with parameters
     */
    private function matchPath(string $routePath, string $requestUri, &$params = []): bool {
        $params = [];
        
        // Exact match
        if ($routePath === $requestUri) {
            return true;
        }

        // Pattern matching for dynamic routes
        $pattern = preg_replace('/\{([a-zA-Z0-9_]+)\}/', '([^/]+)', $routePath);
        $pattern = '#^' . $pattern . '$#';

        if (preg_match($pattern, $requestUri, $matches)) {
            array_shift($matches); // Remove full match
            $params = $matches;
            return true;
        }

        return false;
    }

    /**
     * Execute handler
     */
    private function executeHandler($handler, array $params = []): void {
        if (is_callable($handler)) {
            call_user_func_array($handler, $params);
        } elseif (is_string($handler) && strpos($handler, '@') !== false) {
            [$controllerName, $method] = explode('@', $handler);
            
            // Full namespace
            $controllerClass = "App\\Controllers\\{$controllerName}";
            
            if (class_exists($controllerClass)) {
                $controller = new $controllerClass();
                if (method_exists($controller, $method)) {
                    call_user_func_array([$controller, $method], $params);
                } else {
                    throw new \Exception("Method {$method} not found in {$controllerClass}");
                }
            } else {
                throw new \Exception("Controller {$controllerClass} not found");
            }
        }
    }
}
