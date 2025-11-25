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
    public function notifyStudentGraded(int $studentId, string $assessmentTitle, string $assessmentType, bool $success = true, bool $hasFeedback = false): void {
        $title = $success ? ($hasFeedback ? "Feedback Posted" : "Grade Posted") : "Grading Error";
        $message = $success 
            ? ($hasFeedback 
                ? "Your {$assessmentType} '{$assessmentTitle}' has received feedback from your instructor."
                : "Your {$assessmentType} '{$assessmentTitle}' has been graded.")
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
     * Notify students when new topic is added
     */
    public function notifyStudentsNewTopic(array $studentIds, string $topicTitle, string $courseName): void {
        foreach ($studentIds as $studentId) {
            $this->notificationRepo->createNotification([
                'user_id' => $studentId,
                'title' => "New Topic Added",
                'message' => "A new topic '{$topicTitle}' has been added to {$courseName}.",
                'type' => 'info',
                'related_type' => 'topic',
                'related_id' => null,
            ]);
        }
    }

    /**
     * Notify students when new content is added
     */
    public function notifyStudentsNewContent(array $studentIds, string $contentTitle, string $topicTitle, string $courseName): void {
        foreach ($studentIds as $studentId) {
            $this->notificationRepo->createNotification([
                'user_id' => $studentId,
                'title' => "New Content Available",
                'message' => "New content '{$contentTitle}' has been added to {$topicTitle} in {$courseName}.",
                'type' => 'info',
                'related_type' => 'content',
                'related_id' => null,
            ]);
        }
    }

    /**
     * Notify students when content is modified
     */
    public function notifyStudentsContentModified(array $studentIds, string $contentTitle, string $courseName): void {
        foreach ($studentIds as $studentId) {
            $this->notificationRepo->createNotification([
                'user_id' => $studentId,
                'title' => "Content Updated",
                'message' => "'{$contentTitle}' in {$courseName} has been updated.",
                'type' => 'info',
                'related_type' => 'content',
                'related_id' => null,
            ]);
        }
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
