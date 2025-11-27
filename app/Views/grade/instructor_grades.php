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
        <h1 class="course-title">Grades: <?= htmlspecialchars($courseName) ?></h1>
        
        <h2 style="font-size: 22px; font-weight: 600; color: var(--accent-color); margin-bottom: 20px;">Thống kê chung</h2>
        <div class="chart-container">
            <canvas id="grade-chart"></canvas>
        </div>
        
        <h2 style="font-size: 22px; font-weight: 600; color: var(--accent-color); margin: 40px 0 20px 0;">Chấm điểm các mục</h2>
        <div class="section grade-item-list" style="background-color: var(--bg-light); border: 1px solid var(--border-color); border-radius: 6px;">
            <div class="section-content" style="display: block; padding: 20px;">
                <?php if (empty($assessments)): ?>
                    <p style="text-align: center; color: #777; padding: 20px;">No assessments available yet.</p>
                <?php else: ?>
                    <?php foreach ($assessments as $assessment): ?>
                    <div class="item" style="padding: 15px 0; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #f0f0f0;">
                        <div class="item-icon" style="width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
                            <i data-feather="<?= $assessment['type'] === 'quiz' ? 'help-circle' : 'clipboard' ?>" style="width: 20px; height: 20px; color: var(--primary-color);"></i>
                        </div>
                        <a class="item-text" href="<?= base_url('/grade/' . $assessment['type'] . '/' . $assessment['id']) ?>" style="flex: 1; font-size: 14px; font-weight: 500; color: var(--text-color); text-decoration: none;">
                            <?= htmlspecialchars($assessment['title']) ?>
                            <span style="color: #999; font-size: 12px; margin-left: 10px;">
                                (Avg: <?= number_format($assessment['average_score'] ?? 0, 2) ?>)
                            </span>
                        </a>
                        <a href="<?= base_url('/grade/' . $assessment['type'] . '/' . $assessment['id']) ?>" class="button button-secondary" style="font-size: 14px;">
                            <i data-feather="users"></i> View Submissions
                        </a>
                    </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </div>
    </main>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
const ctx = document.getElementById('grade-chart').getContext('2d');
const assessmentData = <?= json_encode($assessments) ?>;

new Chart(ctx, {
    type: 'bar',
    data: {
        labels: assessmentData.map(a => a.title),
        datasets: [{
            label: 'Điểm trung bình',
            data: assessmentData.map(a => a.average_score || 0),
            backgroundColor: 'rgba(13, 143, 163, 0.6)',
            borderColor: 'rgba(13, 143, 163, 1)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            y: {
                beginAtZero: true,
                max: 10,
                ticks: {
                    stepSize: 2
                }
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'top'
            }
        }
    }
});

feather.replace();
</script>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
