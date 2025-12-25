/**
 * ============================================
 * DATA.JS - Mock Database for Enterprise Management System
 * ============================================
 * This file contains all mock data that simulates a backend database.
 * Data is stored in localStorage to persist across sessions.
 */

// ============================================
// DEFAULT DATA SCHEMAS
// ============================================

const defaultData = {
    // ============================================
    // USERS - Authentication & Profile Data
    // ============================================
    users: [
        {
            id: 1,
            username: 'admin',
            password: 'admin123',
            name: 'Mitchell Admin',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZ9IwqZLMVyFuvjD48r6YmxNecS2IrNMxG2dFNdOE52RuIygLm-jHTDoZtgyBLmLKKdD-TTsuUZVou2vdbxd0D9QR6pC_XY_z2cK-Ec_i7mICjIvR4YPbKET2bazHwZFPJKC_OyGs2Us9f1RopSTgaqSV7l4gG5EcUzhWMP3Azd4xOdVEL64x6f7WLJRJvnmpLmkD5Y63-k_4Z7bhbwIrH61E8LwjgddbaPgANhGtx_Tjkt5DESNWq0Mj89htAHSboNhEooCbGTMI',
            role: 'admin',
            status: 'online',
            email: 'mitchell.admin@company.com',
            phone: '(555) 100-0001'
        },
        {
            id: 2,
            username: 'manager',
            password: 'manager123',
            name: 'Sarah Jenkins',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuCKNLdSGt9GNQQuJhgynj9jMF8biu-5vOd1YwoD8OpHi382fdpmBH7v6lXuN-KLT9XoDNDpCD1tmIdVfDmVKmJInt-Ua0CJAtgriMV70mJX5aYvO9GWfth04SPmJd42EwHXYGk85oCk-vVW0BltZY2V5kicN7hbnBi7v74jWkBM_S33YA5rliWDtvzA77LvdoSijqTcpYOL7BvUhzqWtruL1pr18szcOOA3KM_YmVaeruHKy2MynScXv2toZyB2sTOiGtvraj_xs',
            role: 'manager',
            status: 'online',
            email: 'sarah.jenkins@company.com',
            phone: '(555) 100-0002'
        },
        {
            id: 3,
            username: 'marc',
            password: 'marc123',
            name: 'Marc Demo',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNvzmR2QaPryImJ6Eef1iIYM0QQU3MaUifxAWnO8Usf3XrtFHkd-josMO4s-7RBpjcvGGaR3rDVNORCNHWBvfbYM8vEH26sPNRYeIkYPZ8EV1-uI3yEQAGIFuPjpgdgFH-Baq18XKcinP1K8ZqRbj9GRtGQCIsNvEvM1z4q7GOCyQOkRMJcHnPCZb0j8gUMfjQs01QlHmCidDJ-Ti0SKcafXxew3dCjc8H4RbjKzMb1paF5OWux2ean-31V-WHuCiRa9ai2YTNup4',
            role: 'employee',
            status: 'offline',
            email: 'marc.demo@company.com',
            phone: '(555) 100-0003'
        },
        {
            id: 4,
            username: 'tina',
            password: 'tina123',
            name: 'Tina Williamson',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtLPoctX8BjJQdmoGiR7oxZnEMkJ4X6GajFyBZQw8NmrB75O_ICMDGudNyRqbr-xgB4T6n0aFvRkgbTQ97JwxHE7qoWveguu6Tp-neBxVCwoq82UL7WL8Unz_EH_bJrXseW1znXjOn1hNSniBevf613YxdXrMy-EVttCR_wzsa-dsx4eudABL144FWfIEvJ1XNHhKbK-mSMgVBRxd2AA3xcnqgdXzBT7Gg5DNnQBDrke9-Buo2GgSBF2EiRG4724oxUi-2ExE5qv4',
            role: 'employee',
            status: 'online',
            email: 'tina.williamson@company.com',
            phone: '(555) 100-0004'
        }
    ],

    // ============================================
    // DEPARTMENTS - Organizational Structure
    // ============================================
    departments: [
        {
            id: 1,
            name: 'Management',
            managerId: 1,
            parentId: null,
            color: '#0014A8',
            employeeCount: 5
        },
        {
            id: 2,
            name: 'Human Resources',
            managerId: 4,
            parentId: 1,
            color: '#29ABCB',
            employeeCount: 8
        },
        {
            id: 3,
            name: 'Research & Development',
            managerId: 2,
            parentId: 1,
            color: '#2E7D31',
            employeeCount: 15
        },
        {
            id: 4,
            name: 'Professional Services',
            managerId: 2,
            parentId: 1,
            color: '#F59E0B',
            employeeCount: 12
        },
        {
            id: 5,
            name: 'R&D USA',
            managerId: 3,
            parentId: 3,
            color: '#8B5CF6',
            employeeCount: 10
        }
    ],

    // ============================================
    // EMPLOYEES - Extended Employee Data
    // ============================================
    employees: [
        {
            id: 1,
            userId: 1,
            departmentId: 1,
            jobTitle: 'Chief Executive Officer',
            managerId: null,
            email: 'mitchell.admin@company.com',
            phone: '(555) 100-0001',
            location: 'New York, USA',
            joinDate: '2018-01-15',
            tags: ['Executive', 'Leadership'],
            resume: [
                { title: 'MBA', institution: 'Harvard Business School', year: '2015' },
                { title: 'BS Computer Science', institution: 'MIT', year: '2010' }
            ],
            skills: ['Strategic Planning', 'Leadership', 'Business Development', 'Finance']
        },
        {
            id: 2,
            userId: 2,
            departmentId: 3,
            jobTitle: 'Project Manager',
            managerId: 1,
            email: 'sarah.jenkins@company.com',
            phone: '(555) 100-0002',
            location: 'San Francisco, USA',
            joinDate: '2019-03-20',
            tags: ['Management', 'Agile'],
            resume: [
                { title: 'PMP Certification', institution: 'PMI', year: '2018' },
                { title: 'BS Management', institution: 'Stanford', year: '2014' }
            ],
            skills: ['Project Management', 'Agile', 'Scrum', 'Team Leadership']
        },
        {
            id: 3,
            userId: 3,
            departmentId: 5,
            jobTitle: 'Senior Developer',
            managerId: 2,
            email: 'marc.demo@company.com',
            phone: '(555) 100-0003',
            location: 'Austin, USA',
            joinDate: '2020-06-01',
            tags: ['Development', 'Full-Stack'],
            resume: [
                { title: 'MS Computer Science', institution: 'UT Austin', year: '2019' }
            ],
            skills: ['JavaScript', 'Python', 'React', 'Node.js', 'AWS']
        },
        {
            id: 4,
            userId: 4,
            departmentId: 2,
            jobTitle: 'HR Manager',
            managerId: 1,
            email: 'tina.williamson@company.com',
            phone: '(555) 100-0004',
            location: 'New York, USA',
            joinDate: '2019-09-15',
            tags: ['HR', 'Recruitment'],
            resume: [
                { title: 'SHRM-CP', institution: 'SHRM', year: '2017' },
                { title: 'BA Human Resources', institution: 'NYU', year: '2015' }
            ],
            skills: ['Recruitment', 'Employee Relations', 'Benefits Administration', 'Compliance']
        },
        {
            id: 5,
            userId: null,
            departmentId: 4,
            jobTitle: 'Consultant',
            managerId: 2,
            email: 'abigail.peterson@company.com',
            phone: '(555) 233-9988',
            location: 'Chicago, USA',
            joinDate: '2021-02-01',
            tags: ['Consulting', 'Client Relations'],
            resume: [
                { title: 'MBA', institution: 'Northwestern Kellogg', year: '2020' }
            ],
            skills: ['Business Analysis', 'Client Management', 'Strategy', 'Presentation']
        }
    ],

    // ============================================
    // PROJECTS - Project Management Data
    // ============================================
    projects: [
        {
            id: 1,
            name: 'Home Construction',
            managerId: 2,
            status: 'on_track',
            color: '#22C55E',
            startDate: '2023-09-10',
            endDate: '2023-12-15',
            description: 'Complete residential construction project including foundation, framing, and interior finishing.',
            tags: ['Renovation', 'External', 'High Priority'],
            milestones: { completed: 1, total: 3 },
            isFavorite: true
        },
        {
            id: 2,
            name: 'Office Design',
            managerId: 2,
            status: 'at_risk',
            color: '#F97316',
            startDate: '2023-10-01',
            endDate: '2023-11-30',
            description: 'Modern office space redesign focusing on collaborative work areas and ergonomic furniture.',
            tags: ['Digital', 'Urgent'],
            milestones: { completed: 2, total: 5 },
            isFavorite: false
        },
        {
            id: 3,
            name: 'Q4 Marketing Campaign',
            managerId: 3,
            status: 'delayed',
            color: '#6B7280',
            startDate: '2023-11-01',
            endDate: '2023-12-31',
            description: 'End-of-year marketing push including social media, email campaigns, and promotional events.',
            tags: ['Marketing', 'Q4'],
            milestones: { completed: 0, total: 2 },
            isFavorite: true
        },
        {
            id: 4,
            name: 'Office Renovation',
            managerId: 1,
            status: 'on_track',
            color: '#22C55E',
            startDate: '2023-08-15',
            endDate: '2024-01-30',
            description: 'Complete office building renovation including HVAC upgrade and modern amenities.',
            tags: ['Facilities', 'Long-term'],
            milestones: { completed: 3, total: 6 },
            isFavorite: false
        },
        {
            id: 5,
            name: 'Mobile App Development',
            managerId: 3,
            status: 'on_track',
            color: '#22C55E',
            startDate: '2023-07-01',
            endDate: '2024-02-28',
            description: 'Cross-platform mobile application for customer engagement and self-service.',
            tags: ['Development', 'Mobile', 'Strategic'],
            milestones: { completed: 4, total: 8 },
            isFavorite: false
        }
    ],

    // ============================================
    // TASKS - Task Management Data
    // ============================================
    tasks: [
        // Project 2 - Office Design (5 tasks)
        {
            id: 1,
            projectId: 2,
            title: 'Review and reply to emails',
            stage: 'In Progress',
            assigneeIds: [1],
            priority: 'normal',
            deadline: '2025-12-25',
            isOverdue: false,
            tags: ['Office'],
            statusColor: '#3B82F6',
            description: 'Review all pending emails from clients and team members. Prioritize urgent requests.'
        },
        {
            id: 2,
            projectId: 2,
            title: 'Room 1: Decoration',
            stage: 'In Progress',
            assigneeIds: [2],
            priority: 'high',
            deadline: '2023-11-05',
            isOverdue: true,
            tags: ['New Feature'],
            statusColor: '#EC4899',
            description: 'Complete interior decoration for conference room 1 including artwork and plants.'
        },
        {
            id: 7,
            projectId: 2,
            title: 'Furniture Selection Meeting',
            stage: 'New',
            assigneeIds: [2, 4],
            priority: 'normal',
            deadline: '2025-12-29',
            isOverdue: false,
            tags: ['Meeting', 'Planning'],
            statusColor: '#06B6D4',
            description: 'Meet with vendors to finalize furniture selection for the new office layout.'
        },
        {
            id: 8,
            projectId: 2,
            title: 'Lighting Design Review',
            stage: 'New',
            assigneeIds: [1],
            priority: 'normal',
            deadline: '2025-12-31',
            isOverdue: false,
            tags: ['Design', 'Review'],
            statusColor: '#10B981',
            description: 'Review proposed lighting designs for open workspace and private offices.'
        },
        {
            id: 9,
            projectId: 2,
            title: 'Floor Plan Approval',
            stage: 'Done',
            assigneeIds: [2, 3],
            priority: 'high',
            deadline: '2025-11-15',
            isOverdue: false,
            tags: ['Planning', 'Approval'],
            statusColor: '#22C55E',
            description: 'Get final approval on the new floor plan layout from stakeholders.'
        },

        // Project 3 - Q4 Marketing (3 tasks)
        {
            id: 4,
            projectId: 3,
            title: 'Design social media graphics',
            stage: 'New',
            assigneeIds: [3, 4],
            priority: 'high',
            deadline: '2025-12-30',
            isOverdue: false,
            tags: ['Marketing', 'Design'],
            statusColor: '#8B5CF6',
            description: 'Create graphics for Q4 campaign across Instagram, LinkedIn, and Twitter.'
        },
        {
            id: 10,
            projectId: 3,
            title: 'Email Campaign Setup',
            stage: 'In Progress',
            assigneeIds: [4],
            priority: 'high',
            deadline: '2025-12-28',
            isOverdue: false,
            tags: ['Marketing', 'Email'],
            statusColor: '#F97316',
            description: 'Set up automated email sequences for Q4 promotional campaign.'
        },
        {
            id: 11,
            projectId: 3,
            title: 'Analytics Dashboard',
            stage: 'New',
            assigneeIds: [3],
            priority: 'normal',
            deadline: '2026-01-05',
            isOverdue: false,
            tags: ['Marketing', 'Analytics'],
            statusColor: '#3B82F6',
            description: 'Create dashboard to track Q4 campaign performance metrics.'
        },

        // Project 4 - Office Renovation (4 tasks)
        {
            id: 6,
            projectId: 4,
            title: 'HVAC System Inspection',
            stage: 'In Progress',
            assigneeIds: [1, 2],
            priority: 'normal',
            deadline: '2025-12-27',
            isOverdue: false,
            tags: ['Facilities', 'Maintenance'],
            statusColor: '#F97316',
            description: 'Coordinate with contractors for HVAC system inspection and maintenance report.'
        },
        {
            id: 12,
            projectId: 4,
            title: 'Electrical Wiring Assessment',
            stage: 'Done',
            assigneeIds: [1],
            priority: 'high',
            deadline: '2025-11-20',
            isOverdue: false,
            tags: ['Facilities', 'Safety'],
            statusColor: '#22C55E',
            description: 'Complete electrical assessment and prepare upgrade recommendations.'
        },
        {
            id: 13,
            projectId: 4,
            title: 'Contractor Bid Review',
            stage: 'In Progress',
            assigneeIds: [1, 4],
            priority: 'normal',
            deadline: '2025-12-30',
            isOverdue: false,
            tags: ['Procurement', 'Review'],
            statusColor: '#3B82F6',
            description: 'Review and compare contractor bids for renovation work.'
        },
        {
            id: 14,
            projectId: 4,
            title: 'Safety Compliance Check',
            stage: 'New',
            assigneeIds: [2],
            priority: 'high',
            deadline: '2026-01-10',
            isOverdue: false,
            tags: ['Safety', 'Compliance'],
            statusColor: '#EF4444',
            description: 'Ensure all renovation plans meet building safety codes and regulations.'
        },

        // Project 5 - Mobile App (6 tasks)
        {
            id: 5,
            projectId: 5,
            title: 'Implement user authentication',
            stage: 'Done',
            assigneeIds: [3],
            priority: 'high',
            deadline: '2023-10-15',
            isOverdue: false,
            tags: ['Development', 'Security'],
            statusColor: '#22C55E',
            description: 'Implement OAuth2 authentication with support for Google and Microsoft accounts.'
        },
        {
            id: 15,
            projectId: 5,
            title: 'UI Component Library',
            stage: 'Done',
            assigneeIds: [3, 4],
            priority: 'high',
            deadline: '2025-11-01',
            isOverdue: false,
            tags: ['Development', 'UI'],
            statusColor: '#22C55E',
            description: 'Build reusable UI component library for consistent app design.'
        },
        {
            id: 16,
            projectId: 5,
            title: 'API Integration',
            stage: 'In Progress',
            assigneeIds: [3],
            priority: 'high',
            deadline: '2025-12-31',
            isOverdue: false,
            tags: ['Development', 'Backend'],
            statusColor: '#3B82F6',
            description: 'Integrate mobile app with backend REST APIs for data sync.'
        },
        {
            id: 17,
            projectId: 5,
            title: 'Push Notifications',
            stage: 'New',
            assigneeIds: [4],
            priority: 'normal',
            deadline: '2026-01-15',
            isOverdue: false,
            tags: ['Development', 'Features'],
            statusColor: '#8B5CF6',
            description: 'Implement push notification system for iOS and Android.'
        },
        {
            id: 18,
            projectId: 5,
            title: 'Performance Testing',
            stage: 'New',
            assigneeIds: [3],
            priority: 'normal',
            deadline: '2026-01-20',
            isOverdue: false,
            tags: ['Testing', 'QA'],
            statusColor: '#EAB308',
            description: 'Run performance tests and optimize app loading times.'
        },
        {
            id: 19,
            projectId: 5,
            title: 'Beta Release Preparation',
            stage: 'New',
            assigneeIds: [3, 4],
            priority: 'high',
            deadline: '2026-02-01',
            isOverdue: false,
            tags: ['Release', 'Planning'],
            statusColor: '#EC4899',
            description: 'Prepare app store listings and beta testing distribution.'
        },

        // Unassigned Tasks (2 tasks)
        {
            id: 3,
            projectId: null,
            title: 'Empty Trash Bins',
            stage: 'New',
            assigneeIds: [3],
            priority: 'low',
            deadline: '2025-12-28',
            isOverdue: false,
            tags: ['Work'],
            statusColor: '#EAB308',
            description: 'Weekly office maintenance task - empty all trash bins on the floor.'
        },
        {
            id: 20,
            projectId: null,
            title: 'Team Building Ideas',
            stage: 'New',
            assigneeIds: [1, 2, 3, 4],
            priority: 'low',
            deadline: '2026-01-31',
            isOverdue: false,
            tags: ['HR', 'Team'],
            statusColor: '#10B981',
            description: 'Brainstorm and plan upcoming team building activities for Q1.'
        }
    ],

    // ============================================
    // CHAT CHANNELS - Messaging System
    // ============================================
    chatChannels: [
        {
            id: 1,
            name: 'general',
            type: 'public',
            description: 'General announcements and discussions',
            memberIds: [1, 2, 3, 4]
        },
        {
            id: 2,
            name: 'Administrators',
            type: 'private',
            description: 'Admin-only discussions',
            memberIds: [1]
        },
        {
            id: 3,
            name: 'development',
            type: 'public',
            description: 'Development team discussions',
            memberIds: [2, 3]
        },
        {
            id: 4,
            name: 'hr-updates',
            type: 'public',
            description: 'HR announcements and policy updates',
            memberIds: [1, 4]
        }
    ],

    // ============================================
    // CHAT MESSAGES - Message History
    // ============================================
    chatMessages: [
        {
            id: 1,
            channelId: 1,
            senderId: null,
            content: 'Welcome to the #general channel! This is where we share company-wide updates.',
            timestamp: '2025-12-25T09:00:00',
            type: 'system'
        },
        {
            id: 2,
            channelId: 1,
            senderId: 3,
            content: 'Great news! Our company has received the Deloitte Fast 50 award. 🎉',
            timestamp: '2025-12-25T10:32:00',
            type: 'text'
        },
        {
            id: 3,
            channelId: 1,
            senderId: 1,
            content: 'Congratulations team! This is a testament to everyone\'s hard work. Let\'s keep pushing forward! 💪',
            timestamp: '2025-12-25T10:45:00',
            type: 'text'
        },
        {
            id: 4,
            channelId: 1,
            senderId: 4,
            content: 'Amazing achievement! I\'ll send out a company-wide email with the details.',
            timestamp: '2025-12-25T10:50:00',
            type: 'text'
        },
        {
            id: 5,
            channelId: 3,
            senderId: 3,
            content: 'Just pushed the new authentication module to staging. Ready for review.',
            timestamp: '2025-12-25T11:00:00',
            type: 'text'
        },
        {
            id: 6,
            channelId: 3,
            senderId: 2,
            content: 'Great work Marc! I\'ll review it this afternoon and provide feedback.',
            timestamp: '2025-12-25T11:15:00',
            type: 'text'
        },
        {
            id: 7,
            channelId: 4,
            senderId: 4,
            content: 'Reminder: Open enrollment for health benefits ends on December 31st.',
            timestamp: '2025-12-25T08:00:00',
            type: 'text'
        }
    ],

    // ============================================
    // ANNOUNCEMENTS - Company Announcements
    // ============================================
    announcements: [
        {
            id: 1,
            title: 'Annual Company Retreat & Q4 Goals',
            content: 'We are excited to announce the details for this year\'s retreat. The focus will be on team building, strategic planning for the upcoming year, and celebrating our Q3 successes. Please review the attached agenda and RSVP by Friday.',
            date: '2025-10-26',
            authorId: 1,
            type: 'General',
            isPinned: true,
            commentCount: 12
        },
        {
            id: 2,
            title: 'New Health Insurance Policy Updates',
            content: 'Important changes to our health insurance coverage starting January 1st. The new policy includes expanded mental health coverage, lower deductibles, and a new wellness program. Please review the attached documents.',
            date: '2025-12-24',
            authorId: 4,
            type: 'HR',
            isPinned: false,
            commentCount: 8
        },
        {
            id: 3,
            title: 'Scheduled Server Maintenance',
            content: 'Our IT team will be performing scheduled maintenance on the main servers this weekend. Expected downtime is Saturday 2 AM - 6 AM EST. Please save all work and log out before the maintenance window.',
            date: '2025-12-23',
            authorId: 3,
            type: 'IT',
            isPinned: false,
            commentCount: 3
        },
        {
            id: 4,
            title: 'Q4 Sales Results Announcement',
            content: 'We are thrilled to announce that we have exceeded our Q4 sales targets by 15%! This is our best quarter yet. Thank you to the entire sales team for their dedication and hard work.',
            date: '2025-12-20',
            authorId: 1,
            type: 'General',
            isPinned: false,
            commentCount: 25
        },
        {
            id: 5,
            title: 'Holiday Office Hours',
            content: 'The office will be closed from December 25th to January 1st for the holiday break. Emergency contacts are available in the shared drive. Happy holidays everyone!',
            date: '2025-12-18',
            authorId: 4,
            type: 'HR',
            isPinned: true,
            commentCount: 5
        }
    ],

    // ============================================
    // DIRECT MESSAGES - Private Messages
    // ============================================
    directMessages: [
        {
            id: 1,
            participantIds: [1, 3],
            lastMessageAt: '2025-12-25T11:30:00'
        },
        {
            id: 2,
            participantIds: [2, 4],
            lastMessageAt: '2025-12-25T10:00:00'
        }
    ]
};

// ============================================
// DATABASE CLASS
// ============================================

class Database {
    constructor() {
        this.storageKey = 'ems_database';
        this.init();
    }

    /**
     * Initialize the database
     * Load from localStorage or use default data
     */
    init() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            try {
                this._data = JSON.parse(stored);
                // Merge any new default collections that might not exist in stored data
                Object.keys(defaultData).forEach(key => {
                    if (!this._data[key]) {
                        this._data[key] = defaultData[key];
                    }
                });
            } catch (e) {
                console.error('Failed to parse stored data, using defaults:', e);
                this._data = JSON.parse(JSON.stringify(defaultData));
            }
        } else {
            this._data = JSON.parse(JSON.stringify(defaultData));
        }
        this.save();
    }

    /**
     * Save current state to localStorage
     */
    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this._data));
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
    }

    /**
     * Reset database to default values
     */
    reset() {
        this._data = JSON.parse(JSON.stringify(defaultData));
        this.save();
        console.log('Database reset to defaults');
    }

    // ============================================
    // GENERIC CRUD OPERATIONS
    // ============================================

    /**
     * Get all items from a collection
     */
    getAll(collection) {
        return this._data[collection] || [];
    }

    /**
     * Get item by ID
     */
    getById(collection, id) {
        const items = this.getAll(collection);
        return items.find(item => item.id === id) || null;
    }

    /**
     * Find items by criteria
     */
    find(collection, criteria) {
        const items = this.getAll(collection);
        return items.filter(item => {
            return Object.keys(criteria).every(key => item[key] === criteria[key]);
        });
    }

    /**
     * Find one item by criteria
     */
    findOne(collection, criteria) {
        const results = this.find(collection, criteria);
        return results.length > 0 ? results[0] : null;
    }

    /**
     * Add new item to collection
     */
    add(collection, item) {
        if (!this._data[collection]) {
            this._data[collection] = [];
        }
        // Generate new ID
        const maxId = this._data[collection].reduce((max, i) => Math.max(max, i.id || 0), 0);
        item.id = maxId + 1;
        this._data[collection].push(item);
        this.save();
        return item;
    }

    /**
     * Update existing item
     */
    update(collection, id, updates) {
        const items = this._data[collection];
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            this._data[collection][index] = { ...items[index], ...updates };
            this.save();
            return this._data[collection][index];
        }
        return null;
    }

    /**
     * Delete item by ID
     */
    delete(collection, id) {
        const items = this._data[collection];
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            this._data[collection].splice(index, 1);
            this.save();
            return true;
        }
        return false;
    }

    // ============================================
    // CONVENIENCE GETTERS
    // ============================================

    get users() { return this.getAll('users'); }
    get departments() { return this.getAll('departments'); }
    get employees() { return this.getAll('employees'); }
    get projects() { return this.getAll('projects'); }
    get tasks() { return this.getAll('tasks'); }
    get chatChannels() { return this.getAll('chatChannels'); }
    get chatMessages() { return this.getAll('chatMessages'); }
    get announcements() { return this.getAll('announcements'); }

    // ============================================
    // HELPER METHODS
    // ============================================

    /**
     * Get user by username
     */
    getUserByUsername(username) {
        return this.findOne('users', { username });
    }

    /**
     * Get employee by user ID
     */
    getEmployeeByUserId(userId) {
        return this.findOne('employees', { userId });
    }

    /**
     * Get tasks by project ID
     */
    getTasksByProject(projectId) {
        return this.find('tasks', { projectId });
    }

    /**
     * Get tasks by assignee
     */
    getTasksByAssignee(userId) {
        return this.getAll('tasks').filter(task => 
            task.assigneeIds && task.assigneeIds.includes(userId)
        );
    }

    /**
     * Get messages by channel
     */
    getMessagesByChannel(channelId) {
        return this.find('chatMessages', { channelId }).sort((a, b) => 
            new Date(a.timestamp) - new Date(b.timestamp)
        );
    }

    /**
     * Get employees by department
     */
    getEmployeesByDepartment(departmentId) {
        return this.find('employees', { departmentId });
    }

    /**
     * Get subordinates of a manager
     */
    getSubordinates(managerId) {
        return this.find('employees', { managerId });
    }

    /**
     * Get department hierarchy
     */
    getDepartmentTree() {
        const departments = this.getAll('departments');
        const buildTree = (parentId = null) => {
            return departments
                .filter(d => d.parentId === parentId)
                .map(d => ({
                    ...d,
                    children: buildTree(d.id)
                }));
        };
        return buildTree();
    }

    /**
     * Get announcements with author info
     */
    getAnnouncementsWithAuthors() {
        return this.getAll('announcements').map(a => ({
            ...a,
            author: this.getById('users', a.authorId)
        }));
    }

    /**
     * Get project statistics
     */
    getProjectStats(projectId) {
        const tasks = this.getTasksByProject(projectId);
        return {
            total: tasks.length,
            new: tasks.filter(t => t.stage === 'New').length,
            inProgress: tasks.filter(t => t.stage === 'In Progress').length,
            done: tasks.filter(t => t.stage === 'Done').length,
            overdue: tasks.filter(t => t.isOverdue).length
        };
    }
}

// ============================================
// EXPORT DATABASE INSTANCE
// ============================================

const db = new Database();

// Make it globally available
window.db = db;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { db, Database, defaultData };
}
