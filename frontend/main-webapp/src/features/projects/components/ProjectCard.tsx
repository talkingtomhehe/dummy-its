import type { Project, Tag, Priority } from "../types";

// Priority flag icons
const FlagIcon = ({ priority }: { priority: Priority }) => {
  const colors: Record<Priority, string> = {
    urgent: "#E7000B",
    high: "#FF6900",
    medium: "#FFD230",
    low: "#99A1AF",
  };

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 15C4 15 5 14 8 14C11 14 13 16 16 16C19 16 20 15 20 15V3C20 3 19 4 16 4C13 4 11 2 8 2C5 2 4 3 4 3V15Z"
        fill={colors[priority]}
        stroke={colors[priority]}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 22V15" stroke={colors[priority]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// Calendar icon
const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2.5" y="3.33" width="15" height="15" rx="2" stroke="#90A1B9" strokeWidth="1.5" />
    <line x1="13.33" y1="1.67" x2="13.33" y2="5" stroke="#90A1B9" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="6.67" y1="1.67" x2="6.67" y2="5" stroke="#90A1B9" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="2.5" y1="8.33" x2="17.5" y2="8.33" stroke="#90A1B9" strokeWidth="1.5" />
  </svg>
);

// Tag component
const TagBadge = ({ tag }: { tag: Tag }) => {
  const styles = {
    department: "bg-tag-department/15 text-tag-department",
    scope: "bg-tag-scope/15 text-tag-scope",
  };

  return (
    <span
      className={`inline-flex items-center justify-center px-2 py-1 rounded-full font-medium text-xs leading-4 ${styles[tag.type]}`}
    >
      {tag.label}
    </span>
  );
};

// Progress bar component
const ProgressBar = ({ progress, status }: { progress: number; status: Project["status"] }) => {
  const progressColors: Record<Project["status"], string> = {
    planning: "bg-status-on_hold",
    in_progress: "bg-status-on_track",
    on_hold: "bg-status-on_hold",
    completed: "bg-status-done",
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${progressColors[status]}`}
          style={{ width: `${Math.max(progress, 1)}%` }}
        />
      </div>
      <span className="font-medium text-xs leading-4 text-neutral-500 w-8 text-right">
        {progress}%
      </span>
    </div>
  );
};

// Avatar stack component
const AvatarStack = ({ assignees }: { assignees: Project["assignees"] }) => {
  const displayCount = Math.min(assignees.length, 3);
  const displayAssignees = assignees.slice(0, displayCount);

  return (
    <div className="flex -space-x-2">
      {displayAssignees.map((assignee, index) => (
        <div
          key={assignee.id}
          className="w-6 h-6 rounded-full bg-status-on_track border-2 border-white flex items-center justify-center text-xs font-medium text-neutral-900"
          style={{ zIndex: displayCount - index }}
          title={assignee.name}
        >
          {assignee.avatar ? (
            <img
              src={assignee.avatar}
              alt={assignee.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            assignee.name.charAt(0).toUpperCase()
          )}
        </div>
      ))}
    </div>
  );
};

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-white rounded-[12px] shadow-sm border border-neutral-100 px-3 py-3 flex flex-col gap-3 overflow-hidden min-w-0 cursor-pointer card-hover">
      {/* Header: Tags + Priority */}
      <div className="flex items-start justify-between">
        <div className="flex flex-wrap gap-1">
          {project.tags.map((tag, index) => (
            <TagBadge key={index} tag={tag} />
          ))}
        </div>
        <FlagIcon priority={project.priority} />
      </div>

      {/* Title */}
      <h3 className="font-medium text-sm leading-[18px] text-neutral-900">
        {project.title}
      </h3>


      {/* Progress */}
      <ProgressBar progress={project.progress} status={project.status} />

      {/* Divider */}
      <div className="w-full h-px bg-neutral-200" />

      {/* Footer: Avatars + Due Date */}
      <div className="flex items-center justify-between">
        <AvatarStack assignees={project.assignees} />

        <div className="flex items-center gap-2">
          <CalendarIcon />
          <span className="font-medium text-xs leading-4 text-neutral-400">
            {project.dueDate}
          </span>
        </div>
      </div>
    </div>
  );
}
