import { SearchIcon, FilterIcon, TreeViewIcon, ListViewIcon } from "./Icons";

type ViewMode = "tree" | "list";

interface PositionToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilter: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export default function PositionToolbar({
  searchQuery,
  onSearchChange,
  onFilter,
  viewMode,
  onViewModeChange,
}: PositionToolbarProps) {
  return (
    <div className="bg-white flex flex-wrap items-center justify-between gap-3 px-3 py-1.5 rounded-[12px] shadow-sm border border-neutral-100">
      {/* Page Title */}
      <h1 className="text-sm font-normal text-black">Position</h1>

      {/* Search Input */}
      <div className="bg-white border border-neutral-200 rounded-[10px] flex items-center gap-2 px-2 py-1.5 w-full sm:w-auto sm:min-w-[200px] lg:min-w-[240px]">
        <SearchIcon />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 bg-transparent outline-none text-neutral-900 text-sm placeholder:text-neutral-400"
        />
      </div>

      {/* Filter Button */}
      <button
        onClick={onFilter}
        className="bg-neutral-200 flex items-center gap-2 px-2 py-1 rounded-[8px] hover:bg-neutral-200/80 transition-colors"
      >
        <FilterIcon />
        <span className="text-neutral-500 font-medium text-sm">Filter</span>
      </button>

      {/* View Mode Toggle */}
      <div className="flex items-center rounded-[8px] overflow-hidden">
        <button
          onClick={() => onViewModeChange("tree")}
          className={`p-2 transition-colors ${viewMode === "tree"
              ? "bg-primary"
              : "bg-neutral-200 hover:bg-neutral-200/80"
            }`}
          aria-label="Tree View"
        >
          <TreeViewIcon active={viewMode === "tree"} />
        </button>
        <button
          onClick={() => onViewModeChange("list")}
          className={`p-2 transition-colors ${viewMode === "list"
              ? "bg-primary"
              : "bg-neutral-200 hover:bg-neutral-200/80"
            }`}
          aria-label="List View"
        >
          <ListViewIcon active={viewMode === "list"} />
        </button>
      </div>
    </div>
  );
}
