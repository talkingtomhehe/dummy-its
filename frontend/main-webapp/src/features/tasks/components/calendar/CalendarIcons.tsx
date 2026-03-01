// Calendar-specific icons
import Icon from "../../../../components/common/Icon";

export const ChevronLeftIcon = () => (
  <Icon name="chevron_left" size={20} color="currentColor" />
);

export const ChevronRightIcon = () => (
  <Icon name="chevron_right" size={20} color="currentColor" />
);

export const ListViewIcon = ({ active }: { active: boolean }) => (
  <Icon name="list" size={20} color={active ? "#0014A8" : "#62748E"} />
);

export const BoardViewIcon = ({ active }: { active: boolean }) => (
  <Icon name="view_kanban" size={20} color={active ? "#0014A8" : "#62748E"} filled />
);

export const TimelineViewIcon = ({ active }: { active: boolean }) => (
  <Icon name="timeline" size={20} color={active ? "#0014A8" : "#62748E"} />
);

export const CalendarTabIcon = ({ active }: { active: boolean }) => (
  <Icon name="calendar_month" size={20} color={active ? "#0014A8" : "#62748E"} />
);

export const FilterLinesIcon = () => (
  <Icon name="filter_alt" size={20} color="#62748E" />
);

export const SettingsGearIcon = () => (
  <Icon name="settings" size={20} color="#62748E" />
);

export const ArrowRightIcon = () => (
  <Icon name="chevron_right" size={16} color="#90A1B9" />
);
