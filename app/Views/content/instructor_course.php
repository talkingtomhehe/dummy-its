<?php
/**
 * Instructor Course View
 * Displays course content with editing capabilities for instructors
 */

$showHeader = true;
$activePage = 'courses';
$title = ($courseName ?? 'Course') . ' - ITS';
require_once __DIR__ . '/../layouts/header.php';
?>

<div id="page-instructor-course" class="page active">
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
                <a href="<?= BASE_URL ?>/course">My courses</a>
                <span>/</span>
                <span><?= htmlspecialchars($courseName ?? 'Course') ?></span>
            </div>
            
            <!-- Tabs -->
            <div class="tabs">
                <button class="tab active" data-tab="content">Course</button>
                <button class="tab" data-tab="participants">Participants</button>
                <button class="tab" onclick="window.location.href='<?= BASE_URL ?>/grades'">Grades</button>
            </div>
            
            <!-- Page Controls - Initially hidden, shown when editing mode is ON -->
            <div class="page-controls instructor-controls" style="margin: 20px 0; display: none;">
                <button class="button button-secondary" onclick="showAddTopicModal()">
                    <i data-feather="plus"></i> Add New Topic
                </button>
            </div>
            
            <!-- Content Tab -->
            <div class="tab-content active" id="content-tab">
                <?php if (empty($topics)): ?>
                <div class="section expanded">
                    <div class="section-content">
                        <p style="text-align: center; color: #777; padding: 40px;">
                            No content yet. Click "Add New Topic" to start building your course.
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
                                        <?php if (!$item['is_visible']): ?>
                                        <span style="color: #999; font-size: 12px;">(Hidden)</span>
                                        <?php endif; ?>
                                    </div>
                                    <div class="item-controls instructor-controls" style="display: none;">
                                        <button class="button button-icon" onclick="toggleVisibility(<?= $item['id'] ?>)" title="<?= $item['is_visible'] ? 'Hide' : 'Show' ?>">
                                            <i data-feather="<?= $item['is_visible'] ? 'eye' : 'eye-off' ?>"></i>
                                        </button>
                                        <button class="button button-icon" onclick="editContent(<?= $item['id'] ?>)" title="Edit">
                                            <i data-feather="edit-2"></i>
                                        </button>
                                        <button class="button button-icon button-danger" onclick="deleteContent(<?= $item['id'] ?>)" title="Delete">
                                            <i data-feather="trash-2"></i>
                                        </button>
                                    </div>
                                </div>
                                <?php endforeach; ?>
                            <?php endif; ?>
                            <button class="button button-link instructor-controls" onclick="showAddContentModal(<?= $topic['id'] ?>)" style="margin-top: 10px; display: none;">
                                <i data-feather="plus"></i> Add an activity or resource
                            </button>
                        </div>
                    </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </main>
    </div>
</div>

<script>
    const BASE_URL = '<?= BASE_URL ?>';
    
    function scrollToSection(id) {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    
    function viewContent(id, type, assessmentId = null) {
        if (type === 'quiz') {
            window.location.href = `${BASE_URL}/quiz/${assessmentId ?? id}`;
            return;
        }

        if (type === 'assignment') {
            window.location.href = `${BASE_URL}/assignment/${assessmentId ?? id}`;
            return;
        }

        window.location.href = `${BASE_URL}/content/${id}/view`;
    }
    
    function toggleVisibility(contentId) {
        if (confirm('Toggle visibility for this item?')) {
            fetch(`${BASE_URL}/content/toggle/${contentId}`, { method: 'POST' })
                .then(r => r.json())
                .then(data => {
                    if (data.success) location.reload();
                    else alert('Error: ' + (data.error || 'Unknown error'));
                });
        }
    }
    
    function deleteContent(contentId) {
        if (confirm('Are you sure you want to delete this content item?')) {
            fetch(`${BASE_URL}/content/delete/${contentId}`, { method: 'POST' })
                .then(r => r.json())
                .then(data => {
                    if (data.success) location.reload();
                    else alert('Error: ' + (data.error || 'Unknown error'));
                });
        }
    }
    
    function showAddTopicModal() {
        const title = prompt('Enter topic title:');
        if (title) {
            const formData = new FormData();
            formData.append('subject_id', <?= $courseId ?? 1 ?>);
            formData.append('topic_title', title);
            formData.append('description', '');
            formData.append('display_order', 0);
            
            fetch(`${BASE_URL}/topic/create`, { method: 'POST', body: formData })
                .then(r => r.json())
                .then(data => {
                    if (data.success) location.reload();
                    else alert('Error: ' + (data.error || 'Unknown error'));
                });
        }
    }
    
    function showAddContentModal(topicId) {
        const title = prompt('Enter content title:');
        if (title) {
            const type = prompt('Enter content type (text/video/url/quiz/assignment):');
            if (type) {
                const formData = new FormData();
                formData.append('topic_id', topicId);
                formData.append('title', title);
                formData.append('content_type', type);
                formData.append('content_data', '');
                formData.append('display_order', 0);
                
                fetch(`${BASE_URL}/content/create`, { method: 'POST', body: formData })
                    .then(r => r.json())
                    .then(data => {
                        if (data.success) location.reload();
                        else alert('Error: ' + (data.error || 'Unknown error'));
                    });
            }
        }
    }
    
    // Sidebar toggle
    document.getElementById('sidebar-toggle')?.addEventListener('click', function() {
        document.querySelector('.container').classList.toggle('sidebar-collapsed');
    });
    
    // Section collapse
    document.querySelectorAll('.section-header').forEach(header => {
        header.addEventListener('click', function(e) {
            if (!e.target.closest('.button')) {
                this.parentElement.classList.toggle('collapsed');
            }
        });
    });
    
    // Editing mode toggle
    const editToggle = document.getElementById('editing-toggle');
    if (editToggle) {
        editToggle.addEventListener('change', function() {
            const controls = document.querySelectorAll('.instructor-controls');
            controls.forEach(el => {
                el.style.display = this.checked ? (el.classList.contains('item-controls') ? 'flex' : 'block') : 'none';
            });
        });
    }
    
    feather.replace();
</script>

<!-- Add Topic Modal -->
<div id="add-topic-modal" class="modal" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h2 class="modal-title">Add New Topic</h2>
            <button class="modal-close" onclick="closeModal('add-topic-modal')"><i data-feather="x"></i></button>
        </div>
        <div class="modal-body">
            <form id="add-topic-form" onsubmit="submitTopicForm(event)">
                <div class="form-group">
                    <label for="topic-title">Topic Title:</label>
                    <input type="text" id="topic-title" name="topic-title" required placeholder="e.g., Topic 3: White-Box Testing">
                </div>
                <div class="form-actions">
                    <button type="button" class="button button-secondary" onclick="closeModal('add-topic-modal')">Cancel</button>
                    <button type="submit" class="button button-primary">Save Topic</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Add Content/Activity Modal -->
<div id="add-item-modal" class="modal" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h2 class="modal-title">Add an activity or resource</h2>
            <button class="modal-close" onclick="closeModal('add-item-modal')"><i data-feather="x"></i></button>
        </div>
        <div class="modal-body">
            <form id="add-item-form" onsubmit="submitContentForm(event)">
                <input type="hidden" id="item-topic-id" name="topic-id">
                
                <div class="form-group">
                    <label for="item-type">Item Type:</label>
                    <select id="item-type" name="item-type" onchange="toggleContentFields(this.value)">
                        <option value="text">Page (Lesson)</option>
                        <option value="video">Video</option>
                        <option value="url">Link</option>
                        <option value="quiz">Quiz (Assessment)</option>
                        <option value="assignment">Assignment</option>
                        <option value="file">File (PDF, etc)</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="item-title">Title:</label>
                    <input type="text" id="item-title" name="item-title" required placeholder="e.g., 2.3 Boundary Value Analysis">
                </div>
                
                <div id="form-group-text" class="dynamic-form-group">
                    <div class="form-group">
                        <label for="item-content">Content:</label>
                        <textarea name="item-content" id="item-content" rows="4" placeholder="Enter text content..."></textarea>
                    </div>
                </div>
                
                <div id="form-group-video" class="dynamic-form-group" style="display: none;">
                    <div class="form-group">
                        <label for="item-video-url">Video URL:</label>
                        <input type="text" name="item-video-url" id="item-video-url" placeholder="e.g., https://youtube.com/watch?v=...">
                    </div>
                </div>
                
                <div id="form-group-url" class="dynamic-form-group" style="display: none;">
                    <div class="form-group">
                        <label for="item-link-url">Link URL:</label>
                        <input type="text" name="item-link-url" id="item-link-url" placeholder="e.g., https://www.example.com">
                    </div>
                </div>
                
                <div id="form-group-quiz" class="dynamic-form-group" style="display: none;">
                    <div class="form-group">
                        <label for="quiz-time-limit">Time Limit (minutes):</label>
                        <input type="number" name="quiz-time-limit" id="quiz-time-limit" value="30">
                        <small>0 = no time limit</small>
                    </div>
                    <div class="form-group">
                        <label for="quiz-open-time">Open time:</label>
                        <input type="datetime-local" name="quiz-open-time" id="quiz-open-time">
                    </div>
                    <div class="form-group">
                        <label for="quiz-close-time">Close time:</label>
                        <input type="datetime-local" name="quiz-close-time" id="quiz-close-time">
                    </div>
                </div>
                
                <div id="form-group-assignment" class="dynamic-form-group" style="display: none;">
                    <div class="form-group">
                        <label for="assignment-open-time">Open time:</label>
                        <input type="datetime-local" name="assignment-open-time" id="assignment-open-time">
                    </div>
                    <div class="form-group">
                        <label for="assignment-due-time">Due date:</label>
                        <input type="datetime-local" name="assignment-due-time" id="assignment-due-time">
                    </div>
                </div>
                
                <div id="form-group-file" class="dynamic-form-group" style="display: none;">
                    <div class="form-group">
                        <label for="item-file">Upload File:</label>
                        <input type="file" name="item-file" id="item-file">
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="button button-secondary" onclick="closeModal('add-item-modal')">Cancel</button>
                    <button type="submit" class="button button-primary">Save and Return</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
function showAddTopicModal() {
    document.getElementById('add-topic-modal').style.display = 'flex';
    feather.replace();
}

function showAddContentModal(topicId) {
    document.getElementById('item-topic-id').value = topicId;
    document.getElementById('add-item-modal').style.display = 'flex';
    feather.replace();
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function toggleContentFields(type) {
    document.querySelectorAll('.dynamic-form-group').forEach(g => g.style.display = 'none');
    const groupId = 'form-group-' + type;
    const group = document.getElementById(groupId);
    if (group) group.style.display = 'block';
}

function submitTopicForm(e) {
    e.preventDefault();
    const title = document.getElementById('topic-title').value;
    const formData = new FormData();
    formData.append('subject_id', <?= $courseId ?? 1 ?>);
    formData.append('topic_title', title);
    formData.append('description', '');
    formData.append('display_order', 0);
    
    fetch(`${BASE_URL}/topic/create`, { method: 'POST', body: formData })
        .then(r => r.json())
        .then(data => {
            if (data.success) location.reload();
            else alert('Error: ' + (data.error || 'Unknown error'));
        });
}

function submitContentForm(e) {
    e.preventDefault();
    const form = e.target;
    const topicId = form.querySelector('#item-topic-id').value;
    const title = form.querySelector('#item-title').value;
    const type = form.querySelector('#item-type').value;
    
    let contentData = '';
    if (type === 'text') {
        contentData = form.querySelector('#item-content').value;
    } else if (type === 'video') {
        contentData = form.querySelector('#item-video-url').value;
    } else if (type === 'url') {
        contentData = form.querySelector('#item-link-url').value;
    }
    
    const formData = new FormData();
    formData.append('topic_id', topicId);
    formData.append('title', title);
    formData.append('content_type', type);
    formData.append('content_data', contentData);
    formData.append('display_order', 0);
    
    fetch(`${BASE_URL}/content/create`, { method: 'POST', body: formData })
        .then(r => r.json())
        .then(data => {
            if (data.success) location.reload();
            else alert('Error: ' + (data.error || 'Unknown error'));
        });
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}
</script>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
