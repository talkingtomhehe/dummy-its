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

const InfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="8" r="1" fill="currentColor" />
  </svg>
);

const FlagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 15C4 15 5 14 8 14C11 14 13 16 16 16C19 16 20 15 20 15V3C20 3 19 4 16 4C13 4 11 2 8 2C5 2 4 3 4 3V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 22V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DeleteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AddCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface Milestone {
  id: string;
  name: string;
  targetDate: string;
}

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: ProjectFormData) => void;
}

export interface ProjectFormData {
  name: string;
  startDate: Date | null;
  endDate: Date | null;
  managerId: string;
  description: string;
  milestones: Milestone[];
}

const MANAGERS = [
  { id: "1", name: "Sarah Jenkins" },
  { id: "2", name: "Michael Chen" },
  { id: "3", name: "Amara Okafor" },
];

export default function CreateProjectModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateProjectModalProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    startDate: null,
    endDate: null,
    managerId: "",
    description: "",
    milestones: [{ id: "1", name: "", targetDate: "" }],
  });
  const [errors, setErrors] = useState<{ name?: string }>({});

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, name: e.target.value }));
    if (e.target.value) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleManagerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, managerId: e.target.value }));
  };

  const handleMilestoneChange = (
    id: string,
    field: "name" | "targetDate",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m) =>
        m.id === id ? { ...m, [field]: value } : m
      ),
    }));
  };

  const addMilestone = () => {
    setFormData((prev) => ({
      ...prev,
      milestones: [
        ...prev.milestones,
        { id: Date.now().toString(), name: "", targetDate: "" },
      ],
    }));
  };

  const removeMilestone = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((m) => m.id !== id),
    }));
  };

  const handleSubmit = () => {
    // Validate
    if (!formData.name.trim()) {
      setErrors({ name: "Project name is required" });
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
      managerId: "",
      description: "",
      milestones: [{ id: "1", name: "", targetDate: "" }],
    });
    setErrors({});
    onClose();
  };

  const activeMilestones = formData.milestones.filter((m) => m.name.trim());

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Create New Project"
      maxWidth="xl"
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
            Create Project
          </button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Project Name */}
        <div className="relative group">
          <label className="block text-sm font-semibold text-neutral-900 mb-2">
            Project Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="Enter project name"
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
          label="Select Project Duration"
        />

        {/* Project Manager */}
        <div>
          <label className="block text-sm font-semibold text-neutral-900 mb-2">
            Project Manager / Lead
          </label>
          <div className="relative">
            <select
              value={formData.managerId}
              onChange={handleManagerChange}
              className="w-full appearance-none pl-4 pr-10 py-3 rounded-lg border border-neutral-200 focus:border-primary focus:ring-1 focus:ring-primary bg-neutral-50 text-neutral-900 text-sm cursor-pointer"
            >
              <option disabled value="">
                Select a manager...
              </option>
              {MANAGERS.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none flex">
              <ExpandMoreIcon />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-neutral-200">
          <nav aria-label="Tabs" className="flex gap-8">
            <button className="border-b-2 border-primary py-3 px-1 text-sm font-bold text-primary flex items-center gap-2">
              <InfoIcon />
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
          placeholder="Describe the project scope, key deliverables, and expected outcomes..."
        />

        {/* Milestones */}
        <div className="bg-neutral-100 rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <span className="text-primary"><FlagIcon /></span>
              Key Milestones
            </h3>
            <span className="text-xs text-neutral-500">
              {activeMilestones.length} milestone
              {activeMilestones.length !== 1 ? "s" : ""} added
            </span>
          </div>

          {/* Header */}
          <div className="grid grid-cols-12 gap-4 mb-2 px-2">
            <div className="col-span-7 text-xs font-semibold text-neutral-500 uppercase">
              Milestone Name
            </div>
            <div className="col-span-4 text-xs font-semibold text-neutral-500 uppercase">
              Target Date
            </div>
            <div className="col-span-1" />
          </div>

          {/* Milestone Rows */}
          <div className="flex flex-col gap-3">
            {formData.milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="grid grid-cols-12 gap-4 items-center group"
              >
                <div className="col-span-7">
                  <input
                    type="text"
                    value={milestone.name}
                    onChange={(e) =>
                      handleMilestoneChange(milestone.id, "name", e.target.value)
                    }
                    placeholder="e.g. Design Approval"
                    className="w-full px-3 py-2 rounded-md border border-neutral-200 focus:border-primary focus:ring-1 focus:ring-primary bg-white text-neutral-900 text-sm"
                  />
                </div>
                <div className="col-span-4">
                  <input
                    type="date"
                    value={milestone.targetDate}
                    onChange={(e) =>
                      handleMilestoneChange(
                        milestone.id,
                        "targetDate",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 rounded-md border border-neutral-200 focus:border-primary focus:ring-1 focus:ring-primary bg-white text-neutral-900 text-sm"
                  />
                </div>
                <div className="col-span-1 flex justify-center">
                  <button
                    type="button"
                    onClick={() => removeMilestone(milestone.id)}
                    className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Milestone"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Milestone Button */}
          <button
            type="button"
            onClick={addMilestone}
            className="mt-4 flex items-center gap-2 text-primary font-bold text-sm hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors w-max"
          >
            <AddCircleIcon />
            Add Milestone
          </button>
        </div>
      </div>
    </Modal>
  );
}
