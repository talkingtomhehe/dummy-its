// Icons specific to the Task List View

export const Checkbox = ({ checked }: { checked: boolean }) => (
  <div
    className={`w-[25px] h-[25px] rounded-[6px] border border-neutral-200 bg-white ${
      checked ? "bg-primary border-primary" : ""
    }`}
  />
);

export const CheckboxChecked = () => (
  <div className="w-[25px] h-[25px] rounded-[6px] bg-primary flex items-center justify-center">
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 6L9 17L4 12"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export const ArrowDropDownIcon = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10 12L15 17L20 12" stroke="#62748E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ArrowRightIcon = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 10L17 15L12 20" stroke="#62748E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ListAddIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 5V19"
      stroke="#62748E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 12H19"
      stroke="#62748E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
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

  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 21.25V8.75C6 8.75 6.875 7.5 10.5 7.5C14.125 7.5 15.875 10 19.5 10C23.125 10 24 8.75 24 8.75V18.75C24 18.75 23.125 20 19.5 20C15.875 20 14.125 17.5 10.5 17.5C6.875 17.5 6 18.75 6 18.75"
        fill={colors[priority]}
      />
      <path
        d="M6 21.25V8.75C6 8.75 6.875 7.5 10.5 7.5C14.125 7.5 15.875 10 19.5 10C23.125 10 24 8.75 24 8.75V18.75C24 18.75 23.125 20 19.5 20C15.875 20 14.125 17.5 10.5 17.5C6.875 17.5 6 18.75 6 18.75"
        stroke={colors[priority]}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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
