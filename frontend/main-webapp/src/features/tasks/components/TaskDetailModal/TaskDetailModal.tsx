import { useState, useEffect, useCallback } from "react";
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
} from "./ModalIcons";
import Button from "../../../../components/common/Button";

// Mock assignee options - would come from API in real app
const mockAssignees: Assignee[] = [
  { id: "1", name: "Sarah Jenkins", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
  { id: "2", name: "John Doe", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John" },
  { id: "3", name: "Alice Smith", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice" },
  { id: "4", name: "Bob Wilson" },
];

// Progress bar component matching existing TaskCard style
const ProgressBar = ({ progress }: { progress: number }) => {
  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "bg-status-done";
    if (progress >= 50) return "bg-status-on_track";
    return "bg-primary";
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-500">Progress</span>
        <span className="text-sm font-medium text-primary">{progress}%</span>
      </div>
      <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${getProgressColor(progress)}`}
          style={{ width: `${Math.max(progress, 1)}%` }}
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

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Container - Laptop First: max-width 1440px, responsive padding */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-6">
        <div
          className="w-full max-w-[900px] xl:max-w-[1000px] max-h-[90vh] bg-white rounded-[20px] shadow-xl overflow-hidden flex flex-col animate-slideUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-lg transition-colors z-10"
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-8">
            {/* Title */}
            <h1 className="text-xl lg:text-2xl font-bold text-neutral-900 pr-10 mb-6">
              {task.title}
            </h1>

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
                <ProgressBar progress={task.progress} />

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
    </>
  );
}
