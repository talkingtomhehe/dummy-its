// Gantt Chart Icons
import Icon from "../../../../components/common/Icon";

export const FilterIcon = () => (
  <Icon name="filter_alt" size={14} color="currentColor" />
);

export const GroupByIcon = () => (
  <Icon name="group" size={14} color="currentColor" />
);

export const ChevronLeftIcon = () => (
  <Icon name="chevron_left" size={14} color="currentColor" />
);

export const ChevronRightIcon = () => (
  <Icon name="chevron_right" size={14} color="currentColor" />
);

export const CloseIcon = () => (
  <Icon name="close" size={24} color="currentColor" />
);

export const CheckIcon = () => (
  <Icon name="check" size={16} color="currentColor" />
);

export const FlagIcon = ({ className = "" }: { className?: string }) => (
  <Icon name="flag" size={16} color="currentColor" filled className={className} />
);

export const PlusIcon = () => (
  <Icon name="add" size={16} color="currentColor" />
);
