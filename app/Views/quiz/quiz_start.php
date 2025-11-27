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
                <tr>
                    <th><?= $hasAttempt ? 'Số lần đã làm' : 'Số lần cho phép' ?></th>
                    <td><?= $hasAttempt ? ($attemptCount . ' / ' . ($maxAttempts == 0 ? 'Không giới hạn' : $maxAttempts)) : ($maxAttempts == 0 ? 'Không giới hạn' : $maxAttempts) ?></td>
                </tr>
                <?php if ($hasAttempt && $maxAttempts > 0): ?>
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
                <?= $hasAttempt ? 'Làm lại bài' : 'Làm bài' ?>
            </button>
            <?php elseif ($maxAttempts > 0 && $attemptCount >= $maxAttempts): ?>
            <p style="color: var(--danger-color); font-weight: 500;">Bạn đã hết số lần làm bài cho phép</p>
            <?php else: ?>
            <p style="color: var(--danger-color); font-weight: 500;">Quiz đã đóng hoặc chưa mở</p>
            <?php endif; ?>
        </div>

        <!-- Previous Attempts Section -->
        <?php if (!empty($allAttempts) && count($allAttempts) > 0): ?>
        <div style="margin-top: 40px;">
            <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 20px; color: var(--text-color);">
                <i data-feather="clock"></i> Các lần làm bài trước
            </h2>
            <div style="display: grid; gap: 15px;">
                <?php foreach ($allAttempts as $index => $attempt): ?>
                <div class="attempt-box" style="background: var(--bg-light); border: 1px solid var(--border-color); border-radius: 8px; padding: 20px; display: flex; align-items: center; justify-content: space-between;">
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                            <span style="font-weight: 600; font-size: 16px; color: var(--primary-color);">
                                Lần làm bài #<?= $attempt['attempt_number'] ?? ($index + 1) ?>
                            </span>
                            <?php if ($attempt['status'] === 'completed' || $attempt['status'] === 'graded'): ?>
                            <span class="badge" style="background: var(--success-color); color: white; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 500;">
                                Hoàn thành
                            </span>
                            <?php endif; ?>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 10px;">
                            <div>
                                <span style="color: #666; font-size: 14px;">Điểm:</span>
                                <strong style="color: var(--text-color); font-size: 16px; margin-left: 8px;">
                                    <?= number_format($attempt['score'] ?? 0, 2) ?> / <?= $quiz['max_score'] ?? 10 ?>
                                </strong>
                            </div>
                            <?php if (!empty($attempt['submitted_at'])): ?>
                            <div>
                                <span style="color: #666; font-size: 14px;">Thời gian nộp:</span>
                                <strong style="color: var(--text-color); font-size: 14px; margin-left: 8px;">
                                    <?= date('d/m/Y H:i', strtotime($attempt['submitted_at'])) ?>
                                </strong>
                            </div>
                            <?php endif; ?>
                            <?php if (!empty($attempt['time_taken'])): ?>
                            <div>
                                <span style="color: #666; font-size: 14px;">Thời gian làm bài:</span>
                                <strong style="color: var(--text-color); font-size: 14px; margin-left: 8px;">
                                    <?= floor($attempt['time_taken'] / 60) ?> phút <?= $attempt['time_taken'] % 60 ?> giây
                                </strong>
                            </div>
                            <?php endif; ?>
                        </div>
                    </div>
                    <div>
                        <button class="button button-secondary" onclick="window.location.href='<?= base_url('/quiz/' . $quiz['id'] . '/review?result_id=' . ($attempt['result_id'] ?? '')) ?>'" style="padding: 10px 20px; white-space: nowrap;">
                            <i data-feather="eye"></i> Xem lại
                        </button>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
        <?php endif; ?>
    </main>
</div>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
