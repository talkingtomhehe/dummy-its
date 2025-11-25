<?php 
$showHeader = true;
require_once __DIR__ . '/../layouts/header.php'; ?>

<div class="container">
    <main class="main">
        <div class="back-to-course-box">
            <a href="<?= BASE_URL ?>/course">
                <i data-feather="arrow-left"></i>
                <span>Back</span>
            </a>
        </div>
        <h1 class="course-title">Kết quả: <?= htmlspecialchars($quiz['title']) ?></h1>
        <?php
        $startedAt = $result['started_at'] ?? null;
        $completedAt = $result['completed_at'] ?? null;
        $score = $result['score'] ?? 0;
        ?>
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
        <div class="page-controls" style="justify-content: center;">
            <button class="button button-primary" onclick="window.location.href='<?= base_url('/course/' . $courseId) ?>'">Quay về khóa học</button>
        </div>
    </main>
</div>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
