<?php require_once __DIR__ . '/../layouts/header.php'; ?>

<div class="container">
    <main class="main">
        <h1 class="course-title">Grades: <?= htmlspecialchars($courseName) ?></h1>
        
        <h2 style="font-size: 22px; font-weight: 600; color: var(--accent-color); margin-bottom: 20px;">Thống kê chung</h2>
        <div class="chart-container">
            <canvas id="grade-chart"></canvas>
        </div>
        
        <h2 style="font-size: 22px; font-weight: 600; color: var(--accent-color); margin-bottom: 20px;">Chấm điểm các mục</h2>
        <div class="section grade-item-list">
            <div class="section-content" style="display: block; padding: 0 20px;">
                <?php foreach ($assessments as $assessment): ?>
                <div class="item">
                    <div class="item-icon">
                        <i data-feather="<?= $assessment['type'] === 'quiz' ? 'check-square' : 'upload-cloud' ?>"></i>
                    </div>
                    <a class="item-text" href="<?= base_url('/grade/' . $assessment['type'] . '/' . $assessment['id']) ?>">
                        <?= htmlspecialchars($assessment['title']) ?>
                    </a>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </main>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
const ctx = document.getElementById('grade-chart').getContext('2d');
new Chart(ctx, {
    type: 'bar',
    data: {
        labels: <?= json_encode(array_column($assessments, 'title')) ?>,
        datasets: [{
            label: 'Điểm trung bình',
            data: <?= json_encode(array_column($assessments, 'average_score')) ?>,
            backgroundColor: 'rgba(26, 188, 156, 0.6)',
            borderColor: 'rgba(26, 188, 156, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                max: 10
            }
        }
    }
});

feather.replace();
</script>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
