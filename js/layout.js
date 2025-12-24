/**
 * ============================================
 * LAYOUT.JS - Dynamic Layout System
 * ============================================
 * Handles dynamic injection of common UI elements
 * such as headers and sidebars across all pages.
 */

const Layout = (function() {
    /**
     * ============================================
     * CONFIGURATION
     * ============================================
     */
    const config = {
        // Pages that don't need layout (login, error pages, etc.)
        excludedPages: ['login.html', 'index.html'],
        
        // Navigation menu items
        mainApps: [
            { name: 'Projects', icon: 'assignment', href: 'projects/project.html' },
            { name: 'Tasks', icon: 'task_alt', href: 'tasks/my-task.html' },
            { name: 'Discuss', icon: 'forum', href: 'discuss/chat.html' },
            { name: 'Positions', icon: 'badge', href: 'positions/position-list.html' },
            { name: 'Announcements', icon: 'campaign', href: 'announcements/announcement.html' }
        ],

        // Admin sidebar items
        adminSidebar: [
            { name: 'Dashboard', icon: 'dashboard', href: 'admin.html', active: true },
            { name: 'User Management', icon: 'group', href: '#users' },
            { name: 'System Settings', icon: 'settings', href: '#settings' },
            { name: 'Audit Logs', icon: 'description', href: '#logs' },
            { name: 'Platform Config', icon: 'dns', href: '#config' }
        ]
    };

    /**
     * ============================================
     * UTILITY FUNCTIONS
     * ============================================
     */

    /**
     * Get current page name from URL
     */
    function getCurrentPage() {
        const path = window.location.pathname;
        const parts = path.split('/');
        return parts[parts.length - 1] || 'index.html';
    }

    /**
     * Get base path for links (handles subdirectories)
     */
    function getBasePath() {
        const path = window.location.pathname;
        const parts = path.split('/');
        parts.pop(); // Remove filename
        
        // Count directory depth
        const currentDir = parts[parts.length - 1];
        const knownSubdirs = ['projects', 'tasks', 'discuss', 'positions', 'announcements'];
        
        if (knownSubdirs.includes(currentDir)) {
            return '../';
        }
        return './';
    }

    /**
     * Check if current page matches href
     */
    function isActivePage(href) {
        const currentPath = window.location.pathname.toLowerCase();
        const hrefPath = href.toLowerCase();
        return currentPath.includes(hrefPath.replace('./', '').replace('../', ''));
    }

    /**
     * Check if page should have layout
     */
    function shouldHaveLayout() {
        const currentPage = getCurrentPage().toLowerCase();
        return !config.excludedPages.some(page => 
            currentPage === page.toLowerCase() || currentPage === ''
        );
    }

    /**
     * ============================================
     * HEADER TEMPLATES
     * ============================================
     */

    /**
     * Generate the global header HTML
     */
    function generateGlobalHeader(user) {
        const basePath = getBasePath();
        
        return `
        <header class="flex items-center justify-between whitespace-nowrap bg-primary px-8 py-2.5 shadow-sm sticky top-0 z-50" id="global-header">
            <div class="flex items-center gap-4">
                <a href="${basePath}home.html" class="flex items-center gap-2 text-white font-bold text-lg cursor-pointer hover:opacity-90 transition-opacity">
                    <span class="material-symbols-outlined !text-3xl">branding_watermark</span>
                    <span>Company Workspace</span>
                </a>
            </div>
            <div class="flex flex-1 justify-end gap-6 items-center">
                <div class="flex items-center gap-2">
                    <button aria-label="Chat" class="flex items-center justify-center rounded-lg size-10 hover:text-white text-white/80 transition-colors cursor-pointer" onclick="Layout.navigateTo('discuss/chat.html')">
                        <span class="material-symbols-outlined !text-[24px]">chat_bubble</span>
                    </button>
                    <button aria-label="Activities" class="flex items-center justify-center rounded-lg size-10 hover:text-white text-white/80 transition-colors cursor-pointer">
                        <span class="material-symbols-outlined !text-[24px]">schedule</span>
                    </button>
                </div>
                <div class="h-6 w-px bg-white/20"></div>
                <div class="flex items-center gap-4">
                    <div class="relative group cursor-pointer" id="user-menu-trigger">
                        <div class="bg-center bg-no-repeat bg-cover rounded-full size-9 border-2 border-white/30 group-hover:border-white transition-colors"
                             style='background-image: url("${user.avatar || ''}");'
                             title="${user.name}">
                            ${!user.avatar ? `<div class="w-full h-full flex items-center justify-center text-white font-bold">${user.initials}</div>` : ''}
                        </div>
                        <div class="absolute bottom-0 right-0 size-2.5 bg-green-400 border-2 border-primary rounded-full"></div>
                    </div>
                    <!-- User Dropdown Menu -->
                    <div id="user-dropdown" class="hidden absolute top-full right-4 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <div class="px-4 py-2 border-b border-gray-100">
                            <p class="text-sm font-semibold text-gray-900">${user.name}</p>
                            <p class="text-xs text-gray-500">${user.email || ''}</p>
                        </div>
                        <a href="${basePath}positions/profile-work-info.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <span class="material-symbols-outlined text-[18px] mr-2 align-middle">person</span>
                            My Profile
                        </a>
                        ${user.role === 'admin' ? `
                        <a href="${basePath}admin.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <span class="material-symbols-outlined text-[18px] mr-2 align-middle">admin_panel_settings</span>
                            Admin Panel
                        </a>
                        ` : ''}
                        <hr class="my-2 border-gray-100">
                        <button onclick="Auth.logout()" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                            <span class="material-symbols-outlined text-[18px] mr-2 align-middle">logout</span>
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </header>`;
    }

    /**
     * Generate module-specific header (for Projects, Tasks, etc.)
     */
    function generateModuleHeader(moduleName, navItems, user) {
        const basePath = getBasePath();
        
        return `
        <header class="bg-primary text-white flex items-center justify-between px-4 py-2 shrink-0 z-20" id="module-header">
            <div class="flex items-center gap-4">
                <a href="${basePath}home.html" class="text-white/80 hover:text-white p-1">
                    <span class="material-symbols-outlined text-[24px]">apps</span>
                </a>
                <span class="text-lg font-bold tracking-tight">${moduleName.toUpperCase()}</span>
                <nav class="hidden md:flex items-center gap-6 ml-4 text-sm font-medium text-white/80">
                    ${navItems.map((item, index) => `
                        <a class="${index === 0 ? 'text-white' : 'hover:text-white'}" href="${item.href}">${item.name}</a>
                    `).join('')}
                </nav>
            </div>
            <div class="flex items-center gap-6">
                <div class="flex items-center gap-3">
                    <button class="text-white/80 hover:text-white p-1 relative">
                        <span class="material-symbols-outlined text-[20px]">schedule</span>
                    </button>
                    <button class="text-white/80 hover:text-white p-1 relative">
                        <span class="material-symbols-outlined text-[20px]">chat_bubble</span>
                        <span class="absolute top-0 right-0 size-2 bg-[#E53835] rounded-full border border-primary"></span>
                    </button>
                    <div class="size-8 rounded-full bg-white/20 overflow-hidden ml-2 cursor-pointer border border-white/30 relative group" id="user-avatar-module">
                        ${user.avatar ? 
                            `<img class="w-full h-full object-cover" src="${user.avatar}" alt="${user.name}">` :
                            `<div class="w-full h-full flex items-center justify-center text-white font-bold text-sm">${user.initials}</div>`
                        }
                    </div>
                </div>
            </div>
        </header>`;
    }

    /**
     * Generate admin sidebar
     */
    function generateAdminSidebar(user) {
        return `
        <aside class="flex w-64 flex-col bg-primary h-full shrink-0 transition-all duration-300" id="admin-sidebar">
            <div class="flex items-center gap-3 px-6 py-6 border-b border-white/20">
                <h1 class="text-white text-lg font-bold leading-normal tracking-tight">Admin Dashboard</h1>
            </div>
            <nav class="flex flex-col gap-2 px-4 py-6 flex-1 overflow-y-auto">
                ${config.adminSidebar.map(item => `
                    <a class="flex items-center gap-3 px-3 py-3 rounded-lg ${item.active ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/5 hover:text-white'} transition-colors" href="${item.href}">
                        <span class="material-symbols-outlined text-[20px]">${item.icon}</span>
                        <span class="text-sm font-medium leading-normal">${item.name}</span>
                    </a>
                `).join('')}
            </nav>
            <div class="p-4 border-t border-white/20">
                <button onclick="Auth.logout()" class="flex w-full cursor-pointer items-center gap-3 px-3 py-3 rounded-lg text-white/80 hover:text-white transition-colors">
                    <span class="material-symbols-outlined text-[24px]">logout</span>
                    <span class="text-md font-bold leading-normal">Logout</span>
                </button>
            </div>
        </aside>`;
    }

    /**
     * ============================================
     * LAYOUT INJECTION
     * ============================================
     */

    /**
     * Update existing header with user data
     */
    function updateExistingHeader(user) {
        // Find user avatar elements and update them
        const avatarElements = document.querySelectorAll('[data-alt*="avatar"], [data-alt*="Avatar"], img[alt*="avatar"]');
        avatarElements.forEach(el => {
            if (user.avatar) {
                if (el.tagName === 'IMG') {
                    el.src = user.avatar;
                    el.alt = user.name;
                } else {
                    el.style.backgroundImage = `url("${user.avatar}")`;
                }
            }
        });

        // Find and update user name displays
        const nameElements = document.querySelectorAll('.user-name, [data-user-name]');
        nameElements.forEach(el => {
            el.textContent = user.name;
        });
    }

    /**
     * Add logout functionality to existing logout buttons
     */
    function bindLogoutButtons() {
        // Find buttons with logout text or icon
        const logoutButtons = document.querySelectorAll('button');
        logoutButtons.forEach(btn => {
            const text = btn.textContent.toLowerCase();
            if (text.includes('logout') || text.includes('sign out')) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    Auth.logout();
                });
            }
        });

        // Also check for logout links
        const logoutLinks = document.querySelectorAll('a[href*="logout"], a[href*="signout"]');
        logoutLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                Auth.logout();
            });
        });
    }

    /**
     * Highlight active navigation item
     */
    function highlightActiveNav() {
        const currentPath = window.location.pathname.toLowerCase();
        
        // Find all navigation links
        const navLinks = document.querySelectorAll('nav a, aside a');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && currentPath.includes(href.toLowerCase().replace('../', '').replace('./', ''))) {
                // Add active classes
                link.classList.add('text-white', 'bg-white/10');
                link.classList.remove('text-white/80');
            }
        });
    }

    /**
     * Add user dropdown toggle functionality
     */
    function setupUserDropdown() {
        const trigger = document.getElementById('user-menu-trigger');
        const dropdown = document.getElementById('user-dropdown');
        
        if (trigger && dropdown) {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('hidden');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                dropdown.classList.add('hidden');
            });
        }
    }

    /**
     * Make apps link to home
     */
    function setupAppsButton() {
        const appsButtons = document.querySelectorAll('[class*="apps"]');
        appsButtons.forEach(btn => {
            const icon = btn.querySelector('.material-symbols-outlined');
            if (icon && icon.textContent.trim() === 'apps') {
                const parent = btn.closest('button') || btn.closest('a') || btn;
                if (!parent.getAttribute('href')) {
                    parent.style.cursor = 'pointer';
                    parent.addEventListener('click', () => {
                        const basePath = getBasePath();
                        window.location.href = basePath + 'home.html';
                    });
                }
            }
        });
    }

    /**
     * ============================================
     * PUBLIC API
     * ============================================
     */

    return {
        /**
         * Initialize layout system
         * Call this on every page after DOM is loaded
         */
        init: function() {
            // Check if we're on an excluded page
            if (!shouldHaveLayout()) {
                return;
            }

            // Check authentication
            const user = Auth.getCurrentUser();
            if (!user) {
                return;
            }

            const userInfo = Auth.getUserDisplayInfo();

            // Update existing UI elements with user data
            this.updateUserElements(userInfo);

            // Setup event listeners
            bindLogoutButtons();
            highlightActiveNav();
            setupUserDropdown();
            setupAppsButton();

            console.log('Layout initialized for user:', userInfo.name);
        },

        /**
         * Update user-related UI elements
         */
        updateUserElements: function(user) {
            if (!user) {
                user = Auth.getUserDisplayInfo();
            }

            // Update avatar images
            document.querySelectorAll('[style*="background-image"]').forEach(el => {
                const style = el.getAttribute('style');
                const dataAlt = el.getAttribute('data-alt') || '';
                
                // Check if this looks like a user avatar element
                if (dataAlt.toLowerCase().includes('avatar') || 
                    dataAlt.toLowerCase().includes('user') ||
                    dataAlt.toLowerCase().includes('profile')) {
                    if (user.avatar) {
                        el.style.backgroundImage = `url("${user.avatar}")`;
                    }
                }
            });

            // Update avatar img elements
            document.querySelectorAll('img').forEach(img => {
                const alt = img.getAttribute('alt') || img.getAttribute('data-alt') || '';
                if (alt.toLowerCase().includes('avatar') || 
                    alt.toLowerCase().includes('user') ||
                    alt.toLowerCase().includes('profile')) {
                    if (user.avatar) {
                        img.src = user.avatar;
                        img.alt = user.name;
                    }
                }
            });
        },

        /**
         * Load full layout (header + sidebar if needed)
         * Use this for pages that need complete layout injection
         */
        loadLayout: function(containerId = 'app-container') {
            const user = Auth.protect();
            if (!user) return;

            const userInfo = Auth.getUserDisplayInfo();
            const container = document.getElementById(containerId);
            
            if (!container) {
                console.warn('Layout container not found:', containerId);
                this.init();
                return;
            }

            // Generate and inject header
            const header = generateGlobalHeader(userInfo);
            container.insertAdjacentHTML('afterbegin', header);

            // Setup functionality
            setupUserDropdown();
            bindLogoutButtons();
        },

        /**
         * Navigate to a page (helper function)
         */
        navigateTo: function(page) {
            const basePath = getBasePath();
            window.location.href = basePath + page;
        },

        /**
         * Get the base path
         */
        getBasePath: getBasePath,

        /**
         * Check if user is logged in and redirect if not
         */
        requireAuth: function() {
            return Auth.checkAuth();
        },

        /**
         * Dynamically inject content into a container
         */
        injectContent: function(containerId, html) {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = html;
            }
        },

        /**
         * Show loading state
         */
        showLoading: function(containerId) {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `
                    <div class="flex items-center justify-center h-64">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                `;
            }
        },

        /**
         * Show error message
         */
        showError: function(containerId, message) {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `
                    <div class="flex items-center justify-center h-64">
                        <div class="text-center">
                            <span class="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
                            <p class="text-gray-600">${message}</p>
                        </div>
                    </div>
                `;
            }
        },

        // Expose config for customization
        config: config
    };
})();

// Make Layout globally available
window.Layout = Layout;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Layout;
}
