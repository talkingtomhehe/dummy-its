// Icons specific to the Task List View
import Icon from "../../../components/common/Icon";

export const Checkbox = ({ checked }: { checked: boolean }) => (
  <div
    className={`w-[25px] h-[25px] rounded-[6px] border border-neutral-200 bg-white ${checked ? "bg-primary border-primary" : ""
      }`}
  />
);

export const CheckboxChecked = () => (
  <div className="w-[25px] h-[25px] rounded-[6px] bg-primary flex items-center justify-center">
    <Icon name="check" size={20} color="white" />
  </div>
);

export const ArrowDropDownIcon = () => (
  <Icon name="arrow_drop_down" size={30} color="#62748E" />
);

export const ArrowRightIcon = () => (
  <Icon name="chevron_right" size={30} color="#62748E" />
);

export const ListAddIcon = () => (
  <Icon name="add" size={24} color="#62748E" />
);

export const QuantityBadge = ({ count }: { count: number }) => (
  <div className="relative w-5 h-5">
    <div className="absolute inset-0 rounded-full border-2 border-neutral-200" />
    <span className="absolute inset-0 flex items-center justify-center font-medium text-xs text-neutral-500">
      {count}
    </span>
  </div>
);

export const StatusDot = ({
  status,
}: {
  status: "to_do" | "on_track" | "off_track" | "on_hold" | "done";
}) => {
  const colors: Record<string, string> = {
    to_do: "bg-status-to_do",
    on_track: "bg-status-on_track",
    off_track: "bg-status-off_track",
    on_hold: "bg-status-on_hold",
    done: "bg-status-done",
  };

  return <div className={`w-5 h-5 rounded-full ${colors[status]}`} />;
};

export const FlagIconSmall = ({
  priority,
}: {
  priority: "urgent" | "high" | "medium" | "low";
}) => {
  const colors: Record<string, string> = {
    urgent: "#E7000B",
    high: "#FF6900",
    medium: "#FFD230",
    low: "#99A1AF",
  };

  return <Icon name="flag" size={30} color={colors[priority]} filled />;
};

export const ProgressBar = ({ progress }: { progress: number }) => {
  // Determine color based on progress
  const getProgressColor = () => {
    if (progress >= 100) return "bg-status-done";
    if (progress >= 50) return "bg-status-on_track";
    if (progress >= 25) return "bg-status-to_do";
    return "bg-status-off_track";
  };

  return (
    <div className="flex-1 max-w-[269px] h-2.5 bg-neutral-200 rounded-[20px] overflow-hidden">
      <div
        className={`h-full rounded-[20px] transition-all duration-300 ${getProgressColor()}`}
        style={{ width: `${Math.min(progress, 100)}%` }}
      />
    </div>
  );
};
