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
            dayEvents.forEach((event) => {
                const title = escapeHtml(event.title || 'Event');
                const type = escapeHtml(event.type || 'quiz-open');
                eventsHtml += `<div class="day-event ${type}" title="${title}">${title}</div>`;
            });
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
    })).filter((event) => Boolean(event.date && event.title));
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
