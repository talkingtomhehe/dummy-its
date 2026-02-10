import { useState, useRef, useEffect } from "react";
import type { TaskStatus } from "../../types";
import { ChevronDownIcon } from "./ModalIcons";

interface StatusSelectorProps {
  value: TaskStatus;
  onChange: (status: TaskStatus) => void;
}

const statuses: { value: TaskStatus; label: string; color: string }[] = [
  { value: "to_do", label: "To Do", color: "bg-status-to_do" },
  { value: "on_track", label: "In Progress", color: "bg-status-on_track" },
  { value: "off_track", label: "Off Track", color: "bg-status-off_track" },
  { value: "on_hold", label: "On Hold", color: "bg-status-on_hold" },
  { value: "done", label: "Done", color: "bg-status-done" },
];

export default function StatusSelector({ value, onChange }: StatusSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedStatus = statuses.find((s) => s.value === value) || statuses[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-neutral-500">Status</label>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl hover:border-neutral-300 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${selectedStatus.color}`} />
            <span className="text-sm font-medium text-neutral-900">
              {selectedStatus.label}
            </span>
          </div>
          <ChevronDownIcon />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-neutral-200 shadow-lg z-10 overflow-hidden">
            {statuses.map((status) => (
              <button
                key={status.value}
                onClick={() => {
                  onChange(status.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2.5 hover:bg-neutral-50 transition-colors ${
                  value === status.value ? "bg-neutral-50" : ""
                }`}
              >
                <div className={`w-2.5 h-2.5 rounded-full ${status.color}`} />
                <span className="text-sm text-neutral-900">{status.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
