<?php require_once __DIR__ . '/../layouts/header.php'; ?>

<div class="container">
    <main class="main">
        <h1 class="course-title">Grades: <?= htmlspecialchars($courseName) ?></h1>
        
        <table class="submission-status-table">
            <thead>
                <tr>
                    <th style="width: 50%;">Tên mục</th>
                    <th>Loại</th>
                    <th>Điểm</th>
                    <th>Feedback</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($grades as $grade): ?>
                <tr>
                    <td><?= htmlspecialchars($grade['title']) ?></td>
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
                            <a href="<?= base_url('/quiz/' . $grade['assessment_id'] . '/results') ?>">Xem lại bài làm</a>
                        <?php elseif ($grade['feedback']): ?>
                            <?= htmlspecialchars($grade['feedback']) ?>
                        <?php else: ?>
                            -
                        <?php endif; ?>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </main>
</div>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
