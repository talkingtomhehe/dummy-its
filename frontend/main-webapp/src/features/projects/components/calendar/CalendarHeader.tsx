import { ChevronLeftIcon, ChevronRightIcon } from "./CalendarIcons";
import { getMonthYear } from "./calendarUtils";

interface CalendarHeaderProps {
  year: number;
  month: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export default function CalendarHeader({
  year,
  month,
  onPrevMonth,
  onNextMonth,
  onToday,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
      <div className="flex items-center gap-4">
        <h2 className="font-bold text-xl text-neutral-900">{getMonthYear(year, month)}</h2>
        
        <div className="flex items-center gap-1">
          <button
            onClick={onPrevMonth}
            className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors text-neutral-600"
            aria-label="Previous month"
          >
            <ChevronLeftIcon />
          </button>
          <button
            onClick={onNextMonth}
            className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors text-neutral-600"
            aria-label="Next month"
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>

      <button
        onClick={onToday}
        className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
      >
        Today
      </button>
    </div>
  );
}
