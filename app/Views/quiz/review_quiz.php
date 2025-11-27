<?php 
$showHeader = true;
require_once __DIR__ . '/../layouts/header.php'; 
?>

<div class="container">
    <main class="main">
        <div class="back-to-course-box">
            <a href="<?= BASE_URL ?>/quiz/<?= $quiz['id'] ?>">
                <i data-feather="arrow-left"></i>
                <span>Quay lại kết quả</span>
            </a>
        </div>
        <h1 class="course-title">Xem lại: <?= htmlspecialchars($quiz['title']) ?></h1>
        
        <div class="review-info-box" style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0;"><strong>Điểm:</strong> <?= number_format($result['score'] ?? 0, 2) ?> / 10.00</p>
            <p style="margin: 5px 0 0 0;"><strong>Số câu đúng:</strong> <?= $correctAnswers ?> / <?= $totalQuestions ?></p>
        </div>

        <div class="quiz-review-container">
            <?php foreach ($questions as $index => $question): ?>
            <div class="review-question-box" style="background-color: white; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <div class="review-question-header" style="margin-bottom: 15px;">
                    <h3 style="margin: 0 0 10px 0; color: #2c3e50;">Câu hỏi <?= $index + 1 ?> / <?= count($questions) ?></h3>
                    <p style="margin: 0; font-size: 15px; line-height: 1.6;"><?= nl2br(htmlspecialchars($question['question_text'])) ?></p>
                </div>
                
                <div class="review-options" style="margin-top: 15px;">
                    <?php 
                    $userAnswers = $answers[$question['question_id']] ?? [];
                    if (!is_array($userAnswers)) {
                        $userAnswers = [$userAnswers];
                    }
                    $userAnswers = array_map('strval', $userAnswers);
                    
                    $hasCorrect = false;
                    foreach ($question['options'] as $option) {
                        if (!empty($option['is_correct'])) {
                            $hasCorrect = true;
                            break;
                        }
                    }
                    
                    foreach ($question['options'] as $option): 
                        $isCorrect = !empty($option['is_correct']);
                        $isSelected = in_array((string)$option['option_id'], $userAnswers, true);
                        
                        $backgroundColor = 'white';
                        $borderColor = '#dee2e6';
                        $icon = '';
                        
                        if ($isCorrect && $isSelected) {
                            // Correct and selected - green
                            $backgroundColor = '#d4edda';
                            $borderColor = '#28a745';
                            $icon = '<i data-feather="check-circle" style="color: #28a745; width: 20px; height: 20px;"></i>';
                        } elseif ($isCorrect && !$isSelected) {
                            // Correct but not selected - light green border
                            $backgroundColor = '#f8f9fa';
                            $borderColor = '#28a745';
                            $icon = '<i data-feather="check-circle" style="color: #28a745; width: 20px; height: 20px;"></i>';
                        } elseif (!$isCorrect && $isSelected) {
                            // Wrong and selected - red
                            $backgroundColor = '#f8d7da';
                            $borderColor = '#dc3545';
                            $icon = '<i data-feather="x-circle" style="color: #dc3545; width: 20px; height: 20px;"></i>';
                        }
                    ?>
                    <div class="review-option" style="display: flex; align-items: center; gap: 10px; padding: 12px; margin-bottom: 10px; border: 2px solid <?= $borderColor ?>; border-radius: 6px; background-color: <?= $backgroundColor ?>;">
                        <span style="flex-shrink: 0;"><?= $icon ?></span>
                        <span style="flex: 1;"><?= htmlspecialchars($option['option_text']) ?></span>
                        <?php if ($isSelected): ?>
                        <span style="flex-shrink: 0; font-size: 12px; color: #6c757d; font-style: italic;">Bạn đã chọn</span>
                        <?php endif; ?>
                    </div>
                    <?php endforeach; ?>
                </div>
                
                <?php
                // Check if answer is correct and calculate partial credit
                $correctOptions = [];
                foreach ($question['options'] as $option) {
                    if (!empty($option['is_correct'])) {
                        $correctOptions[] = (string)$option['option_id'];
                    }
                }
                sort($correctOptions);
                sort($userAnswers);
                $isQuestionCorrect = $correctOptions === $userAnswers && !empty($correctOptions);
                
                // Calculate partial credit for multiple-choice questions
                $earnedPoints = 0;
                $isPartiallyCorrect = false;
                
                if ($question['question_type'] === 'multiple_answer' && !empty($correctOptions)) {
                    $numCorrect = count($correctOptions);
                    $numCorrectSelected = 0;
                    $numIncorrectSelected = 0;
                    
                    foreach ($userAnswers as $selected) {
                        if (in_array($selected, $correctOptions, true)) {
                            $numCorrectSelected++;
                        } else {
                            $numIncorrectSelected++;
                        }
                    }
                    
                    // Calculate partial points
                    $pointsPerCorrect = $question['points'] / $numCorrect;
                    $earnedPoints = max(0, ($numCorrectSelected * $pointsPerCorrect) - ($numIncorrectSelected * $pointsPerCorrect));
                    
                    $isPartiallyCorrect = $earnedPoints > 0 && !$isQuestionCorrect;
                } elseif ($isQuestionCorrect) {
                    $earnedPoints = $question['points'];
                }
                ?>
                
                <div class="review-result" style="margin-top: 15px; padding: 10px; border-radius: 6px; <?= $isQuestionCorrect ? 'background-color: #d4edda; color: #155724;' : ($isPartiallyCorrect ? 'background-color: #fff3cd; color: #856404;' : 'background-color: #f8d7da; color: #721c24;') ?>">
                    <strong>
                        <?php if ($isQuestionCorrect): ?>
                            <i data-feather="check" style="width: 16px; height: 16px;"></i> Đúng - <?= number_format($question['points'], 1) ?> điểm
                        <?php elseif ($isPartiallyCorrect): ?>
                            <i data-feather="check-circle" style="width: 16px; height: 16px;"></i> Đúng 1 phần - <?= number_format($earnedPoints, 1) ?> điểm
                        <?php else: ?>
                            <i data-feather="x" style="width: 16px; height: 16px;"></i> Sai - 0 điểm
                        <?php endif; ?>
                    </strong>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
        
        <div class="page-controls" style="justify-content: center; margin-top: 30px;">
            <button class="button button-primary" onclick="window.location.href='<?= base_url('/quiz/' . $quiz['id']) ?>'">
                Quay lại kết quả
            </button>
        </div>
    </main>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    feather.replace();
});
</script>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
