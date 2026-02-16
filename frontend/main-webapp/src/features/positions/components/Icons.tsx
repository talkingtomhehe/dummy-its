// Icons for Position Tree feature

export const SearchIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="8" stroke="#90A1B9" strokeWidth="2" />
    <path d="M21 21L16.65 16.65" stroke="#90A1B9" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18" stroke="#0F172B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 6L18 18" stroke="#0F172B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const FilterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="4" y1="6" x2="20" y2="6" stroke="#62748E" strokeWidth="2" strokeLinecap="round" />
    <line x1="6" y1="12" x2="18" y2="12" stroke="#62748E" strokeWidth="2" strokeLinecap="round" />
    <line x1="8" y1="18" x2="16" y2="18" stroke="#62748E" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const TreeViewIcon = ({ active }: { active: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22 11V3H14V6H10V3H2V11H10V8H11V14H7V12H2V20H7V18H11V22H17V14H11V17H8V8H11V11H22Z"
      fill={active ? "white" : "#62748E"}
    />
  </svg>
);

export const ListViewIcon = ({ active }: { active: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 4H21V6H3V4Z" fill={active ? "white" : "#62748E"} />
    <path d="M3 9H21V11H3V9Z" fill={active ? "white" : "#62748E"} />
    <path d="M3 14H21V16H3V14Z" fill={active ? "white" : "#62748E"} />
    <path d="M3 19H21V21H3V19Z" fill={active ? "white" : "#62748E"} />
  </svg>
);

export const AddIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ChevronDoubleRightIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 17L11 12L6 7" stroke="#0014A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13 17L18 12L13 7" stroke="#0014A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
