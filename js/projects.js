/**
 * ============================================
 * PROJECTS.JS - Projects Module
 * ============================================
 * Handles all project-related functionality including:
 * - Dynamic rendering of project cards
 * - Status updates with dropdown
 * - Create project modal
 * - Navigation to tasks
 */

const Projects = (function() {
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
        const start = new Date(startDate);
        const end = new Date(endDate);
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
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
     * Calculate project statistics from tasks
     */
    function getProjectStats(projectId) {
        const tasks = db.getTasksByProject(projectId);
        const overdueTasks = tasks.filter(t => t.isOverdue);
        const completedTasks = tasks.filter(t => t.stage === 'Done');
        
        return {
            totalTasks: tasks.length,
            overdueTasks: overdueTasks.length,
            completedTasks: completedTasks.length,
            inProgressTasks: tasks.filter(t => t.stage === 'In Progress').length
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
     * RENDER FUNCTIONS
     * ============================================
     */

    /**
     * Generate HTML for a single project card
     * EXACT structure from the original projects.html
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

        return `
<div class="group bg-white border border-gray-200 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-primary/30 transition-all cursor-pointer flex flex-col h-full min-h-[180px]" data-project-id="${project.id}">
<div class="p-4 flex flex-col flex-1 gap-3 project-card-body">
<div class="flex justify-between items-start">
<h3 class="font-semibold text-[#101118] text-base leading-tight truncate pr-2">${project.name}</h3>
<div class="flex items-center shrink-0">
<button class="star-btn ${project.isFavorite ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'} transition-colors" data-project-id="${project.id}">
<span class="material-symbols-outlined text-[20px]${project.isFavorite ? ' fill-current' : ''}" style="${project.isFavorite ? "font-variation-settings: 'FILL' 1;" : ''}">star</span>
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
<div class="flex items-center gap-1 text-gray-500" title="Milestones">
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
<!-- Status Dropdown -->
<div class="status-dropdown hidden absolute right-0 bottom-full mb-2 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50" data-project-id="${project.id}">
<div class="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">Status</div>
<button class="status-option w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2" data-status="on_track">
<span class="size-3 rounded-full bg-green-500"></span>
<span>On Track</span>
</button>
<button class="status-option w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2" data-status="at_risk">
<span class="size-3 rounded-full bg-orange-500"></span>
<span>At Risk</span>
</button>
<button class="status-option w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2" data-status="off_track">
<span class="size-3 rounded-full bg-[#E53835]"></span>
<span>Off Track</span>
</button>
<button class="status-option w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2" data-status="delayed">
<span class="size-3 rounded-full bg-gray-400"></span>
<span>Delayed</span>
</button>
<button class="status-option w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2" data-status="completed">
<span class="size-3 rounded-full bg-blue-500"></span>
<span>Completed</span>
</button>
</div>
</div>
</div>
</div>
</div>
</div>`;
    }

    /**
     * Render all projects to the grid
     */
    function renderProjects(filterFn = null) {
        const grid = document.getElementById('projects-grid');
        if (!grid) {
            console.error('Projects grid container not found. Please add id="projects-grid" to the grid div.');
            return;
        }

        // Get projects (optionally filtered)
        let projects = db.projects;
        if (filterFn && typeof filterFn === 'function') {
            projects = projects.filter(filterFn);
        }

        // Sort by favorites first, then by name
        projects.sort((a, b) => {
            if (a.isFavorite && !b.isFavorite) return -1;
            if (!a.isFavorite && b.isFavorite) return 1;
            return a.name.localeCompare(b.name);
        });

        // Clear and render
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

        // Attach event listeners
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
     * EVENT HANDLERS
     * ============================================
     */

    /**
     * Attach event listeners to project cards
     */
    function attachCardEventListeners() {
        // Status dot click - toggle dropdown
        document.querySelectorAll('.status-dot').forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
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

        // Status option click - update status
        document.querySelectorAll('.status-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
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
                const projectId = parseInt(btn.dataset.projectId);
                toggleFavorite(projectId);
            });
        });

        // Card body click - navigate to tasks
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
                // TODO: Implement more options menu (Edit, Delete, Archive)
                console.log('More options for project:', btn.dataset.projectId);
            });
        });
    }

    /**
     * Update project status
     */
    function updateProjectStatus(projectId, newStatus) {
        const project = db.update('projects', projectId, { status: newStatus });
        if (project) {
            console.log(`Project ${projectId} status updated to: ${newStatus}`);
            // Re-render just the affected card for better performance
            renderProjects();
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
     * Navigate to tasks page with project ID
     */
    function navigateToTasks(projectId) {
        window.location.href = `project-task.html?projectId=${projectId}`;
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
        if (!searchInput) {
            // Try to find by placeholder
            const inputs = document.querySelectorAll('input[placeholder="Search..."]');
            if (inputs.length > 0) {
                inputs[0].id = 'project-search';
                setupSearchListener(inputs[0]);
            }
            return;
        }
        setupSearchListener(searchInput);
    }

    function setupSearchListener(input) {
        let debounceTimer;
        input.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const query = e.target.value.toLowerCase().trim();
                if (query === '') {
                    renderProjects();
                } else {
                    renderProjects(project => 
                        project.name.toLowerCase().includes(query) ||
                        (project.tags && project.tags.some(tag => tag.toLowerCase().includes(query)))
                    );
                }
            }, 300);
        });
    }

    /**
     * ============================================
     * CREATE PROJECT MODAL
     * ============================================
     */

    /**
     * Setup "New" button to open modal
     */
    function setupNewProjectButton() {
        const newBtn = document.getElementById('new-project-btn');
        if (!newBtn) {
            // Find the button by its text content
            const buttons = document.querySelectorAll('button');
            buttons.forEach(btn => {
                if (btn.textContent.includes('New') && btn.querySelector('.material-symbols-outlined')) {
                    btn.id = 'new-project-btn';
                    // Remove existing <a> wrapper if present
                    const parent = btn.parentElement;
                    if (parent.tagName === 'A') {
                        parent.replaceWith(btn);
                    }
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        openCreateModal();
                    });
                }
            });
            return;
        }
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openCreateModal();
        });
    }

    /**
     * Open create project modal
     */
    function openCreateModal() {
        let modal = document.getElementById('create-project-modal');
        
        if (!modal) {
            // Create modal if it doesn't exist
            modal = createModalElement();
            document.body.appendChild(modal);
            setupModalEvents(modal);
        }
        
        // Reset form
        const form = modal.querySelector('form');
        if (form) form.reset();
        
        // Show modal
        modal.classList.remove('hidden');
        modal.querySelector('input[name="name"]')?.focus();
    }

    /**
     * Close create project modal
     */
    function closeCreateModal() {
        const modal = document.getElementById('create-project-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    /**
     * Create modal HTML element
     */
    function createModalElement() {
        const modal = document.createElement('div');
        modal.id = 'create-project-modal';
        modal.className = 'hidden fixed inset-0 z-50 overflow-y-auto';
        modal.innerHTML = `
<!-- Backdrop -->
<div class="fixed inset-0 bg-black/50 transition-opacity modal-backdrop"></div>

<!-- Modal Content -->
<div class="flex min-h-full items-center justify-center p-4">
<div class="relative bg-white rounded-lg shadow-xl w-full max-w-lg transform transition-all">
<!-- Header -->
<div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
<h3 class="text-lg font-bold text-gray-900">Create New Project</h3>
<button type="button" class="modal-close text-gray-400 hover:text-gray-600 transition-colors">
<span class="material-symbols-outlined text-[24px]">close</span>
</button>
</div>

<!-- Form -->
<form id="create-project-form" class="p-6">
<div class="space-y-4">
<!-- Project Name -->
<div>
<label class="block text-sm font-medium text-gray-700 mb-1" for="project-name">
Project Name <span class="text-red-500">*</span>
</label>
<input type="text" name="name" id="project-name" required
class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
placeholder="Enter project name">
</div>

<!-- Manager -->
<div>
<label class="block text-sm font-medium text-gray-700 mb-1" for="project-manager">
Project Manager
</label>
<select name="managerId" id="project-manager"
class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm">
<option value="">Select a manager</option>
${db.users.filter(u => u.role === 'admin' || u.role === 'manager').map(u => 
    `<option value="${u.id}">${u.name}</option>`
).join('')}
</select>
</div>

<!-- Date Range -->
<div class="grid grid-cols-2 gap-4">
<div>
<label class="block text-sm font-medium text-gray-700 mb-1" for="project-start">
Start Date
</label>
<input type="date" name="startDate" id="project-start"
class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm">
</div>
<div>
<label class="block text-sm font-medium text-gray-700 mb-1" for="project-end">
End Date
</label>
<input type="date" name="endDate" id="project-end"
class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm">
</div>
</div>

<!-- Status -->
<div>
<label class="block text-sm font-medium text-gray-700 mb-1" for="project-status">
Initial Status
</label>
<select name="status" id="project-status"
class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm">
<option value="on_track">On Track</option>
<option value="at_risk">At Risk</option>
<option value="delayed">Delayed</option>
</select>
</div>

<!-- Tags -->
<div>
<label class="block text-sm font-medium text-gray-700 mb-1" for="project-tags">
Tags <span class="text-gray-400 font-normal">(comma-separated)</span>
</label>
<input type="text" name="tags" id="project-tags"
class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
placeholder="e.g., Marketing, Q4, High Priority">
</div>

<!-- Description -->
<div>
<label class="block text-sm font-medium text-gray-700 mb-1" for="project-description">
Description
</label>
<textarea name="description" id="project-description" rows="3"
class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm resize-none"
placeholder="Brief project description..."></textarea>
</div>
</div>

<!-- Error Message -->
<div id="create-project-error" class="hidden mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"></div>
</form>

<!-- Footer -->
<div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
<button type="button" class="modal-close px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
Cancel
</button>
<button type="submit" form="create-project-form"
class="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition-colors">
Create Project
</button>
</div>
</div>
</div>
        `;
        return modal;
    }

    /**
     * Setup modal event listeners
     */
    function setupModalEvents(modal) {
        // Close buttons
        modal.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', closeCreateModal);
        });

        // Backdrop click
        modal.querySelector('.modal-backdrop').addEventListener('click', closeCreateModal);

        // Form submission
        const form = modal.querySelector('#create-project-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handleCreateProject(form);
        });

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                closeCreateModal();
            }
        });
    }

    /**
     * Handle create project form submission
     */
    function handleCreateProject(form) {
        const formData = new FormData(form);
        const errorDiv = document.getElementById('create-project-error');
        
        // Get values
        const name = formData.get('name')?.trim();
        const managerId = formData.get('managerId') ? parseInt(formData.get('managerId')) : null;
        const startDate = formData.get('startDate') || new Date().toISOString().split('T')[0];
        const endDate = formData.get('endDate') || '';
        const status = formData.get('status') || 'on_track';
        const tagsStr = formData.get('tags')?.trim() || '';
        const description = formData.get('description')?.trim() || '';

        // Validation
        if (!name) {
            showError(errorDiv, 'Project name is required');
            return;
        }

        // Parse tags
        const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(t => t) : [];

        // Create project object
        const newProject = {
            name,
            managerId,
            status,
            color: config.statusColors[status],
            startDate,
            endDate: endDate || startDate,
            description,
            tags,
            milestones: { completed: 0, total: 0 },
            taskCount: 0,
            isFavorite: false
        };

        // Add to database
        const created = db.add('projects', newProject);
        
        if (created) {
            console.log('Project created:', created);
            closeCreateModal();
            renderProjects();
            
            // Show success toast (optional)
            showToast(`Project "${name}" created successfully!`);
        } else {
            showError(errorDiv, 'Failed to create project. Please try again.');
        }
    }

    /**
     * Show error message
     */
    function showError(element, message) {
        if (element) {
            element.textContent = message;
            element.classList.remove('hidden');
            setTimeout(() => element.classList.add('hidden'), 5000);
        }
    }

    /**
     * Show toast notification
     */
    function showToast(message) {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-slide-up';
        toast.innerHTML = `
            <span class="material-symbols-outlined text-green-400 text-[20px]">check_circle</span>
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
     * INITIALIZATION
     * ============================================
     */

    /**
     * Initialize the Projects module
     */
    function init() {
        console.log('Initializing Projects module...');

        // Check if we're on the projects page
        const grid = document.getElementById('projects-grid') || 
                     document.querySelector('main .grid');
        
        if (!grid) {
            console.warn('Projects grid not found');
            return;
        }

        // Add ID to grid if not present
        if (!grid.id) {
            grid.id = 'projects-grid';
        }

        // Render projects
        renderProjects();

        // Setup interactions
        setupSearch();
        setupNewProjectButton();

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.status-dropdown') && !e.target.closest('.status-dot')) {
                closeAllDropdowns();
            }
        });

        console.log('Projects module initialized');
    }

    /**
     * ============================================
     * PUBLIC API
     * ============================================
     */

    return {
        init,
        renderProjects,
        openCreateModal,
        closeCreateModal,
        updateProjectStatus,
        toggleFavorite,
        getProjectStats,
        
        // Expose for external use
        config
    };
})();

// Make available globally
window.Projects = Projects;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only init on projects pages
    if (window.location.pathname.includes('project.html') || 
        window.location.pathname.endsWith('projects/')) {
        Projects.init();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Projects;
}
