import { useState, useCallback, useRef, useEffect, useMemo, type DragEvent } from "react";
import type { Position } from "./PositionCard";

// ===================== TYPES =====================
type DropMode = "replace" | "subordinate";

interface PositionTreeViewProps {
  positions: Position;
  onPositionMove?: (draggedId: string, targetId: string) => void;
  onPositionClick?: (position: Position) => void;
  unassignedEmployees?: UnassignedEmployee[];
  onEmployeeAssign?: (employeeId: string, targetPositionId: string, mode: DropMode) => void;
}

export interface UnassignedEmployee {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

// ===================== ICONS =====================
const ChevronIcon = ({ expanded }: { expanded: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
  >
    <path d="M6 9L12 15L18 9" stroke="#62748E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ZoomInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M11 8V14M8 11H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ZoomOutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M8 11H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const FitIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 3H21V9M9 21H3V15M21 3L14 10M3 21L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PanelToggleIcon = ({ open }: { open: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M15 3V21" stroke="currentColor" strokeWidth="2" />
    {open && <path d="M18 8L20 10L18 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />}
    {!open && <path d="M20 8L18 10L20 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />}
  </svg>
);

// ===================== AVATAR =====================
const Avatar = ({
  name,
  avatar,
  size = 40,
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
    "bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-purple-500",
    "bg-rose-500", "bg-cyan-500", "bg-indigo-500", "bg-teal-500",
  ];
  const colorIndex = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;

  if (isVacant) {
    return (
      <div
        className="rounded-full bg-neutral-100 border-2 border-dashed border-neutral-300 flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

// ===================== STATUS DOT =====================
const StatusDot = ({ status }: { status: string }) => {
  const statusColors: Record<string, string> = {
    primary: "bg-primary",
    on_track: "bg-emerald-500",
    off_track: "bg-rose-500",
  };
  return <div className={`w-2 h-2 rounded-full ${statusColors[status] || "bg-neutral-300"}`} />;
};

// ===================== HELPERS =====================

/** Count all visible (non-collapsed) nodes in the tree */
function countVisibleNodes(tree: Position, collapsedNodes: Set<string>): number {
  let count = 1;
  if (!collapsedNodes.has(tree.id) && tree.children) {
    for (const child of tree.children) {
      count += countVisibleNodes(child, collapsedNodes);
    }
  }
  return count;
}

/** Calculate zoom scale based on visible node count */
function calculateZoomScale(visibleCount: number): number {
  if (visibleCount <= 1) return 1;
  if (visibleCount <= 3) return 1;
  if (visibleCount <= 5) return 0.95;
  if (visibleCount <= 8) return 0.85;
  if (visibleCount <= 12) return 0.75;
  if (visibleCount <= 18) return 0.65;
  if (visibleCount <= 25) return 0.55;
  return Math.max(0.4, 1 - visibleCount * 0.02);
}

// ===================== TREE NODE =====================
interface TreeNodeProps {
  position: Position;
  isRoot?: boolean;
  collapsedNodes: Set<string>;
  onToggle: (id: string) => void;
  draggedId: string | null;
  dragType: "position" | "employee" | null;
  onDragStart: (id: string, type: "position" | "employee") => void;
  onDragEnd: () => void;
  onDrop: (targetId: string, mode: DropMode) => void;
  onPositionClick?: (position: Position) => void;
  level: number;
  nodeRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
}

const TreeNode = ({
  position,
  isRoot = false,
  collapsedNodes,
  onToggle,
  draggedId,
  dragType,
  onDragStart,
  onDragEnd,
  onDrop,
  onPositionClick,
  level,
  nodeRefs,
}: TreeNodeProps) => {
  const [dropZone, setDropZone] = useState<DropMode | null>(null);
  const children = position.children || [];
  const isCollapsed = collapsedNodes.has(position.id);
  const hasChildren = children.length > 0;
  const isDragging = draggedId === position.id && dragType === "position";

  const statusBorderColors: Record<string, string> = {
    primary: "border-t-primary",
    on_track: "border-t-emerald-500",
    off_track: "border-t-rose-500",
  };
  const status = position.status || "on_track";

  // Register ref for this node
  const cardRef = useCallback(
    (el: HTMLDivElement | null) => {
      if (el) {
        nodeRefs.current.set(position.id, el);
      } else {
        nodeRefs.current.delete(position.id);
      }
    },
    [position.id, nodeRefs]
  );

  const handleDragStart = (e: DragEvent) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", position.id);
    onDragStart(position.id, "position");
  };

  // Detect which half of the card the cursor is over
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedId && draggedId !== position.id) {
      const rect = e.currentTarget.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      setDropZone(e.clientY < midY ? "replace" : "subordinate");
    }
  };

  const handleDragLeave = () => setDropZone(null);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const mode = dropZone || "subordinate";
    setDropZone(null);
    if (draggedId && draggedId !== position.id) {
      onDrop(position.id, mode);
    }
  };

  const handleDragEnd = () => {
    setDropZone(null);
    onDragEnd();
  };

  const childCount = children.length;

  // Visual feedback for drop zones
  const dropRingClass =
    dropZone === "replace"
      ? "ring-2 ring-amber-400 ring-offset-2"
      : dropZone === "subordinate"
        ? "ring-2 ring-emerald-400 ring-offset-2"
        : "";

  return (
    <div className="flex flex-col items-center">
      {/* Card */}
      <div
        ref={cardRef}
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
          ${dropRingClass}
        `}
      >
        <div
          className={`
            bg-white rounded-xl shadow-sm border
            ${position.isVacant ? "border-dashed border-neutral-400" : `border-neutral-100 border-t-4 ${statusBorderColors[status]}`}
            ${isRoot ? "px-4 py-3" : "px-3 py-2.5"}
            flex items-center gap-3
            hover:shadow-md hover:-translate-y-0.5
            transition-all duration-200
            ${isRoot ? "min-w-[250px]" : "w-[200px]"}
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

          {hasChildren && (
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-[10px] font-bold text-primary shrink-0">
              {childCount}
            </div>
          )}
        </div>

        {/* Drop zone indicator label */}
        {dropZone && (
          <div
            className={`absolute left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[9px] font-bold whitespace-nowrap z-20 pointer-events-none
              ${dropZone === "replace"
                ? "-top-6 bg-amber-400 text-white"
                : "-bottom-6 bg-emerald-500 text-white"
              }`}
          >
            {dropZone === "replace" ? "⇄ Replace position" : "↓ Assign as subordinate"}
          </div>
        )}

        {/* Expand/collapse toggle */}
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(position.id);
            }}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10
              w-6 h-6 rounded-full bg-white border border-neutral-200 shadow-sm
              flex items-center justify-center
              hover:bg-neutral-50 hover:border-neutral-300
              transition-all duration-200"
          >
            <ChevronIcon expanded={!isCollapsed} />
          </button>
        )}
      </div>

      {/* Children — smooth animated expand/collapse */}
      {hasChildren && (
        <div
          className="overflow-hidden transition-all duration-400 ease-in-out"
          style={{
            maxHeight: isCollapsed ? "0px" : "5000px",
            opacity: isCollapsed ? 0 : 1,
            marginTop: isCollapsed ? "0px" : "16px",
          }}
        >
          <div className="flex flex-col items-center">
            {/* Vertical stem from parent down */}
            <div className="w-0.5 h-5 bg-neutral-300" />

            {/* Children with consistent padding for equal gaps */}
            <div className="flex items-start">
              {children.map((child, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === children.length - 1;
                const isOnly = children.length === 1;

                return (
                  <div
                    key={child.id}
                    className="flex flex-col items-center px-4"
                  >
                    {/* Horizontal connector using border-top */}
                    <div
                      style={{
                        width: "100%",
                        height: 0,
                        borderTop: isOnly ? "none" : "2px solid #cbd5e1",
                        ...(isFirst && !isOnly
                          ? { marginLeft: "50%", width: "50%" }
                          : {}),
                        ...(isLast && !isOnly
                          ? { marginRight: "50%", width: "50%" }
                          : {}),
                      }}
                    />
                    {/* Vertical drop to child card */}
                    <div className="w-0.5 h-4 bg-neutral-300" />
                    {/* Child card */}
                    <TreeNode
                      position={child}
                      collapsedNodes={collapsedNodes}
                      onToggle={onToggle}
                      draggedId={draggedId}
                      dragType={dragType}
                      onDragStart={onDragStart}
                      onDragEnd={onDragEnd}
                      onDrop={onDrop}
                      onPositionClick={onPositionClick}
                      level={level + 1}
                      nodeRefs={nodeRefs}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===================== UNASSIGNED EMPLOYEE CARD =====================
const UnassignedEmployeeCard = ({
  employee,
  onDragStart,
  onDragEnd,
  isDragging,
}: {
  employee: UnassignedEmployee;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}) => {
  const handleDragStart = (e: DragEvent) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", employee.id);
    onDragStart(employee.id);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      className={`
        flex items-center gap-2.5 px-3 py-2 bg-white rounded-lg border border-neutral-100
        cursor-grab active:cursor-grabbing hover:shadow-sm hover:border-neutral-200
        transition-all duration-150 select-none
        ${isDragging ? "opacity-40 scale-95" : ""}
      `}
    >
      <Avatar name={employee.name} avatar={employee.avatar} size={32} />
      <div className="flex flex-col min-w-0">
        <p className="text-xs font-semibold text-neutral-900 truncate">{employee.name}</p>
        {employee.role && (
          <p className="text-[10px] text-neutral-400 truncate">{employee.role}</p>
        )}
      </div>
    </div>
  );
};

// ===================== MAIN COMPONENT =====================
export default function PositionTreeView({
  positions,
  onPositionMove,
  onPositionClick,
  unassignedEmployees = [],
  onEmployeeAssign,
}: PositionTreeViewProps) {
  // Start with ALL nodes collapsed (only root visible)
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(() => {
    const allIds = new Set<string>();
    const collectIds = (pos: Position) => {
      if (pos.children && pos.children.length > 0) {
        allIds.add(pos.id);
        pos.children.forEach(collectIds);
      }
    };
    collectIds(positions);
    return allIds;
  });

  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragType, setDragType] = useState<"position" | "employee" | null>(null);
  const [manualZoomOffset, setManualZoomOffset] = useState(0);
  const [showPanel, setShowPanel] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const treeContentRef = useRef<HTMLDivElement>(null);
  const edgeScrollIntervalRef = useRef<number | null>(null);
  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // ---- Calculate visible node count & auto-zoom ----
  const visibleNodeCount = useMemo(
    () => countVisibleNodes(positions, collapsedNodes),
    [positions, collapsedNodes]
  );

  const autoScale = calculateZoomScale(visibleNodeCount);
  const zoomScale = Math.max(0.3, Math.min(1.5, autoScale + manualZoomOffset * 0.1));
  const zoomPercent = Math.round(zoomScale * 100);

  // ---- Center on root on mount ----
  useEffect(() => {
    const timer = setTimeout(() => {
      const rootEl = nodeRefs.current.get(positions.id);
      if (rootEl && scrollContainerRef.current) {
        rootEl.scrollIntoView({
          block: "center",
          inline: "center",
          behavior: "instant",
        });
      }
    }, 80);
    return () => clearTimeout(timer);
  }, [positions.id]);

  // ---- Focus camera on toggled node ----
  const focusOnNode = useCallback((nodeId: string) => {
    setTimeout(() => {
      const el = nodeRefs.current.get(nodeId);
      if (el && scrollContainerRef.current) {
        el.scrollIntoView({
          block: "center",
          inline: "center",
          behavior: "smooth",
        });
      }
    }, 150);
  }, []);

  // ---- Edge scrolling when dragging ----
  const EDGE_THRESHOLD = 60;
  const SCROLL_SPEED = 12;

  const startEdgeScrolling = useCallback(() => {
    if (edgeScrollIntervalRef.current) return;

    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    const onDragOver = (e: globalThis.DragEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("dragover", onDragOver);

    edgeScrollIntervalRef.current = window.setInterval(() => {
      const container = scrollContainerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();

      if (mouseX < rect.left + EDGE_THRESHOLD) container.scrollLeft -= SCROLL_SPEED;
      else if (mouseX > rect.right - EDGE_THRESHOLD) container.scrollLeft += SCROLL_SPEED;
      if (mouseY < rect.top + EDGE_THRESHOLD) container.scrollTop -= SCROLL_SPEED;
      else if (mouseY > rect.bottom - EDGE_THRESHOLD) container.scrollTop += SCROLL_SPEED;
    }, 16);

    (window as any).__edgeScrollCleanup = { onMouseMove, onDragOver };
  }, []);

  const stopEdgeScrolling = useCallback(() => {
    if (edgeScrollIntervalRef.current) {
      clearInterval(edgeScrollIntervalRef.current);
      edgeScrollIntervalRef.current = null;
    }
    const cleanup = (window as any).__edgeScrollCleanup;
    if (cleanup) {
      window.removeEventListener("mousemove", cleanup.onMouseMove);
      window.removeEventListener("dragover", cleanup.onDragOver);
      delete (window as any).__edgeScrollCleanup;
    }
  }, []);

  useEffect(() => {
    return () => stopEdgeScrolling();
  }, [stopEdgeScrolling]);

  // ---- Toggle handler with camera focus ----
  const handleToggle = useCallback(
    (id: string) => {
      setCollapsedNodes((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
      focusOnNode(id);
    },
    [focusOnNode]
  );

  // ---- Drag handlers ----
  const handleDragStart = useCallback(
    (id: string, type: "position" | "employee") => {
      setDraggedId(id);
      setDragType(type);
      startEdgeScrolling();
    },
    [startEdgeScrolling]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedId(null);
    setDragType(null);
    stopEdgeScrolling();
  }, [stopEdgeScrolling]);

  const handleDrop = useCallback(
    (targetId: string, mode: DropMode) => {
      if (!draggedId) return;

      if (dragType === "employee" && onEmployeeAssign) {
        onEmployeeAssign(draggedId, targetId, mode);
      } else if (dragType === "position" && onPositionMove) {
        onPositionMove(draggedId, targetId);
      }

      setDraggedId(null);
      setDragType(null);
      stopEdgeScrolling();
    },
    [draggedId, dragType, onPositionMove, onEmployeeAssign, stopEdgeScrolling]
  );

  const handleEmployeeDragStart = useCallback(
    (id: string) => {
      setDraggedId(id);
      setDragType("employee");
      startEdgeScrolling();
    },
    [startEdgeScrolling]
  );

  // ---- Manual zoom controls ----
  const handleZoomIn = () => setManualZoomOffset((v) => Math.min(v + 1, 5));
  const handleZoomOut = () => setManualZoomOffset((v) => Math.max(v - 1, -5));
  const handleZoomFit = () => setManualZoomOffset(0);

  const hasUnassigned = unassignedEmployees.length > 0;

  return (
    <div className="flex gap-3 w-full" style={{ height: "calc(100vh - 200px)" }}>
      {/* Tree area */}
      <div className="flex-1 flex flex-col rounded-xl border border-neutral-100 overflow-hidden bg-neutral-50/50 relative">
        {/* Toolbar: Zoom controls + Panel toggle */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg border border-neutral-200 shadow-sm px-1 py-0.5">
          <button
            onClick={handleZoomOut}
            className="p-1.5 hover:bg-neutral-100 rounded transition-colors text-neutral-500"
            title="Zoom out"
          >
            <ZoomOutIcon />
          </button>
          <span className="text-[10px] font-semibold text-neutral-500 w-8 text-center select-none">
            {zoomPercent}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1.5 hover:bg-neutral-100 rounded transition-colors text-neutral-500"
            title="Zoom in"
          >
            <ZoomInIcon />
          </button>
          <div className="w-px h-4 bg-neutral-200 mx-0.5" />
          <button
            onClick={handleZoomFit}
            className="p-1.5 hover:bg-neutral-100 rounded transition-colors text-neutral-500"
            title="Fit to view"
          >
            <FitIcon />
          </button>
          {hasUnassigned && (
            <>
              <div className="w-px h-4 bg-neutral-200 mx-0.5" />
              <button
                onClick={() => setShowPanel((v) => !v)}
                className={`p-1.5 rounded transition-colors ${showPanel ? "bg-primary/10 text-primary" : "hover:bg-neutral-100 text-neutral-500"}`}
                title={showPanel ? "Hide unassigned panel" : "Show unassigned panel"}
              >
                <PanelToggleIcon open={showPanel} />
              </button>
            </>
          )}
        </div>

        {/* Scrollable tree container */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-auto"
        >
          <div
            ref={treeContentRef}
            className="inline-flex justify-center px-8 py-6 transition-transform duration-300 ease-out"
            style={{
              minWidth: "100%",
              transform: `scale(${zoomScale})`,
              transformOrigin: "top center",
            }}
          >
            <TreeNode
              position={positions}
              isRoot
              collapsedNodes={collapsedNodes}
              onToggle={handleToggle}
              draggedId={draggedId}
              dragType={dragType}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
              onPositionClick={onPositionClick}
              level={0}
              nodeRefs={nodeRefs}
            />
          </div>
        </div>
      </div>

      {/* Unassigned Employees Panel — collapsible */}
      {hasUnassigned && showPanel && (
        <div className="w-[200px] shrink-0 bg-white rounded-xl border border-neutral-100 shadow-sm flex flex-col overflow-hidden transition-all duration-300">
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-neutral-100 bg-neutral-50/50">
            <UsersIcon />
            <span className="text-xs font-semibold text-neutral-700">Unassigned</span>
            <span className="ml-auto text-[10px] font-bold text-neutral-400 bg-neutral-100 rounded-full px-1.5 py-0.5">
              {unassignedEmployees.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
            {unassignedEmployees.map((emp) => (
              <UnassignedEmployeeCard
                key={emp.id}
                employee={emp}
                onDragStart={handleEmployeeDragStart}
                onDragEnd={handleDragEnd}
                isDragging={draggedId === emp.id}
              />
            ))}
          </div>

          {/* Drop zone legend */}
          <div className="px-3 py-2 border-t border-neutral-100 bg-neutral-50/30 space-y-1">
            <p className="text-[10px] text-neutral-500 font-semibold">Drag to a card:</p>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
              <span className="text-[9px] text-neutral-400">Top half → Replace position</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-[9px] text-neutral-400">Bottom half → Add subordinate</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
