import { NavLink } from "react-router-dom";
import type { ReactElement } from "react";
import { useSidebar } from "../../contexts/SidebarContext";

// Icon components as inline SVGs for pixel-perfect rendering
const DashboardIcon = ({ active }: { active: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="3"
      width="7"
      height="7"
      rx="1"
      fill={active ? "#0014A8" : "#62748E"}
    />
    <rect
      x="14"
      y="3"
      width="7"
      height="7"
      rx="1"
      fill={active ? "#0014A8" : "#62748E"}
    />
    <rect
      x="3"
      y="14"
      width="7"
      height="7"
      rx="1"
      fill={active ? "#0014A8" : "#62748E"}
    />
    <rect
      x="14"
      y="14"
      width="7"
      height="7"
      rx="1"
      fill={active ? "#0014A8" : "#62748E"}
    />
  </svg>
);

const AnnouncementIcon = ({ active }: { active: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 11C18 11 21 12 21 15V17H3V15C3 12 6 11 6 11"
      stroke={active ? "#0014A8" : "#62748E"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 11C12 11 8 10 8 7V4L12 2L16 4V7C16 10 12 11 12 11Z"
      stroke={active ? "#0014A8" : "#62748E"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 17V19C9 20.1046 9.89543 21 11 21H13C14.1046 21 15 20.1046 15 19V17"
      stroke={active ? "#0014A8" : "#62748E"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DiscussIcon = ({ active }: { active: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 4H20V16H6L4 18V4Z"
      stroke={active ? "#0014A8" : "#62748E"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="8"
      y1="8"
      x2="16"
      y2="8"
      stroke={active ? "#0014A8" : "#62748E"}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="8"
      y1="12"
      x2="14"
      y2="12"
      stroke={active ? "#0014A8" : "#62748E"}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const PositionIcon = ({ active }: { active: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="12"
      cy="5"
      r="2"
      stroke={active ? "#0014A8" : "#62748E"}
      strokeWidth="2"
    />
    <circle
      cx="6"
      cy="17"
      r="2"
      stroke={active ? "#0014A8" : "#62748E"}
      strokeWidth="2"
    />
    <circle
      cx="18"
      cy="17"
      r="2"
      stroke={active ? "#0014A8" : "#62748E"}
      strokeWidth="2"
    />
    <path
      d="M12 7V10M12 10L6 15M12 10L18 15"
      stroke={active ? "#0014A8" : "#62748E"}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const ProjectIcon = ({ active }: { active: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="3"
      width="6"
      height="18"
      rx="1"
      stroke={active ? "#0014A8" : "#62748E"}
      strokeWidth="2"
    />
    <rect
      x="11"
      y="3"
      width="6"
      height="12"
      rx="1"
      stroke={active ? "#0014A8" : "#62748E"}
      strokeWidth="2"
    />
    <rect
      x="19"
      y="3"
      width="2"
      height="8"
      rx="1"
      fill={active ? "#0014A8" : "#62748E"}
    />
  </svg>
);

const CollapseIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 18L9 12L15 6"
      stroke="#62748E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 18L3 12L9 6"
      stroke="#62748E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronDoubleRightIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 6L15 12L9 18"
      stroke="#62748E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 6L21 12L15 18"
      stroke="#62748E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface NavItemProps {
  to: string;
  icon: (props: { active: boolean }) => ReactElement;
  label: string;
}

const NavItem = ({ to, icon: Icon, label }: NavItemProps) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-col items-center gap-0.5 w-16 py-1 rounded-lg transition-colors ${isActive
        ? "text-primary"
        : "text-neutral-500 hover:text-neutral-900"
      }`
    }
  >
    {({ isActive }) => (
      <>
        <Icon active={isActive} />
        <span
          className={`text-xs text-center leading-4 ${isActive ? "font-medium" : "font-normal"
            }`}
        >
          {label}
        </span>
      </>
    )}
  </NavLink>
);

export default function Sidebar() {
  const { isCollapsed, toggleSidebar } = useSidebar();

  const navItems: NavItemProps[] = [
    { to: "/dashboard", icon: DashboardIcon, label: "Dashboard" },
    { to: "/announcements", icon: AnnouncementIcon, label: "Announcement" },
    { to: "/discuss", icon: DiscussIcon, label: "Discuss" },
    { to: "/positions", icon: PositionIcon, label: "Position" },
    { to: "/projects", icon: ProjectIcon, label: "Project" },
  ];

  // Collapsed state - only show fixed position toggle button
  if (isCollapsed) {
    return (
      <button
        onClick={toggleSidebar}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-10 bg-primary/20 rounded-r-[20px] p-1.5 hover:bg-primary/30 transition-colors"
        aria-label="Expand sidebar"
      >
        <ChevronDoubleRightIcon />
      </button>
    );
  }

  // Expanded state - show full navigation
  return (
    <aside className="bg-white flex flex-col items-center gap-2 px-2 py-2 rounded-xl shadow-[0px_4px_4px_0px_#e2e8f0] h-full min-w-[80px] transition-all duration-300">
      {/* Collapse Toggle Button */}
      <button
        type="button"
        onClick={toggleSidebar}
        className="flex items-center justify-center w-16 h-8 hover:bg-neutral-50 rounded-lg transition-colors"
        aria-label="Collapse sidebar"
      >
        <CollapseIcon />
      </button>

      {/* Navigation Items */}
      <nav className="flex flex-col items-center gap-2 flex-1">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>
    </aside>
  );
}
