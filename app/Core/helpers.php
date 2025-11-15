<?php
/**
 * Configuration Helper
 * Provides helper functions for URLs and paths throughout the application
 */

/**
 * Get the base URL for the application
 */
function base_url(string $path = ''): string {
    return BASE_URL . '/' . ltrim($path, '/');
}

/**
 * Get the public asset URL
 */
function asset(string $path = ''): string {
    return BASE_URL . '/public/' . ltrim($path, '/');
}

/**
 * Redirect to a URL within the application
 */
function redirect_to(string $path): void {
    header('Location: ' . base_url($path));
    exit;
}

/**
 * Check if current route matches
 */
function is_route(string $route): bool {
    $requestUri = $_SERVER['REQUEST_URI'] ?? '';
    // Remove base path
    if (strpos($requestUri, BASE_URL) === 0) {
        $requestUri = substr($requestUri, strlen(BASE_URL));
    }
    return $requestUri === $route || $requestUri === $route . '/';
}

/**
 * Get current route
 */
function current_route(): string {
    $requestUri = $_SERVER['REQUEST_URI'] ?? '';
    if (strpos($requestUri, BASE_URL) === 0) {
        $requestUri = substr($requestUri, strlen(BASE_URL));
    }
    return $requestUri ?: '/';
}
