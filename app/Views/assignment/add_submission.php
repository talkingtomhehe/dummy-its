<?php require_once __DIR__ . '/../layouts/header.php'; ?>

<div class="container">
    <main class="main">
        <h1 class="course-title">Nộp bài: <?= htmlspecialchars($assignment['title'] ?? 'Assignment') ?></h1>
        
        <?php if (!empty($errorMessage)): ?>
            <div class="alert alert-danger" style="margin-bottom: 15px;">
                <?= htmlspecialchars($errorMessage) ?>
            </div>
        <?php endif; ?>

        <form id="submission-form" method="POST" action="<?= base_url('/assignment/' . $assignment['id'] . '/upload') ?>" enctype="multipart/form-data">
            <div class="drop-zone-container">
                <input type="file" id="file-input" name="submission_file" accept=".pdf,.doc,.docx,.zip,.rar">
                
                <div class="drop-zone" id="drop-zone-box">
                    <div class="drop-zone-icon"><i data-feather="upload-cloud" style="width: 48px; height: 48px;"></i></div>
                    <div class="drop-zone-text">
                        Kéo và thả file của bạn vào đây
                        <small>Hoặc nhấp để chọn file</small>
                    </div>
                </div>
                
                <div id="file-preview-list">
                    <?php if (isset($submission) && !empty($submission['submission_file'])): ?>
                    <div class="file-preview-item">
                        <i data-feather="file"></i>
                        <span><?= htmlspecialchars($submission['submission_file']) ?></span>
                        <button type="button" class="button button-icon button-danger" onclick="removeFile()">
                            <i data-feather="x"></i>
                        </button>
                    </div>
                    <?php endif; ?>
                </div>
            </div>

            <div class="form-actions" style="margin-top: 20px;">
                <button type="button" class="button button-secondary" onclick="window.history.back()">Hủy</button>
                <button type="submit" class="button button-primary">Lưu thay đổi</button>
            </div>
        </form>
    </main>
</div>

<script>
const dropZone = document.getElementById('drop-zone-box');
const fileInput = document.getElementById('file-input');
const filePreviewList = document.getElementById('file-preview-list');

dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--primary-color)';
    dropZone.style.backgroundColor = 'rgba(26, 188, 156, 0.05)';
});

dropZone.addEventListener('dragleave', () => {
    dropZone.style.borderColor = '#ddd';
    dropZone.style.backgroundColor = 'transparent';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#ddd';
    dropZone.style.backgroundColor = 'transparent';
    
    const files = e.dataTransfer.files;
    fileInput.files = files;
    displayFiles(files);
});

fileInput.addEventListener('change', (e) => {
    displayFiles(e.target.files);
});

function displayFiles(files) {
    filePreviewList.innerHTML = '';
    
    Array.from(files).forEach((file, index) => {
        const item = document.createElement('div');
        item.className = 'file-preview-item';
        item.innerHTML = `
            <i data-feather="file"></i>
            <span>${file.name}</span>
            <button type="button" class="button button-icon button-danger" onclick="removeFile()">
                <i data-feather="x"></i>
            </button>
        `;
        filePreviewList.appendChild(item);
    });
    
    feather.replace();
}

function removeFile() {
    fileInput.value = '';
    filePreviewList.innerHTML = '';
}

feather.replace();
</script>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
