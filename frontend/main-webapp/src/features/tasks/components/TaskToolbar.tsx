import type { ReactElement } from "react";
import type { ViewMode } from "../types";
import {
  SearchIcon,
  FilterIcon,
  KanbanIcon,
  ListIcon,
  TimelineIcon,
  CalendarViewIcon,
} from "./Icons";

interface TaskToolbarProps {
  projectName: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilter: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export default function TaskToolbar({
  projectName,
  searchQuery,
  onSearchChange,
  onFilter,
  viewMode,
  onViewModeChange,
}: TaskToolbarProps) {
  const viewModes: { mode: ViewMode; icon: (active: boolean) => ReactElement }[] = [
    { mode: "kanban", icon: (active) => <KanbanIcon active={active} /> },
    { mode: "list", icon: (active) => <ListIcon active={active} /> },
    { mode: "timeline", icon: (active) => <TimelineIcon active={active} /> },
    { mode: "calendar", icon: (active) => <CalendarViewIcon active={active} /> },
  ];

  return (
    <div className="bg-white flex flex-wrap items-center justify-between gap-3 px-3 py-1.5 rounded-[12px] shadow-sm border border-neutral-100">
      {/* Breadcrumb */}
      <div className="flex items-center h-8">
        <span className="font-normal text-sm leading-5 text-black">
          Project /{" "}
          <span className="text-primary">{projectName}</span>
        </span>
      </div>

      {/* Search Input */}
      <div className="w-full sm:w-[200px] lg:w-[240px] order-last sm:order-none">
        <div className="bg-white border border-neutral-200 rounded-[10px] flex items-center gap-2 px-2 h-8">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 bg-transparent outline-none text-neutral-900 text-sm font-normal placeholder:text-neutral-400"
          />
        </div>
      </div>

      {/* Filter Button */}
      <button
        onClick={onFilter}
        className="bg-neutral-50 border border-neutral-200 flex items-center gap-2 px-2 py-1.5 rounded-[8px] text-neutral-500 font-medium text-sm leading-5 hover:bg-neutral-100 transition-colors"
      >
        <FilterIcon />
        <span>Filter</span>
      </button>

      {/* View Mode Toggle */}
      <div className="flex items-center rounded-[8px] overflow-hidden">
        {viewModes.map(({ mode, icon }) => (
          <button
            key={mode}
            onClick={() => onViewModeChange(mode)}
            className={`p-2 transition-colors ${viewMode === mode
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
