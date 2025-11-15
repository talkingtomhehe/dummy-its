/**
 * Main JavaScript for ITS Application
 * Handles avatar dropdown, navigation, and common interactions
 */

// Initialize Feather icons when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Replace feather icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    
    // Avatar dropdown functionality
    const avatarBtn = document.getElementById('avatar-btn');
    const avatarDropdown = document.getElementById('avatar-dropdown');
    
    if (avatarBtn && avatarDropdown) {
        avatarBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            avatarDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            avatarDropdown.classList.remove('show');
        });
        
        // Prevent dropdown from closing when clicking inside it
        avatarDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Notification button (placeholder)
    const notificationBtn = document.getElementById('notification-btn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            console.log('Notifications clicked');
            // TODO: Implement notification functionality
        });
    }
    
    // Editing toggle for instructors
    const editingToggle = document.getElementById('editing-toggle');
    if (editingToggle) {
        editingToggle.addEventListener('change', function() {
            const isEditing = this.checked;
            console.log('Editing mode:', isEditing);
            
            // Toggle editing mode UI
            document.body.classList.toggle('editing-mode', isEditing);
            
            // Show/hide editing controls
            const editControls = document.querySelectorAll('.edit-controls, .item-controls');
            editControls.forEach(control => {
                control.style.display = isEditing ? 'flex' : 'none';
            });
        });
    }
});

/**
 * Navigate to a specific page/route
 * @param {string} route - The route to navigate to (without BASE_URL prefix)
 */
function navigateTo(route) {
    // Get BASE_URL from a data attribute or default to '/its'
    const baseUrl = document.querySelector('body').dataset.baseUrl || '/its';
    window.location.href = baseUrl + '/' + route;
}

/**
 * Confirm before performing destructive action
 * @param {string} message - Confirmation message
 * @returns {boolean}
 */
function confirmAction(message) {
    return confirm(message || 'Are you sure you want to perform this action?');
}

/**
 * Show a temporary notification message
 * @param {string} message - The message to display
 * @param {string} type - Type of notification (success, error, info, warning)
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        padding: 15px 20px;
        background-color: ${type === 'success' ? '#28a745' : type === 'error' ? '#d9534f' : type === 'warning' ? '#ffc107' : '#17a2b8'};
        color: white;
        border-radius: 6px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
