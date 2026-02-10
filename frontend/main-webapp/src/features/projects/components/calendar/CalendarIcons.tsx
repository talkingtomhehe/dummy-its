// Navigation arrows
export const ChevronLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ChevronRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

// Clock icon
export const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="6.5" stroke="#90A1B9" strokeWidth="1.5" />
    <path d="M8 4V8L10.5 9.5" stroke="#90A1B9" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Flag icon
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

// Checkmark icon
export const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="6" fill="#00A63E" />
    <path d="M5.5 8L7.5 10L10.5 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// In Progress icon
export const ProgressIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="6" fill="#0B68F7" />
    <path d="M8 5V8.5L10 9.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// On Hold icon
export const PauseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="6" fill="#E7000B" />
    <rect x="5.5" y="5" width="2" height="6" rx="0.5" fill="white" />
    <rect x="8.5" y="5" width="2" height="6" rx="0.5" fill="white" />
  </svg>
);

// Planning icon
export const PlanningIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="6" fill="#FF6900" />
    <path d="M6 8H10M8 6V10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
