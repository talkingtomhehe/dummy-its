// Icons for Task Kanban feature

export const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="8" stroke="#90A1B9" strokeWidth="2" />
    <path d="M21 21L16.65 16.65" stroke="#90A1B9" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const FilterIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="4" y1="6" x2="20" y2="6" stroke="#62748E" strokeWidth="2" strokeLinecap="round" />
    <line x1="6" y1="12" x2="18" y2="12" stroke="#62748E" strokeWidth="2" strokeLinecap="round" />
    <line x1="8" y1="18" x2="16" y2="18" stroke="#62748E" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const KanbanIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="5" height="18" rx="1" fill={active ? "white" : "#62748E"} />
    <rect x="10" y="3" width="5" height="12" rx="1" fill={active ? "white" : "#62748E"} />
    <rect x="17" y="3" width="5" height="15" rx="1" fill={active ? "white" : "#62748E"} />
  </svg>
);

export const ListIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 6H21" stroke={active ? "white" : "#62748E"} strokeWidth="2" strokeLinecap="round" />
    <path d="M8 12H21" stroke={active ? "white" : "#62748E"} strokeWidth="2" strokeLinecap="round" />
    <path d="M8 18H21" stroke={active ? "white" : "#62748E"} strokeWidth="2" strokeLinecap="round" />
    <circle cx="4" cy="6" r="1" fill={active ? "white" : "#62748E"} />
    <circle cx="4" cy="12" r="1" fill={active ? "white" : "#62748E"} />
    <circle cx="4" cy="18" r="1" fill={active ? "white" : "#62748E"} />
  </svg>
);

export const TimelineIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="14" width="4" height="7" fill={active ? "white" : "#62748E"} />
    <rect x="10" y="10" width="4" height="11" fill={active ? "white" : "#62748E"} />
    <rect x="17" y="3" width="4" height="18" fill={active ? "white" : "#62748E"} />
  </svg>
);

export const CalendarViewIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke={active ? "white" : "#62748E"} strokeWidth="2" />
    <line x1="16" y1="2" x2="16" y2="6" stroke={active ? "white" : "#62748E"} strokeWidth="2" strokeLinecap="round" />
    <line x1="8" y1="2" x2="8" y2="6" stroke={active ? "white" : "#62748E"} strokeWidth="2" strokeLinecap="round" />
    <line x1="3" y1="10" x2="21" y2="10" stroke={active ? "white" : "#62748E"} strokeWidth="2" />
  </svg>
);

export const SettingsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="3" stroke="#62748E" strokeWidth="2" />
    <path
      d="M12 1V4M12 20V23M4.22 4.22L6.34 6.34M17.66 17.66L19.78 19.78M1 12H4M20 12H23M4.22 19.78L6.34 17.66M17.66 6.34L19.78 4.22"
      stroke="#62748E"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const AddIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const FlagIcon = ({ priority }: { priority: "urgent" | "high" | "medium" | "low" }) => {
  const colors: Record<string, string> = {
    urgent: "#E7000B",
    high: "#FF6900",
    medium: "#FFD230",
    low: "#99A1AF",
  };

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 15C4 15 5 14 8 14C11 14 13 16 16 16C19 16 20 15 20 15V3C20 3 19 4 16 4C13 4 11 2 8 2C5 2 4 3 4 3V15Z"
        fill={colors[priority]}
        stroke={colors[priority]}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 22V15" stroke={colors[priority]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2.5" y="3.33" width="15" height="15" rx="2" stroke="#90A1B9" strokeWidth="1.5" />
    <line x1="13.33" y1="1.67" x2="13.33" y2="5" stroke="#90A1B9" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="6.67" y1="1.67" x2="6.67" y2="5" stroke="#90A1B9" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="2.5" y1="8.33" x2="17.5" y2="8.33" stroke="#90A1B9" strokeWidth="1.5" />
  </svg>
);

export const SwitchLeftIcon = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 9L5 15L10 21" stroke="#90A1B9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 9L25 15L20 21" stroke="#90A1B9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ExpandArrowIcon = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 8L19 15L11 22" stroke="#0014A8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 8L14 15L6 22" stroke="#0014A8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
