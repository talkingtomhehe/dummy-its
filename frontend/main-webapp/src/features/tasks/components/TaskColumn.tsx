import { useState, useRef, useEffect } from "react";
import type { Stage, Task } from "../types";
import TaskCard from "./TaskCard";
import { MoreVertIcon, ChevronIcon, AddIcon } from "../../../components/common/Icons";

// Rename icon
const RenameIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Clear icon
const ClearIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Delete icon
const DeleteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface TaskColumnProps {
  stage: Stage;
  onAddTask?: () => void;
  onSettings?: () => void;
  onTaskClick?: (task: Task) => void;
  onDeleteStage?: () => void;
  onRenameStage?: () => void;
  onClearTasks?: () => void;
}

export default function TaskColumn({ stage, onAddTask, onTaskClick, onDeleteStage, onRenameStage, onClearTasks }: TaskColumnProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <div
      className={`flex flex-col gap-2 flex-shrink-0 p-1.5 transition-all duration-300 ease-in-out ${isCollapsed ? "min-w-[56px] w-[56px]" : "min-w-[240px] lg:min-w-[280px]"
        }`}
    >
      {/* Column Header */}
      {isCollapsed ? (
        /* Collapsed header — vertical bar */
        <div className="flex flex-col items-center gap-2 py-1.5">
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-1 hover:bg-neutral-100 rounded transition-colors"
            aria-label="Expand stage"
          >
            <ChevronIcon collapsed={true} />
          </button>
          <div className="relative">
            <div className="w-5 h-5 rounded-full bg-neutral-200 flex items-center justify-center">
              <span className="font-medium text-xs text-neutral-500">
                {stage.tasks.length}
              </span>
            </div>
          </div>
          <span
            className="font-medium text-sm text-neutral-500 whitespace-nowrap"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {stage.title.toUpperCase()}
          </span>
        </div>
      ) : (
        /* Expanded header */
        <div className="flex items-center justify-between py-1.5 px-1.5">
          <div className="flex items-center gap-1.5">
            {/* Collapse chevron */}
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-0.5 hover:bg-neutral-100 rounded transition-colors"
              aria-label="Collapse stage"
            >
              <ChevronIcon collapsed={false} />
            </button>
            <span className="font-medium text-sm leading-5 text-neutral-500 uppercase">
              {stage.title}
            </span>
            {/* Count Badge */}
            <div className="relative">
              <div className="w-5 h-5 rounded-full bg-neutral-200 flex items-center justify-center">
                <span className="font-medium text-xs text-neutral-500">
                  {stage.tasks.length}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* 3-dots menu */}
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1 hover:bg-neutral-100 rounded transition-colors text-neutral-500"
                aria-label="Stage options"
              >
                <MoreVertIcon />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 z-30 min-w-[160px] animate-dropdown">
                  <button
                    className="w-full text-left px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-2"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onRenameStage?.();
                    }}
                  >
                    <RenameIcon />
                    Rename Stage
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-2"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onClearTasks?.();
                    }}
                  >
                    <ClearIcon />
                    Clear Tasks
                  </button>
                  <div className="h-px bg-neutral-100 my-1" />
                  <button
                    className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onDeleteStage?.();
                    }}
                  >
                    <DeleteIcon />
                    Delete Stage
                  </button>
                </div>
              )}
            </div>
            {/* Add task */}
            <button
              onClick={onAddTask}
              className="p-1 hover:bg-neutral-100 rounded transition-colors text-neutral-500"
              aria-label="Add task"
            >
              <AddIcon />
            </button>
          </div>
        </div>
      )}

      {/* Task Cards — animated collapse */}
      {!isCollapsed && (
        <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-1 animate-fadeIn">
          {stage.tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => onTaskClick?.(task)} />
          ))}
        </div>
      )}
    </div>
  );
}
