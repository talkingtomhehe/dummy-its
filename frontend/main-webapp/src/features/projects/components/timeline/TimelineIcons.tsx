// Navigation arrows
import Icon from "../../../../components/common/Icon";

export const ChevronLeftIcon = () => (
  <Icon name="chevron_left" size={14} color="currentColor" />
);

export const ChevronRightIcon = () => (
  <Icon name="chevron_right" size={14} color="currentColor" />
);

// Filter icon
export const FilterIcon = () => (
  <Icon name="filter_alt" size={14} color="#90A1B9" />
);

// Calendar icon
export const CalendarIcon = () => (
  <Icon name="calendar_today" size={14} color="#62748E" />
);

// Group by icon
export const GroupByIcon = () => (
  <Icon name="grid_view" size={14} color="#90A1B9" />
);

// Today marker icon
export const TodayIcon = () => (
  <Icon name="adjust" size={14} color="#0B68F7" />
);

// Priority flag icon
export const FlagIcon = ({ color }: { color: string }) => (
  <Icon name="flag" size={14} color={color} filled />
);
