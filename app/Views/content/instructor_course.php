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
                    <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="<?= htmlspecialchars($courseName ?? 'Course') ?>"><?= htmlspecialchars($courseName ?? 'Course') ?></span>
                </div>
                
                <div class="sidebar-nav-item category">
                    <span>Course Topics</span>
                </div>
                
                <?php foreach ($topics ?? [] as $topic): ?>
                <div class="sidebar-nav-item sub-item" onclick="scrollToSection('topic-<?= $topic['id'] ?>')">
                    <i data-feather="folder"></i>
                    <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="<?= htmlspecialchars($topic['name']) ?>"><?= htmlspecialchars($topic['name']) ?></span>
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
                <button class="tab" onclick="window.location.href='<?= BASE_URL ?>/grades/<?= $courseId ?? 1 ?>'">Grades</button>
            </div>
            
            <!-- Page Controls - Initially hidden, shown when editing mode is ON -->
            <div class="page-controls instructor-controls" style="margin: 20px 0; display: <?= \App\Core\Session::get('is_editing', false) ? 'flex' : 'none' ?>;">
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
                            <div class="section-actions instructor-controls item-controls" style="display: <?= \App\Core\Session::get('is_editing', false) ? 'flex' : 'none' ?>;">
                                <button class="button button-icon" onclick="moveTopicUp(<?= $topic['id'] ?>)" title="Move Up">
                                    <i data-feather="arrow-up"></i>
                                </button>
                                <button class="button button-icon" onclick="moveTopicDown(<?= $topic['id'] ?>)" title="Move Down">
                                    <i data-feather="arrow-down"></i>
                                </button>
                                <button class="button button-icon button-danger" onclick="deleteTopic(<?= $topic['id'] ?>)" title="Delete Topic">
                                    <i data-feather="trash-2"></i>
                                </button>
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
                                            'assignment' => 'clipboard',
                                            'announcement' => 'bell'
                                        ];
                                        $icon = $icons[$item['type']] ?? 'file';
                                        ?>
                                        <i data-feather="<?= $icon ?>"></i>
                                    </div>
                                    <div class="item-text" onclick="viewContent(<?= $item['id'] ?>, '<?= $item['type'] ?>', <?= $item['assessment_id'] !== null ? (int)$item['assessment_id'] : 'null' ?>)" title="<?= htmlspecialchars($item['title']) ?>">
                                        <?= htmlspecialchars($item['title']) ?>
                                        <?php if (!$item['is_visible']): ?>
                                        <span style="color: #999; font-size: 12px;">(Hidden)</span>
                                        <?php endif; ?>
                                    </div>
                                    <div class="item-controls instructor-controls" style="display: <?= \App\Core\Session::get('is_editing', false) ? 'flex' : 'none' ?>;">
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
                            <button class="button button-link instructor-controls" onclick="showAddContentModal(<?= $topic['id'] ?>)" style="margin-top: 10px; display: <?= \App\Core\Session::get('is_editing', false) ? 'flex' : 'none' ?>;">
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
    const BASE_URL = document.body.dataset.baseUrl || '<?= BASE_URL ?>';
    
    function scrollToSection(id) {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    
    function viewContent(id, type, assessmentId = null) {
        const parsedAssessmentId = Number(assessmentId);
        const hasAssessment = Number.isInteger(parsedAssessmentId) && parsedAssessmentId > 0;

        if (type === 'quiz') {
            if (hasAssessment) {
                window.location.href = `${BASE_URL}/quiz/${parsedAssessmentId}`;
            } else {
                window.location.href = `${BASE_URL}/content/${id}/view`;
            }
            return;
        }

        if (type === 'assignment') {
            if (hasAssessment) {
                window.location.href = `${BASE_URL}/assignment/${parsedAssessmentId}/status`;
            } else {
                window.location.href = `${BASE_URL}/content/${id}/view`;
            }
            return;
        }

        window.location.href = `${BASE_URL}/content/${id}/view`;
    }
    
    function toggleVisibility(contentId) {
        if (confirm('Toggle visibility for this item?')) {
            fetch(`${BASE_URL}/content/toggle/${contentId}`, { method: 'POST' })
                .then(r => r.json())
                .then(data => {
                    if (data.success) {
                        showNotification('Visibility toggled successfully!', 'success');
                        setTimeout(() => location.reload(), 1500);
                    } else {
                        showNotification('Error: ' + (data.error || 'Unknown error'), 'error');
                    }
                });
        }
    }
    
    function deleteContent(contentId) {
        if (confirm('Are you sure you want to delete this content item?')) {
            fetch(`${BASE_URL}/content/delete/${contentId}`, { method: 'POST' })
                .then(r => r.json())
                .then(data => {
                    if (data.success) {
                        showNotification('Content deleted successfully!', 'success');
                        setTimeout(() => location.reload(), 1500);
                    } else {
                        showNotification('Error: ' + (data.error || 'Unknown error'), 'error');
                    }
                });
        }
    }

    function deleteTopic(topicId) {
        if (confirm('Are you sure you want to delete this topic and all its content?')) {
            fetch(`${BASE_URL}/topic/delete/${topicId}`, { method: 'POST' })
                .then(r => r.json())
                .then(data => {
                    if (data.success) {
                        showNotification('Topic deleted successfully!', 'success');
                        setTimeout(() => location.reload(), 1500);
                    } else {
                        showNotification('Error: ' + (data.error || 'Unknown error'), 'error');
                    }
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
                    if (data.success) {
                        showNotification('Topic created successfully!', 'success');
                        setTimeout(() => location.reload(), 1500);
                    } else {
                        showNotification('Error: ' + (data.error || 'Unknown error'), 'error');
                    }
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
            <form id="add-item-form" onsubmit="submitContentForm(event)" enctype="multipart/form-data">
                <input type="hidden" id="item-topic-id" name="topic-id">
                <input type="hidden" id="editing-content-id" name="content-id">
                
                <div class="form-group">
                    <label for="item-type">Item Type:</label>
                    <select id="item-type" name="item-type" onchange="toggleContentFields(this.value)">
                        <option value="text">Page (Lesson)</option>
                        <option value="video">Video</option>
                        <option value="url">Link</option>
                        <option value="quiz">Quiz (Assessment)</option>
                        <option value="assignment">Assignment</option>
                        <option value="announcement">Announcement</option>
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
                    <div class="form-group">
                        <label for="item-video-file">Upload Video File (optional):</label>
                        <input type="file" name="item-file" id="item-video-file" accept="video/*">
                        <small>Select a file to upload instead of using a URL.</small>
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
                    <div class="form-group">
                        <label for="quiz-max-attempts">Max Attempts:</label>
                        <input type="number" name="quiz-max-attempts" id="quiz-max-attempts" value="1" min="0">
                        <small>0 = unlimited attempts</small>
                    </div>
                    <div class="form-group">
                        <label for="quiz-grading-method">Grading Method:</label>
                        <select name="quiz-grading-method" id="quiz-grading-method">
                            <option value="last">Last Attempt</option>
                            <option value="highest">Highest Score</option>
                            <option value="average">Average Score</option>
                            <option value="first">First Attempt</option>
                        </select>
                        <small>How to calculate final grade from multiple attempts</small>
                    </div>
                </div>
                
                <div id="form-group-assignment" class="dynamic-form-group" style="display: none;">
                    <div class="form-group">
                        <label for="assignment-open-time">Open time:</label>
                        <input type="datetime-local" name="assignment-open-time" id="assignment-open-time">
                    </div>
                    <div class="form-group">
                        <label for="assignment-close-time">Close time:</label>
                        <input type="datetime-local" name="assignment-close-time" id="assignment-close-time">
                    </div>
                </div>
                
                <div id="form-group-announcement" class="dynamic-form-group" style="display: none;">
                    <div class="form-group">
                        <label for="item-content">Announcement Content:</label>
                        <textarea name="item-content" id="announcement-content" rows="4" placeholder="Enter announcement text..."></textarea>
                    </div>
                </div>
                
                <div id="form-group-file" class="dynamic-form-group" style="display: none;">
                    <div class="form-group">
                        <label for="item-file">Upload File:</label>
                        <input type="file" name="item-file" id="item-file" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar,.txt,.png,.jpg,.jpeg,.gif">
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="button button-secondary" onclick="closeModal('add-item-modal')">Cancel</button>
                    <button type="submit" id="item-submit-button" class="button button-primary">Save and Return</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
let isEditingContent = false;

function showAddTopicModal() {
    document.getElementById('add-topic-modal').style.display = 'flex';
    feather.replace();
}

function resetContentForm() {
    const form = document.getElementById('add-item-form');
    form.reset();
    document.getElementById('editing-content-id').value = '';
    document.getElementById('item-type').disabled = false;
    toggleContentFields(document.getElementById('item-type').value);
}

function showAddContentModal(topicId) {
    isEditingContent = false;
    resetContentForm();
    document.getElementById('item-topic-id').value = topicId;
    document.getElementById('item-submit-button').textContent = 'Save and Return';
    document.querySelector('#add-item-modal .modal-title').textContent = 'Add an activity or resource';
    document.getElementById('add-item-modal').style.display = 'flex';
    feather.replace();
}

function populateContentForm(content) {
    if (!content) {
        return;
    }

    const rawType = content.content_type || content.type || 'text';
    const normalizedType = rawType === 'link' ? 'url' : rawType;

    document.getElementById('item-topic-id').value = content.topic_id || '';
    document.getElementById('item-title').value = content.title || '';
    document.getElementById('item-type').value = normalizedType;
    document.getElementById('item-type').disabled = true;
    toggleContentFields(normalizedType);

    if (normalizedType === 'text' || normalizedType === 'page') {
        document.getElementById('item-content').value = content.content_data || '';
    } else if (normalizedType === 'video') {
        document.getElementById('item-video-url').value = content.content_data || '';
    } else if (normalizedType === 'url') {
        document.getElementById('item-link-url').value = content.content_data || '';
    } else if (normalizedType === 'announcement') {
        document.getElementById('announcement-content').value = content.content_data || '';
    } else if (normalizedType === 'quiz') {
        // Populate quiz specific fields
        document.getElementById('quiz-time-limit').value = content.time_limit || 30;
        document.getElementById('quiz-max-attempts').value = content.max_attempts || 1;
        document.getElementById('quiz-grading-method').value = content.grading_method || 'last';
        if (content.open_time) {
            const openTime = formatDateTimeForInput(content.open_time);
            document.getElementById('quiz-open-time').value = openTime;
        }
        if (content.close_time) {
            const closeTime = formatDateTimeForInput(content.close_time);
            document.getElementById('quiz-close-time').value = closeTime;
        }
    } else if (normalizedType === 'assignment') {
        // Populate assignment specific fields
        if (content.open_time) {
            const openTime = formatDateTimeForInput(content.open_time);
            document.getElementById('assignment-open-time').value = openTime;
        }
        if (content.close_time) {
            const closeTime = formatDateTimeForInput(content.close_time);
            document.getElementById('assignment-close-time').value = closeTime;
        }
    }
}

// Helper function to format datetime for datetime-local input
function formatDateTimeForInput(datetimeStr) {
    if (!datetimeStr) return '';
    // Convert "2025-11-25 14:30:00" to "2025-11-25T14:30"
    const dateObj = new Date(datetimeStr);
    if (isNaN(dateObj.getTime())) return '';
    
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function editContent(contentId) {
    isEditingContent = true;
    resetContentForm();
    fetch(`${BASE_URL}/content/${contentId}`)
        .then(response => response.json())
        .then(data => {
            if (!data.success || !data.content) {
                alert('Unable to load content details for editing.');
                return;
            }

            document.getElementById('editing-content-id').value = contentId;
            document.getElementById('item-submit-button').textContent = 'Update and Return';
            document.querySelector('#add-item-modal .modal-title').textContent = 'Edit content item';
            populateContentForm(data.content);
            document.getElementById('add-item-modal').style.display = 'flex';
            feather.replace();
        })
        .catch(() => {
            alert('Unable to load content details for editing.');
        });
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
        return;
    }

    modal.style.display = 'none';

    if (modalId === 'add-item-modal') {
        isEditingContent = false;
        resetContentForm();
    }
}

function toggleContentFields(type) {
    document.querySelectorAll('.dynamic-form-group').forEach(g => g.style.display = 'none');
    const groupId = 'form-group-' + type;
    const group = document.getElementById(groupId);
    if (group) {
        group.style.display = 'block';
    }

    if (type !== 'file') {
        const fileInput = document.getElementById('item-file');
        if (fileInput) {
            fileInput.value = '';
        }
    }

    if (type !== 'video') {
        const videoFileInput = document.getElementById('item-video-file');
        if (videoFileInput) {
            videoFileInput.value = '';
        }
    }
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
            if (data.success) {
                showNotification('Topic created successfully!', 'success');
                setTimeout(() => location.reload(), 1500);
            } else {
                showNotification('Error: ' + (data.error || 'Unknown error'), 'error');
            }
        });
}

function moveTopicUp(topicId) {
    if (!confirm('Move this topic up?')) return;
    
    fetch(`${BASE_URL}/topic/${topicId}/move-up`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            showNotification('Topic moved successfully!', 'success');
            setTimeout(() => location.reload(), 500);
        } else {
            showNotification('Error: ' + (data.error || 'Cannot move topic up'), 'error');
        }
    })
    .catch(err => showNotification('Error: ' + err.message, 'error'));
}

function moveTopicDown(topicId) {
    if (!confirm('Move this topic down?')) return;
    
    fetch(`${BASE_URL}/topic/${topicId}/move-down`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            showNotification('Topic moved successfully!', 'success');
            setTimeout(() => location.reload(), 500);
        } else {
            showNotification('Error: ' + (data.error || 'Cannot move topic down'), 'error');
        }
    })
    .catch(err => showNotification('Error: ' + err.message, 'error'));
}

function submitContentForm(e) {
    e.preventDefault();
    const form = e.target;
    const topicId = form.querySelector('#item-topic-id').value;
    const title = form.querySelector('#item-title').value;
    const type = form.querySelector('#item-type').value;
    const contentId = form.querySelector('#editing-content-id').value;
    
    let contentData = '';
    if (type === 'text' || type === 'page') {
        contentData = form.querySelector('#item-content').value;
    } else if (type === 'video') {
        contentData = form.querySelector('#item-video-url').value;
    } else if (type === 'url' || type === 'link') {
        contentData = form.querySelector('#item-link-url').value;
    } else if (type === 'announcement') {
        contentData = form.querySelector('#announcement-content').value;
    }
    
    const formData = new FormData();
    formData.append('topic_id', topicId);
    formData.append('title', title);
    formData.append('content_type', type);
    formData.append('content_data', contentData);
    formData.append('display_order', 0);

    // Add quiz/assignment specific fields
    if (type === 'quiz') {
        const openTime = form.querySelector('#quiz-open-time');
        const closeTime = form.querySelector('#quiz-close-time');
        const timeLimit = form.querySelector('#quiz-time-limit');
        const maxAttempts = form.querySelector('#quiz-max-attempts');
        const gradingMethod = form.querySelector('#quiz-grading-method');
        if (openTime && openTime.value) formData.append('quiz-open-time', openTime.value);
        if (closeTime && closeTime.value) formData.append('quiz-close-time', closeTime.value);
        if (timeLimit) formData.append('quiz-time-limit', timeLimit.value || 0);
        if (maxAttempts) formData.append('quiz-max-attempts', maxAttempts.value || 1);
        if (gradingMethod) formData.append('quiz-grading-method', gradingMethod.value || 'last');
    } else if (type === 'assignment') {
        const openTime = form.querySelector('#assignment-open-time');
        const closeTime = form.querySelector('#assignment-close-time');
        if (openTime && openTime.value) formData.append('assignment-open-time', openTime.value);
        if (closeTime && closeTime.value) formData.append('assignment-close-time', closeTime.value);
    }

    if (type === 'video') {
        const videoFile = form.querySelector('#item-video-file');
        if (videoFile && videoFile.files && videoFile.files[0]) {
            formData.append('item-file', videoFile.files[0]);
        }
    } else if (type === 'file') {
        const fileInput = form.querySelector('#item-file');
        if (fileInput && fileInput.files && fileInput.files[0]) {
            formData.append('item-file', fileInput.files[0]);
        }
    }

    const endpoint = isEditingContent && contentId
        ? `${BASE_URL}/content/${contentId}/update`
        : `${BASE_URL}/content/create`;

    fetch(endpoint, { method: 'POST', body: formData })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                const message = isEditingContent && contentId ? 'Content updated successfully!' : 'Content created successfully!';
                showNotification(message, 'success');
                setTimeout(() => location.reload(), 1500);
            } else {
                showNotification('Error: ' + (data.error || 'Unknown error'), 'error');
            }
        })
        .catch(err => {
            showNotification('Error: ' + err.message, 'error');
        });
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        closeModal(event.target.id);
    }
}
</script>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
