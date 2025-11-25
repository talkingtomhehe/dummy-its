<?php
namespace App\Models\Services;

use App\Models\Repositories\NotificationRepository;

/**
 * NotificationService
 * Business logic for notifications
 */
class NotificationService {
    private NotificationRepository $notificationRepo;

    public function __construct(?NotificationRepository $notificationRepo = null) {
        $this->notificationRepo = $notificationRepo ?? new NotificationRepository();
    }

    /**
     * Create a grading notification for a student
     */
    public function notifyStudentGraded(int $studentId, string $assessmentTitle, string $assessmentType, bool $success = true): void {
        $title = $success ? "Grade Posted" : "Grading Error";
        $message = $success 
            ? "Your {$assessmentType} '{$assessmentTitle}' has been graded."
            : "There was an error grading your {$assessmentType} '{$assessmentTitle}'.";
        
        $this->notificationRepo->createNotification([
            'user_id' => $studentId,
            'title' => $title,
            'message' => $message,
            'type' => $success ? 'success' : 'error',
            'related_type' => $assessmentType,
            'related_id' => null,
        ]);
    }

    /**
     * Get notifications for a user
     */
    public function getUserNotifications(int $userId, int $limit = 20): array {
        return $this->notificationRepo->getUserNotifications($userId, $limit);
    }

    /**
     * Get unread count
     */
    public function getUnreadCount(int $userId): int {
        return $this->notificationRepo->getUnreadCount($userId);
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(int $notificationId): bool {
        return $this->notificationRepo->markAsRead($notificationId);
    }

    /**
     * Mark all as read
     */
    public function markAllAsRead(int $userId): bool {
        return $this->notificationRepo->markAllAsRead($userId);
    }

    /**
     * Delete notification
     */
    public function deleteNotification(int $notificationId): bool {
        return $this->notificationRepo->deleteNotification($notificationId);
    }
}
