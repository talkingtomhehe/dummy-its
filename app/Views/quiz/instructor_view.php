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
            <i data-feather="help-circle" style="width: 28px; height: 28px;"></i>
            <span><?= htmlspecialchars($quiz['title'] ?? 'Quiz') ?></span>
        </h1>

        <?php
        $openTime = $quiz['open_time'] ?? null;
        $dueTime = $quiz['close_time'] ?? $quiz['due_time'] ?? null;
        ?>
        <div class="submission-info-box">
            <strong>Opened:</strong> <?= $openTime ? date('l, d F Y, g:i A', strtotime($openTime)) : 'Not set' ?><br>
            <strong>Due:</strong> <?= $dueTime ? date('l, d F Y, g:i A', strtotime($dueTime)) : 'Not set' ?>
        </div>

        <h2 style="font-size: 22px; font-weight: 600; color: var(--accent-color); margin-top: 30px; margin-bottom: 20px;">Quiz Statistics</h2>
        
        <table class="submission-status-table">
            <tbody>
                <tr>
                    <th>Total Students</th>
                    <td><?= $totalStudents ?? 0 ?></td>
                </tr>
                <tr>
                    <th>Completed</th>
                    <td style="color: var(--success-color); font-weight: 600;"><?= $completedCount ?? 0 ?></td>
                </tr>
                <tr>
                    <th>Not Completed</th>
                    <td style="color: var(--danger-color); font-weight: 600;"><?= $notCompletedCount ?? 0 ?></td>
                </tr>
                <tr>
                    <th>Completion Rate</th>
                    <td>
                        <?php 
                        $total = $totalStudents ?? 0;
                        $completed = $completedCount ?? 0;
                        $rate = $total > 0 ? round(($completed / $total) * 100, 1) : 0;
                        ?>
                        <span style="font-weight: 600;"><?= $rate ?>%</span>
                    </td>
                </tr>
                <tr>
                    <th>Total Questions</th>
                    <td><?= $totalQuestions ?? 0 ?></td>
                </tr>
                <tr>
                    <th>Max Attempts</th>
                    <td><?= ($quiz['max_attempts'] ?? 1) == 0 ? 'Unlimited' : ($quiz['max_attempts'] ?? 1) ?></td>
                </tr>
                <tr>
                    <th>Grading Method</th>
                    <td><?= ucfirst($quiz['grading_method'] ?? 'last') ?></td>
                </tr>
            </tbody>
        </table>

        <div class="submission-controls" style="margin-top: 30px;">
            <button class="button button-primary button-large" onclick="window.location.href='<?= base_url('/quiz/' . $quiz['id'] . '/manage') ?>'">
                <i data-feather="edit"></i> Manage Questions
            </button>
            <button class="button button-secondary button-large" onclick="window.location.href='<?= base_url('/grade/quiz/' . $quiz['id']) ?>'" style="margin-left: 10px;">
                <i data-feather="bar-chart-2"></i> View Results
            </button>
        </div>
    </main>
</div>

<script>
feather.replace();
</script>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
