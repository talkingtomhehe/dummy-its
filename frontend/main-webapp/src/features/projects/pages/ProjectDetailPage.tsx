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
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="28" fill="#00A63E" />
    <path d="M20 30L27 37L40 24" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LateMilestoneIcon = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="28" fill="#E7000B" />
    <path d="M30 20V32" stroke="white" strokeWidth="4" strokeLinecap="round" />
    <circle cx="30" cy="40" r="2.5" fill="white" />
  </svg>
);

const UpcomingMilestoneIcon = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  progress: number;
  daysRemaining: number;
  milestones: Milestone[];
  isStarred: boolean;
}

// Tag Badge Component (reusing pattern from ProjectCard)
const TagBadge = ({ label, type }: { label: string; type: "department" | "scope" }) => {
  const styles = {
    department: "bg-tag-department/15 text-tag-department",
    scope: "bg-tag-scope/15 text-tag-scope",
  };

  return (
    <span className={`inline-flex items-center justify-center px-2.5 py-2 rounded-[20px] font-medium text-sm leading-[18px] ${styles[type]}`}>
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
    <span className={`inline-flex items-center justify-center px-2.5 py-2 rounded-[20px] font-medium text-sm leading-[18px] ${styles[priority]}`}>
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
    <span className={`inline-flex items-center justify-center px-2.5 py-2 rounded-[20px] font-medium text-base leading-5 ${styles[status]}`}>
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
          className="w-10 h-10 rounded-full bg-status-on_track border-2 border-white flex items-center justify-center text-sm font-medium text-neutral-900"
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
        <div className="w-10 h-10 rounded-full bg-neutral-200 border-2 border-white flex items-center justify-center text-sm font-medium text-neutral-900">
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
    <div className="flex flex-col items-center gap-0.5 min-w-[160px] lg:min-w-[180px]">
      {iconMap[milestone.status]}
      <h4 className="font-bold text-lg lg:text-[22px] leading-[26px] text-neutral-900 text-center mt-1">
        {milestone.title}
      </h4>
      <p className="font-medium text-base leading-5 text-neutral-400 text-center">
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
  
  // TODO: Fetch project data based on projectId from API
  // For now, using mock data
  console.log("Loading project:", projectId);
  const project = mockProject;

  return (
    <div className="flex flex-col gap-4 lg:gap-5 w-full max-w-full">
      {/* Breadcrumb Bar with Search */}
      <div className="bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 lg:px-5 py-2.5 rounded-[20px] shadow-[0px_4px_4px_0px_#e2e8f0]">
        <nav className="text-lg leading-[22px] text-neutral-900">
          <Link to="/projects" className="hover:text-primary transition-colors">
            Project
          </Link>
          <span className="mx-1">/</span>
          <span className="text-primary font-normal">{project.title}</span>
        </nav>

        {/* Search Input */}
        <div className="bg-white border border-neutral-200 rounded-[20px] flex items-center gap-2.5 px-2.5 py-2 w-full sm:w-[280px] lg:w-[315px]">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 bg-transparent outline-none text-base leading-5 text-neutral-900 placeholder:text-neutral-400"
          />
        </div>
      </div>

      {/* Headline Card */}
      <div className="bg-white flex flex-col gap-6 lg:gap-8 p-4 lg:p-5 rounded-[20px] shadow-[0px_4px_4px_0px_#e2e8f0]">
        {/* Title Row with Progress */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
          {/* Title + Star */}
          <div className="flex items-center gap-2.5 shrink-0">
            <h1 className="font-bold text-2xl lg:text-4xl leading-tight lg:leading-[40px] text-neutral-900">
              {project.title}
            </h1>
            <button type="button" className="shrink-0 hover:scale-110 transition-transform" aria-label="Toggle star">
              <StarIcon filled={project.isStarred} />
            </button>
          </div>

          {/* Progress Section */}
          <div className="flex flex-col gap-0.5 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-medium text-base leading-5 text-neutral-500">
                {project.daysRemaining} days remaining until deadline
              </span>
              <span className="font-medium text-lg leading-[22px] text-neutral-900">
                {project.progress}%
              </span>
            </div>
            <div className="w-full h-4 bg-neutral-200 rounded-[20px] overflow-hidden">
              <div
                className="h-full bg-status-on_track rounded-[20px] transition-all"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 lg:gap-x-32 xl:gap-x-44 gap-y-4 lg:gap-y-6 py-2">
          {/* Left Column */}
          <div className="grid grid-cols-[120px_1fr] lg:grid-cols-[145px_1fr] gap-x-8 lg:gap-x-12 gap-y-4 lg:gap-y-6">
            {/* Project Manager */}
            <span className="font-medium text-sm leading-[18px] text-neutral-900">Project Manager</span>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-status-on_track flex items-center justify-center text-sm font-medium text-neutral-900">
                {project.projectManager.avatar ? (
                  <img src={project.projectManager.avatar} alt={project.projectManager.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  project.projectManager.name.charAt(0).toUpperCase()
                )}
              </div>
              <span className="text-sm leading-[18px] text-neutral-900">{project.projectManager.name}</span>
            </div>

            {/* Customer */}
            <span className="font-medium text-sm leading-[18px] text-neutral-900">Customer</span>
            <span className="text-sm leading-[18px] text-neutral-900">{project.customer}</span>

            {/* Tags */}
            <span className="font-medium text-sm leading-[18px] text-neutral-900">Tags</span>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <TagBadge key={index} label={tag.label} type={tag.type} />
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="grid grid-cols-[120px_1fr] lg:grid-cols-[145px_1fr] gap-x-8 lg:gap-x-12 gap-y-4 lg:gap-y-6">
            {/* Team Members */}
            <span className="font-medium text-sm leading-[18px] text-neutral-900">Team Members</span>
            <AvatarStack members={project.teamMembers} maxDisplay={3} />

            {/* Planned Date */}
            <span className="font-medium text-sm leading-[18px] text-neutral-900">Planned Date</span>
            <div className="flex items-center gap-4">
              <span className="text-sm leading-[18px] text-neutral-900">{project.plannedStartDate}</span>
              <ArrowRightIcon />
              <span className="text-sm leading-[18px] text-neutral-900">{project.plannedEndDate}</span>
            </div>

            {/* Priority */}
            <span className="font-medium text-sm leading-[18px] text-neutral-900">Priority</span>
            <PriorityBadge priority={project.priority} />
          </div>
        </div>
      </div>

      {/* Milestones Card */}
      <div className="bg-white flex flex-col gap-4 lg:gap-5 p-4 lg:p-5 rounded-[20px] shadow-[0px_4px_4px_0px_#e2e8f0] relative overflow-hidden">
        {/* Horizontal connecting line (visible on larger screens) */}
        <div className="hidden lg:block absolute top-[130px] left-[60px] right-[60px] h-[2px] bg-neutral-200" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg lg:text-[22px] leading-[26px] text-neutral-900">
            Project Milestones
          </h2>
          <button type="button" className="font-bold text-lg lg:text-[22px] leading-[26px] text-primary hover:underline">
            View all
          </button>
        </div>

        {/* Milestones Grid */}
        <div className="flex flex-wrap justify-center lg:justify-between gap-6 lg:gap-8 xl:gap-16 px-2 lg:px-8 py-2 relative z-10">
          {project.milestones.map((milestone) => (
            <MilestoneItem key={milestone.id} milestone={milestone} />
          ))}
        </div>
      </div>

      {/* Description Card */}
      <div className="bg-white flex flex-col gap-4 lg:gap-5 p-4 lg:p-5 rounded-[20px] shadow-[0px_4px_4px_0px_#e2e8f0]">
        <h2 className="font-bold text-lg lg:text-[22px] leading-[26px] text-neutral-900">
          Description
        </h2>
        <p className="text-base lg:text-lg leading-[22px] text-neutral-900">
          {project.description}
        </p>
      </div>
    </div>
  );
}
