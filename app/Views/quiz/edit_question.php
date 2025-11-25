<?php 
$showHeader = true;
require_once __DIR__ . '/../layouts/header.php'; ?>

<div class="container">
    <main class="main">
        <div class="back-to-course-box">
            <a href="<?= base_url('/quiz/' . $quizId . '/manage') ?>">
                <i data-feather="arrow-left"></i>
                <span>Back to course</span>
            </a>
        </div>
        <h1 class="course-title"><?= isset($question) ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới' ?></h1>

        <form class="edit-question-form" id="edit-question-form" method="POST" action="<?= base_url('/quiz/question/' . ($question['id'] ?? 'new') . '/save') ?>">
            <input type="hidden" name="quiz_id" value="<?= $quizId ?>">
            
            <div class="form-group">
                <label for="question-type">Loại câu hỏi</label>
                <select id="question-type" name="question_type">
                    <option value="multiple_choice" <?= ($question['question_type'] ?? '') === 'multiple_choice' ? 'selected' : '' ?>>Trắc nghiệm (Một đáp án)</option>
                    <option value="multiple_answer" <?= ($question['question_type'] ?? '') === 'multiple_answer' ? 'selected' : '' ?>>Trắc nghiệm (Nhiều đáp án)</option>
                    <option value="true_false" <?= ($question['question_type'] ?? '') === 'true_false' ? 'selected' : '' ?>>Đúng/Sai</option>
                </select>
            </div>

            <div class="form-group">
                <label for="question-text-area">Nội dung câu hỏi</label>
                <textarea id="question-text-area" name="question_text" placeholder="Nhập nội dung câu hỏi..."><?= htmlspecialchars($question['question_text'] ?? '') ?></textarea>
            </div>

            <div class="form-group">
                <label>Các lựa chọn</label>
                <div id="options-container-mc">
                    <?php 
                    $currentType = $question['question_type'] ?? 'multiple_choice';
                    $isTrueFalse = $currentType === 'true_false';
                    
                    if (isset($question['options']) && count($question['options']) > 0): ?>
                        <?php foreach ($question['options'] as $index => $option): ?>
                        <div class="option-group">
                            <input type="<?= $question['question_type'] === 'multiple_answer' ? 'checkbox' : 'radio' ?>" 
                                   name="correct_answer<?= $question['question_type'] === 'multiple_answer' ? '[]' : '' ?>" 
                                   value="<?= $index ?>" 
                                   <?= $option['is_correct'] ? 'checked' : '' ?>>
                            <input type="text" name="options[]" placeholder="Lựa chọn <?= $index + 1 ?>" 
                                   value="<?= htmlspecialchars($option['option_text']) ?>" 
                                   <?= $isTrueFalse ? 'readonly' : '' ?>>
                            <?php if (!$isTrueFalse): ?>
                            <button type="button" class="button button-icon button-danger remove-option"><i data-feather="trash-2"></i></button>
                            <?php endif; ?>
                        </div>
                        <?php endforeach; ?>
                    <?php elseif ($isTrueFalse): ?>
                        <div class="option-group">
                            <input type="radio" name="correct_answer" value="0" checked>
                            <input type="text" name="options[]" placeholder="Đúng" value="Đúng" readonly>
                        </div>
                        <div class="option-group">
                            <input type="radio" name="correct_answer" value="1">
                            <input type="text" name="options[]" placeholder="Sai" value="Sai" readonly>
                        </div>
                    <?php else: ?>
                        <div class="option-group">
                            <input type="radio" name="correct_answer" value="0">
                            <input type="text" name="options[]" placeholder="Lựa chọn 1">
                            <button type="button" class="button button-icon button-danger remove-option"><i data-feather="trash-2"></i></button>
                        </div>
                    <?php endif; ?>
                </div>

                <button type="button" class="button button-link" id="add-option-btn" style="display: <?= $isTrueFalse ? 'none' : 'flex' ?>;"><i data-feather="plus"></i> Thêm lựa chọn</button>
            </div>

            <div class="form-actions-full">
                <?php if (isset($question)): ?>
                <button type="button" class="button button-danger" onclick="deleteQuestion(<?= $question['id'] ?>)">Xóa câu hỏi</button>
                <?php else: ?>
                <span></span>
                <?php endif; ?>
                <div>
                    <button type="button" class="button button-secondary" onclick="window.history.back()">Hủy</button>
                    <button type="submit" class="button button-primary">Lưu thay đổi</button>
                </div>
            </div>
        </form>
    </main>
</div>

<script>
let optionCount = <?= isset($question['options']) ? count($question['options']) : 1 ?>;

document.getElementById('add-option-btn').addEventListener('click', function() {
    const container = document.getElementById('options-container-mc');
    const questionType = document.getElementById('question-type').value;
    const inputType = questionType === 'multiple_answer' ? 'checkbox' : 'radio';
    
    const div = document.createElement('div');
    div.className = 'option-group';
    div.innerHTML = `
        <input type="${inputType}" name="correct_answer${questionType === 'multiple_answer' ? '[]' : ''}" value="${optionCount}">
        <input type="text" name="options[]" placeholder="Lựa chọn ${optionCount + 1}">
        <button type="button" class="button button-icon button-danger remove-option"><i data-feather="trash-2"></i></button>
    `;
    
    container.appendChild(div);
    optionCount++;
    feather.replace();
});

document.addEventListener('click', function(e) {
    if (e.target.closest('.remove-option')) {
        e.target.closest('.option-group').remove();
    }
});

document.getElementById('question-type').addEventListener('change', function() {
    const questionType = this.value;
    const isTrueFalse = questionType === 'true_false';
    const inputType = questionType === 'multiple_answer' ? 'checkbox' : 'radio';
    const nameAttr = questionType === 'multiple_answer' ? 'correct_answer[]' : 'correct_answer';
    const container = document.getElementById('options-container-mc');
    const addBtn = document.getElementById('add-option-btn');
    
    if (isTrueFalse) {
        // Replace with True/False options
        container.innerHTML = `
            <div class="option-group">
                <input type="radio" name="correct_answer" value="0" checked>
                <input type="text" name="options[]" value="Đúng" readonly>
            </div>
            <div class="option-group">
                <input type="radio" name="correct_answer" value="1">
                <input type="text" name="options[]" value="Sai" readonly>
            </div>
        `;
        addBtn.style.display = 'none';
        optionCount = 2;
    } else {
        // Update existing options input types
        addBtn.style.display = 'flex';
        document.querySelectorAll('#options-container-mc .option-group input[type="radio"], #options-container-mc .option-group input[type="checkbox"]').forEach(input => {
            const newInput = document.createElement('input');
            newInput.type = inputType;
            newInput.name = nameAttr;
            newInput.value = input.value;
            newInput.checked = input.checked;
            input.replaceWith(newInput);
        });
        // Make text inputs editable and ensure delete buttons exist
        document.querySelectorAll('#options-container-mc .option-group input[type="text"]').forEach(input => {
            input.readOnly = false;
            const group = input.closest('.option-group');
            if (!group.querySelector('.remove-option')) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'button button-icon button-danger remove-option';
                btn.innerHTML = '<i data-feather="trash-2"></i>';
                group.appendChild(btn);
            }
        });
    }
    feather.replace();
});

function deleteQuestion(questionId) {
    if (confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
        window.location.href = '<?= base_url('/quiz/question/') ?>' + questionId + '/delete';
    }
}

feather.replace();
</script>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
