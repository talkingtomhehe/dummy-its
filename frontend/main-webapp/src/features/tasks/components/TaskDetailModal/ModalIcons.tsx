// Icons specific to Task Detail Modal
import Icon from "../../../../components/common/Icon";

export const CloseIcon = () => (
  <Icon name="close" size={24} color="#90A1B9" />
);

export const BoldIcon = () => (
  <Icon name="format_bold" size={20} color="#62748E" />
);

export const ItalicIcon = () => (
  <Icon name="format_italic" size={20} color="#62748E" />
);

export const StrikethroughIcon = () => (
  <Icon name="strikethrough_s" size={20} color="#62748E" />
);

export const BulletListIcon = () => (
  <Icon name="format_list_bulleted" size={20} color="#62748E" />
);

export const NumberListIcon = () => (
  <Icon name="format_list_numbered" size={20} color="#62748E" />
);

export const LinkIcon = () => (
  <Icon name="link" size={20} color="#62748E" />
);

export const ImageIcon = () => (
  <Icon name="image" size={20} color="#62748E" />
);

export const CheckboxIcon = ({ checked }: { checked: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="16" height="16" rx="4" fill={checked ? "#0014A8" : "white"} stroke={checked ? "#0014A8" : "#E2E8F0"} strokeWidth="1.5" />
    {checked && (
      <path d="M6 10l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    )}
  </svg>
);

export const PlusIcon = () => (
  <Icon name="add" size={20} color="#0014A8" />
);

export const ChevronDownIcon = () => (
  <Icon name="expand_more" size={20} color="#90A1B9" />
);

export const CalendarSmallIcon = () => (
  <Icon name="calendar_today" size={20} color="#62748E" />
);

export const ActivityIcon = () => (
  <Icon name="circle" size={16} color="#0014A8" filled />
);
