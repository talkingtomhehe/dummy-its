<?php 
$showHeader = true;
require_once __DIR__ . '/../layouts/header.php'; 
$timeLimit = isset($quiz['time_limit']) && $quiz['time_limit'] > 0 ? $quiz['time_limit'] : 0;
?>

<div class="container">
    <main class="main">
        <div class="back-to-course-box">
            <a href="<?= BASE_URL ?>/course/<?= $courseId ?? 1 ?>">
                <i data-feather="arrow-left"></i>
                <span>Back to course</span>
            </a>
        </div>
        <div class="quiz-header-info">
            <h1 class="course-title"><?= htmlspecialchars($quiz['title']) ?></h1>
            <?php if ($timeLimit > 0): ?>
            <div class="quiz-timer-box" id="quiz-timer-box">
                <i data-feather="clock"></i>
                <span id="quiz-timer">--:--</span>
            </div>
            <?php endif; ?>
        </div>
        
        <form id="quiz-form" method="POST" action="<?= base_url('/quiz/' . $quiz['id'] . '/submit') ?>">
            <input type="hidden" name="time_taken" id="time-taken-input" value="0">
            <input type="hidden" name="started_at" id="started-at-input" value="">
            
            <div class="quiz-container-new">
                <div class="quiz-main-new">
                    <?php foreach ($questions as $index => $question): ?>
                    <div id="quiz-q-<?= $index + 1 ?>" class="quiz-question-new <?= $index === 0 ? 'active' : '' ?>" data-question-num="<?= $index + 1 ?>">
                        <div class="question-box-new">
                            <div class="question-header-new">
                                <h3 class="question-title-new">Câu hỏi <?= $index + 1 ?> / <?= count($questions) ?></h3>
                                <button type="button" class="flag-button" data-question="<?= $index + 1 ?>" title="Đánh dấu câu hỏi">
                                    <i data-feather="flag"></i>
                                </button>
                            </div>
                            <div class="question-body-new">
                                <div class="question-text-new">
                                    <p><?= nl2br(htmlspecialchars($question['question_text'])) ?></p>
                                </div>
                                <div class="question-options-new">
                                    <?php 
                                    $inputType = 'checkbox';
                                    $inputName = 'answer_' . $question['id'] . '[]';
                                    
                                    if ($question['question_type'] === 'multiple_choice' || $question['question_type'] === 'true_false') {
                                        $inputType = 'radio';
                                        $inputName = 'answer_' . $question['id'];
                                    }
                                    
                                    foreach ($question['options'] as $option): 
                                    ?>
                                    <label class="option-new">
                                        <input type="<?= $inputType ?>" 
                                               name="<?= $inputName ?>" 
                                               value="<?= $option['id'] ?>"
                                               class="answer-input">
                                        <span class="option-text"><?= htmlspecialchars($option['option_text']) ?></span>
                                    </label>
                                    <?php endforeach; ?>
                                </div>
                            </div>
                        </div>
                        <div class="quiz-controls-new">
                            <?php if ($index > 0): ?>
                            <button type="button" class="button button-secondary js-quiz-prev">
                                <i data-feather="chevron-left"></i> Câu trước
                            </button>
                            <?php else: ?>
                            <span></span>
                            <?php endif; ?>
                            
                            <?php if ($index < count($questions) - 1): ?>
                            <button type="button" class="button button-primary js-quiz-next">
                                Câu sau <i data-feather="chevron-right"></i>
                            </button>
                            <?php else: ?>
                            <button type="submit" class="button button-success">
                                <i data-feather="check"></i> Nộp bài
                            </button>
                            <?php endif; ?>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>

                <div class="quiz-sidebar-new">
                    <div class="quiz-nav-box-new">
                        <div class="quiz-nav-header-new">
                            <h3>Điều hướng</h3>
                            <div class="quiz-legend">
                                <span class="legend-item"><span class="legend-box answered"></span> Đã trả lời</span>
                                <span class="legend-item"><span class="legend-box flagged"></span> Đánh dấu</span>
                            </div>
                        </div>
                        <div class="quiz-nav-body-new">
                            <?php foreach ($questions as $index => $question): ?>
                            <div class="quiz-nav-q-new <?= $index === 0 ? 'active' : '' ?>" 
                                 data-q="<?= $index + 1 ?>"
                                 title="Câu <?= $index + 1 ?>">
                                <span class="q-number"><?= $index + 1 ?></span>
                                <i class="flag-icon" data-feather="flag"></i>
                            </div>
                            <?php endforeach; ?>
                        </div>
                        <div class="quiz-nav-footer-new">
                            <button type="submit" class="button button-success" style="width: 100%;">
                                <i data-feather="check"></i> Nộp bài
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </main>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    let currentQuestion = 1;
    const totalQuestions = <?= count($questions) ?>;
    const timeLimit = <?= $timeLimit ?>;
    let startTime = new Date();
    let timerInterval = null;
    let timeRemaining = timeLimit * 60; // Convert to seconds
    
    // Start countdown timer if time limit exists
    if (timeLimit > 0) {
        startCountdown();
    }
    
    function startCountdown() {
        updateTimerDisplay();
        timerInterval = setInterval(function() {
            timeRemaining--;
            updateTimerDisplay();
            
            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                alert('Hết thời gian! Bài thi sẽ được nộp tự động.');
                document.getElementById('quiz-form').submit();
            } else if (timeRemaining <= 60) {
                document.getElementById('quiz-timer-box').classList.add('warning');
            }
        }, 1000);
    }
    
    function updateTimerDisplay() {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        document.getElementById('quiz-timer').textContent = 
            String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
    }
    
    function showQuestion(num) {
        document.querySelectorAll('.quiz-question-new').forEach(q => q.classList.remove('active'));
        document.querySelectorAll('.quiz-nav-q-new').forEach(q => q.classList.remove('active'));
        
        document.getElementById('quiz-q-' + num).classList.add('active');
        document.querySelector('.quiz-nav-q-new[data-q="' + num + '"]').classList.add('active');
        currentQuestion = num;
        
        // Scroll to top of question
        document.querySelector('.quiz-main-new').scrollTop = 0;
    }
    
    // Navigation buttons
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
    
    // Sidebar navigation
    document.querySelectorAll('.quiz-nav-q-new').forEach(navBtn => {
        navBtn.addEventListener('click', function() {
            showQuestion(parseInt(this.getAttribute('data-q')));
        });
    });
    
    // Mark answered questions
    document.querySelectorAll('.answer-input').forEach(input => {
        input.addEventListener('change', function() {
            const questionDiv = this.closest('.quiz-question-new');
            const qNum = questionDiv.getAttribute('data-question-num');
            const navBtn = document.querySelector('.quiz-nav-q-new[data-q="' + qNum + '"]');
            
            // Check if any answer is selected for this question
            const questionInputs = questionDiv.querySelectorAll('.answer-input');
            const hasAnswer = Array.from(questionInputs).some(inp => inp.checked);
            
            if (hasAnswer) {
                navBtn.classList.add('answered');
            } else {
                navBtn.classList.remove('answered');
            }
        });
    });
    
    // Flag functionality
    document.querySelectorAll('.flag-button').forEach(btn => {
        btn.addEventListener('click', function() {
            const qNum = this.getAttribute('data-question');
            const navBtn = document.querySelector('.quiz-nav-q-new[data-q="' + qNum + '"]');
            navBtn.classList.toggle('flagged');
            this.classList.toggle('flagged');
        });
    });
    
    // Record time taken on submit
    document.getElementById('quiz-form').addEventListener('submit', function() {
        const endTime = new Date();
        
        // Calculate actual time taken based on time limit and remaining time
        let actualTimeTaken;
        if (timeLimit > 0) {
            // Time taken = time limit - time remaining (in seconds)
            actualTimeTaken = (timeLimit * 60) - timeRemaining;
        } else {
            // No time limit, calculate from start to end
            actualTimeTaken = Math.floor((endTime - startTime) / 1000);
        }
        
        document.getElementById('time-taken-input').value = actualTimeTaken;
        
        // Calculate the actual start time by subtracting time taken from current time
        const actualStartTime = new Date(endTime.getTime() - (actualTimeTaken * 1000));
        
        // Format to MySQL datetime format in local timezone (same as server timezone +7)
        const year = actualStartTime.getFullYear();
        const month = String(actualStartTime.getMonth() + 1).padStart(2, '0');
        const day = String(actualStartTime.getDate()).padStart(2, '0');
        const hours = String(actualStartTime.getHours()).padStart(2, '0');
        const minutes = String(actualStartTime.getMinutes()).padStart(2, '0');
        const seconds = String(actualStartTime.getSeconds()).padStart(2, '0');
        const formattedStartTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        
        document.getElementById('started-at-input').value = formattedStartTime;
        
        if (timerInterval) {
            clearInterval(timerInterval);
        }
    });
    
    // Initialize feather icons
    feather.replace();
});
</script>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>