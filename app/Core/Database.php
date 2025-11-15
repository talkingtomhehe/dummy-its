<?php
namespace App\Core;

use PDO;
use PDOException;

/**
 * Database Connection Class
 * Provides a singleton PDO instance for database operations
 */
class Database {
    private static ?PDO $instance = null;
    
    // Database configuration
    private const DB_HOST = 'localhost';
    private const DB_NAME = 'its_database';
    private const DB_USER = 'root';
    private const DB_PASS = '';
    private const DB_CHARSET = 'utf8mb4';

    /**
     * Private constructor to prevent direct instantiation
     */
    private function __construct() {}

    /**
     * Get PDO instance (Singleton pattern)
     * @return PDO
     */
    public static function getInstance(): PDO {
        if (self::$instance === null) {
            try {
                $dsn = sprintf(
                    "mysql:host=%s;dbname=%s;charset=%s",
                    self::DB_HOST,
                    self::DB_NAME,
                    self::DB_CHARSET
                );

                self::$instance = new PDO($dsn, self::DB_USER, self::DB_PASS, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]);
            } catch (PDOException $e) {
                error_log("Database Connection Error: " . $e->getMessage());
                die("Database connection failed. Please contact administrator.");
            }
        }
        
        return self::$instance;
    }

    /**
     * Get database connection (alias for getInstance)
     * @return PDO
     */
    public static function getConnection(): PDO {
        return self::getInstance();
    }

    /**
     * Prevent cloning of the instance
     */
    private function __clone() {}

    /**
     * Prevent unserializing of the instance
     */
    public function __wakeup() {
        throw new \Exception("Cannot unserialize singleton");
    }
}
