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
            <i data-feather="clipboard" style="width: 28px; height: 28px;"></i>
            <span><?= htmlspecialchars($assignment['title'] ?? 'Assignment') ?></span>
        </h1>

        <?php
        $openTime = $assignment['open_time'] ?? null;
        $dueTime = $assignment['close_time'] ?? $assignment['due_time'] ?? null;
        ?>
        <div class="submission-info-box">
            <strong>Opened:</strong> <?= $openTime ? date('l, d F Y, g:i A', strtotime($openTime)) : 'Not set' ?><br>
            <strong>Due:</strong> <?= $dueTime ? date('l, d F Y, g:i A', strtotime($dueTime)) : 'Not set' ?>
        </div>

        <h2 style="font-size: 22px; font-weight: 600; color: var(--accent-color); margin-top: 30px; margin-bottom: 20px;">Submission Statistics</h2>
        
        <table class="submission-status-table">
            <tbody>
                <tr>
                    <th>Total Students</th>
                    <td><?= $totalStudents ?? 0 ?></td>
                </tr>
                <tr>
                    <th>Submitted</th>
                    <td style="color: var(--success-color); font-weight: 600;"><?= $submittedCount ?? 0 ?></td>
                </tr>
                <tr>
                    <th>Not Submitted</th>
                    <td style="color: var(--danger-color); font-weight: 600;"><?= $notSubmittedCount ?? 0 ?></td>
                </tr>
                <tr>
                    <th>Submission Rate</th>
                    <td>
                        <?php 
                        $total = $totalStudents ?? 0;
                        $submitted = $submittedCount ?? 0;
                        $rate = $total > 0 ? round(($submitted / $total) * 100, 1) : 0;
                        ?>
                        <span style="font-weight: 600;"><?= $rate ?>%</span>
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="submission-controls" style="margin-top: 30px;">
            <button class="button button-primary button-large" onclick="window.location.href='<?= base_url('/grade/assignment/' . $assignment['id']) ?>'">
                <i data-feather="edit"></i> Grade Submissions
            </button>
        </div>
    </main>
</div>

<script>
feather.replace();
</script>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
