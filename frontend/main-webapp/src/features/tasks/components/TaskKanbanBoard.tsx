import type { Stage, Task } from "../types";
import TaskColumn from "./TaskColumn";
import { AddIcon, SwitchLeftIcon } from "./Icons";

interface TaskKanbanBoardProps {
  stages: Stage[];
  onAddStage?: () => void;
  onAddTask?: (stageId: string) => void;
  onTaskClick?: (task: Task) => void;
}

export default function TaskKanbanBoard({ stages, onAddStage, onAddTask, onTaskClick }: TaskKanbanBoardProps) {
  return (
    <div className="flex gap-2 h-full overflow-x-auto pb-3">
      {/* Stage Columns */}
      {stages.map((stage) => (
        <TaskColumn
          key={stage.id}
          stage={stage}
          onAddTask={() => onAddTask?.(stage.id)}
          onTaskClick={onTaskClick}
        />
      ))}

      {/* Drag Handle / Separator Column */}
      <div className="flex flex-col items-center gap-2 p-2 bg-neutral-50 min-w-[40px] flex-shrink-0">
        <button
          className="hover:bg-neutral-100 rounded transition-colors"
          aria-label="Drag to reorder"
        >
          <SwitchLeftIcon />
        </button>
        <div className="flex items-center justify-center h-[48px] w-[30px]">
          <span
            className="font-medium text-sm text-neutral-400 whitespace-nowrap"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            Deploy
          </span>
        </div>
      </div>

      {/* Add Stage Button */}
      <div className="flex flex-col items-center p-2 min-w-[240px] lg:min-w-[280px] flex-shrink-0">
        <button
          onClick={onAddStage}
          className="w-full bg-white border border-neutral-200 rounded-[12px] flex items-center justify-center gap-2 px-3 py-2 text-neutral-400 hover:bg-neutral-50 transition-colors"
        >
          <AddIcon />
          <span className="font-medium text-sm leading-5">Stage</span>
        </button>
      </div>
    </div>
  );
}
