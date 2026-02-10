import { useState } from "react";
import Modal from "../../../components/common/Modal";
import DateRangePicker from "../../../components/common/DateRangePicker";
import RichTextEditor from "../../../components/common/RichTextEditor";

// SVG Icons
const ErrorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="16" r="1" fill="currentColor" />
  </svg>
);

const ExpandMoreIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DescriptionIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChecklistIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PersonAddIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 8V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M23 11H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DeleteIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AddIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface SubTask {
  id: string;
  name: string;
  completed: boolean;
  assigneeId?: string;
}

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: TaskFormData) => void;
}

export interface TaskFormData {
  name: string;
  startDate: Date | null;
  endDate: Date | null;
  assigneeId: string;
  priority: "low" | "medium" | "high";
  projectId: string;
  description: string;
  subtasks: SubTask[];
}

const ASSIGNEES = [
  {
    id: "1",
    name: "Michael Chen",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAJPWaqMq7LGHKEaa9oKc4MnTiZB6RSJDVsj0F_yWXL1I69pVXeOfZACSeFqEeqm_WUtAoERFRXc1-mt0NmyZT2cgZv1Zt_MkYX4W9MAfwdoCLWu_mRNuA1RedxiOIWdaE2EEiYZijqmC7hLMs-9lB0s2UXUSfqdUO7qzpbCIP6C9I1OpPmfYs_ltzSdT2y2GQADxo2xnr7brYA0strhsvaR7ljwV-WkJco2O15Ms4wEeOenhMnE-pkjxkIZu2mvlgbC1kfBibTk5Y",
    initials: "MC",
  },
  { id: "2", name: "Sarah Jenkins", initials: "SJ" },
  { id: "3", name: "Amara Okafor", initials: "AO" },
];

const PROJECTS = [
  { id: "1", name: "ERP Migration" },
  { id: "2", name: "Mobile App Refresh" },
  { id: "3", name: "Q4 Marketing" },
];

const PRIORITIES = [
  { value: "low" as const, label: "Low Priority", color: "bg-green-500" },
  { value: "medium" as const, label: "Medium Priority", color: "bg-yellow-500" },
  { value: "high" as const, label: "High Priority", color: "bg-orange-500" },
];

export default function CreateTaskModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateTaskModalProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    name: "",
    startDate: null,
    endDate: null,
    assigneeId: "",
    priority: "medium",
    projectId: "",
    description: "",
    subtasks: [{ id: "1", name: "", completed: false }],
  });
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  const selectedAssignee = ASSIGNEES.find((a) => a.id === formData.assigneeId);
  const selectedPriority = PRIORITIES.find((p) => p.value === formData.priority);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, name: e.target.value }));
    if (e.target.value) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleSubtaskChange = (
    id: string,
    field: "name" | "completed",
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      subtasks: prev.subtasks.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    }));
  };

  const addSubtask = () => {
    setFormData((prev) => ({
      ...prev,
      subtasks: [
        ...prev.subtasks,
        { id: Date.now().toString(), name: "", completed: false },
      ],
    }));
  };

  const removeSubtask = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      subtasks: prev.subtasks.filter((s) => s.id !== id),
    }));
  };

  const handleSubmit = () => {
    // Validate
    if (!formData.name.trim()) {
      setErrors({ name: "Task name is required" });
      return;
    }

    onSubmit?.(formData);
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      startDate: null,
      endDate: null,
      assigneeId: "",
      priority: "medium",
      projectId: "",
      description: "",
      subtasks: [{ id: "1", name: "", completed: false }],
    });
    setErrors({});
    onClose();
  };

  const activeSubtasks = formData.subtasks.filter((s) => s.name.trim());

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Create New Task"
      maxWidth="lg"
      footer={
        <>
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-bold text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-hover rounded-lg shadow-md shadow-blue-500/20 transition-all"
          >
            Create Task
          </button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Task Name */}
        <div className="relative group">
          <label className="block text-sm font-semibold text-neutral-900 mb-2">
            Task Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="Enter task name"
              className={`
                w-full px-4 py-3 rounded-lg border 
                ${
                  errors.name
                    ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-neutral-200 focus:border-primary focus:ring-1 focus:ring-primary"
                }
                bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 text-sm transition-colors
              `}
            />
            {errors.name && (
              <>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 cursor-help">
                  <ErrorIcon />
                </div>
                <div className="absolute right-0 top-full mt-1 px-3 py-1 bg-red-500 text-white text-xs rounded shadow-lg z-10 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {errors.name}
                  <div className="absolute bottom-full right-4 border-4 border-transparent border-b-red-500" />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Date Range Picker */}
        <DateRangePicker
          startDate={formData.startDate}
          endDate={formData.endDate}
          onStartDateChange={(date: Date | null) =>
            setFormData((prev) => ({ ...prev, startDate: date }))
          }
          onEndDateChange={(date: Date | null) =>
            setFormData((prev) => ({ ...prev, endDate: date }))
          }
          label="Select Task Duration"
        />

        {/* Assignee, Priority, Project */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Assignee */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Assignee
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
                className="w-full pl-3 pr-10 py-3 rounded-lg border border-neutral-200 focus:border-primary focus:ring-1 focus:ring-primary bg-neutral-50 text-left text-sm flex items-center gap-2"
              >
                {selectedAssignee ? (
                  <>
                    {selectedAssignee.avatar ? (
                      <div
                        className="size-6 rounded-full bg-neutral-300 bg-center bg-cover"
                        style={{
                          backgroundImage: `url('${selectedAssignee.avatar}')`,
                        }}
                      />
                    ) : (
                      <div className="size-6 rounded-full bg-neutral-300 text-[10px] flex items-center justify-center text-neutral-500 font-bold">
                        {selectedAssignee.initials}
                      </div>
                    )}
                    <span className="text-neutral-900 truncate">
                      {selectedAssignee.name}
                    </span>
                  </>
                ) : (
                  <span className="text-neutral-400">Select assignee...</span>
                )}
              </button>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none flex">
                <ExpandMoreIcon />
              </div>

              {/* Dropdown */}
              {showAssigneeDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-20">
                  {ASSIGNEES.map((assignee) => (
                    <button
                      key={assignee.id}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          assigneeId: assignee.id,
                        }));
                        setShowAssigneeDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-neutral-100"
                    >
                      <div className="size-6 rounded-full bg-neutral-300 text-[10px] flex items-center justify-center text-neutral-500 font-bold">
                        {assignee.initials}
                      </div>
                      <span>{assignee.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Priority
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                className="w-full pl-3 pr-10 py-3 rounded-lg border border-neutral-200 focus:border-primary focus:ring-1 focus:ring-primary bg-neutral-50 text-left text-sm flex items-center gap-2"
              >
                <span
                  className={`inline-block size-2 rounded-full ${selectedPriority?.color}`}
                />
                <span className="text-neutral-900">
                  {selectedPriority?.label}
                </span>
              </button>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none flex">
                <ExpandMoreIcon />
              </div>

              {/* Dropdown */}
              {showPriorityDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-20">
                  {PRIORITIES.map((priority) => (
                    <button
                      key={priority.value}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          priority: priority.value,
                        }));
                        setShowPriorityDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-neutral-100"
                    >
                      <span
                        className={`inline-block size-2 rounded-full ${priority.color}`}
                      />
                      <span>{priority.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Associated Project */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Associated Project
            </label>
            <div className="relative">
              <select
                value={formData.projectId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, projectId: e.target.value }))
                }
                className="w-full appearance-none pl-4 pr-10 py-3 rounded-lg border border-neutral-200 focus:border-primary focus:ring-1 focus:ring-primary bg-neutral-50 text-neutral-900 text-sm cursor-pointer"
              >
                <option disabled value="">
                  Select a project...
                </option>
                {PROJECTS.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none flex">
                <ExpandMoreIcon />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-neutral-200">
          <nav aria-label="Tabs" className="flex gap-8">
            <button className="border-b-2 border-primary py-3 px-1 text-sm font-bold text-primary flex items-center gap-2">
              <DescriptionIcon />
              Overview
            </button>
          </nav>
        </div>

        {/* Description */}
        <RichTextEditor
          value={formData.description}
          onChange={(value: string) =>
            setFormData((prev) => ({ ...prev, description: value }))
          }
          placeholder="Describe the task details, requirements, and acceptance criteria..."
          height="h-40"
        />

        {/* Subtasks */}
        <div className="bg-neutral-100 rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <span className="text-primary"><ChecklistIcon /></span>
              Sub-tasks
            </h3>
            <span className="text-xs text-neutral-500">
              {activeSubtasks.length} sub-task
              {activeSubtasks.length !== 1 ? "s" : ""} added
            </span>
          </div>

          {/* Subtask Rows */}
          <div className="flex flex-col gap-3">
            {formData.subtasks.map((subtask) => (
              <div
                key={subtask.id}
                className="flex items-center gap-3 group bg-white p-2 rounded-lg border border-neutral-200"
              >
                <div className="flex items-center justify-center pl-2">
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={(e) =>
                      handleSubtaskChange(
                        subtask.id,
                        "completed",
                        e.target.checked
                      )
                    }
                    className="w-4 h-4 rounded border-neutral-300 text-primary focus:ring-primary"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={subtask.name}
                    onChange={(e) =>
                      handleSubtaskChange(subtask.id, "name", e.target.value)
                    }
                    placeholder="Enter sub-task name"
                    className="w-full px-2 py-1 rounded border-none bg-transparent focus:ring-0 text-neutral-900 text-sm font-medium placeholder:text-neutral-400"
                  />
                </div>
                <div className="flex items-center gap-2 pr-2">
                  <div
                    className="size-6 rounded-full bg-neutral-200 text-[10px] flex items-center justify-center text-neutral-500 font-bold border border-white cursor-pointer hover:bg-neutral-300"
                    title="Assign"
                  >
                    <PersonAddIcon />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSubtask(subtask.id)}
                    className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                    title="Delete Sub-task"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Subtask Button */}
          <button
            type="button"
            onClick={addSubtask}
            className="mt-4 flex items-center gap-2 text-primary font-bold text-sm hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors w-max"
          >
            <AddIcon />
            Add Sub-task
          </button>
        </div>
      </div>
    </Modal>
  );
}
