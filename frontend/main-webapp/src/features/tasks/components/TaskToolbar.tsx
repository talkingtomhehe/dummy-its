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
    <div className="bg-white flex flex-wrap items-center justify-between gap-4 px-6 lg:px-10 py-2.5 rounded-[20px] shadow-[0px_4px_4px_0px_#e2e8f0]">
      {/* Breadcrumb */}
      <div className="flex items-center h-10">
        <span className="font-normal text-lg leading-[22px] text-black">
          Project /{" "}
          <span className="text-primary">{projectName}</span>
        </span>
      </div>

      {/* Search Input */}
      <div className="w-full sm:w-[250px] lg:w-[315px] order-last sm:order-none">
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
        className="bg-neutral-50 border border-neutral-200 flex items-center gap-2.5 px-2 py-2 rounded-[10px] text-neutral-500 font-medium text-lg leading-[22px] hover:bg-neutral-100 transition-colors"
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
