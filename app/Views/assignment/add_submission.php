<?php 
$showHeader = true;
require_once __DIR__ . '/../layouts/header.php'; ?>

<div class="container">
    <main class="main">
        <h1 class="course-title">Nộp bài: <?= htmlspecialchars($assignment['title'] ?? 'Assignment') ?></h1>
        
        <?php if (!empty($errorMessage)): ?>
            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    showNotification('<?= addslashes($errorMessage) ?>', 'error');
                });
            </script>
        <?php endif; ?>

        <form id="submission-form" method="POST" action="<?= base_url('/assignment/' . $assignment['id'] . '/upload') ?>" enctype="multipart/form-data">
            <input type="hidden" name="existing_files" id="existing-files-input" value="">
            
            <div class="drop-zone-container">
                <input type="file" id="file-input" name="submission_file[]" accept=".pdf,.doc,.docx,.zip,.rar" multiple>
                
                <div class="drop-zone" id="drop-zone-box">
                    <div class="drop-zone-icon"><i data-feather="upload-cloud" style="width: 48px; height: 48px;"></i></div>
                    <div class="drop-zone-text">
                        Kéo và thả file của bạn vào đây
                        <small>Hoặc nhấp để chọn file (có thể chọn nhiều file)</small>
                    </div>
                </div>
                
                <div id="file-preview-list">
                    <?php 
                    if (isset($submission) && !empty($submission['submission_file'])):
                        $files = is_array($submission['submission_file']) ? $submission['submission_file'] : [$submission['submission_file']];
                        $originals = isset($submission['original_filenames']) && is_array($submission['original_filenames']) 
                            ? $submission['original_filenames'] 
                            : $files;
                        foreach ($files as $idx => $file):
                            $displayName = $originals[$idx] ?? $file;
                    ?>
                    <div class="file-preview-item" data-existing-file="<?= htmlspecialchars($file) ?>">
                        <i data-feather="file"></i>
                        <span><?= htmlspecialchars($displayName) ?></span>
                        <button type="button" class="button button-icon button-danger" onclick="removeExistingFile(this, '<?= htmlspecialchars($file, ENT_QUOTES) ?>')">
                            <i data-feather="x"></i>
                        </button>
                    </div>
                    <?php 
                        endforeach;
                    endif; 
                    ?>
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
const existingFilesInput = document.getElementById('existing-files-input');

// Track existing files that should be kept
let existingFiles = [];

// Initialize existing files from the DOM
document.querySelectorAll('[data-existing-file]').forEach(elem => {
    existingFiles.push(elem.getAttribute('data-existing-file'));
});
updateExistingFilesInput();

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
    addFilesToInput(files);
});

fileInput.addEventListener('change', (e) => {
    displayNewFiles();
});

function addFilesToInput(newFiles) {
    // Create a new DataTransfer to combine existing and new files
    const dt = new DataTransfer();
    
    // Add existing files from input (preserving previously selected files)
    if (fileInput.files) {
        Array.from(fileInput.files).forEach(file => dt.items.add(file));
    }
    
    // Add new files (these will be appended, not replace)
    Array.from(newFiles).forEach(file => dt.items.add(file));
    
    // Update the file input with combined files
    fileInput.files = dt.files;
    
    // Display all files
    displayNewFiles();
}

function displayNewFiles() {
    // Remove only the new file previews (not existing ones)
    const newFilePreviews = filePreviewList.querySelectorAll('.file-preview-item:not([data-existing-file])');
    newFilePreviews.forEach(elem => elem.remove());
    
    // Display new files from input
    Array.from(fileInput.files).forEach((file, index) => {
        const item = document.createElement('div');
        item.className = 'file-preview-item';
        item.setAttribute('data-new-file-index', index);
        item.innerHTML = `
            <i data-feather="file"></i>
            <span>${file.name}</span>
            <button type="button" class="button button-icon button-danger" onclick="removeNewFile(${index})">
                <i data-feather="x"></i>
            </button>
        `;
        filePreviewList.appendChild(item);
    });
    
    feather.replace();
}

function removeExistingFile(button, filename) {
    // Remove from existing files array
    existingFiles = existingFiles.filter(f => f !== filename);
    updateExistingFilesInput();
    
    // Remove the preview element
    button.closest('.file-preview-item').remove();
}

function removeNewFile(index) {
    // Create a new DataTransfer without the file at the specified index
    const dt = new DataTransfer();
    const files = Array.from(fileInput.files);
    
    files.forEach((file, i) => {
        if (i !== index) {
            dt.items.add(file);
        }
    });
    
    // Update the file input
    fileInput.files = dt.files;
    
    // Re-display files
    displayNewFiles();
}

function updateExistingFilesInput() {
    existingFilesInput.value = JSON.stringify(existingFiles);
}

feather.replace();
</script>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
