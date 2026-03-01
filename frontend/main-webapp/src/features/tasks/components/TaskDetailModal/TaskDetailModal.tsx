import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import type { TaskDetail, TaskDetailModalProps } from "./types";
import type { Assignee } from "../../types";
import SubTaskList from "./SubTaskList";
import ActivityLog from "./ActivityLog";
import PrioritySelector from "./PrioritySelector";
import StatusSelector from "./StatusSelector";
import AssigneeSelector from "./AssigneeSelector";
import {
  CloseIcon,
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  BulletListIcon,
  NumberListIcon,
  LinkIcon,
  ImageIcon,
  CalendarSmallIcon,
} from "../../../../components/common/Icons";
import Button from "../../../../components/common/Button";

// Mock assignee options - would come from API in real app
const mockAssignees: Assignee[] = [
  { id: "1", name: "Sarah Jenkins", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
  { id: "2", name: "John Doe", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John" },
  { id: "3", name: "Alice Smith", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice" },
  { id: "4", name: "Bob Wilson" },
];

// Interactive Progress bar with slider
const ProgressBar = ({ progress, onChange }: { progress: number; onChange?: (value: number) => void }) => {
  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "bg-status-done";
    if (progress >= 50) return "bg-status-on_track";
    return "bg-primary";
  };

  const getThumbColor = (progress: number) => {
    if (progress >= 75) return "#00A63E";
    if (progress >= 50) return "#22C55E";
    return "#0014A8";
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-500">Progress</span>
        <div className="flex items-center gap-1">
          <input
            type="number"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => {
              const val = Math.max(0, Math.min(100, Number(e.target.value) || 0));
              onChange?.(val);
            }}
            className="w-10 text-right text-sm font-medium text-primary bg-transparent outline-none border-b border-transparent focus:border-primary transition-colors"
          />
          <span className="text-sm font-medium text-primary">%</span>
        </div>
      </div>
      <div className="relative">
        <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-200 ${getProgressColor(progress)}`}
            style={{ width: `${Math.max(progress, 1)}%` }}
          />
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => onChange?.(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ cursor: 'pointer' }}
        />
        {/* Visible thumb indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md transition-all duration-200 pointer-events-none"
          style={{
            left: `calc(${progress}% - 8px)`,
            backgroundColor: getThumbColor(progress),
          }}
        />
      </div>
    </div>
  );
};

// Description editor toolbar
const EditorToolbar = () => (
  <div className="flex items-center gap-1 py-2 px-3 border-b border-neutral-200">
    <button className="p-1.5 hover:bg-neutral-100 rounded transition-colors">
      <BoldIcon />
    </button>
    <button className="p-1.5 hover:bg-neutral-100 rounded transition-colors">
      <ItalicIcon />
    </button>
    <button className="p-1.5 hover:bg-neutral-100 rounded transition-colors">
      <StrikethroughIcon />
    </button>
    <div className="w-px h-5 bg-neutral-200 mx-1" />
    <button className="p-1.5 hover:bg-neutral-100 rounded transition-colors">
      <BulletListIcon />
    </button>
    <button className="p-1.5 hover:bg-neutral-100 rounded transition-colors">
      <NumberListIcon />
    </button>
    <div className="w-px h-5 bg-neutral-200 mx-1" />
    <button className="p-1.5 hover:bg-neutral-100 rounded transition-colors">
      <LinkIcon />
    </button>
    <button className="p-1.5 hover:bg-neutral-100 rounded transition-colors">
      <ImageIcon />
    </button>
  </div>
);

export default function TaskDetailModal({
  task: initialTask,
  isOpen,
  onClose,
  onSave,
}: TaskDetailModalProps) {
  const [task, setTask] = useState<TaskDetail>(initialTask);

  // Reset task when modal opens with new data
  useEffect(() => {
    setTask(initialTask);
  }, [initialTask]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleSave = useCallback(() => {
    onSave(task);
    onClose();
  }, [task, onSave, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Container - Laptop First: max-width 1440px, responsive padding */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-6">
        <div
          className="w-full max-w-[900px] xl:max-w-[1000px] max-h-[90vh] bg-white rounded-[20px] shadow-xl overflow-hidden flex flex-col animate-slideUp relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sticky Header */}
          <div className="flex items-center justify-between px-6 lg:px-8 py-4 border-b border-neutral-200 bg-white shrink-0">
            <h1 className="text-xl lg:text-2xl font-bold text-neutral-900 pr-4 truncate">
              {task.title}
            </h1>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors shrink-0"
              aria-label="Close modal"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-8">

            {/* Two Column Layout */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Left Column - Main Content */}
              <div className="flex-1 flex flex-col gap-6 min-w-0">
                {/* Description Section */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-neutral-900">
                    Description
                  </label>
                  <div className="border border-neutral-200 rounded-xl overflow-hidden">
                    <EditorToolbar />
                    <textarea
                      value={task.description}
                      onChange={(e) =>
                        setTask({ ...task, description: e.target.value })
                      }
                      className="w-full min-h-[100px] p-4 text-sm text-neutral-900 placeholder:text-neutral-400 resize-none outline-none"
                      placeholder="Add a description..."
                    />
                  </div>
                </div>

                {/* Sub-tasks Section */}
                <SubTaskList
                  subTasks={task.subTasks}
                  onChange={(subTasks) => setTask({ ...task, subTasks })}
                />

                {/* Activity & Comments */}
                <ActivityLog
                  activities={task.activities}
                  comments={task.comments}
                  onAddComment={(content) => {
                    const newComment = {
                      id: `cmt-${Date.now()}`,
                      user: { id: "current", name: "You" },
                      content,
                      timestamp: "Just now",
                    };
                    setTask({
                      ...task,
                      comments: [...task.comments, newComment],
                    });
                  }}
                />
              </div>

              {/* Right Column - Metadata Sidebar */}
              <div className="w-full lg:w-[280px] xl:w-[300px] flex flex-col gap-5 flex-shrink-0">
                {/* Assignee */}
                <AssigneeSelector
                  value={task.assignees[0] || null}
                  options={mockAssignees}
                  onChange={(assignee) =>
                    setTask({ ...task, assignees: [assignee] })
                  }
                />

                {/* Status */}
                <StatusSelector
                  value={task.status}
                  onChange={(status) => setTask({ ...task, status })}
                />

                {/* Due Date */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-neutral-500">
                    Due Date
                  </label>
                  <div className="flex items-center gap-3 px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl">
                    <CalendarSmallIcon />
                    <input
                      type="text"
                      value={task.dueDate}
                      onChange={(e) =>
                        setTask({ ...task, dueDate: e.target.value })
                      }
                      className="flex-1 bg-transparent text-sm text-neutral-900 outline-none"
                      placeholder="Select date"
                    />
                  </div>
                </div>

                {/* Priority */}
                <PrioritySelector
                  value={task.priority}
                  onChange={(priority) => setTask({ ...task, priority })}
                />

                {/* Progress */}
                <ProgressBar
                  progress={task.progress}
                  onChange={(value) => setTask({ ...task, progress: value })}
                />

                {/* Metadata */}
                <div className="flex flex-col gap-3 pt-4 border-t border-neutral-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-400">Created</span>
                    <span className="text-sm text-neutral-500">
                      {task.createdAt}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-400">Updated</span>
                    <span className="text-sm text-neutral-500">
                      {task.updatedAt}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-400">Key</span>
                    <span className="text-sm text-neutral-500">{task.key}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions - Fixed at bottom */}
          <div className="flex items-center justify-end gap-3 px-6 lg:px-8 py-4 border-t border-neutral-200 bg-white">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Task
            </Button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
