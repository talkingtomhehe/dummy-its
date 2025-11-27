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
        $maxAttempts = $maxAttempts ?? 1;
        $attemptCount = $attemptCount ?? 0;
        $remainingAttempts = $remainingAttempts ?? 0;
        $gradingMethod = $gradingMethod ?? 'last';
        
        $gradingMethodText = [
            'last' => 'Lần làm bài cuối cùng',
            'highest' => 'Điểm cao nhất',
            'average' => 'Điểm trung bình',
            'first' => 'Lần làm bài đầu tiên',
        ];
        ?>
        <table class="quiz-summary-table">
            <tbody>
                <tr>
                    <th>Trạng thái</th>
                    <td><?= $hasAttempt ? 'Đã làm bài' : 'Chưa làm bài' ?></td>
                </tr>
                <?php if ($hasAttempt): ?>
                <tr>
                    <th>Số lần đã làm</th>
                    <td><?= $attemptCount ?> / <?= $maxAttempts == 0 ? 'Không giới hạn' : $maxAttempts ?></td>
                </tr>
                <?php if ($maxAttempts > 0): ?>
                <tr>
                    <th>Số lần còn lại</th>
                    <td style="<?= $remainingAttempts == 0 ? 'color: var(--danger-color); font-weight: 600;' : '' ?>">
                        <?= $remainingAttempts ?>
                    </td>
                </tr>
                <?php endif; ?>
                <?php if ($latestScore !== null): ?>
                <tr>
                    <th>Điểm lần làm gần nhất</th>
                    <td style="font-weight: 600;"><?= number_format($latestScore, 2) ?> / <?= $quiz['max_score'] ?? 10 ?></td>
                </tr>
                <?php endif; ?>
                <?php if ($finalGrade !== null && $attemptCount > 1): ?>
                <tr>
                    <th>Điểm cuối cùng (<?= $gradingMethodText[$gradingMethod] ?? $gradingMethod ?>)</th>
                    <td style="font-weight: 600; color: var(--primary-color);"><?= number_format($finalGrade, 2) ?> / <?= $quiz['max_score'] ?? 10 ?></td>
                </tr>
                <?php endif; ?>
                <?php endif; ?>
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
                    <td><?= $gradingMethodText[$gradingMethod] ?? 'Điểm cao nhất' ?></td>
                </tr>
            </tbody>
        </table>
        <div class="page-controls" style="justify-content: center;">
            <?php if ($canTake): ?>
            <button class="button button-primary" onclick="window.location.href='<?= base_url('/quiz/' . $quiz['id'] . '/take') ?>'" style="padding: 12px 24px; font-size: 16px;">
                <?= $hasAttempt ? 'Làm lại quiz' : 'Start quiz' ?>
            </button>
            <?php elseif ($maxAttempts > 0 && $attemptCount >= $maxAttempts): ?>
            <p style="color: var(--danger-color); font-weight: 500;">Bạn đã hết số lần làm bài cho phép</p>
            <?php else: ?>
            <p style="color: var(--danger-color); font-weight: 500;">Quiz đã đóng hoặc chưa mở</p>
            <?php endif; ?>
            
            <?php if ($hasAttempt): ?>
            <button class="button button-secondary" onclick="window.location.href='<?= base_url('/quiz/' . $quiz['id'] . '/results') ?>'" style="padding: 12px 24px; font-size: 16px; margin-left: 10px;">
                Xem kết quả
            </button>
            <?php endif; ?>
        </div>
    </main>
</div>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
