// Navigation arrows
import Icon from "../../../../components/common/Icon";

export const ChevronLeftIcon = () => (
  <Icon name="chevron_left" size={24} color="currentColor" />
);

export const ChevronRightIcon = () => (
  <Icon name="chevron_right" size={24} color="currentColor" />
);

// Calendar icon
export const CalendarIcon = () => (
  <Icon name="calendar_today" size={20} color="#62748E" />
);

// Clock icon
export const ClockIcon = () => (
  <Icon name="schedule" size={16} color="#90A1B9" />
);

// Flag icon
export const FlagIcon = ({ color }: { color: string }) => (
  <Icon name="flag" size={14} color={color} filled />
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
