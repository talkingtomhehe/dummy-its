/**
 * ============================================
 * PROJECT-TASKS.JS - Task Kanban Board Module
 * ============================================
 * Handles task rendering, status updates, and creation
 * for a specific project's task board.
 * 
 * Target: projects/project-task.html
 */

const ProjectTasks = (function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    
    // Task stages for Kanban columns
    const STAGES = ['New', 'In Progress', 'Done'];
    
    // Status configuration with colors and labels
    const STATUS_CONFIG = {
        'on_track': { 
            color: 'bg-green-500', 
            ring: 'ring-green-200', 
            label: 'On Track',
            hex: '#22C55E'
        },
        'at_risk': { 
            color: 'bg-orange-500', 
            ring: 'ring-orange-200', 
            label: 'At Risk',
            hex: '#F97316'
        },
        'off_track': { 
            color: 'bg-[#E53835]', 
            ring: 'ring-red-200', 
            label: 'Off Track',
            hex: '#E53835'
        },
        'on_hold': { 
            color: 'bg-gray-400', 
            ring: 'ring-gray-200', 
            label: 'On Hold',
            hex: '#9CA3AF'
        },
        'done': { 
            color: 'bg-[#0175C8]', 
            ring: 'ring-blue-200', 
            label: 'Done',
            hex: '#0175C8'
        }
    };

    // Tag color palette
    const TAG_COLORS = [
        { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
        { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
        { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
        { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
        { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200' },
        { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
        { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-200' },
        { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' }
    ];

    // Current project ID
    let currentProjectId = null;
    let currentProject = null;

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================

    /**
     * Get consistent tag color based on tag name
     */
    function getTagColor(tag) {
        let hash = 0;
        for (let i = 0; i < tag.length; i++) {
            hash = tag.charCodeAt(i) + ((hash << 5) - hash);
        }
        return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
    }

    /**
     * Calculate days difference from deadline
     * Returns negative for overdue, positive for future
     */
    function getDaysFromDeadline(deadline) {
        if (!deadline) return null;
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const deadlineDate = new Date(deadline);
        deadlineDate.setHours(0, 0, 0, 0);
        const diffTime = deadlineDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    /**
     * Format deadline display text
     */
    function formatDeadlineText(deadline) {
        const days = getDaysFromDeadline(deadline);
        if (days === null) return '';
        
        if (days < 0) {
            const absDays = Math.abs(days);
            return `${absDays} day${absDays !== 1 ? 's' : ''} ago`;
        } else if (days === 0) {
            return 'Today';
        } else if (days === 1) {
            return 'Tomorrow';
        } else {
            return `In ${days} days`;
        }
    }

    /**
     * Get user by ID from database
     */
    function getUser(userId) {
        return db.getById('users', userId);
    }

    /**
     * Get task status key from statusColor hex
     */
    function getStatusKeyFromColor(hexColor) {
        if (!hexColor) return 'on_track';
        
        for (const [key, config] of Object.entries(STATUS_CONFIG)) {
            if (config.hex === hexColor || config.hex.toLowerCase() === hexColor.toLowerCase()) {
                return key;
            }
        }
        // Try to match common colors
        const colorMap = {
            '#22C55E': 'on_track',
            '#10B981': 'on_track',
            '#F97316': 'at_risk',
            '#EF4444': 'off_track',
            '#E53835': 'off_track',
            '#9CA3AF': 'on_hold',
            '#6B7280': 'on_hold',
            '#0175C8': 'done',
            '#3B82F6': 'on_track'
        };
        return colorMap[hexColor] || 'on_track';
    }

    // ============================================
    // TASK 1: DYNAMIC KANBAN RENDERING
    // ============================================

    /**
     * Initialize the Task Board
     * Main entry point - called on page load
     */
    function initTaskBoard() {
        console.log('Initializing Task Board...');

        // 1. Parse URL to get project ID
        const urlParams = new URLSearchParams(window.location.search);
        currentProjectId = urlParams.get('id') || urlParams.get('projectId');

        if (!currentProjectId) {
            console.error('No project ID provided in URL');
            showToast('No project selected. Please select a project first.', 'error');
            return;
        }

        currentProjectId = parseInt(currentProjectId);
        console.log('Project ID:', currentProjectId);

        // 2. Fetch project details
        currentProject = db.getById('projects', currentProjectId);
        
        if (!currentProject) {
            console.error('Project not found:', currentProjectId);
            showToast('Project not found.', 'error');
            return;
        }

        console.log('Project loaded:', currentProject.name);

        // 3. Update page context (breadcrumbs, title)
        updatePageContext();

        // 4. Render task columns
        renderTaskBoard();

        // 5. Setup event listeners
        setupEventListeners();

        console.log('Task Board initialized successfully');
    }

    /**
     * Update breadcrumbs and page title with project name
     */
    function updatePageContext() {
        // Update page title
        document.title = `${currentProject.name} - Tasks`;

        // Update breadcrumb - find the project name link
        const breadcrumbNav = document.querySelector('nav.hidden.sm\\:flex ol');
        if (breadcrumbNav) {
            const projectLink = breadcrumbNav.querySelector('li:first-child a');
            if (projectLink) {
                projectLink.textContent = currentProject.name;
                projectLink.href = 'project.html';
            }
        }
    }

    /**
     * Render the complete task board with all columns
     */
    function renderTaskBoard() {
        // Get all tasks for this project
        const tasks = db.getTasksByProject(currentProjectId);
        console.log(`Found ${tasks.length} tasks for project ${currentProjectId}`);

        // Group tasks by stage
        const tasksByStage = {
            'New': [],
            'In Progress': [],
            'Done': []
        };

        tasks.forEach(task => {
            const stage = task.stage || 'New';
            if (tasksByStage[stage]) {
                tasksByStage[stage].push(task);
            } else {
                tasksByStage['New'].push(task); // Default to New
            }
        });

        // Find all column containers
        const columns = document.querySelectorAll('main .flex.h-full > .flex.flex-col.w-\\[300px\\]');
        
        // Render each stage column
        STAGES.forEach((stage, index) => {
            if (columns[index]) {
                renderColumn(columns[index], stage, tasksByStage[stage]);
            }
        });

        // Update progress bars
        updateProgressBars(tasksByStage, tasks.length);
    }

    /**
     * Render a single column with tasks
     */
    function renderColumn(columnEl, stage, tasks) {
        // Find the cards container (the scrollable div with tasks)
        const cardsContainer = columnEl.querySelector('.flex-1.flex.flex-col.gap-3');
        if (!cardsContainer) return;

        // Clear existing cards
        cardsContainer.innerHTML = '';

        // Render each task card
        tasks.forEach(task => {
            const cardHTML = generateTaskCardHTML(task);
            cardsContainer.insertAdjacentHTML('beforeend', cardHTML);
        });

        // If no tasks, show empty state
        if (tasks.length === 0) {
            cardsContainer.innerHTML = `
                <div class="flex flex-col items-center justify-center py-8 text-gray-400">
                    <span class="material-symbols-outlined text-[32px] mb-2">inbox</span>
                    <span class="text-sm">No tasks</span>
                </div>
            `;
        }
    }

    /**
     * Generate HTML for a single task card
     * PRESERVES the exact HTML structure from project-task.html
     */
    function generateTaskCardHTML(task) {
        const statusKey = getStatusKeyFromColor(task.statusColor);
        const statusConfig = STATUS_CONFIG[statusKey];
        
        // Get assignee info
        const assignees = (task.assigneeIds || []).map(id => getUser(id)).filter(Boolean);
        const primaryAssignee = assignees[0];
        
        // Calculate deadline info
        const daysFromDeadline = getDaysFromDeadline(task.deadline);
        const isOverdue = daysFromDeadline !== null && daysFromDeadline < 0;
        const deadlineText = formatDeadlineText(task.deadline);
        
        // Generate tags HTML
        const tagsHTML = (task.tags || []).map(tag => {
            const color = getTagColor(tag);
            return `<span class="${color.bg} ${color.text} text-[10px] font-semibold px-2 py-0.5 rounded-full border ${color.border}">${tag}</span>`;
        }).join('');

        // Generate assignee avatars HTML
        const assigneeAvatarsHTML = assignees.slice(0, 3).map((user, idx) => `
            <div class="bg-center bg-no-repeat bg-cover rounded-full h-6 w-6 border border-white shrink-0 ${idx > 0 ? '-ml-2' : ''}" 
                 data-alt="User Avatar ${user.name}" 
                 style='background-image: url("${user.avatar}");'
                 title="${user.name}"></div>
        `).join('');

        // Subtitle - show project context or assignee info
        const subtitle = primaryAssignee 
            ? `${currentProject.name}, ${primaryAssignee.name}`
            : currentProject.name;

        return `
        <div class="group relative bg-white rounded shadow-md border border-gray-100 p-3 hover:shadow-lg transition-shadow cursor-pointer flex flex-col gap-2" 
             data-task-id="${task.id}">
            <div class="flex justify-between items-start">
                <h4 class="text-tprimary font-medium text-sm leading-snug">${task.title}</h4>
                <div class="flex items-center gap-1">
                    ${assigneeAvatarsHTML}
                </div>
            </div>
            <p class="text-xs text-gray-500">${subtitle}</p>
            <div class="flex items-end justify-between mt-1">
                <div class="flex flex-col gap-1 flex-1">
                    ${isOverdue ? `
                    <div class="flex items-center gap-1 text-red-600 font-bold text-xs">
                        <span>${deadlineText}</span>
                    </div>
                    ` : (deadlineText ? `
                    <div class="flex items-center gap-1 text-gray-500 text-xs">
                        <span>${deadlineText}</span>
                    </div>
                    ` : '')}
                    ${tagsHTML ? `
                    <div class="flex flex-wrap gap-1">
                        ${tagsHTML}
                    </div>
                    ` : `
                    <div class="flex items-center justify-between w-full">
                        <span class="material-symbols-outlined text-[18px] text-amber-400 fill-current" style="font-variation-settings: 'FILL' 1;">star</span>
                    </div>
                    `}
                </div>
                <div class="relative ml-2">
                    <button class="task-status-btn h-6 w-6 rounded-full ${statusConfig.color} flex items-center justify-center hover:ring-2 hover:ring-offset-1 hover:${statusConfig.ring} transition-all border border-white" 
                            title="${statusConfig.label}"
                            data-task-id="${task.id}"
                            data-current-status="${statusKey}">
                    </button>
                    <div class="task-status-dropdown absolute top-full mt-1 right-0 w-36 bg-white rounded-lg shadow-lg border border-gray-100 z-50 overflow-hidden hidden">
                        <ul class="py-1 text-xs font-medium text-gray-500">
                            ${generateStatusDropdownItems(task.id, statusKey)}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    /**
     * Generate status dropdown menu items
     */
    function generateStatusDropdownItems(taskId, currentStatus) {
        return Object.entries(STATUS_CONFIG).map(([key, config]) => {
            const isActive = key === currentStatus;
            return `
                <li>
                    <button class="status-option w-full text-left flex items-center px-3 py-2 ${isActive ? 'bg-gray-50/80' : ''} hover:bg-gray-50 transition-colors"
                            data-task-id="${taskId}"
                            data-status="${key}">
                        <span class="size-2.5 rounded-full ${config.color} mr-3"></span>
                        <span class="text-xs font-medium ${isActive ? 'text-gray-900' : 'text-gray-500'}">${config.label}</span>
                        ${isActive ? '<span class="material-symbols-outlined text-[18px] ml-auto text-gray-600">check</span>' : ''}
                    </button>
                </li>
            `;
        }).join('');
    }

    /**
     * Update progress bars for each column
     */
    function updateProgressBars(tasksByStage, totalTasks) {
        const columns = document.querySelectorAll('main .flex.h-full > .flex.flex-col.w-\\[300px\\]');
        
        STAGES.forEach((stage, index) => {
            if (columns[index]) {
                const progressBar = columns[index].querySelector('.h-1.w-full.bg-gray-200 > div');
                if (progressBar) {
                    const stageCount = tasksByStage[stage]?.length || 0;
                    const percentage = totalTasks > 0 ? (stageCount / totalTasks) * 100 : 0;
                    progressBar.style.width = `${percentage}%`;
                    
                    // Update progress bar color based on stage
                    progressBar.className = 'h-full';
                    if (stage === 'New') {
                        progressBar.classList.add('bg-gray-400');
                    } else if (stage === 'In Progress') {
                        progressBar.classList.add('bg-[#FBC02D]');
                    } else if (stage === 'Done') {
                        progressBar.classList.add('bg-green-500');
                    }
                }
            }
        });
    }

    // ============================================
    // TASK 2: TASK STATUS UPDATE
    // ============================================

    /**
     * Setup all event listeners
     */
    function setupEventListeners() {
        // "New" button click - navigate to create task page
        const newBtn = document.querySelector('button');
        document.querySelectorAll('button').forEach(btn => {
            if (btn.textContent.includes('New') && btn.querySelector('.material-symbols-outlined')) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = `create-task.html?projectId=${currentProjectId}`;
                });
            }
        });

        // Quick add buttons (+ in column headers)
        document.addEventListener('click', (e) => {
            const addBtn = e.target.closest('.group.cursor-pointer .flex.items-center button');
            if (addBtn && addBtn.querySelector('.material-symbols-outlined')?.textContent.trim() === 'add') {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = `create-task.html?projectId=${currentProjectId}`;
            }
        });

        // Status dot click - toggle dropdown
        document.addEventListener('click', (e) => {
            const statusBtn = e.target.closest('.task-status-btn');
            if (statusBtn) {
                e.preventDefault();
                e.stopPropagation();
                
                // Close all other dropdowns
                document.querySelectorAll('.task-status-dropdown').forEach(d => {
                    if (d !== statusBtn.nextElementSibling) {
                        d.classList.add('hidden');
                    }
                });
                
                // Toggle current dropdown
                const dropdown = statusBtn.nextElementSibling;
                if (dropdown) {
                    dropdown.classList.toggle('hidden');
                }
            }
        });

        // Status option selection
        document.addEventListener('click', (e) => {
            const statusOption = e.target.closest('.status-option');
            if (statusOption) {
                e.preventDefault();
                e.stopPropagation();
                
                const taskId = parseInt(statusOption.dataset.taskId);
                const newStatus = statusOption.dataset.status;
                
                updateTaskStatus(taskId, newStatus);
                
                // Close dropdown
                const dropdown = statusOption.closest('.task-status-dropdown');
                if (dropdown) {
                    dropdown.classList.add('hidden');
                }
            }
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.task-status-btn') && !e.target.closest('.task-status-dropdown')) {
                document.querySelectorAll('.task-status-dropdown').forEach(d => {
                    d.classList.add('hidden');
                });
            }
        });

        // Task card click - navigate to task details
        document.addEventListener('click', (e) => {
            const taskCard = e.target.closest('[data-task-id]');
            if (taskCard && !e.target.closest('.task-status-btn') && !e.target.closest('.task-status-dropdown')) {
                const taskId = taskCard.dataset.taskId;
                // Navigate to task details (if page exists)
                // window.location.href = `task_details.html?taskId=${taskId}`;
                console.log('Task clicked:', taskId);
            }
        });

        // Search functionality
        const searchInput = document.querySelector('input[placeholder="Search..."]');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                filterTasks(e.target.value);
            });
        }
    }

    /**
     * Update task status in database
     */
    function updateTaskStatus(taskId, newStatus) {
        const task = db.getById('tasks', taskId);
        if (!task) {
            console.error('Task not found:', taskId);
            return;
        }

        // Get status configuration
        const statusConfig = STATUS_CONFIG[newStatus];
        if (!statusConfig) {
            console.error('Invalid status:', newStatus);
            return;
        }

        // Update task
        const updates = {
            statusColor: statusConfig.hex
        };

        // Smart logic: if status is "done", move to Done stage
        if (newStatus === 'done' && task.stage !== 'Done') {
            updates.stage = 'Done';
        }

        // Update in database
        db.update('tasks', taskId, updates);
        
        console.log(`Task ${taskId} status updated to ${newStatus}`);
        showToast(`Task status updated to "${statusConfig.label}"`);

        // Re-render the board
        renderTaskBoard();
    }

    /**
     * Filter tasks by search query
     */
    function filterTasks(query) {
        const allCards = document.querySelectorAll('[data-task-id]');
        const lowerQuery = query.toLowerCase().trim();

        allCards.forEach(card => {
            const title = card.querySelector('h4')?.textContent.toLowerCase() || '';
            const subtitle = card.querySelector('p')?.textContent.toLowerCase() || '';
            const tags = Array.from(card.querySelectorAll('.rounded-full')).map(t => t.textContent.toLowerCase()).join(' ');
            
            const matches = !lowerQuery || 
                title.includes(lowerQuery) || 
                subtitle.includes(lowerQuery) ||
                tags.includes(lowerQuery);
            
            card.style.display = matches ? '' : 'none';
        });
    }

    // ============================================
    // TASK 3: CREATE TASK FLOW (handled in create-task.html)
    // ============================================

    /**
     * Create a new task
     * Called from create-task.html form handler
     */
    function createTask(taskData) {
        const newTask = {
            projectId: currentProjectId,
            title: taskData.title,
            stage: taskData.stage || 'New',
            assigneeIds: taskData.assigneeIds || [],
            priority: taskData.priority || 'normal',
            deadline: taskData.deadline || null,
            isOverdue: false,
            tags: taskData.tags || [],
            statusColor: STATUS_CONFIG['on_track'].hex,
            description: taskData.description || ''
        };

        const created = db.add('tasks', newTask);
        
        if (created) {
            console.log('Task created:', created);
            return created;
        }
        
        return null;
    }

    // ============================================
    // UTILITY: Toast Notifications
    // ============================================

    function showToast(message, type = 'success') {
        // Remove existing toast
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) existingToast.remove();

        const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';
        const icon = type === 'error' ? 'error' : 'check_circle';

        const toastHTML = `
        <div class="toast-notification fixed bottom-4 right-4 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-slide-up">
            <span class="material-symbols-outlined text-[20px]">${icon}</span>
            <span class="text-sm font-medium">${message}</span>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', toastHTML);

        setTimeout(() => {
            const toast = document.querySelector('.toast-notification');
            if (toast) toast.remove();
        }, 3000);
    }

    // ============================================
    // PUBLIC API
    // ============================================

    return {
        initTaskBoard,
        renderTaskBoard,
        updateTaskStatus,
        createTask,
        showToast,
        
        // Expose current project info
        get currentProjectId() { return currentProjectId; },
        get currentProject() { return currentProject; }
    };

})();

// Make available globally
window.ProjectTasks = ProjectTasks;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    if (path.includes('project-task.html')) {
        ProjectTasks.initTaskBoard();
    }
});
