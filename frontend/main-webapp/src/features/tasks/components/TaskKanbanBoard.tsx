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
    <div className="flex gap-2.5 h-full overflow-x-auto pb-4">
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
      <div className="flex flex-col items-center gap-2.5 p-2.5 bg-neutral-50 min-w-[50px] flex-shrink-0">
        <button 
          className="hover:bg-neutral-100 rounded transition-colors"
          aria-label="Drag to reorder"
        >
          <SwitchLeftIcon />
        </button>
        <div className="flex items-center justify-center h-[60px] w-[38px]">
          <span 
            className="font-medium text-lg text-neutral-400 whitespace-nowrap"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            Deploy
          </span>
        </div>
      </div>

      {/* Add Stage Button */}
      <div className="flex flex-col items-center p-2.5 min-w-[300px] lg:min-w-[418px] flex-shrink-0">
        <button
          onClick={onAddStage}
          className="w-full bg-white border border-neutral-200 rounded-[20px] flex items-center justify-center gap-2.5 px-4 py-2.5 text-neutral-400 hover:bg-neutral-50 transition-colors"
        >
          <AddIcon />
          <span className="font-medium text-lg leading-[22px]">Stage</span>
        </button>
      </div>
    </div>
  );
}
