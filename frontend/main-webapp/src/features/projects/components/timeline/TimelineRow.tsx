import type { ProjectTimelineItem } from "./types";
import { statusLabels, priorityColors } from "./types";
import { FlagIcon } from "./TimelineIcons";

interface TimelineRowProps {
  project: ProjectTimelineItem;
  onClick?: () => void;
}

// Avatar component
const Avatar = ({ name, avatar }: { name: string; avatar?: string }) => (
  <div
    className="w-6 h-6 rounded-full bg-status-on_track flex items-center justify-center text-xs font-medium text-neutral-900 shrink-0"
    title={name}
  >
    {avatar ? (
      <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
    ) : (
      name.charAt(0).toUpperCase()
    )}
  </div>
);

export default function TimelineRow({ project, onClick }: TimelineRowProps) {
  const owner = project.assignees[0];

  return (
    <div
      className="flex items-center gap-4 px-4 py-3 border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      {/* Project Name */}
      <div className="w-48 min-w-[12rem] flex items-center gap-2 truncate">
        <FlagIcon color={priorityColors[project.priority]} />
        <span className="font-medium text-neutral-900 truncate">{project.title}</span>
      </div>

      {/* Owner */}
      <div className="w-32 min-w-[8rem] flex items-center gap-2">
        {owner && (
          <>
            <Avatar name={owner.name} avatar={owner.avatar} />
            <span className="text-sm text-neutral-600 truncate">{owner.name}</span>
          </>
        )}
      </div>

      {/* Status */}
      <div className="w-24 min-w-[6rem]">
        <span
          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
            project.status === "completed"
              ? "bg-status-done/15 text-status-done"
              : project.status === "in_progress"
              ? "bg-primary/15 text-primary"
              : project.status === "on_hold"
              ? "bg-status-off_track/15 text-status-off_track"
              : "bg-status-on_hold/15 text-status-on_hold"
          }`}
        >
          {statusLabels[project.status]}
        </span>
      </div>
    </div>
  );
}
