<?php
/**
 * Student Course View
 * Displays course content, topics, and assessments for students
 */

$showHeader = true;
$activePage = 'courses';
$title = ($courseName ?? 'Course') . ' - ITS';
require_once __DIR__ . '/../layouts/header.php';
?>

<div id="page-student-course" class="page active">
    <div class="container">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="sidebar-header">
                <button class="toggle-button" id="sidebar-toggle">
                    <i data-feather="menu"></i>
                </button>
            </div>
            <div class="sidebar-content">
                <div class="sidebar-nav-item" onclick="window.location.href='<?= BASE_URL ?>/dashboard'">
                    <i data-feather="home"></i>
                    <span>Dashboard</span>
                </div>
                <div class="sidebar-nav-item active">
                    <i data-feather="book"></i>
                    <span><?= htmlspecialchars($courseName ?? 'Course') ?></span>
                </div>
                
                <div class="sidebar-nav-item category">
                    <span>Course Topics</span>
                </div>
                
                <?php foreach ($topics ?? [] as $topic): ?>
                <div class="sidebar-nav-item sub-item" onclick="scrollToSection('topic-<?= $topic['id'] ?>')">
                    <i data-feather="folder"></i>
                    <span><?= htmlspecialchars($topic['name']) ?></span>
                </div>
                <?php endforeach; ?>
            </div>
        </aside>
        
        <!-- Main Content -->
        <main class="main">
            <h1 class="course-title"><?= htmlspecialchars($courseName ?? 'Course') ?></h1>
            
            <div class="breadcrumbs">
                <a href="<?= BASE_URL ?>/dashboard">Home</a>
                <span>/</span>
                <a href="<?= BASE_URL ?>/dashboard">My courses</a>
                <span>/</span>
                <span><?= htmlspecialchars($courseName ?? 'Course') ?></span>
            </div>
            
            <!-- Tabs -->
            <div class="tabs">
                <button class="tab active" data-tab="content">Content</button>
                <button class="tab" data-tab="grades">Grades</button>
            </div>
            
            <!-- Content Tab -->
            <div class="tab-content active" id="content-tab">
                <?php if (empty($topics)): ?>
                <div class="section expanded">
                    <div class="section-content">
                        <p style="text-align: center; color: #777; padding: 40px;">
                            No content available yet. Check back later!
                        </p>
                    </div>
                </div>
                <?php else: ?>
                    <?php foreach ($topics ?? [] as $topic): ?>
                    <div class="section expanded" id="topic-<?= $topic['id'] ?>">
                        <div class="section-header">
                            <div class="section-header-content">
                                <i class="arrow" data-feather="chevron-right"></i>
                                <span class="section-title"><?= htmlspecialchars($topic['name']) ?></span>
                            </div>
                        </div>
                        <div class="section-content">
                            <?php if (empty($topic['content_items'])): ?>
                            <p style="color: #777; font-style: italic;">No items in this topic yet.</p>
                            <?php else: ?>
                                <?php foreach ($topic['content_items'] as $item): ?>
                                <?php if ($item['is_visible']): ?>
                                <div class="item">
                                    <div class="item-icon">
                                        <?php
                                        $icons = [
                                            'text' => 'file-text',
                                            'page' => 'file-text',
                                            'video' => 'video',
                                            'file' => 'file',
                                            'url' => 'link',
                                            'link' => 'link',
                                            'quiz' => 'help-circle',
                                            'assignment' => 'clipboard'
                                        ];
                                        $icon = $icons[$item['type']] ?? 'file';
                                        ?>
                                        <i data-feather="<?= $icon ?>"></i>
                                    </div>
                                    <div class="item-text" onclick="viewContent(<?= $item['id'] ?>, '<?= $item['type'] ?>', <?= $item['assessment_id'] !== null ? (int)$item['assessment_id'] : 'null' ?>)">
                                        <?= htmlspecialchars($item['title']) ?>
                                    </div>
                                </div>
                                <?php endif; ?>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </div>
                    </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
            
            <!-- Grades Tab -->
            <div class="tab-content" id="grades-tab" style="display: none;">
                <div class="section expanded">
                    <div class="section-header">
                        <div class="section-header-content">
                            <i class="arrow" data-feather="chevron-right"></i>
                            <span class="section-title">My Grades</span>
                        </div>
                    </div>
                    <div class="section-content">
                        <?php if (empty($grades)): ?>
                        <p style="text-align: center; color: #777; padding: 20px;">
                            No grades available yet.
                        </p>
                        <?php else: ?>
                        <table class="grading-table">
                            <thead>
                                <tr>
                                    <th>Assessment</th>
                                    <th>Type</th>
                                    <th>Grade</th>
                                    <th>Feedback</th>
                                    <th>Submitted</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($grades ?? [] as $grade): ?>
                                <tr>
                                    <td>
                                        <strong><?= htmlspecialchars($grade['assessment_title']) ?></strong>
                                    </td>
                                    <td><?= ucfirst(htmlspecialchars($grade['assessment_type'])) ?></td>
                                    <td>
                                        <?php if ($grade['grade'] !== null): ?>
                                        <strong style="color: var(--success-color);">
                                            <?= number_format($grade['grade'], 1) ?>/<?= $grade['max_grade'] ?>
                                        </strong>
                                        <?php else: ?>
                                        <span style="color: #777;">Not graded</span>
                                        <?php endif; ?>
                                    </td>
                                    <td><?= htmlspecialchars($grade['feedback'] ?? '-') ?></td>
                                    <td><?= date('M d, Y H:i', strtotime($grade['submitted_at'])) ?></td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>

<!-- Help Button -->
<button class="help-button">
    <i data-feather="help-circle"></i>
</button>

<script>
    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            
            // Update active tab
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show correct content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.style.display = 'none';
            });
            document.getElementById(tabName + '-tab').style.display = 'block';
        });
    });
    
    // Section toggle
    document.querySelectorAll('.section-header').forEach(header => {
        header.addEventListener('click', function() {
            this.closest('.section').classList.toggle('expanded');
        });
    });
    
    // Sidebar toggle
    document.getElementById('sidebar-toggle').addEventListener('click', function() {
        document.querySelector('.container').classList.toggle('sidebar-collapsed');
    });
    
    // Scroll to section
    function scrollToSection(id) {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Expand if collapsed
            if (!element.classList.contains('expanded')) {
                element.classList.add('expanded');
            }
        }
    }
    
    // View content
    function viewContent(id, type, assessmentId = null) {
        const baseUrl = '<?= BASE_URL ?>';
        if (type === 'quiz') {
            window.location.href = `${baseUrl}/quiz/${assessmentId ?? id}`;
        } else if (type === 'assignment') {
            window.location.href = `${baseUrl}/assignment/${assessmentId ?? id}`;
        } else {
            window.location.href = `${baseUrl}/content/${id}/view`;
        }
    }
    
    // Initialize feather icons
    feather.replace();
</script>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
