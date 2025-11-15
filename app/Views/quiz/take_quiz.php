<?php require_once __DIR__ . '/../layouts/header.php'; ?>

<div class="container">
    <main class="main">
        <h1 class="course-title"><?= htmlspecialchars($quiz['title']) ?></h1>
        <div class="quiz-container">
            <form id="quiz-form" method="POST" action="<?= base_url('/quiz/' . $quiz['id'] . '/submit') ?>">
                <div class="quiz-main">
                    <?php foreach ($questions as $index => $question): ?>
                    <div id="quiz-q-<?= $index + 1 ?>" class="quiz-question <?= $index === 0 ? 'active' : '' ?>">
                        <div class="question-box">
                            <div class="question-header">
                                <h3 class="question-title">Câu hỏi <?= $index + 1 ?></h3>
                            </div>
                            <div class="question-body">
                                <div class="question-text">
                                    <p><?= htmlspecialchars($question['question_text']) ?></p>
                                </div>
                                <div class="question-options">
                                    <?php foreach ($question['options'] as $option): ?>
                                    <label class="option">
                                        <input type="<?= $question['question_type'] === 'multiple_choice' ? 'radio' : 'checkbox' ?>" 
                                               name="answer_<?= $question['id'] ?><?= $question['question_type'] === 'multiple_choice' ? '' : '[]' ?>" 
                                               value="<?= $option['id'] ?>">
                                        <span><?= htmlspecialchars($option['option_text']) ?></span>
                                    </label>
                                    <?php endforeach; ?>
                                </div>
                            </div>
                        </div>
                        <div class="quiz-controls">
                            <?php if ($index > 0): ?>
                            <button type="button" class="button button-secondary js-quiz-prev">Trang trước</button>
                            <?php else: ?>
                            <span></span>
                            <?php endif; ?>
                            
                            <?php if ($index < count($questions) - 1): ?>
                            <button type="button" class="button button-primary js-quiz-next">Trang sau</button>
                            <?php else: ?>
                            <button type="submit" class="button button-primary">Nộp bài</button>
                            <?php endif; ?>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>

                <div class="quiz-sidebar">
                    <div class="quiz-nav-box">
                        <div class="quiz-nav-header">
                            <h3>Điều hướng Quiz</h3>
                        </div>
                        <div class="quiz-nav-body">
                            <?php foreach ($questions as $index => $question): ?>
                            <div class="quiz-nav-q <?= $index === 0 ? 'active' : '' ?>" data-q="<?= $index + 1 ?>"><?= $index + 1 ?></div>
                            <?php endforeach; ?>
                        </div>
                        <div class="quiz-nav-footer">
                            <button type="submit" class="button button-primary" style="width: 100%;">Nộp bài</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </main>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    let currentQuestion = 1;
    const totalQuestions = <?= count($questions) ?>;
    
    function showQuestion(num) {
        document.querySelectorAll('.quiz-question').forEach(q => q.classList.remove('active'));
        document.querySelectorAll('.quiz-nav-q').forEach(q => q.classList.remove('active'));
        
        document.getElementById('quiz-q-' + num).classList.add('active');
        document.querySelector('.quiz-nav-q[data-q="' + num + '"]').classList.add('active');
        currentQuestion = num;
    }
    
    document.querySelectorAll('.js-quiz-next').forEach(btn => {
        btn.addEventListener('click', function() {
            if (currentQuestion < totalQuestions) {
                showQuestion(currentQuestion + 1);
            }
        });
    });
    
    document.querySelectorAll('.js-quiz-prev').forEach(btn => {
        btn.addEventListener('click', function() {
            if (currentQuestion > 1) {
                showQuestion(currentQuestion - 1);
            }
        });
    });
    
    document.querySelectorAll('.quiz-nav-q').forEach(navBtn => {
        navBtn.addEventListener('click', function() {
            showQuestion(parseInt(this.getAttribute('data-q')));
        });
    });
    
    // Mark answered questions
    document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
        input.addEventListener('change', function() {
            const questionDiv = this.closest('.quiz-question');
            const qNum = questionDiv.id.replace('quiz-q-', '');
            document.querySelector('.quiz-nav-q[data-q="' + qNum + '"]').classList.add('answered');
        });
    });
});
</script>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
