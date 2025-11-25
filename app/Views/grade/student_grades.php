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
        
        <table class="submission-status-table">
            <thead>
                <tr>
                    <th style="width: 30%;">Tên mục</th>
                    <th style="width: 15%;">Loại</th>
                    <th style="width: 20%;">Điểm</th>
                    <th style="width: 35%;">Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($grades as $grade): ?>
                <tr>
                    <td class="truncate-cell" title="<?= htmlspecialchars($grade['title']) ?>">
                        <?php 
                        $title = htmlspecialchars($grade['title']);
                        echo (strlen($title) > 50) ? substr($title, 0, 47) . '...' : $title;
                        ?>
                    </td>
                    <td><?= ucfirst($grade['type']) ?></td>
                    <td>
                        <?php if ($grade['score'] !== null): ?>
                            <span class="grade"><?= number_format($grade['score'], 2) ?> / 10.00</span>
                        <?php else: ?>
                            Chưa chấm điểm
                        <?php endif; ?>
                    </td>
                    <td>
                        <?php if ($grade['type'] === 'quiz' && $grade['score'] !== null): ?>
                            <a href="<?= base_url('/quiz/' . $grade['assessment_id'] . '/results') ?>" class="button button-secondary" style="font-size: 14px;">
                                <i data-feather="eye"></i> View Results
                            </a>
                        <?php endif; ?>
                        
                        <?php if ($grade['score'] !== null): ?>
                            <button class="button button-secondary" onclick="showFeedbackModal('<?= addslashes(htmlspecialchars($grade['title'], ENT_QUOTES)) ?>', '<?= addslashes(htmlspecialchars($grade['feedback'] ?? 'No feedback provided.', ENT_QUOTES)) ?>')" style="font-size: 14px; <?= ($grade['type'] === 'quiz' && $grade['score'] !== null) ? 'margin-left: 5px;' : '' ?>">
                                <i data-feather="message-square"></i> View Feedback
                            </button>
                        <?php elseif ($grade['score'] === null): ?>
                            <span style="color: #999;">Not graded</span>
                        <?php endif; ?>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </main>
</div>

<!-- Student Feedback View Modal -->
<div id="student-feedback-modal" class="modal" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h2 class="modal-title" id="feedback-modal-title">Instructor Feedback</h2>
            <button class="modal-close" onclick="closeStudentFeedbackModal()"><i data-feather="x"></i></button>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label style="font-weight: 600; margin-bottom: 10px; display: block;">Feedback:</label>
                <p id="student-feedback-text" style="white-space: pre-wrap; padding: 15px; background: #f9f9f9; border-radius: 6px; border: 1px solid var(--border-color); line-height: 1.6;"></p>
            </div>
            <div class="form-actions">
                <button type="button" class="button button-primary" onclick="closeStudentFeedbackModal()">Close</button>
            </div>
        </div>
    </div>
</div>

<script>
function showFeedbackModal(title, feedback) {
    document.getElementById('feedback-modal-title').textContent = 'Feedback: ' + title;
    document.getElementById('student-feedback-text').textContent = feedback;
    document.getElementById('student-feedback-modal').style.display = 'flex';
    feather.replace();
}

function closeStudentFeedbackModal() {
    document.getElementById('student-feedback-modal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('student-feedback-modal');
    if (event.target === modal) {
        closeStudentFeedbackModal();
    }
};

feather.replace();
</script>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
