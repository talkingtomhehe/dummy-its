import type { Stage, Task } from "../types";
import TaskCard from "./TaskCard";
import { SettingsIcon, AddIcon } from "./Icons";

interface TaskColumnProps {
  stage: Stage;
  onAddTask?: () => void;
  onSettings?: () => void;
  onTaskClick?: (task: Task) => void;
}

export default function TaskColumn({ stage, onAddTask, onSettings, onTaskClick }: TaskColumnProps) {
  return (
    <div className="flex flex-col gap-2.5 min-w-[300px] lg:min-w-[360px] flex-shrink-0 p-2.5">
      {/* Column Header */}
      <div className="flex items-center justify-between py-2.5 px-2.5">
        <div className="flex items-center gap-2.5">
          <span className="font-medium text-lg leading-[22px] text-neutral-500 uppercase">
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
        <div className="flex items-center gap-2.5">
          <button 
            onClick={onSettings}
            className="p-1 hover:bg-neutral-100 rounded transition-colors text-neutral-500"
            aria-label="Column settings"
          >
            <SettingsIcon />
          </button>
          <button 
            onClick={onAddTask}
            className="p-1 hover:bg-neutral-100 rounded transition-colors text-neutral-500"
            aria-label="Add task"
          >
            <AddIcon />
          </button>
        </div>
      </div>

      {/* Task Cards */}
      <div className="flex flex-col gap-2.5 overflow-y-auto flex-1 pr-1">
        {stage.tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={() => onTaskClick?.(task)} />
        ))}
      </div>
    </div>
  );
}
