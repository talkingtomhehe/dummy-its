/**
 * ============================================
 * APP.JS - Main Application Entry Point
 * ============================================
 * This is the main entry point for the Enterprise Management System.
 * It initializes all modules and sets up the application.
 */

const App = (function() {
    /**
     * ============================================
     * CONFIGURATION
     * ============================================
     */
    const config = {
        debug: true,
        version: '1.0.0'
    };

    /**
     * ============================================
     * INITIALIZATION
     * ============================================
     */

    /**
     * Initialize the application
     */
    function init() {
        if (config.debug) {
            console.log(`Enterprise Management System v${config.version}`);
            console.log('Initializing application...');
        }

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', onDOMReady);
        } else {
            onDOMReady();
        }
    }

    /**
     * Called when DOM is ready
     */
    function onDOMReady() {
        // Determine current page type
        const pageType = getPageType();

        if (config.debug) {
            console.log('Page type:', pageType);
        }

        switch (pageType) {
            case 'login':
                initLoginPage();
                break;
            case 'home':
                initHomePage();
                break;
            case 'admin':
                initAdminPage();
                break;
            default:
                initProtectedPage();
                break;
        }
    }

    /**
     * Determine the type of page
     */
    function getPageType() {
        const path = window.location.pathname.toLowerCase();
        const filename = path.split('/').pop();

        if (filename === 'login.html' || filename === 'index.html' || filename === '') {
            return 'login';
        }
        if (filename === 'home.html') {
            return 'home';
        }
        if (filename === 'admin.html') {
            return 'admin';
        }
        return 'protected';
    }

    /**
     * ============================================
     * PAGE INITIALIZERS
     * ============================================
     */

    /**
     * Initialize login page
     */
    function initLoginPage() {
        if (config.debug) console.log('Initializing login page...');

        // Redirect if already logged in
        if (Auth.redirectIfLoggedIn()) {
            return;
        }

        // Setup login form
        setupLoginForm();
    }

    /**
     * Setup login form handling
     */
    function setupLoginForm() {
        const form = document.querySelector('form');
        const submitButton = document.querySelector('button[type="button"]');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');

        if (!form || !usernameInput || !passwordInput) {
            console.warn('Login form elements not found');
            return;
        }

        // Remove the existing <a> tag from the button if present
        if (submitButton) {
            const link = submitButton.querySelector('a');
            if (link) {
                submitButton.innerHTML = 'Sign In';
            }
        }

        // Handle form submission
        const handleLogin = (e) => {
            e.preventDefault();

            const username = usernameInput.value.trim();
            const password = passwordInput.value;

            // Show loading state
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '<span class="animate-pulse">Signing in...</span>';
            }

            // Attempt login
            const result = Auth.login(username, password);

            if (result.success) {
                // Show success briefly then redirect
                if (submitButton) {
                    submitButton.innerHTML = '<span class="text-green-200">✓ Success!</span>';
                }
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 500);
            } else {
                // Show error
                showLoginError(result.message);
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Sign In';
                }
            }
        };

        // Attach event listeners
        form.addEventListener('submit', handleLogin);
        
        if (submitButton) {
            submitButton.addEventListener('click', handleLogin);
        }

        // Allow Enter key to submit
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleLogin(e);
            }
        });

        // Pre-fill demo credentials hint
        addDemoCredentialsHint();
    }

    /**
     * Show login error message
     */
    function showLoginError(message) {
        // Check if error container already exists
        let errorDiv = document.getElementById('login-error');
        
        if (!errorDiv) {
            // Create error div
            errorDiv = document.createElement('div');
            errorDiv.id = 'login-error';
            errorDiv.className = 'bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2';
            
            // Insert before the form
            const form = document.querySelector('form');
            if (form) {
                form.insertBefore(errorDiv, form.firstChild);
            }
        }

        errorDiv.innerHTML = `
            <span class="material-symbols-outlined text-red-500">error</span>
            <span>${message}</span>
        `;
        errorDiv.classList.remove('hidden');

        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorDiv.classList.add('hidden');
        }, 5000);
    }

    /**
     * Add demo credentials hint
     */
    function addDemoCredentialsHint() {
        const form = document.querySelector('form');
        if (!form) return;

        // Check if hint already exists
        if (document.getElementById('demo-hint')) return;

        const hintDiv = document.createElement('div');
        hintDiv.id = 'demo-hint';
        hintDiv.className = 'bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-4 text-sm';
        hintDiv.innerHTML = `
            <p class="font-semibold mb-1">Demo Credentials:</p>
            <p><strong>Admin:</strong> admin / admin123</p>
            <p><strong>Manager:</strong> manager / manager123</p>
            <p><strong>Employee:</strong> marc / marc123</p>
        `;

        form.insertBefore(hintDiv, form.firstChild);
    }

    /**
     * Initialize home page
     */
    function initHomePage() {
        if (config.debug) console.log('Initializing home page...');

        // Check authentication
        if (!Auth.checkAuth()) {
            return;
        }

        // Initialize layout
        Layout.init();

        // Update welcome message if exists
        updateWelcomeMessage();
    }

    /**
     * Update welcome message with user name
     */
    function updateWelcomeMessage() {
        const user = Auth.getCurrentUser();
        if (!user) return;

        // Look for welcome/greeting elements
        const headings = document.querySelectorAll('h1, h2');
        headings.forEach(h => {
            if (h.textContent.includes('Welcome') || h.textContent.includes('Hello')) {
                h.textContent = h.textContent.replace(/Welcome|Hello/i, `Welcome, ${user.name.split(' ')[0]}`);
            }
        });
    }

    /**
     * Initialize admin page
     */
    function initAdminPage() {
        if (config.debug) console.log('Initializing admin page...');

        // Check authentication and admin role
        const user = Auth.protect(['admin']);
        if (!user) return;

        // Initialize layout
        Layout.init();

        // Update admin name in header
        updateAdminHeader(user);

        // Load admin statistics
        loadAdminStats();
    }

    /**
     * Update admin header with user info
     */
    function updateAdminHeader(user) {
        // Update name displays
        const nameEls = document.querySelectorAll('header p.font-bold, header .font-bold');
        nameEls.forEach(el => {
            if (el.textContent === 'Admin Name') {
                el.textContent = user.name;
            }
        });
    }

    /**
     * Load admin statistics
     */
    function loadAdminStats() {
        if (!window.db) return;

        // Get counts
        const userCount = db.users.length;
        const projectCount = db.projects.length;
        const taskCount = db.tasks.length;

        // Update stat cards if they exist
        const statCards = document.querySelectorAll('.text-2xl.font-bold');
        statCards.forEach(card => {
            const label = card.parentElement?.querySelector('p')?.textContent || '';
            if (label.includes('Total Users')) {
                card.textContent = userCount;
            }
        });
    }

    /**
     * Initialize protected pages
     */
    function initProtectedPage() {
        if (config.debug) console.log('Initializing protected page...');

        // Check authentication
        if (!Auth.checkAuth()) {
            return;
        }

        // Initialize layout
        Layout.init();

        // Initialize page-specific functionality
        initPageSpecificFeatures();
    }

    /**
     * Initialize page-specific features based on current page
     */
    function initPageSpecificFeatures() {
        const path = window.location.pathname.toLowerCase();

        if (path.includes('project')) {
            initProjectsModule();
        } else if (path.includes('task')) {
            initTasksModule();
        } else if (path.includes('chat') || path.includes('discuss')) {
            initDiscussModule();
        } else if (path.includes('position') || path.includes('employee')) {
            initPositionsModule();
        } else if (path.includes('announcement')) {
            initAnnouncementsModule();
        }
    }

    /**
     * ============================================
     * MODULE INITIALIZERS
     * ============================================
     */

    function initProjectsModule() {
        if (config.debug) console.log('Initializing Projects module...');
        // Projects-specific initialization can go here
    }

    function initTasksModule() {
        if (config.debug) console.log('Initializing Tasks module...');
        // Tasks-specific initialization can go here
    }

    function initDiscussModule() {
        if (config.debug) console.log('Initializing Discuss module...');
        // Chat-specific initialization can go here
    }

    function initPositionsModule() {
        if (config.debug) console.log('Initializing Positions module...');
        // Positions-specific initialization can go here
    }

    function initAnnouncementsModule() {
        if (config.debug) console.log('Initializing Announcements module...');
        // Announcements-specific initialization can go here
    }

    /**
     * ============================================
     * UTILITY FUNCTIONS
     * ============================================
     */

    /**
     * Format date for display
     */
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    /**
     * Format relative time (e.g., "2 hours ago")
     */
    function formatRelativeTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} mins ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays < 7) return `${diffDays} days ago`;
        return formatDate(dateString);
    }

    /**
     * ============================================
     * PUBLIC API
     * ============================================
     */

    return {
        init: init,
        config: config,
        formatDate: formatDate,
        formatRelativeTime: formatRelativeTime,
        
        // Expose module initializers for manual calling if needed
        initProjectsModule: initProjectsModule,
        initTasksModule: initTasksModule,
        initDiscussModule: initDiscussModule,
        initPositionsModule: initPositionsModule,
        initAnnouncementsModule: initAnnouncementsModule
    };
})();

// Make App globally available
window.App = App;

// Auto-initialize when script loads
App.init();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}
