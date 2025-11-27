<?php
/**
 * Courses List Page
 * Displays all available courses
 */

$showHeader = true;
$activePage = 'courses';
$title = 'My Courses - ITS';
require_once __DIR__ . '/../layouts/header.php';
?>

<div class="container">
    <!-- Main Content -->
    <main class="main">
        <h1 class="course-title">My Courses</h1>
        
        <div class="breadcrumbs">
            <a href="<?= BASE_URL ?>/dashboard">Dashboard</a>
            <span>/</span>
            <span>My Courses</span>
        </div>

        <?php if (!empty($successMessage)): ?>
            <div class="alert alert-success"><?= htmlspecialchars($successMessage) ?></div>
        <?php endif; ?>

        <?php if (!empty($errorMessage)): ?>
            <div class="alert alert-danger"><?= htmlspecialchars($errorMessage) ?></div>
        <?php endif; ?>

        <!-- Courses Grid -->
        <div style="margin-top: 30px;">
            <?php if (empty($courses)): ?>
                <div class="section expanded">
                    <div class="section-content" style="text-align: center; padding: 40px;">
                        <i data-feather="book" style="width: 64px; height: 64px; color: #ccc; margin-bottom: 20px;"></i>
                        <h3 style="color: #666; margin-bottom: 10px;">No Courses Available</h3>
                        <p style="color: #999;">
                            <?php if ($isInstructor ?? false): ?>
                                There are no courses in the system yet.
                            <?php else: ?>
                                You are not enrolled in any courses yet.
                            <?php endif; ?>
                        </p>
                    </div>
                </div>
            <?php else: ?>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
                    <?php foreach ($courses as $course): ?>
                        <div class="course-card" onclick="window.location.href='<?= BASE_URL ?>/course/<?= $course['subject_id'] ?>'" style="cursor: pointer;">
                            <div class="course-card-header" style="background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%); padding: 30px 20px; color: white; border-radius: 8px 8px 0 0;">
                                <h3 style="margin: 0; font-size: 18px; font-weight: 600; line-height: 1.4;">
                                    <?= htmlspecialchars($course['subject_name']) ?>
                                </h3>
                                <?php if (!empty($course['subject_code'])): ?>
                                    <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 14px;">
                                        <?= htmlspecialchars($course['subject_code']) ?>
                                    </p>
                                <?php endif; ?>
                            </div>
                            <div class="course-card-body" style="padding: 20px; background: var(--bg-light); border: 1px solid var(--border-color); border-top: none; border-radius: 0 0 8px 8px;">
                                <?php if (!empty($course['description'])): ?>
                                    <p style="color: #666; line-height: 1.6; margin: 0 0 15px 0; font-size: 14px;">
                                        <?= htmlspecialchars(substr($course['description'], 0, 120)) ?><?= strlen($course['description']) > 120 ? '...' : '' ?>
                                    </p>
                                <?php endif; ?>
                                <div style="display: flex; align-items: center; justify-content: space-between; margin-top: auto;">
                                    <div style="display: flex; align-items: center; gap: 15px; font-size: 13px; color: #666;">
                                        <span style="display: flex; align-items: center; gap: 5px;">
                                            <i data-feather="book-open" style="width: 16px; height: 16px;"></i>
                                            <?= $course['topic_count'] ?? 0 ?> Topics
                                        </span>
                                        <span style="display: flex; align-items: center; gap: 5px;">
                                            <i data-feather="file-text" style="width: 16px; height: 16px;"></i>
                                            <?= $course['content_count'] ?? 0 ?> Items
                                        </span>
                                    </div>
                                    <button class="button button-primary" style="padding: 8px 16px; font-size: 13px;">
                                        View Course <i data-feather="arrow-right" style="width: 14px; height: 14px;"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
    </main>
</div>

<style>
.course-card {
    transition: transform 0.2s, box-shadow 0.2s;
    border-radius: 8px;
    overflow: hidden;
}

.course-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.course-card-body {
    display: flex;
    flex-direction: column;
    min-height: 140px;
}
</style>

<script>
feather.replace();
</script>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
