// Navigation arrows
export const ChevronLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12.5 15L7.5 10L12.5 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChevronRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7.5 15L12.5 10L7.5 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Filter icon
export const FilterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18.333 2.5H1.667L8.333 10.383V15.833L11.667 17.5V10.383L18.333 2.5Z"
      stroke="#90A1B9"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Calendar icon
export const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2.5" y="3.33" width="15" height="15" rx="2" stroke="#62748E" strokeWidth="1.5" />
    <line x1="13.33" y1="1.67" x2="13.33" y2="5" stroke="#62748E" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="6.67" y1="1.67" x2="6.67" y2="5" stroke="#62748E" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="2.5" y1="8.33" x2="17.5" y2="8.33" stroke="#62748E" strokeWidth="1.5" />
  </svg>
);

// Group by icon
export const GroupByIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2.5" y="3.33" width="6.67" height="5" rx="1" stroke="#90A1B9" strokeWidth="1.5" />
    <rect x="10.83" y="3.33" width="6.67" height="5" rx="1" stroke="#90A1B9" strokeWidth="1.5" />
    <rect x="2.5" y="11.67" width="6.67" height="5" rx="1" stroke="#90A1B9" strokeWidth="1.5" />
    <rect x="10.83" y="11.67" width="6.67" height="5" rx="1" stroke="#90A1B9" strokeWidth="1.5" />
  </svg>
);

// Today marker icon
export const TodayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="8" stroke="#0B68F7" strokeWidth="2" />
    <circle cx="10" cy="10" r="3" fill="#0B68F7" />
  </svg>
);

// Priority flag icon
export const FlagIcon = ({ color }: { color: string }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2.33 8.75C2.33 8.75 2.92 8.17 4.67 8.17C6.42 8.17 7.58 9.33 9.33 9.33C11.08 9.33 11.67 8.75 11.67 8.75V1.75C11.67 1.75 11.08 2.33 9.33 2.33C7.58 2.33 6.42 1.17 4.67 1.17C2.92 1.17 2.33 1.75 2.33 1.75V8.75Z"
      fill={color}
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M2.33 12.83V8.75" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
