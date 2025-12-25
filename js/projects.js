/**
 * ============================================
 * PROJECTS.JS - Projects Module
 * ============================================
 * Handles all project-related functionality including:
 * - Dynamic rendering of project cards (TASK 1)
 * - Status updates with dropdown (TASK 2)
 * - Create project navigation & handling (TASK 3)
 * - Card interactions & navigation
 */

const Projects = (function() {
    'use strict';

    /**
     * ============================================
     * CONFIGURATION
     * ============================================
     */
    const config = {
        // Status colors mapping
        statusColors: {
            'on_track': 'bg-green-500',
            'at_risk': 'bg-orange-500',
            'off_track': 'bg-[#E53835]',
            'delayed': 'bg-gray-400',
            'completed': 'bg-blue-500'
        },
        // Status labels for dropdown
        statusLabels: {
            'on_track': 'On Track',
            'at_risk': 'At Risk',
            'off_track': 'Off Track',
            'delayed': 'Delayed',
            'completed': 'Completed'
        },
        // Tag color schemes (for dynamic tag styling)
        tagColors: [
            { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
            { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200' },
            { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-200' },
            { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
            { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
            { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
            { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
            { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
            { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
            { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' }
        ]
    };

    // Track currently open dropdown
    let activeDropdownId = null;

    /**
     * ============================================
     * HELPER FUNCTIONS
     * ============================================
     */

    /**
     * Get status color class
     */
    function getStatusColor(status) {
        return config.statusColors[status] || config.statusColors['delayed'];
    }

    /**
     * Get status label
     */
    function getStatusLabel(status) {
        return config.statusLabels[status] || 'Unknown';
    }

    /**
     * Get tag color based on tag name (consistent coloring)
     */
    function getTagColor(tagName) {
        // Simple hash function to get consistent color for same tag
        let hash = 0;
        for (let i = 0; i < tagName.length; i++) {
            hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % config.tagColors.length;
        return config.tagColors[index];
    }

    /**
     * Format date range for display
     */
    function formatDateRange(startDate, endDate) {
        if (!startDate) return '';
        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : null;
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        
        if (!end) {
            return start.toLocaleDateString('en-US', options);
        }
        return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', options)}`;
    }

    /**
     * Get manager name by ID
     */
    function getManagerName(managerId) {
        if (!managerId) return 'Unassigned';
        const user = db.getById('users', managerId);
        return user ? user.name : 'Unknown';
    }

    /**
     * Get manager avatar by ID
     */
    function getManagerAvatar(managerId) {
        if (!managerId) return '';
        const user = db.getById('users', managerId);
        return user ? user.avatar : '';
    }

    /**
     * TASK 1: Calculate project statistics from tasks
     * Queries db.tasks to count:
     * - Total tasks linked to this project ID
     * - Overdue tasks (for Flag icon count)
     */
    function getProjectStats(projectId) {
        const tasks = db.getTasksByProject(projectId);
        const now = new Date();
        
        // Calculate overdue tasks
        const overdueTasks = tasks.filter(t => {
            if (t.stage === 'Done') return false;
            const deadline = new Date(t.deadline);
            return deadline < now;
        });
        
        const completedTasks = tasks.filter(t => t.stage === 'Done');
        const inProgressTasks = tasks.filter(t => t.stage === 'In Progress');
        const newTasks = tasks.filter(t => t.stage === 'New');
        
        return {
            totalTasks: tasks.length,
            overdueTasks: overdueTasks.length,
            completedTasks: completedTasks.length,
            inProgressTasks: inProgressTasks.length,
            newTasks: newTasks.length
        };
    }

    /**
     * Close all open dropdowns
     */
    function closeAllDropdowns() {
        document.querySelectorAll('.status-dropdown').forEach(dropdown => {
            dropdown.classList.add('hidden');
        });
        activeDropdownId = null;
    }

    /**
     * ============================================
     * RENDER FUNCTIONS (TASK 1)
     * ============================================
     */

    /**
     * Generate HTML for a single project card
     * EXACT structure from the original project.html
     * Maps: project.name, project.manager, project.color (status dot), calculated stats
     */
    function generateProjectCardHTML(project) {
        const stats = getProjectStats(project.id);
        const managerName = getManagerName(project.managerId);
        const managerAvatar = getManagerAvatar(project.managerId);
        const statusColorClass = getStatusColor(project.status);
        const dateRange = formatDateRange(project.startDate, project.endDate);
        
        // Generate tags HTML
        const tagsHTML = (project.tags || []).map(tag => {
            const colors = getTagColor(tag);
            return `<span class="px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} text-xs font-medium border ${colors.border}">${tag}</span>`;
        }).join('');

        // Milestones display
        const milestones = project.milestones || { completed: 0, total: 0 };

        // Star icon styling based on favorite status
        const starClass = project.isFavorite ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400';
        const starStyle = project.isFavorite ? "font-variation-settings: 'FILL' 1;" : '';
        const starFillClass = project.isFavorite ? ' fill-current' : '';

        return `
<div class="group bg-white border border-gray-200 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-primary/30 transition-all cursor-pointer flex flex-col h-full min-h-[180px]" data-project-id="${project.id}">
    <div class="p-4 flex flex-col flex-1 gap-3 project-card-body">
        <div class="flex justify-between items-start">
            <h3 class="font-semibold text-[#101118] text-base leading-tight truncate pr-2">${project.name}</h3>
            <div class="flex items-center shrink-0">
                <button class="star-btn ${starClass} transition-colors" data-project-id="${project.id}">
                    <span class="material-symbols-outlined text-[20px]${starFillClass}" style="${starStyle}">star</span>
                </button>
                <button class="text-gray-400 hover:text-gray-600 ml-1 opacity-80 group-hover:opacity-100 transition-opacity more-btn" data-project-id="${project.id}">
                    <span class="material-symbols-outlined text-[20px]">more_vert</span>
                </button>
            </div>
        </div>
        <div class="text-sm text-gray-500">
            <div class="flex items-center gap-1 mb-1">
                <span class="text-xs font-medium uppercase tracking-wide text-gray-400">Manager:</span>
                <span class="text-gray-700">${managerName}</span>
            </div>
            <div class="text-xs text-gray-400">${dateRange}</div>
        </div>
        <div class="flex flex-wrap gap-1.5 mt-auto pt-2">
            ${tagsHTML}
        </div>
    </div>
    <div class="px-4 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-100 rounded-b-lg">
        <span class="text-xs font-semibold text-gray-600 bg-gray-300 px-2 py-0.5 rounded">${stats.totalTasks} Task${stats.totalTasks !== 1 ? 's' : ''}</span>
        <div class="flex items-center gap-3">
            <div class="flex items-center gap-1 ${stats.overdueTasks > 0 ? 'text-red-500' : 'text-gray-500'}" title="${stats.overdueTasks} overdue tasks">
                <span class="material-symbols-outlined text-[16px]">flag</span>
                <span class="text-xs font-medium">${milestones.completed}/${milestones.total}</span>
            </div>
            <div class="flex items-center gap-2">
                <div class="relative size-7">
                    ${managerAvatar ? 
                        `<img class="w-full h-full rounded-full object-cover border border-white shadow-sm" alt="${managerName}" src="${managerAvatar}"/>` :
                        `<div class="w-full h-full rounded-full bg-primary/20 border border-white shadow-sm flex items-center justify-center text-primary text-xs font-bold">${managerName.charAt(0)}</div>`
                    }
                </div>
                <div class="relative">
                    <button class="status-dot size-7 rounded-full ${statusColorClass} border border-white shadow-sm cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-gray-300 transition-all" title="Click to change status" data-project-id="${project.id}">
                    </button>
                    <!-- Status Dropdown (TASK 2) -->
                    <div class="status-dropdown hidden absolute right-0 bottom-full mb-2 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50" data-project-id="${project.id}">
                        <div class="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">Status</div>
                        ${Object.entries(config.statusColors).map(([key, colorClass]) => `
                            <button class="status-option w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${project.status === key ? 'bg-gray-50 font-medium' : ''}" data-status="${key}">
                                <span class="size-3 rounded-full ${colorClass}"></span>
                                <span>${config.statusLabels[key]}</span>
                                ${project.status === key ? '<span class="material-symbols-outlined text-[16px] ml-auto text-green-500">check</span>' : ''}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`;
    }

    /**
     * TASK 1: Main render function - initProjectDashboard()
     * Fetches data from db.projects, calculates stats, renders grid
     */
    function renderProjects(filterFn = null) {
        const grid = document.getElementById('projects-grid');
        if (!grid) {
            console.error('Projects grid container not found. Expected element with id="projects-grid".');
            return;
        }

        // Get projects from database (reads from localStorage via db)
        let projects = db.getAll('projects');
        
        // Apply filter if provided
        if (filterFn && typeof filterFn === 'function') {
            projects = projects.filter(filterFn);
        }

        // Sort by favorites first, then by name
        projects.sort((a, b) => {
            if (a.isFavorite && !b.isFavorite) return -1;
            if (!a.isFavorite && b.isFavorite) return 1;
            return a.name.localeCompare(b.name);
        });

        // Clear existing content and render
        grid.innerHTML = '';
        
        if (projects.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full flex flex-col items-center justify-center py-16 text-gray-500">
                    <span class="material-symbols-outlined text-6xl mb-4 text-gray-300">folder_off</span>
                    <p class="text-lg font-medium">No projects found</p>
                    <p class="text-sm">Create a new project to get started</p>
                </div>
            `;
            return;
        }

        // Render each project card
        projects.forEach(project => {
            grid.insertAdjacentHTML('beforeend', generateProjectCardHTML(project));
        });

        // Update pagination info
        updatePaginationInfo(projects.length);

        // Attach event listeners (TASK 2)
        attachCardEventListeners();
    }

    /**
     * Update pagination display
     */
    function updatePaginationInfo(count) {
        const paginationEl = document.querySelector('.font-medium.mr-2');
        if (paginationEl) {
            paginationEl.innerHTML = `1-${count} <span class="text-gray-500 font-normal">/ ${count}</span>`;
        }
    }

    /**
     * ============================================
     * EVENT HANDLERS (TASK 2)
     * ============================================
     */

    /**
     * Attach event listeners to project cards
     */
    function attachCardEventListeners() {
        // TASK 2: Status dot click - toggle dropdown
        document.querySelectorAll('.status-dot').forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                const projectId = parseInt(dot.dataset.projectId);
                const dropdown = dot.parentElement.querySelector('.status-dropdown');
                
                if (activeDropdownId === projectId) {
                    closeAllDropdowns();
                } else {
                    closeAllDropdowns();
                    dropdown.classList.remove('hidden');
                    activeDropdownId = projectId;
                }
            });
        });

        // TASK 2: Status option click - update status in db and re-render
        document.querySelectorAll('.status-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                const dropdown = option.closest('.status-dropdown');
                const projectId = parseInt(dropdown.dataset.projectId);
                const newStatus = option.dataset.status;
                
                updateProjectStatus(projectId, newStatus);
                closeAllDropdowns();
            });
        });

        // Star/favorite button
        document.querySelectorAll('.star-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                const projectId = parseInt(btn.dataset.projectId);
                toggleFavorite(projectId);
            });
        });

        // TASK 2: Card body click - navigate to project-task.html?id={projectId}
        document.querySelectorAll('.project-card-body').forEach(body => {
            body.addEventListener('click', (e) => {
                // Don't navigate if clicking on buttons
                if (e.target.closest('button')) return;
                
                const card = body.closest('[data-project-id]');
                const projectId = card.dataset.projectId;
                navigateToTasks(projectId);
            });
        });

        // More button (placeholder for future menu)
        document.querySelectorAll('.more-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                // TODO: Implement more options menu (Edit, Delete, Archive)
                console.log('More options for project:', btn.dataset.projectId);
            });
        });
    }

    /**
     * TASK 2: Update project status
     * Updates db.projects, saves to LocalStorage, re-renders dot color immediately
     */
    function updateProjectStatus(projectId, newStatus) {
        const project = db.update('projects', projectId, { status: newStatus });
        if (project) {
            console.log(`Project ${projectId} status updated to: ${newStatus}`);
            // Re-render to reflect change immediately
            renderProjects();
            // Show feedback toast
            showToast(`Status updated to "${config.statusLabels[newStatus]}"`);
        }
    }

    /**
     * Toggle project favorite status
     */
    function toggleFavorite(projectId) {
        const project = db.getById('projects', projectId);
        if (project) {
            db.update('projects', projectId, { isFavorite: !project.isFavorite });
            renderProjects();
        }
    }

    /**
     * TASK 2: Navigate to tasks page with project ID
     * Redirects to projects/project-task.html?id={projectId}
     */
    function navigateToTasks(projectId) {
        window.location.href = `project-task.html?id=${projectId}`;
    }

    /**
     * ============================================
     * SEARCH FUNCTIONALITY
     * ============================================
     */

    /**
     * Setup search functionality
     */
    function setupSearch() {
        const searchInput = document.getElementById('project-search');
        if (!searchInput) return;
        
        let debounceTimer;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const query = e.target.value.toLowerCase().trim();
                if (query === '') {
                    renderProjects();
                } else {
                    renderProjects(project => 
                        project.name.toLowerCase().includes(query) ||
                        (project.tags && project.tags.some(tag => tag.toLowerCase().includes(query))) ||
                        getManagerName(project.managerId).toLowerCase().includes(query)
                    );
                }
            }, 300);
        });
    }

    /**
     * ============================================
     * CREATE PROJECT (TASK 3)
     * ============================================
     */

    /**
     * TASK 3: Setup "New" button to navigate to create-project.html
     */
    function setupNewProjectButton() {
        const newBtn = document.getElementById('new-project-btn');
        if (!newBtn) return;
        
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Navigate to create-project.html
            window.location.href = 'create-project.html';
        });
    }

    /**
     * TASK 3: Handle create project form submission
     * Called from create-project.html
     */
    function handleCreateProject(formData) {
        const name = formData.name?.trim();
        
        if (!name) {
            showToast('Project name is required', 'error');
            return null;
        }

        // Parse tags if provided (handle both string and array)
        let tags = [];
        if (formData.tags) {
            if (Array.isArray(formData.tags)) {
                tags = formData.tags;
            } else if (typeof formData.tags === 'string') {
                tags = formData.tags.split(',').map(t => t.trim()).filter(t => t);
            }
        }

        // Create project object
        const newProject = {
            name: name,
            managerId: formData.managerId ? parseInt(formData.managerId) : null,
            status: formData.status || 'on_track',
            startDate: formData.startDate || new Date().toISOString().split('T')[0],
            endDate: formData.endDate || '',
            description: formData.description || '',
            tags: tags,
            milestones: formData.milestones || { completed: 0, total: 0 },
            isFavorite: formData.isFavorite || false
        };

        // Add to database (saves to localStorage)
        const created = db.add('projects', newProject);
        
        if (created) {
            console.log('Project created:', created);
            showToast(`Project "${name}" created successfully!`);
            return created;
        }
        
        return null;
    }

    /**
     * Show toast notification
     */
    function showToast(message, type = 'success') {
        // Remove existing toast
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) existingToast.remove();

        const bgColor = type === 'error' ? 'bg-red-500' : 'bg-gray-900';
        const icon = type === 'error' ? 'error' : 'check_circle';
        const iconColor = type === 'error' ? 'text-white' : 'text-green-400';

        const toast = document.createElement('div');
        toast.className = `toast-notification fixed bottom-4 right-4 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-slide-up`;
        toast.innerHTML = `
            <span class="material-symbols-outlined ${iconColor} text-[20px]">${icon}</span>
            <span class="text-sm">${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /**
     * ============================================
     * INITIALIZATION (TASK 1: initProjectDashboard)
     * ============================================
     */

    /**
     * Initialize the Projects Dashboard
     * This is the main entry point - runs on projects/project.html
     */
    function initProjectDashboard() {
        console.log('Initializing Projects Dashboard...');

        // Check if we're on the projects page
        const grid = document.getElementById('projects-grid');
        if (!grid) {
            console.warn('Projects grid not found - not on projects page');
            return;
        }

        // TASK 1: Fetch data and render projects
        renderProjects();

        // Setup search
        setupSearch();

        // TASK 3: Setup New button navigation
        setupNewProjectButton();

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.status-dropdown') && !e.target.closest('.status-dot')) {
                closeAllDropdowns();
            }
        });

        console.log('Projects Dashboard initialized successfully');
    }

    /**
     * ============================================
     * PUBLIC API
     * ============================================
     */

    return {
        // Main initialization
        init: initProjectDashboard,
        initProjectDashboard,
        
        // Rendering
        renderProjects,
        
        // Actions
        updateProjectStatus,
        toggleFavorite,
        navigateToTasks,
        handleCreateProject,
        
        // Stats
        getProjectStats,
        
        // Utilities
        showToast,
        
        // Config (for external use)
        config
    };
})();

// Make available globally
window.Projects = Projects;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only init on main projects page (project.html)
    const path = window.location.pathname;
    if (path.includes('project.html') && !path.includes('create-project') && !path.includes('project-task') && !path.includes('project-status')) {
        Projects.initProjectDashboard();
    }
});
