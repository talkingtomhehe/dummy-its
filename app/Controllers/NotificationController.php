<?php

namespace App\Controllers;

use App\Core\Session;
use App\Core\View;
use App\Models\Services\NotificationService;

class NotificationController
{
    private NotificationService $notificationService;

    public function __construct(?NotificationService $notificationService = null)
    {
        $this->notificationService = $notificationService ?? new NotificationService();
    }

    /**
     * Get notifications for the current user (AJAX)
     */
    public function getNotifications(): void
    {
        $userId = Session::getUserId();
        
        if (!$userId) {
            View::json(['success' => false, 'error' => 'Unauthorized'], 401);
            return;
        }

        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
        
        try {
            $notifications = $this->notificationService->getUserNotifications($userId, $limit);
            $unreadCount = $this->notificationService->getUnreadCount($userId);
            
            View::json([
                'success' => true,
                'notifications' => $notifications,
                'unread_count' => $unreadCount
            ]);
        } catch (\Throwable $e) {
            View::json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get unread notification count (AJAX)
     */
    public function getUnreadCount(): void
    {
        $userId = Session::getUserId();
        
        if (!$userId) {
            View::json(['success' => false, 'error' => 'Unauthorized'], 401);
            return;
        }

        try {
            $count = $this->notificationService->getUnreadCount($userId);
            View::json(['success' => true, 'count' => $count]);
        } catch (\Throwable $e) {
            View::json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Mark notification as read (AJAX)
     */
    public function markAsRead($params): void
    {
        $userId = Session::getUserId();
        
        if (!$userId) {
            View::json(['success' => false, 'error' => 'Unauthorized'], 401);
            return;
        }

        $notificationId = isset($params['id']) ? (int)$params['id'] : 0;
        
        if ($notificationId <= 0) {
            View::json(['success' => false, 'error' => 'Invalid notification ID'], 400);
            return;
        }

        try {
            $success = $this->notificationService->markAsRead($notificationId);
            View::json(['success' => $success]);
        } catch (\Throwable $e) {
            View::json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Mark all notifications as read (AJAX)
     */
    public function markAllAsRead(): void
    {
        $userId = Session::getUserId();
        
        if (!$userId) {
            View::json(['success' => false, 'error' => 'Unauthorized'], 401);
            return;
        }

        try {
            $success = $this->notificationService->markAllAsRead($userId);
            View::json(['success' => $success]);
        } catch (\Throwable $e) {
            View::json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Delete notification (AJAX)
     */
    public function deleteNotification($params): void
    {
        $userId = Session::getUserId();
        
        if (!$userId) {
            View::json(['success' => false, 'error' => 'Unauthorized'], 401);
            return;
        }

        $notificationId = isset($params['id']) ? (int)$params['id'] : 0;
        
        if ($notificationId <= 0) {
            View::json(['success' => false, 'error' => 'Invalid notification ID'], 400);
            return;
        }

        try {
            $success = $this->notificationService->deleteNotification($notificationId);
            View::json(['success' => $success]);
        } catch (\Throwable $e) {
            View::json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
}
