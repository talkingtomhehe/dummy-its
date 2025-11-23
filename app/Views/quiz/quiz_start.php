<?php 
$showHeader = true;
require_once __DIR__ . '/../layouts/header.php'; ?>

<div class="container">
    <main class="main">
        <div class="back-to-course-box">
            <a href="<?= BASE_URL ?>/course">
                <i data-feather="arrow-left"></i>
                <span>Back to course</span>
            </a>
        </div>
        <h1 class="course-title"><?= htmlspecialchars($quiz['title']) ?></h1>
        <?php
        $openTime = $quiz['open_time'] ?? null;
        $closeTime = $quiz['close_time'] ?? null;
        ?>
        <table class="quiz-summary-table">
            <tbody>
                <tr>
                    <th>Trạng thái</th>
                    <td><?= $hasAttempt ? 'Đã làm bài' : 'Chưa làm bài' ?></td>
                </tr>
                <tr>
                    <th>Thời gian cho phép</th>
                    <td><?= $quiz['time_limit'] ?? 30 ?> phút</td>
                </tr>
                <tr>
                    <th>Thời gian mở</th>
                    <td><?= $openTime ? date('l, d F Y, g:i A', strtotime($openTime)) : 'Không thiết lập' ?></td>
                </tr>
                <tr>
                    <th>Thời gian đóng</th>
                    <td><?= $closeTime ? date('l, d F Y, g:i A', strtotime($closeTime)) : 'Không thiết lập' ?></td>
                </tr>
                <tr>
                    <th>Phương thức tính điểm</th>
                    <td>Điểm cao nhất</td>
                </tr>
            </tbody>
        </table>
        <div class="page-controls" style="justify-content: center;">
            <?php if ($canTake): ?>
            <button class="button button-primary" onclick="window.location.href='<?= base_url('/quiz/' . $quiz['id'] . '/take') ?>'" style="padding: 12px 24px; font-size: 16px;">
                Start quiz
            </button>
            <?php else: ?>
            <p style="color: var(--danger-color); font-weight: 500;">Quiz đã đóng hoặc chưa mở</p>
            <?php endif; ?>
        </div>
    </main>
</div>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
