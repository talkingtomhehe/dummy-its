/**
 * Tasks Module
 * Handles task listing, filtering, status updates, and creation
 * Works with both project-task.html (project tasks) and my-task.html (personal tasks)
 */

(function() {
    'use strict';

    // Task stages for Kanban view
    const TASK_STAGES = ['New', 'In Progress', 'Done', 'Cancelled'];

    // Status colors mapping
    const STATUS_COLORS = {
        'on_track': { bg: 'bg-green-500', ring: 'ring-green-200', label: 'On Track' },
        'at_risk': { bg: 'bg-orange-500', ring: 'ring-orange-200', label: 'At Risk' },
        'off_track': { bg: 'bg-[#E53835]', ring: 'ring-red-200', label: 'Off Track' },
        'on_hold': { bg: 'bg-gray-400', ring: 'ring-gray-200', label: 'On Hold' },
        'done': { bg: 'bg-[#0175C8]', ring: 'ring-blue-200', label: 'Done' }
    };

    // Tag color generator (same as projects.js)
    function getTagColor(tag) {
        const colors = [
            { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
            { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
            { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
            { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
            { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200' },
            { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
            { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-200' },
            { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' }
        ];
        
        let hash = 0;
        for (let i = 0; i < tag.length; i++) {
            hash = tag.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    }

    // Calculate days overdue
    function getDaysOverdue(deadline) {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = now - deadlineDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    // Get user avatar URL
    function getUserAvatar(userId) {
        const db = window.Database;
        const user = db.getById('users', userId);
        return user ? user.avatar : 'https://via.placeholder.com/32';
    }

    // Get user name
    function getUserName(userId) {
        const db = window.Database;
        const user = db.getById('users', userId);
        return user ? user.name : 'Unknown';
    }

    // Get project name
    function getProjectName(projectId) {
        if (!projectId) return null;
        const db = window.Database;
        const project = db.getById('projects', projectId);
        return project ? project.name : 'Unknown Project';
    }

    // Generate task card HTML (matches project-task.html structure)
    function generateTaskCardHTML(task) {
        const db = window.Database;
        const assignee = task.assigneeIds && task.assigneeIds.length > 0 
            ? db.getById('users', task.assigneeIds[0]) 
            : null;
        
        const daysOverdue = getDaysOverdue(task.deadline);
        const isOverdue = daysOverdue > 0 && task.stage !== 'Done';
        
        // Get project name for subtitle
        const projectName = getProjectName(task.projectId);
        const subtitle = projectName ? `${projectName}` : '';
        
        // Generate tags HTML
        const tagsHTML = (task.tags || []).map(tag => {
            const color = getTagColor(tag);
            return `<span class="${color.bg} ${color.text} text-[10px] font-semibold px-2 py-0.5 rounded-full border ${color.border}">${tag}</span>`;
        }).join('');

        // Determine current task status (defaults to on_track)
        const taskStatus = task.statusType || 'on_track';
        const statusInfo = STATUS_COLORS[taskStatus];

        return `
        <div class="group relative bg-white rounded shadow-md border border-gray-100 p-3 hover:shadow-lg transition-shadow cursor-pointer flex flex-col gap-2" 
             data-task-id="${task.id}" onclick="Tasks.openTaskDetails(${task.id})">
            <div class="flex justify-between items-start">
                <h4 class="text-tprimary font-medium text-sm leading-snug">${task.title}</h4>
                <div class="flex items-center gap-1">
                    ${assignee ? `
                    <div class="bg-center bg-no-repeat bg-cover rounded-full h-6 w-6 border border-white shrink-0" 
                         data-alt="User Avatar ${assignee.name}" 
                         style='background-image: url("${assignee.avatar}");'></div>
                    ` : ''}
                </div>
            </div>
            ${subtitle ? `<p class="text-xs text-gray-500">${subtitle}</p>` : ''}
            <div class="flex items-end justify-between mt-1">
                <div class="flex flex-col gap-1 flex-1">
                    ${tagsHTML ? `<div class="flex flex-wrap gap-1">${tagsHTML}</div>` : ''}
                    ${isOverdue ? `
                    <div class="flex items-center gap-1 text-red-600 font-bold text-xs">
                        <span>${daysOverdue} days ago</span>
                    </div>
                    ` : ''}
                    <div class="flex items-center justify-between w-full">
                        <span class="material-symbols-outlined text-[18px] text-gray-400 hover:text-yellow-400 task-star" 
                              data-task-id="${task.id}" onclick="event.stopPropagation(); Tasks.toggleStar(${task.id})">
                            ${task.starred ? 'star' : 'star'}
                        </span>
                    </div>
                </div>
                <div class="relative ml-2" onclick="event.stopPropagation();">
                    <button class="task-status-btn h-6 w-6 rounded-full ${statusInfo.bg} flex items-center justify-center hover:ring-2 hover:ring-offset-1 hover:${statusInfo.ring} transition-all border border-white" 
                            title="${statusInfo.label}" data-task-id="${task.id}">
                    </button>
                    <div class="task-status-dropdown absolute top-full mt-1 right-0 w-36 bg-white rounded-lg shadow-lg border border-gray-100 z-50 overflow-hidden hidden">
                        <ul class="py-1 text-xs font-medium text-gray-500">
                            <li>
                                ${Object.entries(STATUS_COLORS).map(([key, value]) => `
                                <button class="w-full text-left flex items-center px-3 py-2 hover:bg-gray-50 transition-colors ${taskStatus === key ? 'bg-gray-50/80' : ''}" 
                                        onclick="Tasks.updateTaskStatus(${task.id}, '${key}')">
                                    <span class="size-2.5 rounded-full ${value.bg} mr-3"></span>
                                    <span class="text-xs font-medium ${taskStatus === key ? 'text-gray-900' : 'text-gray-500'}">${value.label}</span>
                                    ${taskStatus === key ? '<span class="material-symbols-outlined text-[18px] ml-auto text-gray-600">check</span>' : ''}
                                </button>
                                `).join('')}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    // Generate quick create form HTML (for inline task creation)
    function generateQuickCreateFormHTML() {
        const db = window.Database;
        const users = db.getAll('users');

        return `
        <div class="bg-white rounded-lg p-3 shadow-sm border border-gray-200 flex flex-col gap-3" id="quick-create-form">
            <div class="flex flex-col gap-1.5">
                <div class="flex items-center gap-1">
                    <label class="text-xs font-bold text-gray-700">Task Title</label>
                    <span class="material-symbols-outlined text-[14px] text-blue-500 cursor-help" title="More information">help</span>
                </div>
                <input id="quick-task-title" class="w-full border-gray-300 rounded text-sm focus:ring-[#0014A6] focus:border-[#0014A6] placeholder:text-gray-400 py-1.5" 
                       placeholder="e.g. Send Invitations" type="text"/>
            </div>
            <div class="flex flex-col gap-1.5">
                <label class="text-xs font-bold text-gray-700">Assignees</label>
                <div class="flex items-center justify-end h-[34px] border border-gray-300 rounded bg-white">
                    <select id="quick-task-assignee" class="w-full border-none text-sm focus:ring-0 h-full">
                        <option value="">Select assignee...</option>
                        ${users.map(u => `<option value="${u.id}">${u.name}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div class="flex items-center justify-between mt-1">
                <div class="flex gap-2">
                    <button onclick="Tasks.quickCreateTask()" class="bg-primary hover:bg-primary/90 text-white text-xs font-medium px-4 py-1.5 rounded tracking-wide shadow-sm transition-colors">
                        Add
                    </button>
                    <button onclick="Tasks.cancelQuickCreate()" class="bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 text-xs font-medium px-4 py-1.5 rounded tracking-wide shadow-sm transition-colors">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
        `;
    }

    // Tasks Module
    const Tasks = {
        currentProjectId: null,
        currentView: 'kanban', // 'kanban' or 'my-tasks'

        /**
         * Initialize the Tasks module
         */
        init: function() {
            // Get projectId from URL - check both 'id' and 'projectId' parameters
            const urlParams = new URLSearchParams(window.location.search);
            this.currentProjectId = urlParams.get('id') || urlParams.get('projectId');
            
            // Determine which view we're in
            const path = window.location.pathname;
            if (path.includes('my-task')) {
                this.currentView = 'my-tasks';
            } else if (path.includes('project-task') || path.includes('create-task')) {
                this.currentView = 'kanban';
            }

            // Update breadcrumb with project name if applicable
            this.updateBreadcrumb();

            // Render tasks based on view
            this.renderTasks();

            // Setup event listeners
            this.setupEventListeners();

            console.log('Tasks module initialized', {
                projectId: this.currentProjectId,
                view: this.currentView
            });
        },

        /**
         * Update breadcrumb with project name
         */
        updateBreadcrumb: function() {
            if (!this.currentProjectId) return;

            const db = window.Database;
            const project = db.getById('projects', parseInt(this.currentProjectId));
            
            if (project) {
                // Find breadcrumb link
                const breadcrumbLinks = document.querySelectorAll('nav ol li a');
                breadcrumbLinks.forEach(link => {
                    if (link.textContent.includes('Home Construction') || link.textContent.includes('Project')) {
                        link.textContent = project.name;
                        link.href = `project.html`;
                    }
                });
            }
        },

        /**
         * Render tasks in Kanban view
         */
        renderTasks: function() {
            const db = window.Database;
            let tasks;

            if (this.currentView === 'my-tasks') {
                // Get current user's tasks
                const currentUser = window.Auth?.getCurrentUser();
                if (currentUser) {
                    tasks = db.find('tasks', t => 
                        t.assigneeIds && t.assigneeIds.includes(currentUser.id)
                    );
                } else {
                    tasks = db.getAll('tasks');
                }
                this.renderMyTasks(tasks);
            } else {
                // Get tasks filtered by project if projectId is present
                if (this.currentProjectId) {
                    tasks = db.find('tasks', t => t.projectId === parseInt(this.currentProjectId));
                } else {
                    tasks = db.getAll('tasks');
                }
                this.renderKanbanView(tasks);
            }
        },

        /**
         * Render Kanban view (project-task.html)
         */
        renderKanbanView: function(tasks) {
            const kanbanContainer = document.querySelector('main .flex.h-full');
            if (!kanbanContainer) return;

            // Find all stage columns
            const columns = kanbanContainer.querySelectorAll('.flex.flex-col.w-\\[300px\\]');
            
            // Map stage names to column indices
            const stageColumnMap = {
                'New': 0,
                'In Progress': 1,
                'Done': 2
            };

            // Clear existing task cards from columns (keep headers)
            columns.forEach((col, index) => {
                if (index < 3) { // Only first 3 columns are task columns
                    const cardsContainer = col.querySelector('.flex-1.flex.flex-col.gap-3');
                    if (cardsContainer) {
                        // Keep quick create form if it's in New column
                        const quickForm = cardsContainer.querySelector('#quick-create-form');
                        cardsContainer.innerHTML = '';
                        
                        // If New column, add quick create form
                        if (index === 0) {
                            cardsContainer.innerHTML = generateQuickCreateFormHTML();
                        }
                    }
                }
            });

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
                }
            });

            // Render tasks into columns
            Object.entries(tasksByStage).forEach(([stage, stageTasks]) => {
                const columnIndex = stageColumnMap[stage];
                if (columnIndex === undefined) return;

                const column = columns[columnIndex];
                if (!column) return;

                const cardsContainer = column.querySelector('.flex-1.flex.flex-col.gap-3');
                if (!cardsContainer) return;

                // For New column, append after quick create form
                stageTasks.forEach(task => {
                    const cardHTML = generateTaskCardHTML(task);
                    cardsContainer.insertAdjacentHTML('beforeend', cardHTML);
                });

                // Update task count in header
                const countSpan = column.querySelector('.flex.items-center.gap-2 span.text-gray-600');
                if (countSpan) {
                    countSpan.textContent = stageTasks.length;
                }

                // Update progress bar
                this.updateColumnProgress(column, stage, stageTasks.length, tasks.length);
            });
        },

        /**
         * Update column progress bar
         */
        updateColumnProgress: function(column, stage, count, total) {
            const progressBar = column.querySelector('.h-1.w-full .h-full');
            if (!progressBar) return;

            const percentage = total > 0 ? (count / total) * 100 : 0;
            
            // Set color based on stage
            const colors = {
                'New': 'bg-gray-400',
                'In Progress': 'bg-[#FBC02D]',
                'Done': 'bg-green-500'
            };

            progressBar.className = `h-full ${colors[stage] || 'bg-gray-400'}`;
            progressBar.style.width = `${percentage}%`;
        },

        /**
         * Render My Tasks view (my-task.html) - grouped by time
         */
        renderMyTasks: function(tasks) {
            const kanbanContainer = document.querySelector('main .flex.h-full');
            if (!kanbanContainer) return;

            // Find all columns
            const columns = kanbanContainer.querySelectorAll('.flex.flex-col.w-\\[300px\\]');
            
            // Categorize tasks by deadline
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const weekEnd = new Date(today);
            weekEnd.setDate(weekEnd.getDate() + 7);
            const monthEnd = new Date(today);
            monthEnd.setMonth(monthEnd.getMonth() + 1);

            const tasksByPeriod = {
                'Today': [],
                'This Week': [],
                'This Month': [],
                'Later': []
            };

            tasks.forEach(task => {
                if (task.stage === 'Done') return; // Skip completed tasks
                
                const deadline = new Date(task.deadline);
                
                if (deadline <= today) {
                    tasksByPeriod['Today'].push(task);
                } else if (deadline <= weekEnd) {
                    tasksByPeriod['This Week'].push(task);
                } else if (deadline <= monthEnd) {
                    tasksByPeriod['This Month'].push(task);
                } else {
                    tasksByPeriod['Later'].push(task);
                }
            });

            // Period to column mapping
            const periodColumnMap = {
                'Today': 0,
                'This Week': 1,
                'This Month': 2,
                'Later': 3
            };

            // Render tasks into columns
            Object.entries(tasksByPeriod).forEach(([period, periodTasks]) => {
                const columnIndex = periodColumnMap[period];
                if (columnIndex === undefined) return;

                const column = columns[columnIndex];
                if (!column) return;

                const cardsContainer = column.querySelector('.flex-1.flex.flex-col.gap-3');
                if (!cardsContainer) return;

                // Clear existing cards
                cardsContainer.innerHTML = '';

                // Render task cards
                periodTasks.forEach(task => {
                    const cardHTML = this.generateMyTaskCardHTML(task);
                    cardsContainer.insertAdjacentHTML('beforeend', cardHTML);
                });

                // Update count
                const countSpan = column.querySelector('.flex.items-center.gap-2 span.text-gray-600');
                if (countSpan) {
                    countSpan.textContent = periodTasks.length;
                }
            });
        },

        /**
         * Generate task card HTML for My Tasks view
         */
        generateMyTaskCardHTML: function(task) {
            const db = window.Database;
            const assignee = task.assigneeIds && task.assigneeIds.length > 0 
                ? db.getById('users', task.assigneeIds[0]) 
                : null;
            
            const daysOverdue = getDaysOverdue(task.deadline);
            const isOverdue = daysOverdue > 0;
            
            // Get project name for subtitle
            const projectName = getProjectName(task.projectId);
            
            // Generate tags HTML
            const tagsHTML = (task.tags || []).map(tag => {
                const color = getTagColor(tag);
                return `<span class="${color.bg} ${color.text} text-[10px] font-semibold px-2 py-0.5 rounded-full">${tag}</span>`;
            }).join('');

            return `
            <div class="group relative bg-white rounded shadow-sm border border-gray-100 p-3 hover:shadow-md transition-shadow cursor-pointer flex flex-col gap-2"
                 data-task-id="${task.id}" onclick="Tasks.openTaskDetails(${task.id})">
                <div class="flex justify-between items-start">
                    <h4 class="text-gray-900 font-medium text-sm leading-snug">${task.title}</h4>
                </div>
                ${projectName ? `<p class="text-xs text-gray-500">${projectName}</p>` : ''}
                ${tagsHTML ? `<div class="flex flex-wrap gap-1">${tagsHTML}</div>` : ''}
                ${isOverdue ? `
                <div class="text-red-600 font-bold text-xs">
                    ${daysOverdue} days ago
                </div>
                ` : ''}
                <div class="flex items-center justify-between mt-1 pt-2 border-t border-transparent group-hover:border-gray-50">
                    <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-[18px] text-gray-400 hover:text-yellow-400" 
                              onclick="event.stopPropagation(); Tasks.toggleStar(${task.id})">star</span>
                        <span class="material-symbols-outlined text-[16px] text-gray-400">schedule</span>
                    </div>
                    ${assignee ? `
                    <div class="bg-center bg-no-repeat bg-cover rounded-full h-6 w-6 border border-white shrink-0" 
                         data-alt="User Avatar" 
                         style='background-image: url("${assignee.avatar}");'></div>
                    ` : ''}
                </div>
            </div>
            `;
        },

        /**
         * Setup event listeners
         */
        setupEventListeners: function() {
            // New button click - navigate to create-task.html with projectId
            const newBtns = document.querySelectorAll('button');
            newBtns.forEach(btn => {
                if (btn.textContent.includes('New') && btn.querySelector('.material-symbols-outlined')) {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        const projectId = this.currentProjectId;
                        if (projectId) {
                            window.location.href = `create-task.html?projectId=${projectId}`;
                        } else {
                            window.location.href = 'create-task.html';
                        }
                    });
                }
            });

            // Quick add buttons (+ icon in column headers)
            document.addEventListener('click', (e) => {
                const addBtn = e.target.closest('.flex.items-center.opacity-0 button');
                if (addBtn && addBtn.querySelector('.material-symbols-outlined')?.textContent === 'add') {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Find which column this button belongs to
                    const column = addBtn.closest('.flex.flex-col.w-\\[300px\\]');
                    if (column) {
                        const stageTitle = column.querySelector('h3').textContent.trim();
                        this.showQuickCreateInColumn(column, stageTitle);
                    }
                }
            });

            // Status dropdown toggle
            document.addEventListener('click', (e) => {
                const statusBtn = e.target.closest('.task-status-btn');
                if (statusBtn) {
                    e.stopPropagation();
                    const dropdown = statusBtn.nextElementSibling;
                    
                    // Close all other dropdowns
                    document.querySelectorAll('.task-status-dropdown').forEach(d => {
                        if (d !== dropdown) d.classList.add('hidden');
                    });
                    
                    // Toggle current dropdown
                    dropdown.classList.toggle('hidden');
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

            // Search functionality
            const searchInput = document.querySelector('input[placeholder="Search..."]');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    this.filterTasks(e.target.value);
                });
            }
        },

        /**
         * Update task status
         */
        updateTaskStatus: function(taskId, newStatus) {
            const db = window.Database;
            
            db.update('tasks', taskId, { statusType: newStatus });
            
            // Close dropdown
            document.querySelectorAll('.task-status-dropdown').forEach(d => {
                d.classList.add('hidden');
            });

            // Re-render tasks
            this.renderTasks();

            // Show toast
            this.showToast('Task status updated successfully!');
        },

        /**
         * Quick create task from inline form
         */
        quickCreateTask: function() {
            const titleInput = document.getElementById('quick-task-title');
            const assigneeSelect = document.getElementById('quick-task-assignee');

            if (!titleInput || !titleInput.value.trim()) {
                this.showToast('Please enter a task title', 'error');
                return;
            }

            const db = window.Database;
            const tasks = db.getAll('tasks');
            const newId = Math.max(...tasks.map(t => t.id), 0) + 1;

            const newTask = {
                id: newId,
                projectId: this.currentProjectId ? parseInt(this.currentProjectId) : null,
                title: titleInput.value.trim(),
                stage: 'New',
                assigneeIds: assigneeSelect.value ? [parseInt(assigneeSelect.value)] : [],
                priority: 'normal',
                deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week from now
                isOverdue: false,
                tags: [],
                statusType: 'on_track',
                description: ''
            };

            db.add('tasks', newTask);

            // Re-render
            this.renderTasks();

            this.showToast('Task created successfully!');
        },

        /**
         * Cancel quick create
         */
        cancelQuickCreate: function() {
            const titleInput = document.getElementById('quick-task-title');
            const assigneeSelect = document.getElementById('quick-task-assignee');
            
            if (titleInput) titleInput.value = '';
            if (assigneeSelect) assigneeSelect.value = '';
        },

        /**
         * Open create task modal
         */
        openCreateModal: function() {
            const db = window.Database;
            const users = db.getAll('users');
            const projects = db.getAll('projects');

            // Remove existing modal if any
            const existingModal = document.getElementById('create-task-modal');
            if (existingModal) existingModal.remove();

            const modalHTML = `
            <div id="create-task-modal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onclick="Tasks.closeModal(event)">
                <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4" onclick="event.stopPropagation()">
                    <div class="flex items-center justify-between p-4 border-b border-gray-200">
                        <h2 class="text-lg font-semibold text-gray-900">Create New Task</h2>
                        <button onclick="Tasks.closeModal()" class="text-gray-400 hover:text-gray-600">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <form id="create-task-form" class="p-4 space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Task Title *</label>
                            <input type="text" id="task-title" required 
                                   class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                                   placeholder="Enter task title">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea id="task-description" rows="3"
                                      class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                                      placeholder="Enter task description"></textarea>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Project</label>
                                <select id="task-project" class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-primary focus:border-primary">
                                    <option value="">No Project</option>
                                    ${projects.map(p => `<option value="${p.id}" ${this.currentProjectId == p.id ? 'selected' : ''}>${p.name}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                                <select id="task-assignee" class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-primary focus:border-primary">
                                    <option value="">Unassigned</option>
                                    ${users.map(u => `<option value="${u.id}">${u.name}</option>`).join('')}
                                </select>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                                <select id="task-stage" class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-primary focus:border-primary">
                                    <option value="New">New</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                <select id="task-priority" class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-primary focus:border-primary">
                                    <option value="low">Low</option>
                                    <option value="normal" selected>Normal</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                            <input type="date" id="task-deadline" 
                                   class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                                   value="${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                            <input type="text" id="task-tags"
                                   class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                                   placeholder="e.g., Urgent, Feature">
                        </div>
                    </form>
                    <div class="flex justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                        <button onclick="Tasks.closeModal()" 
                                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                            Cancel
                        </button>
                        <button onclick="Tasks.createTask()" 
                                class="px-4 py-2 text-sm font-medium text-white bg-primary rounded hover:bg-primary/90">
                            Create Task
                        </button>
                    </div>
                </div>
            </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHTML);
        },

        /**
         * Close modal
         */
        closeModal: function(event) {
            if (event && event.target !== event.currentTarget) return;
            const modal = document.getElementById('create-task-modal');
            if (modal) modal.remove();
        },

        /**
         * Create new task from modal
         */
        createTask: function() {
            const title = document.getElementById('task-title').value.trim();
            const description = document.getElementById('task-description').value.trim();
            const projectId = document.getElementById('task-project').value;
            const assigneeId = document.getElementById('task-assignee').value;
            const stage = document.getElementById('task-stage').value;
            const priority = document.getElementById('task-priority').value;
            const deadline = document.getElementById('task-deadline').value;
            const tags = document.getElementById('task-tags').value.trim();

            if (!title) {
                this.showToast('Please enter a task title', 'error');
                return;
            }

            const db = window.Database;
            const tasks = db.getAll('tasks');
            const newId = Math.max(...tasks.map(t => t.id), 0) + 1;

            const newTask = {
                id: newId,
                projectId: projectId ? parseInt(projectId) : null,
                title: title,
                stage: stage,
                assigneeIds: assigneeId ? [parseInt(assigneeId)] : [],
                priority: priority,
                deadline: deadline,
                isOverdue: new Date(deadline) < new Date(),
                tags: tags ? tags.split(',').map(t => t.trim()).filter(t => t) : [],
                statusType: 'on_track',
                description: description
            };

            db.add('tasks', newTask);

            this.closeModal();
            this.renderTasks();
            this.showToast('Task created successfully!');
        },

        /**
         * Open task details (navigate to task_details.html)
         */
        openTaskDetails: function(taskId) {
            window.location.href = `task_details.html?taskId=${taskId}`;
        },

        /**
         * Toggle task star/favorite
         */
        toggleStar: function(taskId) {
            const db = window.Database;
            const task = db.getById('tasks', taskId);
            
            if (task) {
                db.update('tasks', taskId, { starred: !task.starred });
                this.renderTasks();
            }
        },

        /**
         * Filter tasks by search query
         */
        filterTasks: function(query) {
            if (!query.trim()) {
                this.renderTasks();
                return;
            }

            const db = window.Database;
            const lowerQuery = query.toLowerCase();
            
            let tasks;
            if (this.currentProjectId) {
                tasks = db.find('tasks', t => 
                    t.projectId === parseInt(this.currentProjectId) &&
                    (t.title.toLowerCase().includes(lowerQuery) ||
                     (t.tags || []).some(tag => tag.toLowerCase().includes(lowerQuery)))
                );
            } else {
                tasks = db.find('tasks', t =>
                    t.title.toLowerCase().includes(lowerQuery) ||
                    (t.tags || []).some(tag => tag.toLowerCase().includes(lowerQuery))
                );
            }

            if (this.currentView === 'kanban') {
                this.renderKanbanView(tasks);
            } else {
                this.renderMyTasks(tasks);
            }
        },

        /**
         * Show quick create form in a specific column
         */
        showQuickCreateInColumn: function(column, stage) {
            const cardsContainer = column.querySelector('.flex-1.flex.flex-col.gap-3');
            if (!cardsContainer) return;

            // Remove existing quick create forms
            document.querySelectorAll('#quick-create-form').forEach(f => f.remove());

            // Add quick create form at the top
            const quickFormHTML = generateQuickCreateFormHTML();
            cardsContainer.insertAdjacentHTML('afterbegin', quickFormHTML);

            // Store stage for later use
            const form = document.getElementById('quick-create-form');
            if (form) {
                form.dataset.stage = stage;
                // Focus on title input
                const titleInput = form.querySelector('#quick-task-title');
                if (titleInput) titleInput.focus();
            }
        },

        /**
         * Quick create task from inline form
         */
        quickCreateTask: function() {
            const form = document.getElementById('quick-create-form');
            if (!form) return;

            const titleInput = document.getElementById('quick-task-title');
            const assigneeSelect = document.getElementById('quick-task-assignee');

            const title = titleInput?.value.trim();
            const assigneeId = assigneeSelect?.value;
            const stage = form.dataset.stage || 'New';

            if (!title) {
                this.showToast('Please enter a task title', 'error');
                titleInput?.focus();
                return;
            }

            const db = window.Database;
            const newTask = {
                title: title,
                projectId: this.currentProjectId ? parseInt(this.currentProjectId) : null,
                stage: stage,
                assigneeIds: assigneeId ? [parseInt(assigneeId)] : [],
                priority: 'normal',
                deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
                isOverdue: false,
                tags: [],
                statusType: 'on_track',
                description: ''
            };

            const created = db.add('tasks', newTask);
            
            if (created) {
                this.showToast('Task created successfully!');
                this.cancelQuickCreate();
                this.renderTasks();
            } else {
                this.showToast('Failed to create task', 'error');
            }
        },

        /**
         * Cancel quick create and remove form
         */
        cancelQuickCreate: function() {
            const form = document.getElementById('quick-create-form');
            if (form) form.remove();
        },

        /**
         * Show toast notification
         */
        showToast: function(message, type = 'success') {
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
    };

    // Expose to global scope
    window.Tasks = Tasks;

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Tasks.init());
    } else {
        // Small delay to ensure other modules are loaded
        setTimeout(() => Tasks.init(), 100);
    }

})();
