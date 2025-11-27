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
        <h1 class="course-title">Kết quả: <?= htmlspecialchars($quiz['title']) ?></h1>
        <?php
        $startedAt = $result['started_at'] ?? null;
        $completedAt = $result['completed_at'] ?? null;
        $score = $result['score'] ?? 0;
        $allAttempts = $allAttempts ?? [];
        $finalGrade = $finalGrade ?? null;
        $gradingMethod = $gradingMethod ?? 'last';
        
        $gradingMethodText = [
            'last' => 'Lần làm bài cuối cùng',
            'highest' => 'Điểm cao nhất',
            'average' => 'Điểm trung bình',
            'first' => 'Lần làm bài đầu tiên',
        ];
        ?>
        
        <?php if (count($allAttempts) > 1): ?>
        <div style="background: var(--primary-light); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-bottom: 10px; color: var(--primary-color);">
                <i data-feather="list"></i> Tất cả các lần làm bài (<?= count($allAttempts) ?> lần)
            </h3>
            <table class="submission-status-table" style="margin-bottom: 0;">
                <thead>
                    <tr>
                        <th>Lần</th>
                        <th>Thời gian</th>
                        <th>Điểm</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($allAttempts as $idx => $attempt): ?>
                    <tr style="<?= $attempt['result_id'] == $result['result_id'] ? 'background: #fff; font-weight: 600;' : '' ?>">
                        <td><?= $attempt['attempt_number'] ?? ($idx + 1) ?></td>
                        <td><?= date('d/m/Y H:i', strtotime($attempt['submitted_at'])) ?></td>
                        <td><?= number_format($attempt['score'], 2) ?></td>
                        <td>
                            <a href="<?= base_url('/quiz/' . $quiz['id'] . '/review?result_id=' . $attempt['result_id']) ?>" class="button button-icon">
                                <i data-feather="eye"></i>
                            </a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            <?php if ($finalGrade !== null): ?>
            <div style="margin-top: 15px; padding: 10px; background: var(--bg-light); border-radius: 4px;">
                <strong>Điểm cuối cùng (<?= $gradingMethodText[$gradingMethod] ?? $gradingMethod ?>):</strong>
                <span style="color: var(--primary-color); font-size: 18px; font-weight: 600; margin-left: 10px;">
                    <?= number_format($finalGrade, 2) ?> / <?= $quiz['max_score'] ?? 10 ?>
                </span>
            </div>
            <?php endif; ?>
        </div>
        <?php endif; ?>
        
        <h3 style="margin-bottom: 15px; color: var(--primary-color);">
            Chi tiết lần làm bài này <?= isset($result['attempt_number']) ? '(Lần ' . $result['attempt_number'] . ')' : '' ?>
        </h3>
        <table class="quiz-summary-table">
            <tbody>
                <tr>
                    <th>Bắt đầu lúc</th>
                    <td><?= $startedAt ? date('l, d F Y, g:i A', strtotime($startedAt)) : '-' ?></td>
                </tr>
                <tr>
                    <th>Trạng thái</th>
                    <td>Đã hoàn thành</td>
                </tr>
                <tr>
                    <th>Hoàn thành lúc</th>
                    <td><?= $completedAt ? date('l, d F Y, g:i A', strtotime($completedAt)) : '-' ?></td>
                </tr>
                <tr>
                    <th>Thời gian làm bài</th>
                    <td>
                        <?php
                        if ($startedAt && $completedAt) {
                            $start = strtotime($startedAt);
                            $end = strtotime($completedAt);
                            $diff = max(0, $end - $start);
                            $minutes = floor($diff / 60);
                            $seconds = $diff % 60;
                            echo $minutes . ' phút ' . $seconds . ' giây';
                        } else {
                            echo '-';
                        }
                        ?>
                    </td>
                </tr>
                <tr>
                    <th>Số câu đúng</th>
                    <td><?= $correctAnswers ?> / <?= $totalQuestions ?></td>
                </tr>
                <tr>
                    <th>Điểm</th>
                    <td class="grade"><?= number_format($score, 2) ?> / 10.00</td>
                </tr>
                <tr>
                    <th>Feedback</th>
                    <td><?= isset($result['feedback']) && $result['feedback'] ? htmlspecialchars($result['feedback']) : '-' ?></td>
                </tr>
            </tbody>
        </table>
        <div class="page-controls" style="justify-content: center; gap: 10px;">
            <button class="button button-secondary" onclick="window.location.href='<?= base_url('/quiz/' . $quiz['id'] . '/review?result_id=' . ($result['result_id'] ?? '')) ?>'">
                <i data-feather="eye"></i> Xem lại bài làm
            </button>
            <button class="button button-primary" onclick="window.location.href='<?= base_url('/quiz/' . $quiz['id']) ?>'">Quay lại kết quả</button>
        </div>
    </main>
</div>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
