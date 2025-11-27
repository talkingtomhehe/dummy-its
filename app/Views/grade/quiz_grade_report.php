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
                    <th>Hành động</th>
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
                        <?php if ($result['completed_at'] && $result['started_at']): ?>
                            <?php
                            $start = strtotime($result['started_at']);
                            $end = strtotime($result['completed_at']);
                            if ($start && $end) {
                                $diff = $end - $start;
                                $minutes = floor($diff / 60);
                                $seconds = $diff % 60;
                                echo $minutes . ' phút ' . $seconds . ' giây';
                            } else {
                                echo '-';
                            }
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
                                onclick="event.preventDefault(); event.stopPropagation(); openFeedbackModal(<?= $result['result_id'] ?? 0 ?>, '<?= htmlspecialchars($result['student_name'], ENT_QUOTES) ?>', '<?= addslashes(htmlspecialchars($result['feedback'] ?? '', ENT_QUOTES)) ?>');">
                            <i data-feather="message-square"></i>
                        </button>
                    </td>
                    <td>
                        <?php if ($result['result_id']): ?>
                        <button type="button" 
                                class="button button-danger button-icon" 
                                onclick="deleteQuizAttempt(<?= $result['result_id'] ?>, '<?= htmlspecialchars($result['student_name'], ENT_QUOTES) ?>')"
                                title="Xóa bài làm">
                            <i data-feather="trash-2"></i>
                        </button>
                        <?php else: ?>
                            -
                        <?php endif; ?>
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

<!-- Feedback Modal -->
<div id="feedback-modal" class="modal" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h2 class="modal-title" id="feedback-modal-title">Feedback cho sinh viên</h2>
            <button class="modal-close" onclick="closeFeedbackModal()"><i data-feather="x"></i></button>
        </div>
        <div class="modal-body">
            <form id="feedback-form" onsubmit="submitFeedback(event)">
                <input type="hidden" id="feedback-result-id" name="result-id">
                <div class="form-group">
                    <label for="feedback-text">Nội dung feedback</label>
                    <textarea id="feedback-text" name="feedback-text" rows="5" placeholder="Nhập feedback..."></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="button button-secondary" onclick="closeFeedbackModal()">Hủy</button>
                    <button type="submit" class="button button-primary">Lưu Feedback</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
const BASE_URL = document.body.dataset.baseUrl || '<?= BASE_URL ?>';

const scores = <?= json_encode(array_map(fn($r) => $r['score'] !== null ? floatval($r['score']) : null, $results)) ?>.filter(s => s !== null);
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
        },
        plugins: {
            legend: {
                display: true,
                position: 'top'
            }
        }
    }
});

function openFeedbackModal(resultId, studentName, currentFeedback) {
    document.getElementById('feedback-modal-title').textContent = `Feedback cho ${studentName}`;
    document.getElementById('feedback-result-id').value = resultId;
    document.getElementById('feedback-text').value = currentFeedback || '';
    document.getElementById('feedback-modal').style.display = 'flex';
    feather.replace();
}

function closeFeedbackModal() {
    document.getElementById('feedback-modal').style.display = 'none';
    document.getElementById('feedback-form').reset();
}

function submitFeedback(e) {
    e.preventDefault();
    const resultId = document.getElementById('feedback-result-id').value;
    const feedbackText = document.getElementById('feedback-text').value;
    
    const formData = new FormData();
    formData.append('feedback', feedbackText);
    
    fetch(`${BASE_URL}/grade/result/${resultId}/feedback`, {
        method: 'POST',
        body: formData
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            showNotification('Feedback saved successfully!', 'success');
            closeFeedbackModal();
            setTimeout(() => location.reload(), 1500);
        } else {
            showNotification('Error: ' + (data.error || 'Unknown error'), 'error');
        }
    })
    .catch(err => {
        showNotification('Error: ' + err.message, 'error');
    });
}

function deleteQuizAttempt(resultId, studentName) {
    if (!confirm(`Bạn có chắc chắn muốn xóa bài làm của ${studentName}? Sinh viên sẽ có thể làm lại bài quiz.`)) {
        return;
    }
    
    fetch(`${BASE_URL}/grade/result/${resultId}/delete`, {
        method: 'POST'
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            showNotification('Đã xóa bài làm thành công!', 'success');
            setTimeout(() => location.reload(), 1500);
        } else {
            showNotification('Lỗi: ' + (data.error || 'Unknown error'), 'error');
        }
    })
    .catch(err => {
        showNotification('Lỗi: ' + err.message, 'error');
    });
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('feedback-modal');
    if (event.target === modal) {
        closeFeedbackModal();
    }
};

feather.replace();
</script>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
