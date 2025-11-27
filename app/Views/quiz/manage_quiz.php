<?php 
$showHeader = true;
require_once __DIR__ . '/../layouts/header.php'; ?>

<div class="container">
    <main class="main">
        <div class="back-to-course-box">
            <a href="<?= base_url('/quiz/' . $quiz['id']) ?>">
                <i data-feather="arrow-left"></i>
                <span>Back to quiz</span>
            </a>
        </div>
        <h1 class="course-title">Quản lý Quiz: <?= htmlspecialchars($quiz['title']) ?></h1>

        <!-- Quiz Settings Section -->
        <div class="quiz-settings-box" style="background: var(--bg-light); padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid var(--border-color);">
            <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 15px; color: var(--primary-color);">
                <i data-feather="settings"></i> Quiz Settings
            </h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                    <label style="display: block; font-weight: 600; margin-bottom: 5px;">Max Attempts:</label>
                    <input type="number" id="max-attempts" min="0" value="<?= $quiz['max_attempts'] ?? 1 ?>" 
                           style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                    <small style="color: #666;">0 = unlimited attempts</small>
                </div>
                <div>
                    <label style="display: block; font-weight: 600; margin-bottom: 5px;">Grading Method:</label>
                    <select id="grading-method" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                        <option value="last" <?= ($quiz['grading_method'] ?? 'last') === 'last' ? 'selected' : '' ?>>Last Attempt</option>
                        <option value="highest" <?= ($quiz['grading_method'] ?? 'last') === 'highest' ? 'selected' : '' ?>>Highest Score</option>
                        <option value="average" <?= ($quiz['grading_method'] ?? 'last') === 'average' ? 'selected' : '' ?>>Average Score</option>
                        <option value="first" <?= ($quiz['grading_method'] ?? 'last') === 'first' ? 'selected' : '' ?>>First Attempt</option>
                    </select>
                </div>
            </div>
            <button class="button button-primary" onclick="saveQuizSettings()" style="margin-top: 15px;">
                <i data-feather="save"></i> Save Settings
            </button>
        </div>

        <div class="page-controls">
            <span>Tổng số: <?= count($questions) ?> câu hỏi</span>
            <button class="button button-primary" onclick="window.location.href='<?= base_url('/quiz/' . $quiz['id'] . '/question/new') ?>'">
                <i data-feather="plus"></i> Thêm câu hỏi mới
            </button>
        </div>

        <?php foreach ($questions as $index => $question): ?>
        <div class="question-manage-item">
            <span class="question-manage-icon"><i data-feather="check-square"></i></span>
            <span class="question-manage-text">Câu <?= $index + 1 ?>: <?= htmlspecialchars($question['question_text']) ?></span>
            <div class="question-manage-controls">
                <button class="button button-icon" onclick="window.location.href='<?= base_url('/quiz/question/' . $question['id'] . '/edit') ?>'" title="Sửa">
                    <i data-feather="edit-2"></i>
                </button>
                <button class="button button-icon button-danger" onclick="deleteQuestion(<?= $question['id'] ?>)" title="Xóa">
                    <i data-feather="trash-2"></i>
                </button>
            </div>
        </div>
        <?php endforeach; ?>
    </main>
</div>

<script>
function saveQuizSettings() {
    const maxAttempts = document.getElementById('max-attempts').value;
    const gradingMethod = document.getElementById('grading-method').value;
    
    fetch('<?= base_url('/quiz/' . $quiz['id'] . '/update-settings') ?>', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            max_attempts: maxAttempts,
            grading_method: gradingMethod
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Settings saved successfully!');
        } else {
            alert('Error: ' + data.message);
        }
    });
}

function deleteQuestion(questionId) {
    if (confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
        fetch('<?= base_url('/quiz/question/') ?>' + questionId + '/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            } else {
                alert('Lỗi: ' + data.message);
            }
        });
    }
}

feather.replace();
</script>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
