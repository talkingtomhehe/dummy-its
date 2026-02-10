// Calendar-specific icons

export const ChevronLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ChevronRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ListViewIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.667 5H16.667" stroke={active ? "#0014A8" : "#62748E"} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6.667 10H16.667" stroke={active ? "#0014A8" : "#62748E"} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6.667 15H16.667" stroke={active ? "#0014A8" : "#62748E"} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="3.333" cy="5" r="1" fill={active ? "#0014A8" : "#62748E"}/>
    <circle cx="3.333" cy="10" r="1" fill={active ? "#0014A8" : "#62748E"}/>
    <circle cx="3.333" cy="15" r="1" fill={active ? "#0014A8" : "#62748E"}/>
  </svg>
);

export const BoardViewIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2.5" y="2.5" width="4" height="15" rx="1" fill={active ? "#0014A8" : "#62748E"}/>
    <rect x="8" y="2.5" width="4" height="10" rx="1" fill={active ? "#0014A8" : "#62748E"}/>
    <rect x="13.5" y="2.5" width="4" height="12.5" rx="1" fill={active ? "#0014A8" : "#62748E"}/>
  </svg>
);

export const TimelineViewIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 10H17.5" stroke={active ? "#0014A8" : "#62748E"} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="5" cy="10" r="2" fill={active ? "#0014A8" : "#62748E"}/>
    <circle cx="10" cy="10" r="2" fill={active ? "#0014A8" : "#62748E"}/>
    <circle cx="15" cy="10" r="2" fill={active ? "#0014A8" : "#62748E"}/>
  </svg>
);

export const CalendarTabIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2.5" y="3.333" width="15" height="15" rx="2" stroke={active ? "#0014A8" : "#62748E"} strokeWidth="1.5"/>
    <path d="M13.333 1.667V5" stroke={active ? "#0014A8" : "#62748E"} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6.667 1.667V5" stroke={active ? "#0014A8" : "#62748E"} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M2.5 8.333H17.5" stroke={active ? "#0014A8" : "#62748E"} strokeWidth="1.5"/>
  </svg>
);

export const FilterLinesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.333 5H16.667" stroke="#62748E" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M5 10H15" stroke="#62748E" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M7.5 15H12.5" stroke="#62748E" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const SettingsGearIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="2.5" stroke="#62748E" strokeWidth="1.5"/>
    <path d="M10 1.667V3.333M10 16.667V18.333M3.517 3.517L4.7 4.7M15.3 15.3L16.483 16.483M1.667 10H3.333M16.667 10H18.333M3.517 16.483L4.7 15.3M15.3 4.7L16.483 3.517" stroke="#62748E" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 12L10 8L6 4" stroke="#90A1B9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
