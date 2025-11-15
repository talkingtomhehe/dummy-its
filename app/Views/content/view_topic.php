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

        <div class="content-container" id="content-container-body">
            <?php if (in_array($contentType, ['text', 'page'], true)): ?>
                <div class="content-text">
                    <?= $contentData ?>
                </div>

            <?php elseif ($contentType === 'video'): ?>
                <div class="content-video">
                    <?php if (strpos($contentData, 'youtube.com') !== false || strpos($contentData, 'youtu.be') !== false): ?>
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
                        <video width="100%" height="500" controls>
                            <source src="<?= htmlspecialchars($contentData) ?>" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    <?php else: ?>
                        <p>No video URL provided.</p>
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
                $downloadPath = $filePath ?: $contentData;
                $downloadUrl = null;
                if ($downloadPath) {
                    $isAbsolute = preg_match('/^https?:\/\//i', $downloadPath) === 1;
                    $downloadUrl = $isAbsolute
                        ? $downloadPath
                        : base_url('/uploads/' . ltrim($downloadPath, '/'));
                }
                ?>
                <div class="content-file">
                    <p><strong>Downloadable file:</strong></p>
                    <?php if ($downloadUrl): ?>
                    <a href="<?= htmlspecialchars($downloadUrl) ?>" target="_blank" class="button button-primary" download>
                        <i data-feather="download"></i> Download file
                    </a>
                    <?php if (in_array(strtolower(pathinfo($downloadPath, PATHINFO_EXTENSION)), ['pdf'], true)): ?>
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
                    <button class="button button-primary" onclick="window.location.href='<?= base_url('/assignment/' . ($assessmentId ?? $contentId)) ?>'">
                        View assignment
                    </button>
                </div>

            <?php else: ?>
                <p>This content type is not yet supported.</p>
            <?php endif; ?>
        </div>

        <div class="page-controls" style="margin-top: 30px;">
            <button class="button button-secondary" onclick="window.location.href='<?= base_url('/course/' . $courseId) ?>'">
                Back to course
            </button>
        </div>
    </main>
</div>

<script>
feather.replace();
</script>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
