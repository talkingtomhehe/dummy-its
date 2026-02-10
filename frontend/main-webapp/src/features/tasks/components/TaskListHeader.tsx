import { Checkbox } from "./ListViewIcons";

export default function TaskListHeader() {
  return (
    <div className="bg-secondary flex items-center gap-4 lg:gap-8 xl:gap-12 px-3 py-2.5 w-full">
      {/* Checkbox */}
      <div className="flex-shrink-0">
        <Checkbox checked={false} />
      </div>

      {/* Title Column */}
      <div className="w-[140px] lg:w-[170px] flex-shrink-0">
        <span className="font-bold text-lg lg:text-[22px] leading-[26px] text-neutral-500">
          Title
        </span>
      </div>

      {/* Assignees Column */}
      <div className="w-[90px] lg:w-[108px] flex-shrink-0">
        <span className="font-bold text-lg lg:text-[22px] leading-[26px] text-neutral-500">
          Assignees
        </span>
      </div>

      {/* Tags Column */}
      <div className="w-[80px] lg:w-[100px] flex-shrink-0">
        <span className="font-bold text-lg lg:text-[22px] leading-[26px] text-neutral-500">
          Tags
        </span>
      </div>

      {/* Due Date Column */}
      <div className="w-[80px] lg:w-[96px] flex-shrink-0">
        <span className="font-bold text-lg lg:text-[22px] leading-[26px] text-neutral-500">
          Due date
        </span>
      </div>

      {/* Progress Column */}
      <div className="flex-1 min-w-[100px]">
        <span className="font-bold text-lg lg:text-[22px] leading-[26px] text-neutral-500">
          Progress
        </span>
      </div>
    </div>
  );
}
