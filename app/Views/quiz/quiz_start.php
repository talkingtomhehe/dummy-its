<?php require_once __DIR__ . '/../layouts/header.php'; ?>

<div class="container">
    <main class="main">
        <div class="breadcrumbs" style="margin-bottom: 20px;">
            <a href="<?= BASE_URL ?>/course" style="color: var(--primary-color); text-decoration: none;">
                <i data-feather="arrow-left" style="width: 16px; height: 16px; vertical-align: middle;"></i>
                Back to course
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
                <?= $hasAttempt ? 'Làm lại bài' : 'Bắt đầu làm bài' ?>
            </button>
            <?php else: ?>
            <p style="color: var(--danger-color); font-weight: 500;">Quiz đã đóng hoặc chưa mở</p>
            <?php endif; ?>
        </div>
    </main>
</div>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
