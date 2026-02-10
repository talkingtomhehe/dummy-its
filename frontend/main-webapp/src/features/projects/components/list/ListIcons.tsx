// Sort icons
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
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-transform ${expanded ? "rotate-90" : ""}`}
  >
    <path
      d="M7.5 5L12.5 10L7.5 15"
      stroke="#62748E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// More actions icon
export const MoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="5" r="1.5" fill="#62748E" />
    <circle cx="10" cy="10" r="1.5" fill="#62748E" />
    <circle cx="10" cy="15" r="1.5" fill="#62748E" />
  </svg>
);

// Calendar icon
export const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2.67" width="12" height="12" rx="2" stroke="#90A1B9" strokeWidth="1.5" />
    <line x1="10.67" y1="1.33" x2="10.67" y2="4" stroke="#90A1B9" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="5.33" y1="1.33" x2="5.33" y2="4" stroke="#90A1B9" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="2" y1="6.67" x2="14" y2="6.67" stroke="#90A1B9" strokeWidth="1.5" />
  </svg>
);

// Flag icon for priority
export const FlagIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2.67 10C2.67 10 3.33 9.33 5.33 9.33C7.33 9.33 8.67 10.67 10.67 10.67C12.67 10.67 13.33 10 13.33 10V2C13.33 2 12.67 2.67 10.67 2.67C8.67 2.67 7.33 1.33 5.33 1.33C3.33 1.33 2.67 2 2.67 2V10Z"
      fill={color}
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M2.67 14.67V10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
