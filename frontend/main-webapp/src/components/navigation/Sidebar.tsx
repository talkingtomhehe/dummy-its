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
    className="transition-transform duration-200 group-hover:scale-110"
  >
    <rect x="3" y="3" width="7" height="7" rx="1" fill={active ? "#0014A8" : "#62748E"} />
    <rect x="14" y="3" width="7" height="7" rx="1" fill={active ? "#0014A8" : "#62748E"} />
    <rect x="3" y="14" width="7" height="7" rx="1" fill={active ? "#0014A8" : "#62748E"} />
    <rect x="14" y="14" width="7" height="7" rx="1" fill={active ? "#0014A8" : "#62748E"} />
  </svg>
);

const AnnouncementIcon = ({ active }: { active: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="transition-transform duration-200 group-hover:scale-110"
  >
    <path
      d="M18 11C18 11 21 12 21 15V17H3V15C3 12 6 11 6 11"
      stroke={active ? "#0014A8" : "#62748E"}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
    <path
      d="M12 11C12 11 8 10 8 7V4L12 2L16 4V7C16 10 12 11 12 11Z"
      stroke={active ? "#0014A8" : "#62748E"}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
    <path
      d="M9 17V19C9 20.1046 9.89543 21 11 21H13C14.1046 21 15 20.1046 15 19V17"
      stroke={active ? "#0014A8" : "#62748E"}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
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
    className="transition-transform duration-200 group-hover:scale-110"
  >
    <path
      d="M4 4H20V16H6L4 18V4Z"
      stroke={active ? "#0014A8" : "#62748E"}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
    <line x1="8" y1="8" x2="16" y2="8" stroke={active ? "#0014A8" : "#62748E"} strokeWidth="2" strokeLinecap="round" />
    <line x1="8" y1="12" x2="14" y2="12" stroke={active ? "#0014A8" : "#62748E"} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const PositionIcon = ({ active }: { active: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="transition-transform duration-200 group-hover:scale-110"
  >
    <circle cx="12" cy="5" r="2" stroke={active ? "#0014A8" : "#62748E"} strokeWidth="2" />
    <circle cx="6" cy="17" r="2" stroke={active ? "#0014A8" : "#62748E"} strokeWidth="2" />
    <circle cx="18" cy="17" r="2" stroke={active ? "#0014A8" : "#62748E"} strokeWidth="2" />
    <path d="M12 7V10M12 10L6 15M12 10L18 15" stroke={active ? "#0014A8" : "#62748E"} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ProjectIcon = ({ active }: { active: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="transition-transform duration-200 group-hover:scale-110"
  >
    <rect x="3" y="3" width="6" height="18" rx="1" stroke={active ? "#0014A8" : "#62748E"} strokeWidth="2" />
    <rect x="11" y="3" width="6" height="12" rx="1" stroke={active ? "#0014A8" : "#62748E"} strokeWidth="2" />
    <rect x="19" y="3" width="2" height="8" rx="1" fill={active ? "#0014A8" : "#62748E"} />
  </svg>
);

const CollapseIcon = ({ collapsed }: { collapsed: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
  >
    <path d="M15 18L9 12L15 6" stroke="#62748E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 18L3 12L9 6" stroke="#62748E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SettingsIcon = ({ active }: { active: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="transition-transform duration-200 group-hover:scale-110"
  >
    <circle cx="12" cy="12" r="3" stroke={active ? "#0014A8" : "#62748E"} strokeWidth="2" />
    <path
      d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
      stroke={active ? "#0014A8" : "#62748E"}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

interface NavItemProps {
  to: string;
  icon: (props: { active: boolean }) => ReactElement;
  label: string;
  isCollapsed: boolean;
}

const NavItem = ({ to, icon: Icon, label, isCollapsed }: NavItemProps) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `group relative flex items-center rounded-lg transition-all duration-200 ease-out
       ${isCollapsed ? "w-10 h-10 justify-center" : "w-full px-3 py-2 gap-3"}
       ${isActive
        ? "bg-primary/8 text-primary shadow-sm"
        : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800"
      }`
    }
  >
    {({ isActive }) => (
      <>
        {/* Active indicator bar */}
        <div
          className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full transition-all duration-300 ease-out
            ${isActive ? "h-5 bg-primary opacity-100" : "h-0 bg-transparent opacity-0"}
          `}
        />

        <div className="flex-shrink-0">
          <Icon active={isActive} />
        </div>

        {/* Label - animated fade/slide */}
        <span
          className={`text-xs font-medium whitespace-nowrap transition-all duration-300 ease-out overflow-hidden
            ${isCollapsed
              ? "w-0 opacity-0 ml-0"
              : "w-auto opacity-100"
            }
            ${isActive ? "text-primary font-semibold" : ""}`}
        >
          {label}
        </span>

        {/* Tooltip for collapsed state */}
        {isCollapsed && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-neutral-800 text-white text-xs rounded-md
                          opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200
                          whitespace-nowrap z-50 shadow-lg">
            {label}
            {/* Tooltip arrow */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-neutral-800 rotate-45 rounded-sm" />
          </div>
        )}
      </>
    )}
  </NavLink>
);

export default function Sidebar() {
  const { isCollapsed, toggleSidebar } = useSidebar();

  const navItems: Omit<NavItemProps, "isCollapsed">[] = [
    { to: "/dashboard", icon: DashboardIcon, label: "Dashboard" },
    { to: "/announcements", icon: AnnouncementIcon, label: "Announce" },
    { to: "/discuss", icon: DiscussIcon, label: "Discuss" },
    { to: "/positions", icon: PositionIcon, label: "Position" },
    { to: "/projects", icon: ProjectIcon, label: "Project" },
  ];

  return (
    <aside
      className={`bg-white flex flex-col items-center gap-1 py-3 rounded-xl shadow-sm border border-neutral-100 sticky top-0 self-start h-[calc(100vh-theme(spacing.16))]
                   transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden
                   ${isCollapsed ? "w-[56px] px-2" : "w-[140px] px-2.5"}`}
    >
      {/* Collapse Toggle Button */}
      <button
        type="button"
        onClick={toggleSidebar}
        className={`flex items-center justify-center rounded-lg transition-all duration-200
                    hover:bg-neutral-100 active:scale-95 mb-1
                    ${isCollapsed ? "w-10 h-8" : "w-full h-8"}`}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <CollapseIcon collapsed={isCollapsed} />
      </button>

      {/* Subtle divider */}
      <div className={`h-px bg-neutral-100 transition-all duration-300 mb-1 ${isCollapsed ? "w-8" : "w-full"}`} />

      {/* Navigation Items */}
      <nav className="flex flex-col items-center gap-1 w-full">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} isCollapsed={isCollapsed} />
        ))}
      </nav>

      {/* Spacer pushes Settings to bottom */}
      <div className="flex-1" />

      {/* Bottom divider */}
      <div className={`h-px bg-neutral-100 transition-all duration-300 ${isCollapsed ? "w-8" : "w-full"}`} />

      {/* Settings Button */}
      <NavItem
        to="/settings"
        icon={SettingsIcon}
        label="Settings"
        isCollapsed={isCollapsed}
      />
    </aside>
  );
}
