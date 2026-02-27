import { useState } from "react";
import { useParams, Link } from "react-router-dom";

// Search Icon
const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="8" stroke="#90A1B9" strokeWidth="2" />
    <path d="M21 21L16.65 16.65" stroke="#90A1B9" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Star Icon
const StarIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      fill={filled ? "#FFD230" : "none"}
      stroke="#FFD230"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Arrow Right Icon
const ArrowRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#0F172B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Milestone Icons
const CompletedMilestoneIcon = () => (
  <svg width="40" height="40" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="28" fill="#00A63E" />
    <path d="M20 30L27 37L40 24" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LateMilestoneIcon = () => (
  <svg width="40" height="40" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="28" fill="#E7000B" />
    <path d="M30 20V32" stroke="white" strokeWidth="4" strokeLinecap="round" />
    <circle cx="30" cy="40" r="2.5" fill="white" />
  </svg>
);

const UpcomingMilestoneIcon = () => (
  <svg width="40" height="40" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="28" stroke="#90A1B9" strokeWidth="2" fill="white" />
    <rect x="20" y="18" width="20" height="20" rx="2" stroke="#90A1B9" strokeWidth="2" fill="none" />
    <line x1="24" y1="16" x2="24" y2="20" stroke="#90A1B9" strokeWidth="2" strokeLinecap="round" />
    <line x1="36" y1="16" x2="36" y2="20" stroke="#90A1B9" strokeWidth="2" strokeLinecap="round" />
    <line x1="20" y1="26" x2="40" y2="26" stroke="#90A1B9" strokeWidth="2" />
  </svg>
);

// Types
interface Milestone {
  id: string;
  title: string;
  date: string;
  status: "completed" | "late" | "upcoming";
}

interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
}

type ProjectStatus = "planning" | "in_progress" | "on_hold" | "completed";

interface ProjectDetail {
  id: string;
  title: string;
  description: string;
  projectManager: TeamMember;
  customer: string;
  tags: { label: string; type: "department" | "scope" }[];
  teamMembers: TeamMember[];
  plannedStartDate: string;
  plannedEndDate: string;
  priority: "urgent" | "high" | "medium" | "low";
  status: ProjectStatus;
  progress: number;
  daysRemaining: number;
  milestones: Milestone[];
  isStarred: boolean;
}

// Status Badge Component
const StatusBadge = ({ status }: { status: ProjectStatus }) => {
  const styles: Record<ProjectStatus, string> = {
    planning: "bg-status-on_hold/15 text-status-on_hold",
    in_progress: "bg-status-on_track/15 text-status-on_track",
    on_hold: "bg-status-on_hold/15 text-status-on_hold",
    completed: "bg-status-done/15 text-status-done",
  };

  const labels: Record<ProjectStatus, string> = {
    planning: "Planning",
    in_progress: "In Progress",
    on_hold: "On Hold",
    completed: "Completed",
  };

  return (
    <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full font-medium text-xs leading-4 ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

// Kanban Board Icon for Manage Tasks button
const KanbanIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="4" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="6" y="1" width="4" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="11" y="1" width="4" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

// Recent Task Item
interface RecentTask {
  id: string;
  title: string;
  priority: "urgent" | "high" | "medium" | "low";
  progress: number;
  assignee: string;
  dueDate: string;
}

const RecentTaskItem = ({ task }: { task: RecentTask }) => {
  const priorityColors: Record<string, string> = {
    urgent: "bg-[#E7000B]",
    high: "bg-[#FF6900]",
    medium: "bg-[#FFD230]",
    low: "bg-neutral-400",
  };

  return (
    <div className="flex items-center gap-3 py-2 px-1 hover:bg-neutral-50 rounded-lg transition-colors">
      <div className={`w-2 h-2 rounded-full shrink-0 ${priorityColors[task.priority]}`} />
      <span className="font-medium text-sm text-neutral-900 flex-1 truncate">{task.title}</span>
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-16 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
          <div className="h-full bg-status-on_track rounded-full" style={{ width: `${task.progress}%` }} />
        </div>
        <span className="text-xs text-neutral-400 w-8 text-right">{task.progress}%</span>
      </div>
      <div className="w-6 h-6 rounded-full bg-status-on_track flex items-center justify-center text-[10px] font-medium text-neutral-900 shrink-0">
        {task.assignee.charAt(0).toUpperCase()}
      </div>
      <span className="text-xs text-neutral-400 shrink-0 hidden sm:inline">{task.dueDate}</span>
    </div>
  );
};

const mockRecentTasks: RecentTask[] = [
  { id: "t1", title: "Design homepage wireframes", priority: "high", progress: 75, assignee: "Alice", dueDate: "Feb 28" },
  { id: "t2", title: "Set up CI/CD pipeline", priority: "urgent", progress: 30, assignee: "Bob", dueDate: "Mar 1" },
  { id: "t3", title: "Implement user authentication", priority: "medium", progress: 50, assignee: "Charlie", dueDate: "Mar 5" },
  { id: "t4", title: "Database schema migration", priority: "low", progress: 0, assignee: "Diana", dueDate: "Mar 10" },
];

// Tag Badge Component (reusing pattern from ProjectCard)
const TagBadge = ({ label, type }: { label: string; type: "department" | "scope" }) => {
  const styles = {
    department: "bg-tag-department/15 text-tag-department",
    scope: "bg-tag-scope/15 text-tag-scope",
  };

  return (
    <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full font-medium text-xs leading-4 ${styles[type]}`}>
      {label}
    </span>
  );
};

// Priority Badge Component
const PriorityBadge = ({ priority }: { priority: ProjectDetail["priority"] }) => {
  const styles = {
    urgent: "bg-status-off_track/15 text-status-off_track",
    high: "bg-status-off_track/15 text-status-off_track",
    medium: "bg-status-on_track/15 text-status-on_track",
    low: "bg-neutral-500/15 text-neutral-500",
  };

  const labels = {
    urgent: "Urgent",
    high: "High",
    medium: "Medium",
    low: "Low",
  };

  return (
    <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full font-medium text-xs leading-4 ${styles[priority]}`}>
      {labels[priority]}
    </span>
  );
};

// Milestone Status Badge
const MilestoneStatusBadge = ({ status }: { status: Milestone["status"] }) => {
  const styles = {
    completed: "bg-status-done/15 text-status-done",
    late: "bg-status-off_track/15 text-status-off_track",
    upcoming: "bg-neutral-500/15 text-neutral-500",
  };

  const labels = {
    completed: "Completed",
    late: "Late",
    upcoming: "Upcoming",
  };

  return (
    <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full font-medium text-xs leading-4 ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

// Avatar Stack Component
const AvatarStack = ({ members, maxDisplay = 3 }: { members: TeamMember[]; maxDisplay?: number }) => {
  const displayMembers = members.slice(0, maxDisplay);
  const remaining = members.length - maxDisplay;

  return (
    <div className="flex items-center -space-x-2">
      {displayMembers.map((member, index) => (
        <div
          key={member.id}
          className="w-7 h-7 rounded-full bg-status-on_track border-2 border-white flex items-center justify-center text-xs font-medium text-neutral-900"
          style={{ zIndex: maxDisplay - index }}
          title={member.name}
        >
          {member.avatar ? (
            <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            member.name.charAt(0).toUpperCase()
          )}
        </div>
      ))}
      {remaining > 0 && (
        <div className="w-7 h-7 rounded-full bg-neutral-200 border-2 border-white flex items-center justify-center text-xs font-medium text-neutral-900">
          +{remaining}
        </div>
      )}
    </div>
  );
};

// Milestone Item Component
const MilestoneItem = ({ milestone }: { milestone: Milestone }) => {
  const iconMap = {
    completed: <CompletedMilestoneIcon />,
    late: <LateMilestoneIcon />,
    upcoming: <UpcomingMilestoneIcon />,
  };

  return (
    <div className="flex flex-col items-center gap-0.5 min-w-[120px] lg:min-w-[140px]">
      {iconMap[milestone.status]}
      <h4 className="font-bold text-sm leading-5 text-neutral-900 text-center mt-0.5">
        {milestone.title}
      </h4>
      <p className="font-medium text-xs leading-4 text-neutral-400 text-center">
        {milestone.date}
      </p>
      <MilestoneStatusBadge status={milestone.status} />
    </div>
  );
};

// Mock Data
const mockProject: ProjectDetail = {
  id: "1",
  title: "ABC WEBSITE",
  description: "The bla bla...",
  projectManager: { id: "1", name: "John Doe", avatar: "" },
  customer: "Jane",
  tags: [{ label: "External", type: "scope" }],
  teamMembers: [
    { id: "1", name: "Alice", avatar: "" },
    { id: "2", name: "Bob", avatar: "" },
    { id: "3", name: "Charlie", avatar: "" },
    { id: "4", name: "Diana", avatar: "" },
    { id: "5", name: "Eve", avatar: "" },
    { id: "6", name: "Frank", avatar: "" },
    { id: "7", name: "Grace", avatar: "" },
    { id: "8", name: "Henry", avatar: "" },
    { id: "9", name: "Ivy", avatar: "" },
    { id: "10", name: "Jack", avatar: "" },
    { id: "11", name: "Kate", avatar: "" },
  ],
  plannedStartDate: "01/01/2026",
  plannedEndDate: "01/02/2026",
  priority: "high",
  status: "in_progress",
  progress: 75,
  daysRemaining: 3,
  milestones: [
    { id: "1", title: "Proposal Approval", date: "Sep 15, 2026", status: "completed" },
    { id: "2", title: "Proposal Approval", date: "Sep 15, 2026", status: "late" },
    { id: "3", title: "Proposal Approval", date: "Sep 15, 2026", status: "upcoming" },
    { id: "4", title: "Proposal Approval", date: "Sep 15, 2026", status: "upcoming" },
  ],
  isStarred: false,
};

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [status, setStatus] = useState<ProjectStatus>(mockProject.status);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  // TODO: Fetch project data based on projectId from API
  // For now, using mock data
  console.log("Loading project:", projectId);
  const project = mockProject;

  const statusOptions: { value: ProjectStatus; label: string }[] = [
    { value: "planning", label: "Planning" },
    { value: "in_progress", label: "In Progress" },
    { value: "on_hold", label: "On Hold" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <div className="flex flex-col gap-3 w-full max-w-full">
      {/* Breadcrumb Bar with Search */}
      <div className="bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-3 py-1.5 rounded-[12px] shadow-sm border border-neutral-100">
        <nav className="text-sm leading-5 text-neutral-900">
          <Link to="/projects" className="hover:text-primary transition-colors">
            Project
          </Link>
          <span className="mx-1">/</span>
          <span className="text-primary font-normal">{project.title}</span>
        </nav>

        {/* Search Input */}
        <div className="bg-white border border-neutral-200 rounded-[10px] flex items-center gap-2 px-2 h-8 w-full sm:w-[200px] lg:w-[240px]">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 bg-transparent outline-none text-sm leading-5 text-neutral-900 placeholder:text-neutral-400"
          />
        </div>
      </div>

      {/* Headline Card */}
      <div className="bg-white flex flex-col gap-4 p-3 rounded-[12px] shadow-sm border border-neutral-100">
        {/* Title Row with Progress */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          {/* Title + Star + Manage Tasks */}
          <div className="flex items-center gap-2 shrink-0">
            <h1 className="font-bold text-lg leading-6 text-neutral-900">
              {project.title}
            </h1>
            <button type="button" className="shrink-0 hover:scale-110 transition-transform" aria-label="Toggle star">
              <StarIcon filled={project.isStarred} />
            </button>
            <Link
              to={`/projects/${projectId}/tasks`}
              className="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
            >
              <KanbanIcon />
              Manage Tasks
            </Link>
          </div>

          {/* Progress Section */}
          <div className="flex flex-col gap-0.5 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-medium text-xs leading-4 text-neutral-500">
                {project.daysRemaining} days remaining until deadline
              </span>
              <span className="font-medium text-sm leading-5 text-neutral-900">
                {project.progress}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-status-on_track rounded-full transition-all"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-16 gap-y-3 py-1">
          {/* Left Column */}
          <div className="grid grid-cols-[100px_1fr] lg:grid-cols-[120px_1fr] gap-x-4 lg:gap-x-8 gap-y-3">
            {/* Project Manager */}
            <span className="font-medium text-xs leading-4 text-neutral-900">Project Manager</span>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-status-on_track flex items-center justify-center text-xs font-medium text-neutral-900">
                {project.projectManager.avatar ? (
                  <img src={project.projectManager.avatar} alt={project.projectManager.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  project.projectManager.name.charAt(0).toUpperCase()
                )}
              </div>
              <span className="text-xs leading-4 text-neutral-900">{project.projectManager.name}</span>
            </div>

            {/* Customer */}
            <span className="font-medium text-xs leading-4 text-neutral-900">Customer</span>
            <span className="text-xs leading-4 text-neutral-900">{project.customer}</span>

            {/* Tags */}
            <span className="font-medium text-xs leading-4 text-neutral-900">Tags</span>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <TagBadge key={index} label={tag.label} type={tag.type} />
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="grid grid-cols-[100px_1fr] lg:grid-cols-[120px_1fr] gap-x-4 lg:gap-x-8 gap-y-3">
            {/* Team Members */}
            <span className="font-medium text-xs leading-4 text-neutral-900">Team Members</span>
            <AvatarStack members={project.teamMembers} maxDisplay={3} />

            {/* Planned Date */}
            <span className="font-medium text-xs leading-4 text-neutral-900">Planned Date</span>
            <div className="flex items-center gap-3">
              <span className="text-xs leading-4 text-neutral-900">{project.plannedStartDate}</span>
              <ArrowRightIcon />
              <span className="text-xs leading-4 text-neutral-900">{project.plannedEndDate}</span>
            </div>

            {/* Priority */}
            <span className="font-medium text-xs leading-4 text-neutral-900">Priority</span>
            <PriorityBadge priority={project.priority} />

            {/* Status */}
            <span className="font-medium text-xs leading-4 text-neutral-900">Status</span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsStatusOpen(!isStatusOpen)}
                className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
              >
                <StatusBadge status={status} />
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-transform ${isStatusOpen ? 'rotate-180' : ''}`}>
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="#90A1B9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {isStatusOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 z-20 min-w-[140px]">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-neutral-50 transition-colors ${status === option.value ? 'font-bold' : ''
                        }`}
                      onClick={() => {
                        setStatus(option.value);
                        setIsStatusOpen(false);
                        console.log('Status changed to:', option.value);
                      }}
                    >
                      <StatusBadge status={option.value} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Milestones Card */}
      <div className="bg-white flex flex-col gap-3 p-3 rounded-[12px] shadow-sm border border-neutral-100 relative overflow-hidden">
        {/* Horizontal connecting line (visible on larger screens) */}
        <div className="hidden lg:block absolute top-[90px] left-[40px] right-[40px] h-[2px] bg-neutral-200" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-sm leading-5 text-neutral-900">
            Project Milestones
          </h2>
          <button type="button" className="font-bold text-xs leading-4 text-primary hover:underline">
            View all
          </button>
        </div>

        {/* Milestones Grid */}
        <div className="flex flex-wrap justify-center lg:justify-between gap-4 lg:gap-6 px-2 lg:px-4 py-1 relative z-10">
          {project.milestones.map((milestone) => (
            <MilestoneItem key={milestone.id} milestone={milestone} />
          ))}
        </div>
      </div>

      {/* Recent Tasks Card */}
      <div className="bg-white flex flex-col gap-2 p-3 rounded-[12px] shadow-sm border border-neutral-100">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-sm leading-5 text-neutral-900">
            Recent Tasks
          </h2>
          <Link
            to={`/projects/${projectId}/tasks`}
            className="font-bold text-xs leading-4 text-primary hover:underline inline-flex items-center gap-1"
          >
            View All Tasks
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
        <div className="flex flex-col divide-y divide-neutral-100">
          {mockRecentTasks.map((task) => (
            <RecentTaskItem key={task.id} task={task} />
          ))}
        </div>
      </div>

      {/* Description Card */}
      <div className="bg-white flex flex-col gap-3 p-3 rounded-[12px] shadow-sm border border-neutral-100">
        <h2 className="font-bold text-sm leading-5 text-neutral-900">
          Description
        </h2>
        <p className="text-xs leading-4 text-neutral-900">
          {project.description}
        </p>
      </div>
    </div>
  );
}
