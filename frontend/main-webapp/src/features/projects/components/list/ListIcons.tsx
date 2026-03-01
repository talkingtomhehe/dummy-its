// Sort icons
import Icon from "../../../../components/common/Icon";

export const SortIcon = ({ direction }: { direction: "asc" | "desc" | null }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 3L11 6H5L8 3Z"
      fill={direction === "asc" ? "#0B68F7" : "#90A1B9"}
    />
    <path
      d="M8 13L5 10H11L8 13Z"
      fill={direction === "desc" ? "#0B68F7" : "#90A1B9"}
    />
  </svg>
);

// Checkbox icons
export const CheckboxIcon = ({ checked }: { checked: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    {checked ? (
      <>
        <rect x="2" y="2" width="16" height="16" rx="4" fill="#0B68F7" />
        <path d="M6 10L9 13L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ) : (
      <rect x="2" y="2" width="16" height="16" rx="4" stroke="#90A1B9" strokeWidth="2" />
    )}
  </svg>
);

// Expand/Collapse icons
export const ChevronIcon = ({ expanded }: { expanded: boolean }) => (
  <span className={`inline-flex transition-transform ${expanded ? "rotate-90" : ""}`}>
    <Icon name="chevron_right" size={20} color="#62748E" />
  </span>
);

// More actions icon
export const MoreIcon = () => (
  <Icon name="more_vert" size={20} color="#62748E" />
);

// Calendar icon
export const CalendarIcon = () => (
  <Icon name="calendar_today" size={16} color="#90A1B9" />
);

// Flag icon for priority
export const FlagIcon = ({ color }: { color: string }) => (
  <Icon name="flag" size={16} color={color} filled />
);
