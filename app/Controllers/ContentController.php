<?php
namespace App\Controllers;

use App\Core\Session;
use App\Core\View;
use App\Models\Services\ContentService;
use App\Models\Repositories\ContentRepository;

/**
 * ContentController
 * Handles content management requests
 * 
 * SOLID: Single Responsibility Principle (SRP)
 * Only handles HTTP requests, delegates to ContentService
 */
class ContentController {
    private ContentService $contentService;

    public function __construct(?ContentService $contentService = null) {
        // SOLID: DIP - allow dependency injection, default to in-project wiring
        $this->contentService = $contentService ?? new ContentService(new ContentRepository());
    }

    /**
     * Show course page
     */
    public function showCourse(int $subjectId = 1): void {
        if (!Session::isAuthenticated()) {
            View::redirect('/');
            return;
        }

        try {
            $courseData = $this->contentService->getCourseStructure($subjectId);
            
            // Fix Bug 2: Map database field names to view-expected names
            $mappedTopics = [];
            foreach ($courseData['topics'] ?? [] as $topic) {
                $mappedItems = [];
                foreach ($topic['content_items'] ?? [] as $item) {
                    $mappedItems[] = [
                        'id' => $item['content_id'],
                        'title' => $item['title'],
                        'type' => $item['content_type'],
                        'is_visible' => $item['is_visible'],
                        'content_data' => $item['content_data'],
                        'file_path' => $item['file_path'] ?? null,
                        'assessment_id' => $item['assessment_id'] ?? null,
                        'assessment_type' => $item['assessment_type'] ?? null
                    ];
                }
                $mappedTopics[] = [
                    'id' => $topic['topic_id'],
                    'name' => $topic['topic_title'],
                    'description' => $topic['description'] ?? '',
                    'content_items' => $mappedItems
                ];
            }
            
            $data = [
                'courseName' => $courseData['subject']['subject_name'] ?? 'Course',
                'courseId' => $subjectId,
                'topics' => $mappedTopics,
                'grades' => [], // TODO: Fetch from GradeService
                'userRole' => Session::getUserRole(),
                'isInstructor' => Session::isInstructor(),
                'userName' => Session::get('full_name')
            ];

            // Fix Bug 1: Use correct view path - separate views for instructors and students
            $view = Session::isInstructor() ? 'content/instructor_course' : 'content/student_course';
            View::render($view, $data);
        } catch (\Exception $e) {
            Session::flash('error', $e->getMessage());
            View::redirect('/dashboard');
        }
    }

    /**
     * View content item
     */
    public function viewContent(int $contentId): void {
        if (!Session::isAuthenticated()) {
            View::json(['error' => 'Unauthorized'], 401);
            return;
        }

        try {
            $content = $this->contentService->getContentItem($contentId);
            
            if (!$content) {
                View::json(['error' => 'Content not found'], 404);
                return;
            }

            View::json(['success' => true, 'content' => $content]);
        } catch (\Exception $e) {
            View::json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Create content item (Instructor only)
     */
    public function createContent(): void {
        if (!Session::isInstructor()) {
            View::json(['error' => 'Unauthorized'], 403);
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            View::json(['error' => 'Method not allowed'], 405);
            return;
        }

        try {
            $contentType = strtolower(trim($_POST['content_type'] ?? ''));
            $uploadedFilePath = null;
            $uploadedFile = $_FILES['item-file'] ?? null;

            // Handle announcement type - store content in content_data
            if ($contentType === 'announcement') {
                $contentType = 'page'; // Store as page type internally but render differently
            }

            if ($uploadedFile && ($uploadedFile['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_OK && is_uploaded_file($uploadedFile['tmp_name'])) {
                $originalName = $uploadedFile['name'] ?? 'upload';
                $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
                $safeBaseName = preg_replace('/[^A-Za-z0-9_-]/', '_', pathinfo($originalName, PATHINFO_FILENAME));
                $uniquePrefix = str_replace('.', '', uniqid('', true));
                $uniqueName = $uniquePrefix . '_' . ($safeBaseName ?: 'file');
                if ($extension !== '') {
                    $uniqueName .= '.' . $extension;
                }

                $contentUploadDir = realpath(__DIR__ . '/../../public/uploads/content');
                $videoUploadDir = realpath(__DIR__ . '/../../public/uploads/videos');

                if ($contentUploadDir === false) {
                    $contentUploadDir = __DIR__ . '/../../public/uploads/content';
                    if (!is_dir($contentUploadDir) && !mkdir($contentUploadDir, 0775, true) && !is_dir($contentUploadDir)) {
                        throw new \RuntimeException('Unable to initialize content upload directory.');
                    }
                }

                if ($videoUploadDir === false) {
                    $videoUploadDir = __DIR__ . '/../../public/uploads/videos';
                    if (!is_dir($videoUploadDir) && !mkdir($videoUploadDir, 0775, true) && !is_dir($videoUploadDir)) {
                        throw new \RuntimeException('Unable to initialize video upload directory.');
                    }
                }

                if ($contentType === 'video') {
                    $allowedVideoExtensions = ['mp4', 'webm', 'ogg', 'ogv', 'mov'];
                    if ($extension && !in_array($extension, $allowedVideoExtensions, true)) {
                        throw new \InvalidArgumentException('Unsupported video format uploaded.');
                    }

                    $destination = rtrim($videoUploadDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $uniqueName;
                    if (!move_uploaded_file($uploadedFile['tmp_name'], $destination)) {
                        throw new \RuntimeException('Failed to store uploaded video file.');
                    }

                    $uploadedFilePath = $uniqueName;
                } else {
                    $allowedFileExtensions = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'zip', 'rar', 'txt', 'png', 'jpg', 'jpeg', 'gif'];
                    if ($extension && !in_array($extension, $allowedFileExtensions, true)) {
                        throw new \InvalidArgumentException('Unsupported file format uploaded.');
                    }

                    $destination = rtrim($contentUploadDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $uniqueName;
                    if (!move_uploaded_file($uploadedFile['tmp_name'], $destination)) {
                        throw new \RuntimeException('Failed to store uploaded file.');
                    }

                    $uploadedFilePath = $uniqueName;
                }
            } elseif ($uploadedFile && ($uploadedFile['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
                throw new \RuntimeException('File upload failed. Please try again.');
            }

            $data = [
                'topic_id' => isset($_POST['topic_id']) ? (int) $_POST['topic_id'] : 0,
                'title' => trim($_POST['title'] ?? ''),
                'content_type' => $contentType,
                'content_data' => trim($_POST['content_data'] ?? ''),
                'display_order' => isset($_POST['display_order']) ? (int) $_POST['display_order'] : 0,
                'file_path' => $uploadedFilePath,
            ];

            if ($contentType === 'video' && $uploadedFilePath) {
                // Use uploaded video file, omit external URL
                $data['content_data'] = '';
            }

            if ($contentType === 'file' && $uploadedFilePath) {
                $data['content_data'] = '';
            }

            $contentId = $this->contentService->createContentItem($data);
            View::json(['success' => true, 'content_id' => $contentId]);
        } catch (\Exception $e) {
            View::json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Update content item (Instructor only)
     */
    public function updateContent(array $params): void
    {
        if (!Session::isInstructor()) {
            View::json(['error' => 'Unauthorized'], 403);
            return;
        }

        if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
            View::json(['error' => 'Method not allowed'], 405);
            return;
        }

        $contentId = isset($params['id']) ? (int) $params['id'] : 0;
        if ($contentId <= 0) {
            View::json(['error' => 'Invalid content identifier'], 400);
            return;
        }

        try {
            $existing = $this->contentService->getContentItem($contentId);
            if (!$existing) {
                View::json(['error' => 'Content not found'], 404);
                return;
            }

            $rawType = strtolower(trim($_POST['content_type'] ?? ($existing['content_type'] ?? '')));
            $contentType = $rawType === 'link' ? 'url' : $rawType;

            $uploadedFilePath = $existing['file_path'] ?? null;
            $uploadedFile = $_FILES['item-file'] ?? null;

            if ($uploadedFile && ($uploadedFile['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_OK && is_uploaded_file($uploadedFile['tmp_name'])) {
                $originalName = $uploadedFile['name'] ?? 'upload';
                $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
                $safeBaseName = preg_replace('/[^A-Za-z0-9_-]/', '_', pathinfo($originalName, PATHINFO_FILENAME));
                $uniquePrefix = str_replace('.', '', uniqid('', true));
                $uniqueName = $uniquePrefix . '_' . ($safeBaseName ?: 'file');
                if ($extension !== '') {
                    $uniqueName .= '.' . $extension;
                }

                $contentUploadDir = realpath(__DIR__ . '/../../public/uploads/content');
                $videoUploadDir = realpath(__DIR__ . '/../../public/uploads/videos');

                if ($contentUploadDir === false) {
                    $contentUploadDir = __DIR__ . '/../../public/uploads/content';
                    if (!is_dir($contentUploadDir) && !mkdir($contentUploadDir, 0775, true) && !is_dir($contentUploadDir)) {
                        throw new \RuntimeException('Unable to initialize content upload directory.');
                    }
                }

                if ($videoUploadDir === false) {
                    $videoUploadDir = __DIR__ . '/../../public/uploads/videos';
                    if (!is_dir($videoUploadDir) && !mkdir($videoUploadDir, 0775, true) && !is_dir($videoUploadDir)) {
                        throw new \RuntimeException('Unable to initialize video upload directory.');
                    }
                }

                if ($contentType === 'video') {
                    $allowedVideoExtensions = ['mp4', 'webm', 'ogg', 'ogv', 'mov'];
                    if ($extension && !in_array($extension, $allowedVideoExtensions, true)) {
                        throw new \InvalidArgumentException('Unsupported video format uploaded.');
                    }

                    $destination = rtrim($videoUploadDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $uniqueName;
                    if (!move_uploaded_file($uploadedFile['tmp_name'], $destination)) {
                        throw new \RuntimeException('Failed to store uploaded video file.');
                    }

                    $uploadedFilePath = $uniqueName;
                } else {
                    $allowedFileExtensions = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'zip', 'rar', 'txt', 'png', 'jpg', 'jpeg', 'gif'];
                    if ($extension && !in_array($extension, $allowedFileExtensions, true)) {
                        throw new \InvalidArgumentException('Unsupported file format uploaded.');
                    }

                    $destination = rtrim($contentUploadDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $uniqueName;
                    if (!move_uploaded_file($uploadedFile['tmp_name'], $destination)) {
                        throw new \RuntimeException('Failed to store uploaded file.');
                    }

                    $uploadedFilePath = $uniqueName;
                }
            } elseif ($uploadedFile && ($uploadedFile['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
                throw new \RuntimeException('File upload failed. Please try again.');
            }

            $contentData = trim($_POST['content_data'] ?? '');

            if ($contentType === 'video' && $uploadedFilePath) {
                $contentData = '';
            }

            if ($contentType === 'file') {
                if ($uploadedFilePath) {
                    $contentData = '';
                } elseif (empty($contentData)) {
                    $contentData = $existing['content_data'] ?? '';
                }
            }

            if (!in_array($contentType, ['video', 'file'], true)) {
                $uploadedFilePath = null;
            }

            $updateData = [
                'title' => trim($_POST['title'] ?? ($existing['title'] ?? '')),
                'content_type' => $contentType,
                'content_data' => $contentData,
                'file_path' => $uploadedFilePath,
                'is_visible' => $existing['is_visible'] ?? 1,
                'display_order' => $existing['display_order'] ?? 0,
            ];

            $updated = $this->contentService->updateContentItem($contentId, $updateData);

            if (!$updated) {
                View::json(['error' => 'Unable to update content item'], 500);
                return;
            }

            View::json(['success' => true, 'content_id' => $contentId]);
        } catch (\Throwable $throwable) {
            View::json(['error' => $throwable->getMessage()], 400);
        }
    }

    /**
     * Create topic (Instructor only)
     */
    public function createTopic(): void {
        if (!Session::isInstructor()) {
            View::json(['error' => 'Unauthorized'], 403);
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            View::json(['error' => 'Method not allowed'], 405);
            return;
        }

        try {
            $data = [
                'subject_id' => $_POST['subject_id'] ?? 0,
                'topic_title' => $_POST['topic_title'] ?? '',
                'description' => $_POST['description'] ?? '',
                'display_order' => $_POST['display_order'] ?? 0,
            ];

            $topicId = $this->contentService->createTopic($data);
            View::json(['success' => true, 'topic_id' => $topicId]);
        } catch (\Exception $e) {
            View::json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Toggle content visibility (Instructor only)
     */
    public function toggleVisibility(int $contentId): void {
        if (!Session::isInstructor()) {
            View::json(['error' => 'Unauthorized'], 403);
            return;
        }

        try {
            $result = $this->contentService->toggleContentVisibility($contentId);
            View::json(['success' => $result]);
        } catch (\Exception $e) {
            View::json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Delete content (Instructor only)
     */
    public function deleteContent(int $contentId): void {
        if (!Session::isInstructor()) {
            View::json(['error' => 'Unauthorized'], 403);
            return;
        }

        try {
            $result = $this->contentService->deleteContentItem($contentId);
            View::json(['success' => $result]);
        } catch (\Exception $e) {
            View::json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Delete topic (Instructor only)
     */
    public function deleteTopic($params): void {
        if (!Session::isInstructor()) {
            View::json(['error' => 'Unauthorized'], 403);
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            View::json(['error' => 'Method not allowed'], 405);
            return;
        }

        $topicId = isset($params['id']) ? (int) $params['id'] : 0;
        if ($topicId <= 0) {
            View::json(['error' => 'Invalid topic identifier'], 400);
            return;
        }

        try {
            $result = $this->contentService->deleteTopic($topicId);
            if (!$result) {
                View::json(['error' => 'Topic not found or already deleted'], 404);
                return;
            }

            View::json(['success' => true]);
        } catch (\Throwable $throwable) {
            View::json(['error' => $throwable->getMessage()], 500);
        }
    }

    /**
     * View content page (full page view)
     */
    public function viewContentPage($params): void {
        $contentId = $params['id'] ?? null;

        if (!$contentId || !Session::isAuthenticated()) {
            View::redirect('/dashboard');
            return;
        }

        try {
            $db = \App\Core\Database::getConnection();
            
            // Get content details
            $stmt = $db->prepare("
                SELECT ci.*, t.topic_title, s.subject_name, s.subject_id, a.assessment_id, a.assessment_type
                FROM content_items ci
                JOIN topics t ON ci.topic_id = t.topic_id
                JOIN subjects s ON t.subject_id = s.subject_id
                LEFT JOIN assessments a ON a.content_id = ci.content_id
                WHERE ci.content_id = ?
            ");
            $stmt->execute([$contentId]);
            $content = $stmt->fetch();

            if (!$content) {
                Session::flash('error', 'Content not found');
                View::redirect('/dashboard');
                return;
            }

            $contentView = [
                'id' => $content['content_id'],
                'title' => $content['title'],
                'type' => $content['content_type'],
                'data' => $content['content_data'],
                'file_path' => $content['file_path'],
                'assessment_id' => $content['assessment_id'],
                'assessment_type' => $content['assessment_type'],
                'is_visible' => (bool)$content['is_visible'],
                'created_at' => $content['created_at'],
                'updated_at' => $content['updated_at']
            ];

            $data = [
                'content' => $contentView,
                'courseName' => $content['subject_name'],
                'courseId' => $content['subject_id'],
                'topicName' => $content['topic_title'],
                'topicId' => $content['topic_id']
            ];

            View::render('content/view_topic', $data);
        } catch (\Exception $e) {
            Session::flash('error', $e->getMessage());
            View::redirect('/dashboard');
        }
    }
}

