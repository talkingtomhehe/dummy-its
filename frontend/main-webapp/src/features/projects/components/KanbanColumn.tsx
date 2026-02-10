import ProjectCard from "./ProjectCard";
import type { Project, ProjectStatus } from "../types";

// More options icon
const MoreVertIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="5" r="1.5" fill="#62748E"/>
    <circle cx="12" cy="12" r="1.5" fill="#62748E"/>
    <circle cx="12" cy="19" r="1.5" fill="#62748E"/>
  </svg>
);

interface KanbanColumnProps {
  title: string;
  projects: Project[];
  status: ProjectStatus;
}

export default function KanbanColumn({ title, projects }: KanbanColumnProps) {
  return (
    <div className="flex flex-col gap-5 min-w-[300px] lg:min-w-[351px] flex-shrink-0">
      {/* Column Header */}
      <div className="flex items-center justify-between py-2.5">
        <div className="flex items-center gap-2.5">
          <span className="font-medium text-lg leading-[22px] text-neutral-500">
            {title}
          </span>
          {/* Count Badge */}
          <div className="relative">
            <div className="w-5 h-5 rounded-full bg-neutral-200" />
            <span className="absolute inset-0 flex items-center justify-center font-medium text-xs text-neutral-500">
              {projects.length}
            </span>
          </div>
        </div>

        {/* More Options */}
        <button className="p-1 hover:bg-neutral-100 rounded transition-colors">
          <MoreVertIcon />
        </button>
      </div>

      {/* Project Cards */}
      <div className="flex flex-col gap-5 overflow-y-auto flex-1 pr-1">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
