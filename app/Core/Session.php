<?php
namespace App\Core;

/**
 * Session Management Class
 * Handles session operations and user authentication state
 */
class Session {
    
    /**
     * Start session if not already started
     */
    public static function start(): void {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    /**
     * Set a session variable
     */
    public static function set(string $key, $value): void {
        self::start();
        $_SESSION[$key] = $value;
    }

    /**
     * Get a session variable
     */
    public static function get(string $key, $default = null) {
        self::start();
        return $_SESSION[$key] ?? $default;
    }

    /**
     * Check if session variable exists
     */
    public static function has(string $key): bool {
        self::start();
        return isset($_SESSION[$key]);
    }

    /**
     * Remove a session variable
     */
    public static function remove(string $key): void {
        self::start();
        unset($_SESSION[$key]);
    }

    /**
     * Destroy the session
     */
    public static function destroy(): void {
        self::start();
        session_unset();
        session_destroy();
    }

    /**
     * Check if user is authenticated
     */
    public static function isAuthenticated(): bool {
        return self::has('user_id');
    }

    /**
     * Get authenticated user ID
     */
    public static function getUserId(): ?int {
        return self::get('user_id');
    }

    /**
     * Get user role
     */
    public static function getUserRole(): ?string {
        return self::get('role');
    }

    /**
     * Set user authentication
     */
    public static function setAuth(int $userId, string $role): void {
        self::set('user_id', $userId);
        self::set('role', $role);
    }

    /**
     * Check if user is instructor
     */
    public static function isInstructor(): bool {
        return self::getUserRole() === 'instructor';
    }

    /**
     * Check if user is student
     */
    public static function isStudent(): bool {
        return self::getUserRole() === 'student';
    }

    /**
     * Flash message - set
     */
    public static function flash(string $key, $value): void {
        self::set('_flash_' . $key, $value);
    }

    /**
     * Flash message - get and remove
     */
    public static function getFlash(string $key, $default = null) {
        $value = self::get('_flash_' . $key, $default);
        self::remove('_flash_' . $key);
        return $value;
    }
}
