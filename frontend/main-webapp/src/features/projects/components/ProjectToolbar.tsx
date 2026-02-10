import type { ReactElement } from "react";

// Icons
const AddIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="8" stroke="#90A1B9" strokeWidth="2"/>
    <path d="M21 21L16.65 16.65" stroke="#90A1B9" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const FilterIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="#90A1B9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const KanbanIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="5" height="18" rx="1" fill={active ? "white" : "#62748E"}/>
    <rect x="10" y="3" width="5" height="12" rx="1" fill={active ? "white" : "#62748E"}/>
    <rect x="17" y="3" width="5" height="15" rx="1" fill={active ? "white" : "#62748E"}/>
  </svg>
);

const ListIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 6H21" stroke={active ? "white" : "#62748E"} strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 12H21" stroke={active ? "white" : "#62748E"} strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 18H21" stroke={active ? "white" : "#62748E"} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="4" cy="6" r="1" fill={active ? "white" : "#62748E"}/>
    <circle cx="4" cy="12" r="1" fill={active ? "white" : "#62748E"}/>
    <circle cx="4" cy="18" r="1" fill={active ? "white" : "#62748E"}/>
  </svg>
);

const TimelineIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="14" width="4" height="7" fill={active ? "white" : "#62748E"}/>
    <rect x="10" y="10" width="4" height="11" fill={active ? "white" : "#62748E"}/>
    <rect x="17" y="3" width="4" height="18" fill={active ? "white" : "#62748E"}/>
  </svg>
);

const CalendarIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke={active ? "white" : "#62748E"} strokeWidth="2"/>
    <line x1="16" y1="2" x2="16" y2="6" stroke={active ? "white" : "#62748E"} strokeWidth="2" strokeLinecap="round"/>
    <line x1="8" y1="2" x2="8" y2="6" stroke={active ? "white" : "#62748E"} strokeWidth="2" strokeLinecap="round"/>
    <line x1="3" y1="10" x2="21" y2="10" stroke={active ? "white" : "#62748E"} strokeWidth="2"/>
  </svg>
);

type ViewMode = "kanban" | "list" | "timeline" | "calendar";

interface ProjectToolbarProps {
  onNewProject: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilter: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export default function ProjectToolbar({
  onNewProject,
  searchQuery,
  onSearchChange,
  onFilter,
  viewMode,
  onViewModeChange,
}: ProjectToolbarProps) {
  const viewModes: { mode: ViewMode; icon: (active: boolean) => ReactElement }[] = [
    { mode: "kanban", icon: (active) => <KanbanIcon active={active} /> },
    { mode: "list", icon: (active) => <ListIcon active={active} /> },
    { mode: "timeline", icon: (active) => <TimelineIcon active={active} /> },
    { mode: "calendar", icon: (active) => <CalendarIcon active={active} /> },
  ];

  return (
    <div className="bg-white flex items-center justify-between px-6 lg:px-10 py-2.5 rounded-[20px] shadow-[0px_4px_4px_0px_#e2e8f0] mx-6 mt-6">
      {/* New Project Button */}
      <button
        onClick={onNewProject}
        className="bg-secondary border border-primary flex items-center gap-2.5 px-4 py-2 rounded-[10px] text-primary font-medium text-base leading-5 hover:bg-secondary/80 transition-colors"
      >
        <AddIcon />
        <span>New Project</span>
      </button>

      {/* Page Title */}
      <h1 className="font-normal text-lg leading-[22px] text-black">
        Project
      </h1>

      {/* Search Input */}
      <div className="w-[250px] lg:w-[315px]">
        <div className="bg-white border border-neutral-200 rounded-[20px] flex items-center gap-2.5 px-3 h-10">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 bg-transparent outline-none text-neutral-900 text-base font-normal placeholder:text-neutral-400"
          />
        </div>
      </div>

      {/* Filter Button */}
      <button
        onClick={onFilter}
        className="bg-neutral-50 border border-neutral-200 flex items-center gap-2.5 px-2 py-2 rounded-[10px] text-neutral-400 font-medium text-lg leading-[22px] hover:bg-neutral-100 transition-colors"
      >
        <FilterIcon />
        <span>Filter</span>
      </button>

      {/* View Mode Toggle */}
      <div className="flex items-center rounded-[10px] overflow-hidden">
        {viewModes.map(({ mode, icon }) => (
          <button
            key={mode}
            onClick={() => onViewModeChange(mode)}
            className={`p-2 transition-colors ${
              viewMode === mode
                ? "bg-primary"
                : "bg-neutral-200 hover:bg-neutral-300"
            }`}
            aria-label={`${mode} view`}
          >
            {icon(viewMode === mode)}
          </button>
        ))}
      </div>
    </div>
  );
}
