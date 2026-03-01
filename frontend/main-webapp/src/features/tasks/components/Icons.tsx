// Icons for Task Kanban feature
import Icon from "../../../components/common/Icon";

export const SearchIcon = () => (
  <Icon name="search" size={14} color="#90A1B9" />
);

export const FilterIcon = () => (
  <Icon name="filter_alt" size={14} color="#62748E" />
);

export const KanbanIcon = ({ active }: { active: boolean }) => (
  <Icon name="view_kanban" size={16} color={active ? "white" : "#62748E"} filled />
);

export const ListIcon = ({ active }: { active: boolean }) => (
  <Icon name="list" size={16} color={active ? "white" : "#62748E"} />
);

export const TimelineIcon = ({ active }: { active: boolean }) => (
  <Icon name="bar_chart" size={16} color={active ? "white" : "#62748E"} filled />
);

export const CalendarViewIcon = ({ active }: { active: boolean }) => (
  <Icon name="calendar_month" size={16} color={active ? "white" : "#62748E"} />
);

export const SettingsIcon = () => (
  <Icon name="settings" size={24} color="#62748E" />
);

export const AddIcon = () => (
  <Icon name="add" size={24} color="currentColor" />
);

export const FlagIcon = ({ priority }: { priority: "urgent" | "high" | "medium" | "low" }) => {
  const colors: Record<string, string> = {
    urgent: "#E7000B",
    high: "#FF6900",
    medium: "#FFD230",
    low: "#99A1AF",
  };

  return (
    <Icon name="flag" size={24} color={colors[priority]} filled />
  );
};

export const CalendarIcon = () => (
  <Icon name="calendar_today" size={20} color="#90A1B9" />
);

export const SwitchLeftIcon = () => (
  <Icon name="swap_horiz" size={30} color="#90A1B9" />
);

export const ExpandArrowIcon = () => (
  <Icon name="double_arrow" size={30} color="#0014A8" />
);

export const MoreVertIcon = () => (
  <Icon name="more_vert" size={24} color="#62748E" />
);

export const ChevronIcon = ({ collapsed }: { collapsed: boolean }) => (
  <span className={`transition-transform duration-200 inline-flex ${collapsed ? "-rotate-90" : "rotate-0"}`}>
    <Icon name="expand_more" size={16} color="#62748E" />
  </span>
);
