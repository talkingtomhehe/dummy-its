<?php require_once __DIR__ . '/../layouts/header.php'; ?>

<div class="container">
    <main class="main">
        <div class="breadcrumbs" style="margin-bottom: 20px;">
            <a href="<?= BASE_URL ?>/course" style="color: var(--primary-color); text-decoration: none;">
                <i data-feather="arrow-left" style="width: 16px; height: 16px; vertical-align: middle;"></i>
                Back to course
            </a>
        </div>
        <h1 class="course-title" style="color: var(--primary-color); display: flex; align-items: center; gap: 10px;">
            <i data-feather="upload-cloud" style="width: 28px; height: 28px;"></i>
            <span><?= htmlspecialchars($assignment['title'] ?? 'Assignment') ?></span>
        </h1>
        
        <?php if (!empty($successMessage)): ?>
            <div class="alert alert-success" style="margin-top: 15px;">
                <?= htmlspecialchars($successMessage) ?>
            </div>
        <?php endif; ?>

        <?php if (!empty($errorMessage)): ?>
            <div class="alert alert-danger" style="margin-top: 15px;">
                <?= htmlspecialchars($errorMessage) ?>
            </div>
        <?php endif; ?>

        <?php
        $openTime = $assignment['open_time'] ?? null;
        $dueTime = $assignment['due_time'] ?? null;
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
            <button class="button button-primary button-large" <?= $canSubmit ? "onclick=\"window.location.href='" . base_url('/assignment/' . $assignment['id'] . '/submit') . "'\"" : 'disabled' ?>>
                <?= $submitLabel ?>
            </button>
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
                        <?php if ($submission && !empty($submission['submission_file'])): ?>
                            <a href="<?= base_url('/uploads/assignments/' . $submission['submission_file']) ?>" target="_blank">
                                <i data-feather="file"></i> <?= htmlspecialchars($submission['submission_file']) ?>
                            </a>
                        <?php else: ?>
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
feather.replace();
</script>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
