<?php require_once __DIR__ . '/../layouts/header.php'; ?>

<div class="container">
    <main class="main">
        <h1 class="course-title">Báo cáo điểm: <?= htmlspecialchars($quiz['title']) ?></h1>
        
        <div class="chart-container">
            <canvas id="quiz-grade-chart"></canvas>
        </div>
        
        <table class="grading-table">
            <thead>
                <tr>
                    <th>Tên sinh viên</th>
                    <th>Trạng thái</th>
                    <th>Thời gian làm bài</th>
                    <th>Điểm (trên 10)</th>
                    <th>Feedback</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($results as $result): ?>
                <tr>
                    <td><?= htmlspecialchars($result['student_name']) ?></td>
                    <td class="<?= $result['completed_at'] ? 'status-completed' : 'status-not-completed' ?>">
                        <?= $result['completed_at'] ? 'Đã làm bài' : 'Chưa làm bài' ?>
                    </td>
                    <td>
                        <?php if ($result['completed_at']): ?>
                            <?php
                            $start = strtotime($result['started_at']);
                            $end = strtotime($result['completed_at']);
                            $diff = $end - $start;
                            $minutes = floor($diff / 60);
                            $seconds = $diff % 60;
                            echo $minutes . ' phút ' . $seconds . ' giây';
                            ?>
                        <?php else: ?>
                            -
                        <?php endif; ?>
                    </td>
                    <td>
                        <?= $result['score'] !== null ? '<span class="grade">' . number_format($result['score'], 2) . '</span>' : '-' ?>
                    </td>
                    <td>
                        <button type="button" 
                                class="button button-secondary button-icon" 
                                onclick="viewDetails(<?= $result['student_id'] ?>)">
                            <i data-feather="eye"></i>
                        </button>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        <div class="form-actions">
            <button class="button button-primary button-large" onclick="window.location.href='<?= base_url('/quiz/' . $quiz['id'] . '/manage') ?>'">
                Quản lý câu hỏi Quiz
            </button>
        </div>
    </main>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
const scores = <?= json_encode(array_filter(array_column($results, 'score'), fn($s) => $s !== null)) ?>;
const scoreRanges = {
    '0-2': 0,
    '2-4': 0,
    '4-6': 0,
    '6-8': 0,
    '8-10': 0
};

scores.forEach(score => {
    if (score < 2) scoreRanges['0-2']++;
    else if (score < 4) scoreRanges['2-4']++;
    else if (score < 6) scoreRanges['4-6']++;
    else if (score < 8) scoreRanges['6-8']++;
    else scoreRanges['8-10']++;
});

const ctx = document.getElementById('quiz-grade-chart').getContext('2d');
new Chart(ctx, {
    type: 'bar',
    data: {
        labels: Object.keys(scoreRanges),
        datasets: [{
            label: 'Số lượng sinh viên',
            data: Object.values(scoreRanges),
            backgroundColor: 'rgba(52, 152, 219, 0.6)',
            borderColor: 'rgba(52, 152, 219, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
    }
});

function viewDetails(studentId) {
    window.location.href = '<?= base_url('/quiz/' . $quiz['id'] . '/results?student=') ?>' + studentId;
}

feather.replace();
</script>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
