// Icons for Position Tree feature
import Icon from "../../../components/common/Icon";

export const SearchIcon = ({ size = 14 }: { size?: number }) => (
  <Icon name="search" size={size} color="#90A1B9" />
);

export const CloseIcon = () => (
  <Icon name="close" size={24} color="#0F172B" />
);

export const FilterIcon = () => (
  <Icon name="filter_alt" size={14} color="#62748E" />
);

export const TreeViewIcon = ({ active }: { active: boolean }) => (
  <Icon name="account_tree" size={16} color={active ? "white" : "#62748E"} filled />
);

export const ListViewIcon = ({ active }: { active: boolean }) => (
  <Icon name="list" size={16} color={active ? "white" : "#62748E"} />
);

export const AddIcon = () => (
  <Icon name="add" size={30} color="currentColor" />
);

export const ChevronDoubleRightIcon = () => (
  <Icon name="keyboard_double_arrow_right" size={30} color="#0014A8" />
);
