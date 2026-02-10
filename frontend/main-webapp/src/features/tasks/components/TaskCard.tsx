import type { Task } from "../types";
import { FlagIcon, CalendarIcon } from "./Icons";

// Progress bar component
const ProgressBar = ({ progress }: { progress: number }) => {
  // Determine color based on progress
  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "bg-status-done";
    if (progress >= 50) return "bg-status-on_track";
    if (progress >= 25) return "bg-status-on_track";
    return "bg-status-on_track";
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${getProgressColor(progress)}`}
          style={{ width: `${Math.max(progress, 1)}%` }}
        />
      </div>
      <span className="font-medium text-xs leading-4 text-neutral-500 w-8 text-right shrink-0">
        {progress}%
      </span>
    </div>
  );
};

// Avatar stack component
const AvatarStack = ({ assignees }: { assignees: Task["assignees"] }) => {
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

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  return (
    <div
      className="bg-white rounded-[12px] shadow-sm border border-neutral-100 px-3 py-3 flex flex-col gap-3 cursor-pointer hover:shadow-md transition-shadow overflow-hidden min-w-0"
      onClick={onClick}
    >
      {/* Header: Title + Priority Flag */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-medium text-sm leading-5 text-neutral-900 flex-1">
          {task.title}
        </h3>
        <FlagIcon priority={task.priority} />
      </div>

      {/* Description */}
      <p className="font-normal text-xs leading-4 text-neutral-400 line-clamp-2">
        {task.description}
      </p>

      {/* Progress */}
      <ProgressBar progress={task.progress} />

      {/* Divider */}
      <div className="w-full h-px bg-neutral-200" />

      {/* Footer: Avatars + Due Date + Status Indicator */}
      <div className="flex items-center justify-between">
        <AvatarStack assignees={task.assignees} />

        <div className="flex items-center gap-2">
          <CalendarIcon />
          <span className="font-medium text-xs leading-4 text-neutral-400">
            {task.dueDate}
          </span>
        </div>

        {/* Status dot */}
        <div className="w-5 h-5 rounded-full bg-status-on_track" />
      </div>
    </div>
  );
}
