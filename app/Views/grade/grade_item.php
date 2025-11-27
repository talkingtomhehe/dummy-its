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
        <h1 class="course-title">Chấm điểm: <?= htmlspecialchars($assignment['title']) ?></h1>
        
        <?php if ($successMessage = \App\Core\Session::getFlash('success')): ?>
            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    if (typeof showNotification === 'function') {
                        showNotification('<?= addslashes($successMessage) ?>', 'success');
                    }
                });
            </script>
        <?php endif; ?>
        
        <?php if ($errorMessage = \App\Core\Session::getFlash('error')): ?>
            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    if (typeof showNotification === 'function') {
                        showNotification('<?= addslashes($errorMessage) ?>', 'error');
                    }
                });
            </script>
        <?php endif; ?>
        
        <div class="chart-container">
            <canvas id="item-grade-chart"></canvas>
        </div>
        
        <form method="POST" action="<?= base_url('/grade/assignment/' . $assignment['id'] . '/save') ?>">
            <table class="grading-table">
                <thead>
                    <tr>
                        <th>Tên sinh viên</th>
                        <th>Trạng thái nộp bài</th>
                        <th>File đã nộp</th>
                        <th>Điểm (trên 10)</th>
                        <th>Feedback</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($submissions as $submission): ?>
                    <tr>
                        <td><?= htmlspecialchars($submission['student_name']) ?></td>
                        <td class="<?= $submission['file_path'] ? 'status-submitted' : 'status-not-submitted' ?>">
                            <?= $submission['file_path'] ? 'Đã nộp' : 'Chưa nộp' ?>
                        </td>
                        <td>
                            <?php if ($submission['file_path']): 
                                $files = is_array($submission['file_path']) ? $submission['file_path'] : [$submission['file_path']];
                                $originals = isset($submission['original_filenames']) && is_array($submission['original_filenames']) 
                                    ? $submission['original_filenames'] 
                                    : $files;
                                foreach ($files as $idx => $file):
                                    $displayName = $originals[$idx] ?? $file;
                            ?>
                                <div style="margin-bottom: 5px;">
                                    <a href="<?= base_url('/uploads/assignments/' . $file) ?>" target="_blank">
                                        <i data-feather="file"></i> <?= htmlspecialchars($displayName) ?>
                                    </a>
                                </div>
                            <?php 
                                endforeach;
                            else: ?>
                                -
                            <?php endif; ?>
                        </td>
                        <td>
                            <input type="number" 
                                   class="grade-input" 
                                   name="grade[<?= $submission['student_id'] ?>]" 
                                   min="0" 
                                   max="10" 
                                   step="0.5" 
                                   value="<?= $submission['grade'] ?? '' ?>">
                        </td>
                        <td>
                            <button type="button" 
                                    class="button button-secondary button-icon" 
                                    onclick="openFeedback(<?= $submission['student_id'] ?>, '<?= htmlspecialchars($submission['feedback'] ?? '', ENT_QUOTES) ?>')">
                                <i data-feather="message-square"></i>
                            </button>
                            <textarea name="feedback[<?= $submission['student_id'] ?>]" 
                                      id="feedback-<?= $submission['student_id'] ?>" 
                                      style="display: none;"><?= htmlspecialchars($submission['feedback'] ?? '') ?></textarea>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            <div class="form-actions">
                <button type="submit" class="button button-primary button-large">Lưu tất cả điểm</button>
            </div>
        </form>
    </main>
</div>

<div id="feedback-modal" class="modal" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h2 class="modal-title">Feedback</h2>
            <button class="modal-close" onclick="closeFeedback()"><i data-feather="x"></i></button>
        </div>
        <div class="modal-body">
            <textarea id="feedback-textarea" rows="5" style="width: 100%; padding: 10px;"></textarea>
        </div>
        <div class="modal-footer">
            <button class="button button-secondary" onclick="closeFeedback()">Hủy</button>
            <button class="button button-primary" onclick="saveFeedback()">Lưu</button>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
let currentStudentId = null;

const submissions = <?= json_encode($submissions) ?>;
const scores = submissions.map(s => s.grade).filter(g => g !== null && g !== '');

const scoreRanges = {
    '0-2': 0,
    '2-4': 0,
    '4-6': 0,
    '6-8': 0,
    '8-10': 0
};

scores.forEach(score => {
    const numScore = parseFloat(score);
    if (numScore < 2) scoreRanges['0-2']++;
    else if (numScore < 4) scoreRanges['2-4']++;
    else if (numScore < 6) scoreRanges['4-6']++;
    else if (numScore < 8) scoreRanges['6-8']++;
    else scoreRanges['8-10']++;
});

const ctx = document.getElementById('item-grade-chart').getContext('2d');
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
        },
        plugins: {
            legend: {
                display: true,
                position: 'top'
            }
        }
    }
});

function openFeedback(studentId, currentFeedback) {
    currentStudentId = studentId;
    document.getElementById('feedback-textarea').value = currentFeedback;
    document.getElementById('feedback-modal').style.display = 'flex';
    feather.replace();
}

function closeFeedback() {
    document.getElementById('feedback-modal').style.display = 'none';
    currentStudentId = null;
}

function saveFeedback() {
    if (currentStudentId) {
        const feedback = document.getElementById('feedback-textarea').value;
        document.getElementById('feedback-' + currentStudentId).value = feedback;
        closeFeedback();
        showNotification('Feedback saved successfully!', 'success');
    }
}

feather.replace();
</script>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
