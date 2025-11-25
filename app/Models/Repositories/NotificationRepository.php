<?php
namespace App\Models\Repositories;

use App\Core\Database;
use PDO;

/**
 * NotificationRepository
 * Handles database operations for notifications
 */
class NotificationRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    /**
     * Create a new notification
     */
    public function createNotification(array $data): int {
        $stmt = $this->db->prepare("
            INSERT INTO notifications (user_id, title, message, type, related_type, related_id)
            VALUES (:user_id, :title, :message, :type, :related_type, :related_id)
        ");
        
        $stmt->execute([
            'user_id' => $data['user_id'],
            'title' => $data['title'],
            'message' => $data['message'],
            'type' => $data['type'] ?? 'info',
            'related_type' => $data['related_type'] ?? null,
            'related_id' => $data['related_id'] ?? null,
        ]);
        
        return (int) $this->db->lastInsertId();
    }

    /**
     * Get notifications for a user
     */
    public function getUserNotifications(int $userId, int $limit = 20): array {
        $stmt = $this->db->prepare("
            SELECT * FROM notifications 
            WHERE user_id = :user_id 
            ORDER BY created_at DESC 
            LIMIT :limit
        ");
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * Get unread notification count
     */
    public function getUnreadCount(int $userId): int {
        $stmt = $this->db->prepare("
            SELECT COUNT(*) as count FROM notifications 
            WHERE user_id = :user_id AND is_read = 0
        ");
        $stmt->execute(['user_id' => $userId]);
        $result = $stmt->fetch();
        return (int) ($result['count'] ?? 0);
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(int $notificationId): bool {
        $stmt = $this->db->prepare("
            UPDATE notifications 
            SET is_read = 1, read_at = CURRENT_TIMESTAMP 
            WHERE notification_id = :notification_id
        ");
        return $stmt->execute(['notification_id' => $notificationId]);
    }

    /**
     * Mark all notifications as read for a user
     */
    public function markAllAsRead(int $userId): bool {
        $stmt = $this->db->prepare("
            UPDATE notifications 
            SET is_read = 1, read_at = CURRENT_TIMESTAMP 
            WHERE user_id = :user_id AND is_read = 0
        ");
        return $stmt->execute(['user_id' => $userId]);
    }

    /**
     * Delete a notification
     */
    public function deleteNotification(int $notificationId): bool {
        $stmt = $this->db->prepare("DELETE FROM notifications WHERE notification_id = :notification_id");
        return $stmt->execute(['notification_id' => $notificationId]);
    }
}
