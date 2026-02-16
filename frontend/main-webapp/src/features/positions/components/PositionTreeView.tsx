import { useState, useCallback, type DragEvent } from "react";
import type { Position } from "./PositionCard";

interface PositionTreeViewProps {
  positions: Position;
  onPositionMove?: (draggedId: string, targetId: string) => void;
  onPositionClick?: (position: Position) => void;
}

// --- Chevron Icon for expand/collapse ---
const ChevronIcon = ({ expanded }: { expanded: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
  >
    <path d="M6 9L12 15L18 9" stroke="#62748E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// --- Avatar with initials fallback ---
const Avatar = ({
  name,
  avatar,
  size = 44,
  isVacant,
}: {
  name: string;
  avatar?: string;
  size?: number;
  isVacant?: boolean;
}) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const colors = [
    "bg-blue-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-purple-500",
    "bg-rose-500",
    "bg-cyan-500",
    "bg-indigo-500",
  ];
  const colorIndex = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;

  if (isVacant) {
    return (
      <div
        className="rounded-full bg-neutral-100 border-2 border-dashed border-neutral-300 flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="8" r="4" stroke="#90A1B9" strokeWidth="2" />
          <path d="M4 20C4 16.6863 7.13401 14 11 14H13C16.866 14 20 16.6863 20 20" stroke="#90A1B9" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className="rounded-full object-cover shrink-0 border-2 border-white shadow-sm"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`${colors[colorIndex]} rounded-full flex items-center justify-center shrink-0 text-white font-semibold border-2 border-white shadow-sm`}
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
};

// --- Status badge dot ---
const StatusDot = ({ status }: { status: string }) => {
  const statusColors: Record<string, string> = {
    primary: "bg-primary",
    on_track: "bg-emerald-500",
    off_track: "bg-rose-500",
  };
  return (
    <div
      className={`w-2 h-2 rounded-full ${statusColors[status] || "bg-neutral-300"}`}
    />
  );
};

// --- Tree Node Component (recursive) ---
interface TreeNodeProps {
  position: Position;
  isRoot?: boolean;
  collapsedNodes: Set<string>;
  onToggle: (id: string) => void;
  draggedId: string | null;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDrop: (targetId: string) => void;
  onPositionClick?: (position: Position) => void;
  level: number;
}

const TreeNode = ({
  position,
  isRoot = false,
  collapsedNodes,
  onToggle,
  draggedId,
  onDragStart,
  onDragEnd,
  onDrop,
  onPositionClick,
  level,
}: TreeNodeProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const children = position.children || [];
  const isCollapsed = collapsedNodes.has(position.id);
  const hasChildren = children.length > 0;
  const isDragging = draggedId === position.id;

  const handleDragStart = (e: DragEvent) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", position.id);
    onDragStart(position.id);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedId && draggedId !== position.id) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (draggedId && draggedId !== position.id) {
      onDrop(position.id);
    }
  };

  const handleDragEnd = () => {
    setIsDragOver(false);
    onDragEnd();
  };

  // Card border style
  const statusBorderColors: Record<string, string> = {
    primary: "border-t-primary",
    on_track: "border-t-emerald-500",
    off_track: "border-t-rose-500",
  };

  const status = position.status || "on_track";

  return (
    <div className="flex flex-col items-center">
      {/* Card */}
      <div
        draggable={!position.isVacant}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
        onClick={() => onPositionClick?.(position)}
        className={`
          relative group cursor-pointer select-none
          transition-all duration-200 ease-out
          ${isDragging ? "opacity-40 scale-95" : "opacity-100"}
          ${isDragOver ? "ring-2 ring-primary ring-offset-2 scale-[1.02]" : ""}
        `}
      >
        {/* The card itself */}
        <div
          className={`
            bg-white rounded-xl shadow-sm border
            ${position.isVacant ? "border-dashed border-neutral-400" : `border-neutral-100 border-t-4 ${statusBorderColors[status]}`}
            ${isRoot ? "px-4 py-3" : "px-3 py-2.5"}
            flex items-center gap-3
            hover:shadow-md hover:-translate-y-0.5
            transition-all duration-200
            ${isRoot ? "min-w-[240px]" : "w-[200px]"}
          `}
        >
          <Avatar
            name={position.name}
            avatar={position.avatar}
            size={isRoot ? 48 : 40}
            isVacant={position.isVacant}
          />

          <div className="flex flex-col flex-1 min-w-0">
            <p className={`font-semibold leading-tight truncate ${isRoot ? "text-sm" : "text-xs"} ${position.isVacant ? "text-neutral-400" : "text-neutral-900"}`}>
              {position.isVacant ? "Vacant" : position.name}
            </p>
            <p className={`text-[11px] leading-4 truncate ${position.isVacant ? "text-neutral-400" : "text-neutral-500"}`}>
              {position.title}
            </p>
            {!position.isVacant && (
              <div className="flex items-center gap-1 mt-0.5">
                <StatusDot status={status} />
                <span className="text-[10px] text-neutral-400 capitalize">{status.replace("_", " ")}</span>
              </div>
            )}
          </div>

          {/* Subordinate count badge */}
          {isRoot && position.subordinateCount !== undefined && position.subordinateCount > 0 && (
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-xs font-bold text-primary shrink-0">
              {position.subordinateCount}
            </div>
          )}
        </div>

        {/* Expand/collapse toggle */}
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(position.id);
            }}
            className={`
              absolute -bottom-3 left-1/2 -translate-x-1/2 z-10
              w-6 h-6 rounded-full bg-white border border-neutral-200 shadow-sm
              flex items-center justify-center
              hover:bg-neutral-50 hover:border-neutral-300
              transition-all duration-200
            `}
          >
            <ChevronIcon expanded={!isCollapsed} />
          </button>
        )}
      </div>

      {/* Children */}
      {hasChildren && !isCollapsed && (
        <div className="flex flex-col items-center mt-3">
          {/* Vertical connector from parent */}
          <div className="w-px h-6 bg-neutral-200" />

          {/* Horizontal connector + children row */}
          <div className="relative flex items-start">
            {/* Horizontal line connecting all children */}
            {children.length > 1 && (
              <div
                className="absolute top-0 h-px bg-neutral-200"
                style={{
                  left: `${100 / (children.length * 2)}%`,
                  right: `${100 / (children.length * 2)}%`,
                }}
              />
            )}

            {/* Children nodes */}
            {children.map((child, index) => (
              <div key={child.id} className="flex flex-col items-center px-3">
                {/* Vertical connector to child */}
                <div className="w-px h-4 bg-neutral-200" />

                {/* Recursive child */}
                <TreeNode
                  position={child}
                  collapsedNodes={collapsedNodes}
                  onToggle={onToggle}
                  draggedId={draggedId}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  onDrop={onDrop}
                  onPositionClick={onPositionClick}
                  level={level + 1}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main PositionTreeView ---
export default function PositionTreeView({
  positions,
  onPositionMove,
  onPositionClick,
}: PositionTreeViewProps) {
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleToggle = useCallback((id: string) => {
    setCollapsedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleDragStart = useCallback((id: string) => {
    setDraggedId(id);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedId(null);
  }, []);

  const handleDrop = useCallback(
    (targetId: string) => {
      if (draggedId && onPositionMove) {
        onPositionMove(draggedId, targetId);
      }
      setDraggedId(null);
    },
    [draggedId, onPositionMove]
  );

  return (
    <div className="w-full overflow-x-auto py-4">
      <div className="flex justify-center min-w-fit px-8">
        <TreeNode
          position={positions}
          isRoot
          collapsedNodes={collapsedNodes}
          onToggle={handleToggle}
          draggedId={draggedId}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
          onPositionClick={onPositionClick}
          level={0}
        />
      </div>
    </div>
  );
}
