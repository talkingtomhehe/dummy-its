// Icons specific to Task Detail Modal

export const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18" stroke="#90A1B9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 6L18 18" stroke="#90A1B9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const BoldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 3.333h6.25a3.75 3.75 0 0 1 0 7.5H5V3.333Z" stroke="#62748E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 10.833h7.5a3.75 3.75 0 0 1 0 7.5H5v-7.5Z" stroke="#62748E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ItalicIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.833 3.333H7.5M12.5 16.667H4.167M12.5 3.333 7.5 16.667" stroke="#62748E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const StrikethroughIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.167 10h11.666M13.333 13.333c0 1.841-1.493 3.334-3.333 3.334s-3.333-1.493-3.333-3.334M6.667 6.667c0-1.841 1.493-3.334 3.333-3.334s3.333 1.493 3.333 3.334" stroke="#62748E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const BulletListIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 5h10M7.5 10h10M7.5 15h10" stroke="#62748E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="3.333" cy="5" r="1" fill="#62748E"/>
    <circle cx="3.333" cy="10" r="1" fill="#62748E"/>
    <circle cx="3.333" cy="15" r="1" fill="#62748E"/>
  </svg>
);

export const NumberListIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.333 5h9.167M8.333 10h9.167M8.333 15h9.167" stroke="#62748E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <text x="2.5" y="6.5" fill="#62748E" fontSize="5" fontFamily="Roboto" fontWeight="500">1.</text>
    <text x="2.5" y="11.5" fill="#62748E" fontSize="5" fontFamily="Roboto" fontWeight="500">2.</text>
    <text x="2.5" y="16.5" fill="#62748E" fontSize="5" fontFamily="Roboto" fontWeight="500">3.</text>
  </svg>
);

export const LinkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.333 10.833a4.167 4.167 0 0 0 6.25.542l2.084-2.083a4.167 4.167 0 0 0-5.892-5.892L9.583 4.583" stroke="#62748E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.667 9.167a4.167 4.167 0 0 0-6.25-.542L3.333 10.708a4.167 4.167 0 1 0 5.892 5.892l1.192-1.192" stroke="#62748E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ImageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2.5" y="2.5" width="15" height="15" rx="2" stroke="#62748E" strokeWidth="1.5"/>
    <circle cx="6.667" cy="6.667" r="1.667" stroke="#62748E" strokeWidth="1.5"/>
    <path d="m2.5 13.333 4.167-4.166a1.667 1.667 0 0 1 2.357 0l4.31 4.31" stroke="#62748E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="m11.667 11.667 1.666-1.667a1.667 1.667 0 0 1 2.357 0l1.81 1.81" stroke="#62748E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const CheckboxIcon = ({ checked }: { checked: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="16" height="16" rx="4" fill={checked ? "#0014A8" : "white"} stroke={checked ? "#0014A8" : "#E2E8F0"} strokeWidth="1.5"/>
    {checked && (
      <path d="M6 10l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    )}
  </svg>
);

export const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 4.167v11.666M4.167 10h11.666" stroke="#0014A8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ChevronDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 7.5 10 12.5 15 7.5" stroke="#90A1B9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const CalendarSmallIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2.5" y="3.333" width="15" height="14.167" rx="2" stroke="#62748E" strokeWidth="1.5"/>
    <path d="M13.333 1.667v3.333M6.667 1.667v3.333M2.5 8.333h15" stroke="#62748E" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const ActivityIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="3" fill="#0014A8"/>
  </svg>
);
