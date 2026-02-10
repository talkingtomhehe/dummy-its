import type { Task } from "../types";
import {
  Checkbox,
  CheckboxChecked,
  StatusDot,
  FlagIconSmall,
  ProgressBar,
} from "./ListViewIcons";
import AssigneesGroup from "./AssigneesGroup";
import TagBadge from "./TagBadge";

interface TaskRowProps {
  task: Task;
  isSelected: boolean;
  onToggleSelect: () => void;
  isLastInStage?: boolean;
  onClick?: () => void;
}

export default function TaskRow({
  task,
  isSelected,
  onToggleSelect,
  isLastInStage = false,
  onClick,
}: TaskRowProps) {
  return (
    <div
      className={`flex items-center gap-4 lg:gap-8 xl:gap-12 px-3 py-2.5 w-full cursor-pointer hover:bg-neutral-50 transition-colors ${
        isLastInStage ? "border-b border-neutral-200" : "border-t border-neutral-200"
      }`}
      onClick={onClick}
    >
      {/* Checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelect();
        }}
        className="flex-shrink-0 focus:outline-none"
        aria-label={isSelected ? "Deselect task" : "Select task"}
      >
        {isSelected ? <CheckboxChecked /> : <Checkbox checked={false} />}
      </button>

      {/* Title Column */}
      <div className="w-[140px] lg:w-[170px] flex-shrink-0 flex items-center gap-2.5 px-2.5 py-2.5">
        <StatusDot status={task.progress >= 100 ? "done" : "on_track"} />
        <span className="font-bold text-lg lg:text-[22px] leading-[26px] text-neutral-900 truncate">
          {task.title}
        </span>
        <FlagIconSmall priority={task.priority} />
      </div>

      {/* Assignees Column */}
      <div className="w-[90px] lg:w-[108px] flex-shrink-0">
        <AssigneesGroup assignees={task.assignees} maxVisible={3} />
      </div>

      {/* Tags Column */}
      <div className="w-[80px] lg:w-[100px] flex-shrink-0 flex items-center gap-1 flex-wrap">
        {task.tags?.map((tag) => (
          <TagBadge key={tag.id} type={tag.type} label={tag.label} />
        ))}
      </div>

      {/* Due Date Column */}
      <div className="w-[80px] lg:w-[96px] flex-shrink-0">
        <span className="font-medium text-base lg:text-lg leading-[22px] text-neutral-500">
          {task.dueDate}
        </span>
      </div>

      {/* Progress Column */}
      <div className="flex-1 min-w-[100px] flex items-center gap-4 lg:gap-[30px] pr-1.5">
        <ProgressBar progress={task.progress} />
        <span className="font-medium text-base lg:text-lg leading-[22px] text-neutral-500 w-10">
          {task.progress}%
        </span>
      </div>
    </div>
  );
}
