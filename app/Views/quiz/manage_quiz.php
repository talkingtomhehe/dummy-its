<?php 
$showHeader = true;
require_once __DIR__ . '/../layouts/header.php'; ?>

<div class="container">
    <main class="main">
        <div class="back-to-course-box">
            <a href="<?= base_url('/quiz/' . $quiz['id']) ?>">
                <i data-feather="arrow-left"></i>
                <span>Back to course</span>
            </a>
        </div>
        <h1 class="course-title">Quản lý Quiz: <?= htmlspecialchars($quiz['title']) ?></h1>

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
