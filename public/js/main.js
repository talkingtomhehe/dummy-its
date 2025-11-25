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
    const baseUrl = document.body.dataset.baseUrl || '/its';
    
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
    
    // Notification button functionality
    const notificationBtn = document.getElementById('notification-btn');
    if (notificationBtn) {
        // Create notification dropdown
        const notificationDropdown = document.createElement('div');
        notificationDropdown.className = 'notification-dropdown';
        notificationDropdown.id = 'notification-dropdown';
        notificationDropdown.innerHTML = `
            <div class="notification-header">
                <h3>Notifications</h3>
                <button class="mark-all-read-btn" id="mark-all-read">Mark all read</button>
            </div>
            <div class="notification-list" id="notification-list">
                <div class="notification-loading">Loading...</div>
            </div>
        `;
        notificationBtn.parentElement.appendChild(notificationDropdown);
        
        // Badge for unread count
        const badge = document.createElement('span');
        badge.className = 'notification-badge';
        badge.id = 'notification-badge';
        badge.style.display = 'none';
        notificationBtn.appendChild(badge);
        
        // Toggle dropdown
        notificationBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            notificationDropdown.classList.toggle('show');
            if (notificationDropdown.classList.contains('show')) {
                loadNotifications();
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!notificationDropdown.contains(event.target) && event.target !== notificationBtn) {
                notificationDropdown.classList.remove('show');
            }
        });
        
        // Prevent dropdown from closing when clicking inside
        notificationDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // Mark all as read
        document.getElementById('mark-all-read').addEventListener('click', function() {
            markAllNotificationsAsRead();
        });
        
        // Load unread count on page load
        updateUnreadCount();
        
        // Poll for new notifications every 30 seconds
        setInterval(updateUnreadCount, 30000);
    }
    
    // Editing toggle for instructors
    const editingToggle = document.getElementById('editing-toggle');

    const applyEditingState = (isEditing) => {
        document.body.classList.toggle('editing-mode', isEditing);

        const editControls = document.querySelectorAll('.instructor-controls, .edit-controls, .item-controls');
        editControls.forEach((control) => {
            let displayValue = 'block';
            if (control.classList.contains('item-controls') || control.classList.contains('instructor-controls')) {
                displayValue = 'flex';
            }
            if (control.tagName === 'BUTTON') {
                displayValue = 'inline-flex';
            }

            control.style.display = isEditing ? displayValue : 'none';
        });
    };

    if (editingToggle) {
        applyEditingState(editingToggle.checked);

        editingToggle.addEventListener('change', function() {
            const desiredState = this.checked;

            fetch(`${baseUrl}/toggle-editing`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify({}),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Request failed with status ${response.status}`);
                    }
                    return response.json();
                })
                .then((payload) => {
                    if (!payload || payload.success !== true) {
                        throw new Error(payload && payload.message ? payload.message : 'Unable to toggle editing mode.');
                    }

                    const newState = Boolean(payload.is_editing);
                    editingToggle.checked = newState;
                    applyEditingState(newState);
                })
                .catch((error) => {
                    console.error('Failed to toggle editing mode:', error);
                    editingToggle.checked = !desiredState;
                    applyEditingState(editingToggle.checked);
                    showNotification('Unable to update editing mode. Please try again.', 'error');
                });
        });
    } else {
        applyEditingState(false);
    }

    initDashboardPage();
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

/**
 * Initialize dashboard calendar and interactions
 */
function initDashboardPage() {
    const dashboardPage = document.getElementById('page-dashboard');
    if (!dashboardPage) {
        return;
    }

    const calendarGrid = document.getElementById('calendar-grid');
    const monthTitle = document.getElementById('calendar-month-year');
    if (!calendarGrid || !monthTitle) {
        return;
    }

    const prevBtn = document.getElementById('prev-month');
    const nextBtn = document.getElementById('next-month');
    const todayBtn = document.getElementById('today-btn');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const container = dashboardPage.querySelector('.container');

    if (sidebarToggle && container) {
        sidebarToggle.addEventListener('click', function() {
            container.classList.toggle('sidebar-collapsed');
        });
    }

    const state = {
        currentDate: new Date(),
        events: [],
    };

    const defaultEvents = safeParseJson(dashboardPage.dataset.defaultEvents) || [];
    if (Array.isArray(defaultEvents)) {
        state.events = normalizeEvents(defaultEvents);
    }

    const eventsUrl = dashboardPage.dataset.eventsUrl || '';

    const changeMonth = (offset) => {
        state.currentDate.setMonth(state.currentDate.getMonth() + offset);
        renderCalendar(monthTitle, calendarGrid, state.currentDate, state.events);
    };

    if (prevBtn) {
        prevBtn.addEventListener('click', () => changeMonth(-1));
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => changeMonth(1));
    }

    if (todayBtn) {
        todayBtn.addEventListener('click', () => {
            state.currentDate = new Date();
            renderCalendar(monthTitle, calendarGrid, state.currentDate, state.events);
        });
    }

    const fetchEvents = () => {
        if (!eventsUrl) {
            return Promise.resolve(state.events);
        }

        return fetch(eventsUrl, {
            headers: {
                'Accept': 'application/json',
            },
            credentials: 'same-origin',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to load events: ${response.status}`);
                }
                return response.json();
            })
            .then((payload) => {
                if (Array.isArray(payload)) {
                    return payload;
                }
                if (payload && Array.isArray(payload.data)) {
                    return payload.data;
                }
                return [];
            })
            .catch((error) => {
                console.warn(error);
                return state.events;
            });
    };

    renderCalendar(monthTitle, calendarGrid, state.currentDate, state.events);

    fetchEvents().then((events) => {
        state.events = normalizeEvents(events);
        renderCalendar(monthTitle, calendarGrid, state.currentDate, state.events);
    });
}

/**
 * Render the calendar into the DOM
 */
function renderCalendar(monthTitle, calendarGrid, currentDate, events) {
    if (!monthTitle || !calendarGrid) {
        return;
    }

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    monthTitle.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const today = new Date();
    const eventMap = buildEventLookup(events);

    let html = '';

    weekdays.forEach((day) => {
        html += `<div class="calendar-weekday">${day}</div>`;
    });

    for (let i = firstDay - 1; i >= 0; i -= 1) {
        const day = daysInPrevMonth - i;
        html += `<div class="calendar-day other-month"><div class="day-number">${day}</div></div>`;
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayEvents = eventMap.get(dateStr) || [];

        let cellClass = 'calendar-day';
        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            cellClass += ' today';
        }

        let eventsHtml = '';
        if (dayEvents.length > 0) {
            eventsHtml = '<div class="day-events">';
            const maxVisible = 2;
            const visibleEvents = dayEvents.slice(0, maxVisible);
            const remainingCount = dayEvents.length - maxVisible;
            
            visibleEvents.forEach((event) => {
                const title = escapeHtml(event.title || 'Event');
                const type = escapeHtml(event.type || 'quiz-open');
                const eventId = event.id || '';
                const eventType = event.assessment_type || (type.includes('quiz') ? 'quiz' : 'assignment');
                const eventData = JSON.stringify({
                    id: eventId,
                    type: eventType,
                    title: event.assessment_title || event.title || '',
                    description: event.description || '',
                    timeLimit: event.time_limit || 0,
                    maxScore: event.max_score || 10,
                    openTime: event.open_time || '',
                    closeTime: event.close_time || '',
                    status: type
                }).replace(/"/g, '&quot;');
                eventsHtml += `<div class="day-event ${type}" title="${title}" onclick='showEventPopup(${eventData})'>${title}</div>`;
            });
            
            if (remainingCount > 0) {
                const allEventsData = JSON.stringify(dayEvents).replace(/"/g, '&quot;');
                eventsHtml += `<div class="day-event-more" onclick='showAllDayEvents("${dateStr}", ${allEventsData})'>+${remainingCount} more...</div>`;
            }
            
            eventsHtml += '</div>';
        }

        html += `<div class="${cellClass}">
            <div class="day-number">${day}</div>
            ${eventsHtml}
        </div>`;
    }

    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    const remainingCells = totalCells - (firstDay + daysInMonth);
    for (let day = 1; day <= remainingCells; day += 1) {
        html += `<div class="calendar-day other-month"><div class="day-number">${day}</div></div>`;
    }

    calendarGrid.innerHTML = html;

    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

/**
 * Create a quick lookup for events per day
 */
function buildEventLookup(events) {
    const map = new Map();
    events.forEach((event) => {
        if (!event || !event.date) {
            return;
        }
        const key = event.date;
        if (!map.has(key)) {
            map.set(key, []);
        }
        map.get(key).push(event);
    });
    return map;
}

/**
 * Normalize event objects to expected keys
 */
function normalizeEvents(events) {
    if (!Array.isArray(events)) {
        return [];
    }
    return events.map((event) => ({
        date: event.date,
        title: event.title,
        type: event.type || 'quiz-open',
        id: event.id || event.assessment_id || '',
        assessment_type: event.assessment_type || '',
        assessment_title: event.assessment_title || '',
        description: event.description || '',
        time_limit: event.time_limit || 0,
        max_score: event.max_score || 10,
        open_time: event.open_time || '',
        close_time: event.close_time || '',
    })).filter((event) => Boolean(event.date && event.title));
}

/**
 * Show all events for a specific day in a modal
 */
function showAllDayEvents(dateStr, eventsData) {
    const baseUrl = document.querySelector('body').dataset.baseUrl || '/its';
    const events = Array.isArray(eventsData) ? eventsData : [];
    
    if (events.length === 0) {
        return;
    }
    
    // Format date
    const date = new Date(dateStr);
    const formattedDate = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Build event list HTML
    let eventsListHtml = '';
    events.forEach((event) => {
        const isQuiz = (event.assessment_type || event.type || '').toLowerCase().includes('quiz');
        const isAssignment = (event.assessment_type || event.type || '').toLowerCase().includes('assignment');
        const icon = isQuiz ? 'help-circle' : 'clipboard';
        const eventType = event.type || 'event';
        const statusClass = eventType.includes('close') ? 'danger' : 'success';
        const statusText = eventType.includes('close') ? 'Closing' : 'Opening';
        
        const formatTime = (timeStr) => {
            if (!timeStr) return 'Not set';
            const time = new Date(timeStr);
            return time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        };
        
        const openTime = formatTime(event.open_time);
        const closeTime = formatTime(event.close_time);
        
        const eventData = JSON.stringify({
            id: event.id || event.assessment_id || '',
            type: event.assessment_type || (isQuiz ? 'quiz' : 'assignment'),
            title: event.assessment_title || event.title || '',
            description: event.description || '',
            timeLimit: event.time_limit || 0,
            maxScore: event.max_score || 10,
            openTime: event.open_time || '',
            closeTime: event.close_time || '',
            status: event.type
        }).replace(/"/g, '&quot;');
        
        eventsListHtml += `
            <div class="event-list-item" onclick='showEventPopup(${eventData})' style="cursor: pointer; padding: 15px; margin-bottom: 10px; background: var(--bg-light); border-radius: 6px; border-left: 3px solid var(--primary-color); transition: all 0.2s;">
                <div style="display: flex; align-items: start; gap: 12px;">
                    <div style="flex-shrink: 0; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: var(--primary-light); border-radius: 50%;">
                        <i data-feather="${icon}" style="width: 18px; height: 18px; color: var(--primary-color);"></i>
                    </div>
                    <div style="flex: 1; min-width: 0;">
                        <h4 style="margin: 0 0 5px 0; font-size: 16px; font-weight: 600; color: var(--text-color); word-wrap: break-word;">
                            ${escapeHtml(event.title || 'Event')}
                        </h4>
                        <div style="display: flex; gap: 15px; flex-wrap: wrap; margin-top: 8px;">
                            <span style="font-size: 13px; color: #666;">
                                <i data-feather="calendar" style="width: 14px; height: 14px; vertical-align: middle;"></i>
                                ${statusText}: ${eventType.includes('open') ? openTime : closeTime}
                            </span>
                            <span style="font-size: 13px; padding: 2px 8px; border-radius: 12px; background: var(--${statusClass}-color); color: white; font-weight: 500;">
                                ${isQuiz ? 'Quiz' : 'Assignment'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 650px; max-height: 85vh;">
            <div class="modal-header">
                <h2 class="modal-title" style="display: flex; align-items: center; gap: 10px;">
                    <i data-feather="calendar"></i>
                    <span>Events on ${formattedDate}</span>
                </h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">
                    <i data-feather="x"></i>
                </button>
            </div>
            <div class="modal-body" style="max-height: calc(85vh - 150px); overflow-y: auto; padding: 20px;">
                <p style="margin-bottom: 20px; color: #666; font-size: 14px;">
                    <strong>${events.length}</strong> event${events.length !== 1 ? 's' : ''} scheduled for this day
                </p>
                ${eventsListHtml}
            </div>
            <div class="modal-footer" style="display: flex; justify-content: flex-end;">
                <button class="button button-secondary" onclick="this.closest('.modal').remove()">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add hover effect to event items
    const eventItems = modal.querySelectorAll('.event-list-item');
    eventItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.background = '#f0f8fa';
            this.style.transform = 'translateX(5px)';
        });
        item.addEventListener('mouseleave', function() {
            this.style.background = 'var(--bg-light)';
            this.style.transform = 'translateX(0)';
        });
    });
    
    // Close when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Replace feather icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

/**
 * Show event details popup with comprehensive information
 */
function showEventPopup(eventData) {
    const baseUrl = document.querySelector('body').dataset.baseUrl || '/its';
    const isQuiz = eventData.type === 'quiz';
    const isAssignment = eventData.type === 'assignment';
    
    // Format dates
    const formatDate = (dateStr) => {
        if (!dateStr) return 'Not set';
        const date = new Date(dateStr);
        return date.toLocaleString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };
    
    const openTime = formatDate(eventData.openTime);
    const closeTime = formatDate(eventData.closeTime);
    const timeLimit = eventData.timeLimit > 0 ? `${eventData.timeLimit} minutes` : 'No time limit';
    const maxScore = eventData.maxScore || 10;
    const isClosing = eventData.status && eventData.status.includes('close');
    const statusText = isClosing ? 'Closing Soon' : 'Open';
    const statusColor = isClosing ? 'var(--danger-color)' : 'var(--success-color)';
    
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header">
                <h2 class="modal-title" style="display: flex; align-items: center; gap: 10px; word-break: break-word;">
                    <i data-feather="${isQuiz ? 'help-circle' : 'clipboard'}"></i>
                    <span style="flex: 1;">${escapeHtml(eventData.title)}</span>
                </h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">
                    <i data-feather="x"></i>
                </button>
            </div>
            <div class="modal-body" style="max-height: calc(90vh - 200px); overflow-y: auto;">
                <div class="form-group" style="margin-bottom: 15px;">
                    <label style="font-weight: 600; color: var(--accent-color); display: block; margin-bottom: 5px;">Type:</label>
                    <p style="margin: 0; padding: 8px 12px; background: var(--background-color); border-radius: 6px; border-left: 3px solid var(--primary-color);">
                        ${isQuiz ? '📝 Quiz' : '📋 Assignment'}
                    </p>
                </div>
                
                <div class="form-group" style="margin-bottom: 15px;">
                    <label style="font-weight: 600; color: var(--accent-color); display: block; margin-bottom: 5px;">Status:</label>
                    <p style="margin: 0; padding: 8px 12px; background: var(--background-color); border-radius: 6px; border-left: 3px solid ${statusColor}; color: ${statusColor}; font-weight: 600;">
                        ${statusText}
                    </p>
                </div>
                
                ${eventData.description ? `
                <div class="form-group" style="margin-bottom: 15px;">
                    <label style="font-weight: 600; color: var(--accent-color); display: block; margin-bottom: 5px;">Description:</label>
                    <p style="margin: 0; padding: 12px; background: var(--background-color); border-radius: 6px; line-height: 1.6; word-wrap: break-word; white-space: pre-wrap;">
                        ${escapeHtml(eventData.description)}
                    </p>
                </div>
                ` : ''}
                
                <div class="form-group" style="margin-bottom: 15px;">
                    <label style="font-weight: 600; color: var(--accent-color); display: block; margin-bottom: 5px;">Opens:</label>
                    <p style="margin: 0; padding: 8px 12px; background: var(--background-color); border-radius: 6px;">
                        <i data-feather="calendar" style="width: 16px; height: 16px; vertical-align: middle;"></i>
                        ${openTime}
                    </p>
                </div>
                
                <div class="form-group" style="margin-bottom: 15px;">
                    <label style="font-weight: 600; color: var(--accent-color); display: block; margin-bottom: 5px;">Due:</label>
                    <p style="margin: 0; padding: 8px 12px; background: var(--background-color); border-radius: 6px;">
                        <i data-feather="calendar" style="width: 16px; height: 16px; vertical-align: middle;"></i>
                        ${closeTime}
                    </p>
                </div>
                
                ${isQuiz ? `
                <div class="form-group" style="margin-bottom: 15px;">
                    <label style="font-weight: 600; color: var(--accent-color); display: block; margin-bottom: 5px;">Time Limit:</label>
                    <p style="margin: 0; padding: 8px 12px; background: var(--background-color); border-radius: 6px;">
                        <i data-feather="clock" style="width: 16px; height: 16px; vertical-align: middle;"></i>
                        ${timeLimit}
                    </p>
                </div>
                ` : ''}
                
                <div class="form-group" style="margin-bottom: 15px;">
                    <label style="font-weight: 600; color: var(--accent-color); display: block; margin-bottom: 5px;">Maximum Score:</label>
                    <p style="margin: 0; padding: 8px 12px; background: var(--background-color); border-radius: 6px;">
                        <i data-feather="award" style="width: 16px; height: 16px; vertical-align: middle;"></i>
                        ${maxScore} points
                    </p>
                </div>
            </div>
            <div class="modal-footer" style="display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap;">
                <button class="button button-secondary" onclick="this.closest('.modal').remove()">Close</button>
                ${isQuiz ? `<button class="button button-primary" onclick="window.location.href='${baseUrl}/quiz/${eventData.id}'">
                    <i data-feather="play"></i> Take Quiz
                </button>` : ''}
                ${isAssignment ? `<button class="button button-primary" onclick="window.location.href='${baseUrl}/assignment/${eventData.id}/status'">
                    <i data-feather="upload"></i> Submit Assignment
                </button>` : ''}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Replace feather icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

/**
 * Safely parse JSON without throwing
 */
function safeParseJson(jsonString) {
    if (!jsonString) {
        return null;
    }
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.warn('Failed to parse JSON payload', error);
        return null;
    }
}

/**
 * Basic HTML escaping helper
 */
function escapeHtml(value) {
    if (typeof value !== 'string') {
        return '';
    }
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Notification System
 * Shows auto-dismissing notifications (success/error)
 */
let notificationContainer = null;

function showNotification(message, type = 'success') {
    // Create container if it doesn't exist
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 'alert-circle';
    notification.innerHTML = `
        <i data-feather="${icon}"></i>
        <span>${escapeHtml(message)}</span>
    `;
    
    notificationContainer.appendChild(notification);
    
    // Replace feather icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
            // Remove container if no notifications left
            if (notificationContainer.children.length === 0) {
                notificationContainer.remove();
                notificationContainer = null;
            }
        }, 300);
    }, 5000);
}

/**
 * Notification Dropdown Functions
 */
function loadNotifications() {
    const baseUrl = document.body.dataset.baseUrl || '/its';
    const notificationList = document.getElementById('notification-list');
    
    if (!notificationList) return;
    
    notificationList.innerHTML = '<div class="notification-loading">Loading...</div>';
    
    fetch(`${baseUrl}/notifications`, {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.notifications) {
            displayNotifications(data.notifications);
        } else {
            notificationList.innerHTML = '<div class="notification-empty">No notifications</div>';
        }
    })
    .catch(error => {
        console.error('Failed to load notifications:', error);
        notificationList.innerHTML = '<div class="notification-error">Failed to load notifications</div>';
    });
}

function displayNotifications(notifications) {
    const notificationList = document.getElementById('notification-list');
    
    if (!notificationList) return;
    
    if (notifications.length === 0) {
        notificationList.innerHTML = '<div class="notification-empty">No notifications</div>';
        return;
    }
    
    notificationList.innerHTML = '';
    
    notifications.forEach(notification => {
        const notifElement = document.createElement('div');
        notifElement.className = `notification-item ${notification.is_read ? '' : 'unread'}`;
        notifElement.dataset.id = notification.notification_id;
        
        const timeAgo = formatTimeAgo(notification.created_at);
        const typeIcon = getNotificationIcon(notification.type);
        
        notifElement.innerHTML = `
            <div class="notification-icon ${notification.type}">
                <i data-feather="${typeIcon}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${escapeHtml(notification.title)}</div>
                <div class="notification-message">${escapeHtml(notification.message)}</div>
                <div class="notification-time">${timeAgo}</div>
            </div>
            <button class="notification-delete" onclick="deleteNotification(${notification.notification_id})">
                <i data-feather="x"></i>
            </button>
        `;
        
        // Handle notification click to navigate to related content
        notifElement.addEventListener('click', function(e) {
            if (!e.target.closest('.notification-delete')) {
                // Mark as read if not already
                if (!notification.is_read) {
                    markNotificationAsRead(notification.notification_id);
                }
                
                // Navigate to related content if available
                const baseUrl = document.body.dataset.baseUrl || '/its';
                const message = notification.message.toLowerCase();
                const title = notification.title.toLowerCase();
                let url = '';
                
                // Check for grade/feedback notifications first
                if (title.includes('grade') || title.includes('graded') || 
                    title.includes('feedback') || message.includes('graded')) {
                    // Direct to student grades page
                    url = `${baseUrl}/grade/student`;
                } 
                // Check for new content notifications
                else if (title.includes('new content') || title.includes('content added') || 
                         message.includes('new content') || message.includes('content added')) {
                    // Direct to content view if we have the related_id
                    if (notification.related_type === 'content' && notification.related_id) {
                        url = `${baseUrl}/content/${notification.related_id}/view`;
                    }
                }
                // Check for content modified notifications
                else if (title.includes('modified') || title.includes('updated') || 
                         message.includes('modified') || message.includes('updated')) {
                    // Direct to content view if we have the related_id
                    if (notification.related_type === 'content' && notification.related_id) {
                        url = `${baseUrl}/content/${notification.related_id}/view`;
                    }
                }
                // Fallback to related_type based navigation
                else if (notification.related_type && notification.related_id) {
                    switch (notification.related_type) {
                        case 'content':
                            url = `${baseUrl}/content/${notification.related_id}/view`;
                            break;
                        case 'quiz':
                            url = `${baseUrl}/quiz/${notification.related_id}`;
                            break;
                        case 'assignment':
                            url = `${baseUrl}/assignment/${notification.related_id}/status`;
                            break;
                        case 'course':
                            url = `${baseUrl}/course/${notification.related_id}`;
                            break;
                    }
                }
                
                if (url) {
                    window.location.href = url;
                }
            }
        });
        
        notificationList.appendChild(notifElement);
    });
    
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

function updateUnreadCount() {
    const baseUrl = document.body.dataset.baseUrl || '/its';
    const badge = document.getElementById('notification-badge');
    
    if (!badge) return;
    
    fetch(`${baseUrl}/notifications/unread-count`, {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.count !== undefined) {
            if (data.count > 0) {
                badge.textContent = data.count > 99 ? '99+' : data.count;
                badge.style.display = 'block';
            } else {
                badge.style.display = 'none';
            }
        }
    })
    .catch(error => {
        console.error('Failed to update unread count:', error);
    });
}

function markNotificationAsRead(notificationId) {
    const baseUrl = document.body.dataset.baseUrl || '/its';
    
    fetch(`${baseUrl}/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const notifElement = document.querySelector(`[data-id="${notificationId}"]`);
            if (notifElement) {
                notifElement.classList.remove('unread');
            }
            updateUnreadCount();
        }
    })
    .catch(error => {
        console.error('Failed to mark notification as read:', error);
    });
}

function markAllNotificationsAsRead() {
    const baseUrl = document.body.dataset.baseUrl || '/its';
    
    fetch(`${baseUrl}/notifications/read-all`, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadNotifications();
            updateUnreadCount();
        }
    })
    .catch(error => {
        console.error('Failed to mark all as read:', error);
    });
}

function deleteNotification(notificationId) {
    const baseUrl = document.body.dataset.baseUrl || '/its';
    
    fetch(`${baseUrl}/notifications/${notificationId}/delete`, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const notifElement = document.querySelector(`[data-id="${notificationId}"]`);
            if (notifElement) {
                notifElement.remove();
            }
            updateUnreadCount();
            
            // Check if list is empty
            const notificationList = document.getElementById('notification-list');
            if (notificationList && notificationList.children.length === 0) {
                notificationList.innerHTML = '<div class="notification-empty">No notifications</div>';
            }
        }
    })
    .catch(error => {
        console.error('Failed to delete notification:', error);
    });
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'alert-circle',
        'warning': 'alert-triangle',
        'info': 'info'
    };
    return icons[type] || 'bell';
}

function formatTimeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return past.toLocaleDateString();
}
