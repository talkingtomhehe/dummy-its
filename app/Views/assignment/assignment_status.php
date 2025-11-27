<?php 
$showHeader = true;
require_once __DIR__ . '/../layouts/header.php'; ?>

<div class="container">
    <main class="main">
        <div class="back-to-course-box">
            <a href="<?= BASE_URL ?>/course/<?= $courseId ?? 1 ?>">
                <i data-feather="arrow-left"></i>
                <span>Back to course</span>
            </a>
        </div>
        <h1 class="course-title" style="color: var(--primary-color); display: flex; align-items: center; gap: 10px;">
            <i data-feather="upload-cloud" style="width: 28px; height: 28px;"></i>
            <span><?= htmlspecialchars($assignment['title'] ?? 'Assignment') ?></span>
        </h1>
        
        <?php if (!empty($successMessage)): ?>
            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    showNotification('<?= addslashes($successMessage) ?>', 'success');
                });
            </script>
        <?php endif; ?>

        <?php if (!empty($errorMessage)): ?>
            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    showNotification('<?= addslashes($errorMessage) ?>', 'error');
                });
            </script>
        <?php endif; ?>

        <?php
        $openTime = $assignment['open_time'] ?? null;
        $dueTime = $assignment['close_time'] ?? $assignment['due_time'] ?? null;
        $submission = $submission ?? null;
        ?>
        <div class="submission-info-box">
            <strong>Opened:</strong> <?= $openTime ? date('l, d F Y, g:i A', strtotime($openTime)) : 'Not set' ?><br>
            <strong>Due:</strong> <?= $dueTime ? date('l, d F Y, g:i A', strtotime($dueTime)) : 'Not set' ?>
        </div>

        <?php
        $canSubmit = isset($canSubmit) ? (bool)$canSubmit : true;
        $submitLabel = $submission ? 'Edit submission' : 'Add submission';
        if (!$canSubmit) {
            $submitLabel = 'Submission closed';
        }
        ?>
        <div class="submission-controls">
            <button class="button button-primary button-large" <?= $canSubmit ? "onclick=\"window.location.href='" . base_url('/assignment/' . ($assignment['assessment_id'] ?? $assignment['id']) . '/submit') . "'\"" : 'disabled' ?>>
                <?= $submitLabel ?>
            </button>
            <?php if ($submission && $canSubmit): ?>
            <button class="button button-primary button-large" onclick="confirmRemoveSubmission(<?= $assignment['assessment_id'] ?? $assignment['id'] ?>)" style="margin-left: 10px;">
                Remove submission
            </button>
            <?php endif; ?>
        </div>
        
        <h2 style="font-size: 22px; font-weight: 600; color: var(--accent-color); margin-top: 30px; margin-bottom: 20px;">Submission status</h2>
        
        <table class="submission-status-table">
            <tbody>
                <tr>
                    <th>Submission status</th>
                    <td><?= $submission ? 'Submitted for grading' : 'No submissions have been made yet' ?></td>
                </tr>
                <tr>
                    <th>Grading status</th>
                    <td><?= $submission && $submission['score'] !== null ? 'Graded' : 'Not graded' ?></td>
                </tr>
                <tr>
                    <th>Time remaining</th>
                    <td>
                        <?php
                        $now = time();
                        if ($dueTime) {
                            $due = strtotime($dueTime);
                            $diff = $due - $now;
                            if ($diff > 0) {
                                $days = floor($diff / 86400);
                                $hours = floor(($diff % 86400) / 3600);
                                echo $days . ' days ' . $hours . ' hours remaining';
                            } else {
                                echo '<span style="color: var(--danger-color);">Overdue</span>';
                            }
                        } else {
                            echo '-';
                        }
                        ?>
                    </td>
                </tr>
                <tr>
                    <th>Last modified</th>
                    <td><?= $submission && $submission['submitted_at'] ? date('l, d F Y, g:i A', strtotime($submission['submitted_at'])) : '-' ?></td>
                </tr>
                <tr>
                    <th>File submissions</th>
                    <td>
                        <?php if ($submission && !empty($submission['submission_file'])): 
                            $files = is_array($submission['submission_file']) ? $submission['submission_file'] : [$submission['submission_file']];
                            $originals = isset($submission['original_filenames']) && is_array($submission['original_filenames']) 
                                ? $submission['original_filenames'] 
                                : $files;
                            foreach ($files as $idx => $file):
                                $displayName = $originals[$idx] ?? $file;
                        ?>
                            <div style="margin-bottom: 5px;">
                                <a href="<?= base_url('/uploads/assignments/' . $file) ?>" target="_blank">
                                    <i data-feather="file"></i> <?= htmlspecialchars($displayName) ?>
                                </a>
                            </div>
                        <?php 
                            endforeach;
                        else: ?>
                            -
                        <?php endif; ?>
                    </td>
                </tr>
                <?php if ($submission && $submission['score'] !== null): ?>
                <tr>
                    <th>Grade</th>
                    <td class="grade"><?= number_format($submission['score'], 2) ?> / 10.00</td>
                </tr>
                <tr>
                    <th>Feedback</th>
                    <td><?= $submission['feedback'] ? htmlspecialchars($submission['feedback']) : '-' ?></td>
                </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </main>
</div>

<script>
function confirmRemoveSubmission(assignmentId) {
    if (confirm('Are you sure you want to remove your submission? This action cannot be undone.')) {
        // Create a form and submit
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '<?= BASE_URL ?>/assignment/' + assignmentId + '/remove';
        document.body.appendChild(form);
        form.submit();
    }
}

feather.replace();
</script>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
