/**
 * ============================================
 * AUTH.JS - Authentication Module
 * ============================================
 * Handles user authentication, session management,
 * and access control for the Enterprise Management System.
 */

const Auth = (function() {
    // Storage keys
    const STORAGE_KEY = 'ems_current_user';
    const SESSION_KEY = 'ems_session';

    // Configuration
    const config = {
        loginPage: 'login.html',
        homePage: 'home.html',
        sessionTimeout: 8 * 60 * 60 * 1000 // 8 hours in milliseconds
    };

    /**
     * ============================================
     * PRIVATE METHODS
     * ============================================
     */

    /**
     * Get the base path for redirects
     * Handles both root and subdirectory access
     */
    function getBasePath() {
        const path = window.location.pathname;
        const parts = path.split('/');
        // Remove filename and get directory
        parts.pop();
        // If we're in a subdirectory (like /projects/), go up one level
        if (parts.length > 1 && parts[parts.length - 1] !== '') {
            parts.pop();
        }
        return parts.join('/') + '/';
    }

    /**
     * Navigate to a page
     */
    function navigateTo(page) {
        const basePath = getBasePath();
        window.location.href = basePath + page;
    }

    /**
     * Check if current page is the login page
     */
    function isLoginPage() {
        const path = window.location.pathname.toLowerCase();
        return path.endsWith('login.html') || path.endsWith('index.html') || path === '/' || path.endsWith('/');
    }

    /**
     * Create session object
     */
    function createSession(user) {
        return {
            userId: user.id,
            loginTime: new Date().toISOString(),
            expiresAt: new Date(Date.now() + config.sessionTimeout).toISOString()
        };
    }

    /**
     * Check if session is valid
     */
    function isSessionValid() {
        const session = getSession();
        if (!session) return false;
        
        const expiresAt = new Date(session.expiresAt);
        return expiresAt > new Date();
    }

    /**
     * Get current session
     */
    function getSession() {
        try {
            const sessionStr = localStorage.getItem(SESSION_KEY);
            return sessionStr ? JSON.parse(sessionStr) : null;
        } catch (e) {
            console.error('Failed to parse session:', e);
            return null;
        }
    }

    /**
     * Save session to storage
     */
    function saveSession(session) {
        try {
            localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        } catch (e) {
            console.error('Failed to save session:', e);
        }
    }

    /**
     * Clear session from storage
     */
    function clearSession() {
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(STORAGE_KEY);
    }

    /**
     * Update user status in database
     */
    function updateUserStatus(userId, status) {
        if (window.db) {
            window.db.update('users', userId, { status });
        }
    }

    /**
     * ============================================
     * PUBLIC API
     * ============================================
     */

    return {
        /**
         * Attempt to log in with credentials
         * @param {string} username - The username
         * @param {string} password - The password
         * @returns {object} Result object with success boolean and message
         */
        login: function(username, password) {
            // Validate inputs
            if (!username || !password) {
                return {
                    success: false,
                    message: 'Please enter both username and password.'
                };
            }

            // Check if db is available
            if (!window.db) {
                console.error('Database not initialized');
                return {
                    success: false,
                    message: 'System error. Please try again later.'
                };
            }

            // Find user by username
            const user = window.db.getUserByUsername(username.trim().toLowerCase());

            if (!user) {
                return {
                    success: false,
                    message: 'Invalid username or password.'
                };
            }

            // Check password
            if (user.password !== password) {
                return {
                    success: false,
                    message: 'Invalid username or password.'
                };
            }

            // Create session
            const session = createSession(user);
            saveSession(session);

            // Store user data (without password)
            const userData = { ...user };
            delete userData.password;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));

            // Update user status to online
            updateUserStatus(user.id, 'online');

            return {
                success: true,
                message: 'Login successful!',
                user: userData
            };
        },

        /**
         * Log out the current user
         * @param {boolean} redirect - Whether to redirect to login page
         */
        logout: function(redirect = true) {
            const user = this.getCurrentUser();
            
            // Update user status to offline
            if (user) {
                updateUserStatus(user.id, 'offline');
            }

            // Clear session
            clearSession();

            // Redirect to login page
            if (redirect) {
                navigateTo(config.loginPage);
            }
        },

        /**
         * Check if user is authenticated
         * Redirects to login if not authenticated (unless on login page)
         * @returns {boolean} Whether user is authenticated
         */
        checkAuth: function() {
            const user = this.getCurrentUser();
            const validSession = isSessionValid();

            if (!user || !validSession) {
                // Clear any stale data
                clearSession();

                // Only redirect if not already on login page
                if (!isLoginPage()) {
                    navigateTo(config.loginPage);
                }
                return false;
            }

            // Refresh session expiry on activity
            const session = getSession();
            if (session) {
                session.expiresAt = new Date(Date.now() + config.sessionTimeout).toISOString();
                saveSession(session);
            }

            return true;
        },

        /**
         * Get the current logged-in user
         * @returns {object|null} User object or null
         */
        getCurrentUser: function() {
            try {
                const userStr = localStorage.getItem(STORAGE_KEY);
                return userStr ? JSON.parse(userStr) : null;
            } catch (e) {
                console.error('Failed to parse current user:', e);
                return null;
            }
        },

        /**
         * Check if current user has a specific role
         * @param {string|array} roles - Role or array of roles to check
         * @returns {boolean} Whether user has the role
         */
        hasRole: function(roles) {
            const user = this.getCurrentUser();
            if (!user) return false;

            const roleArray = Array.isArray(roles) ? roles : [roles];
            return roleArray.includes(user.role);
        },

        /**
         * Check if current user is an admin
         * @returns {boolean}
         */
        isAdmin: function() {
            return this.hasRole('admin');
        },

        /**
         * Check if current user is a manager
         * @returns {boolean}
         */
        isManager: function() {
            return this.hasRole(['admin', 'manager']);
        },

        /**
         * Protect a page - call this at the start of protected pages
         * @param {array} allowedRoles - Optional array of allowed roles
         * @returns {object|null} Current user if authenticated, null otherwise
         */
        protect: function(allowedRoles = null) {
            if (!this.checkAuth()) {
                return null;
            }

            if (allowedRoles && !this.hasRole(allowedRoles)) {
                // User doesn't have required role
                alert('You do not have permission to access this page.');
                navigateTo(config.homePage);
                return null;
            }

            return this.getCurrentUser();
        },

        /**
         * Update current user's profile
         * @param {object} updates - Fields to update
         * @returns {object|null} Updated user or null
         */
        updateProfile: function(updates) {
            const user = this.getCurrentUser();
            if (!user) return null;

            // Don't allow updating sensitive fields
            delete updates.id;
            delete updates.username;
            delete updates.password;
            delete updates.role;

            // Update in database
            const updatedUser = window.db.update('users', user.id, updates);
            
            if (updatedUser) {
                // Update local storage (without password)
                const userData = { ...updatedUser };
                delete userData.password;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
                return userData;
            }

            return null;
        },

        /**
         * Get user display info (for header/profile)
         * @returns {object} Display info
         */
        getUserDisplayInfo: function() {
            const user = this.getCurrentUser();
            if (!user) {
                return {
                    name: 'Guest',
                    avatar: '',
                    role: '',
                    initials: 'G'
                };
            }

            // Get initials from name
            const nameParts = user.name.split(' ');
            const initials = nameParts.map(p => p[0]).join('').toUpperCase().slice(0, 2);

            return {
                id: user.id,
                name: user.name,
                avatar: user.avatar || '',
                role: user.role,
                email: user.email,
                initials: initials
            };
        },

        /**
         * Redirect if already logged in (for login page)
         */
        redirectIfLoggedIn: function() {
            if (this.getCurrentUser() && isSessionValid()) {
                navigateTo(config.homePage);
                return true;
            }
            return false;
        },

        // Expose navigation helper
        navigateTo: navigateTo,

        // Expose config for customization
        config: config
    };
})();

// Make Auth globally available
window.Auth = Auth;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Auth;
}
