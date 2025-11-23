<?php
$contentTitle = $content['title'] ?? 'Course Content';
$contentType = strtolower($content['type'] ?? $content['content_type'] ?? 'text');
$contentData = $content['data'] ?? $content['content_data'] ?? '';
$filePath = $content['file_path'] ?? null;
$contentId = $content['id'] ?? $content['content_id'] ?? null;
$assessmentId = $content['assessment_id'] ?? null;

$showHeader = true;
$activePage = 'courses';
$title = $contentTitle . ' - ITS';

require_once __DIR__ . '/../layouts/header.php';
?>

<div class="container">
    <main class="main">
        <div class="breadcrumbs">
            <a href="<?= base_url('/course/' . $courseId) ?>"><?= htmlspecialchars($courseName) ?></a>
            <span>&gt;</span>
            <a href="<?= base_url('/course/' . $courseId . '#topic-' . $topicId) ?>"><?= htmlspecialchars($topicName) ?></a>
            <span>&gt;</span>
            <span><?= htmlspecialchars($contentTitle) ?></span>
        </div>

        <div class="back-to-course-box">
            <a href="<?= base_url('/course/' . $courseId) ?>">
                <i data-feather="arrow-left"></i>
                <span>Back to course</span>
            </a>
        </div>

        <div class="content-container" id="content-container-body">
            <?php if (in_array($contentType, ['text', 'page'], true)): ?>
                <div class="content-text">
                    <?= $contentData ?>
                </div>

            <?php elseif ($contentType === 'video'): ?>
                <div class="content-video">
                    <?php if (!empty($filePath)): ?>
                        <?php
                        $relativeVideo = ltrim($filePath, '/');
                        if (strpos($relativeVideo, 'uploads/videos/') === 0) {
                            $videoUrl = base_url('/' . $relativeVideo);
                        } elseif (strpos($relativeVideo, 'videos/') === 0) {
                            $videoUrl = base_url('/uploads/' . $relativeVideo);
                        } else {
                            $videoUrl = base_url('/uploads/videos/' . $relativeVideo);
                        }
                        $videoExt = strtolower(pathinfo($relativeVideo, PATHINFO_EXTENSION));
                        $mimeTypes = [
                            'mp4' => 'video/mp4',
                            'webm' => 'video/webm',
                            'ogg' => 'video/ogg',
                            'ogv' => 'video/ogg',
                            'mov' => 'video/quicktime',
                        ];
                        $videoMime = $mimeTypes[$videoExt] ?? 'video/mp4';
                        ?>
                        <video width="100%" height="500" controls>
                            <source src="<?= htmlspecialchars($videoUrl) ?>" type="<?= htmlspecialchars($videoMime) ?>">
                            Your browser does not support the video tag.
                        </video>
                    <?php elseif (strpos($contentData, 'youtube.com') !== false || strpos($contentData, 'youtu.be') !== false): ?>
                        <?php
                        preg_match('/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i', $contentData, $matches);
                        $videoId = $matches[1] ?? '';
                        ?>
                        <?php if ($videoId): ?>
                        <iframe width="100%" height="500"
                                src="https://www.youtube.com/embed/<?= $videoId ?>"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen>
                        </iframe>
                        <?php else: ?>
                        <p>Unable to load this video. Please check the URL.</p>
                        <?php endif; ?>
                    <?php elseif (!empty($contentData)): ?>
                        <?php
                        $videoSrc = $contentData;
                        if (strpos($videoSrc, 'http://') !== 0 && strpos($videoSrc, 'https://') !== 0) {
                            $videoSrc = base_url('/' . ltrim($videoSrc, '/'));
                        }
                        ?>
                        <video width="100%" height="500" controls>
                            <source src="<?= htmlspecialchars($videoSrc) ?>" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    <?php else: ?>
                        <p>No video provided.</p>
                    <?php endif; ?>
                </div>

            <?php elseif (in_array($contentType, ['url', 'link'], true)): ?>
                <div class="content-link">
                    <p><strong>Resource link:</strong></p>
                    <a href="<?= htmlspecialchars($contentData) ?>" target="_blank" class="button button-primary">
                        <i data-feather="external-link"></i> Open resource
                    </a>
                </div>

            <?php elseif ($contentType === 'file'): ?>
                <?php
                $downloadUrl = null;
                $downloadPath = null;
                if (!empty($filePath)) {
                    $downloadPath = ltrim($filePath, '/');
                    if (strpos($downloadPath, 'uploads/content/') === 0) {
                        $downloadUrl = base_url('/' . $downloadPath);
                    } elseif (strpos($downloadPath, 'content/') === 0) {
                        $downloadUrl = base_url('/uploads/' . $downloadPath);
                    } else {
                        $downloadUrl = base_url('/uploads/content/' . $downloadPath);
                    }
                } elseif (!empty($contentData)) {
                    $contentDataTrimmed = ltrim($contentData, '/');
                    $isAbsolute = preg_match('/^https?:\/\//i', $contentDataTrimmed) === 1;
                    if ($isAbsolute) {
                        $downloadUrl = $contentDataTrimmed;
                        $downloadPath = $contentDataTrimmed;
                    } else {
                        $downloadPath = $contentDataTrimmed;
                        if (strpos($downloadPath, 'uploads/content/') === 0) {
                            $downloadUrl = base_url('/' . $downloadPath);
                        } elseif (strpos($downloadPath, 'content/') === 0) {
                            $downloadUrl = base_url('/uploads/' . $downloadPath);
                        } else {
                            $downloadUrl = base_url('/uploads/content/' . $downloadPath);
                        }
                    }
                }
                ?>
                <div class="content-file">
                    <p><strong>Downloadable file:</strong></p>
                    <?php if ($downloadUrl): ?>
                    <a href="<?= htmlspecialchars($downloadUrl) ?>" target="_blank" class="button button-primary" download>
                        <i data-feather="download"></i> Download file
                    </a>
                    <?php if ($downloadPath && in_array(strtolower(pathinfo($downloadPath, PATHINFO_EXTENSION)), ['pdf'], true)): ?>
                    <div style="margin-top: 20px;">
                        <iframe src="<?= htmlspecialchars($downloadUrl) ?>"
                                width="100%"
                                height="600px"
                                style="border: 1px solid #ddd;">
                        </iframe>
                    </div>
                    <?php endif; ?>
                    <?php else: ?>
                        <p>No file has been attached to this item.</p>
                    <?php endif; ?>
                </div>

            <?php elseif ($contentType === 'quiz'): ?>
                <div class="content-quiz">
                    <p>This activity is a quiz. Click the button below to begin.</p>
                    <button class="button button-primary" onclick="window.location.href='<?= base_url('/quiz/' . ($assessmentId ?? $contentId)) ?>'">
                        Go to quiz
                    </button>
                </div>

            <?php elseif ($contentType === 'assignment'): ?>
                <div class="content-assignment">
                    <p>This activity is an assignment. Click below to view the submission details.</p>
                    <button class="button button-primary" onclick="window.location.href='<?= base_url('/assignment/' . ($assessmentId ?? $contentId) . '/status') ?>'">
                        View assignment
                    </button>
                </div>

            <?php else: ?>
                <p>This content type is not yet supported.</p>
            <?php endif; ?>
        </div>
    </main>
</div>

<script>
feather.replace();
</script>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
