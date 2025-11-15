<?php require_once __DIR__ . '/../layouts/header.php'; ?>

<div class="container">
    <main class="main">
        <h1 class="course-title">Chấm điểm: <?= htmlspecialchars($assignment['title']) ?></h1>
        
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
                            <?php if ($submission['file_path']): ?>
                                <a href="<?= base_url('/uploads/assignments/' . $submission['file_path']) ?>" target="_blank">
                                    <?= htmlspecialchars($submission['file_path']) ?>
                                </a>
                            <?php else: ?>
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

const submittedCount = <?= count(array_filter($submissions, fn($s) => $s['file_path'] !== null)) ?>;
const notSubmittedCount = <?= count(array_filter($submissions, fn($s) => $s['file_path'] === null)) ?>;

const ctx = document.getElementById('item-grade-chart').getContext('2d');
new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Đã nộp', 'Chưa nộp'],
        datasets: [{
            data: [submittedCount, notSubmittedCount],
            backgroundColor: ['rgba(26, 188, 156, 0.6)', 'rgba(231, 76, 60, 0.6)']
        }]
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
    }
}

feather.replace();
</script>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
