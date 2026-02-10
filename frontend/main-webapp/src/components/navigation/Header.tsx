import { Link } from "react-router-dom";

// Logo Icon SVG
const LogoIcon = () => (
  <svg
    width="36"
    height="24"
    viewBox="0 0 54 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M27 0C12.088 0 0 12.088 0 27C0 29.761 0.373 32.438 1.077 34H52.923C53.627 32.438 54 29.761 54 27C54 12.088 41.912 0 27 0ZM15 24V34H21V24C21 22.343 19.657 21 18 21C16.343 21 15 22.343 15 24ZM24 18V34H30V18C30 16.343 28.657 15 27 15C25.343 15 24 16.343 24 18ZM33 12V34H39V12C39 10.343 37.657 9 36 9C34.343 9 33 10.343 33 12Z"
      fill="#0014A8"
    />
  </svg>
);

// Message Icon SVG
const MessageIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
      stroke="#62748E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 6L12 13L2 6"
      stroke="#62748E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Notification Bell Icon SVG
const NotificationIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
      stroke="#62748E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
      stroke="#62748E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface HeaderProps {
  companyName?: string;
  userAvatarUrl?: string;
}

export default function Header({
  companyName = "Your company",
  userAvatarUrl,
}: HeaderProps) {
  return (
    <header className="bg-white flex items-center justify-between px-3 py-2 shadow-[0px_4px_4px_0px_#e2e8f0] w-full">
      {/* Logo Section */}
      <Link to="/dashboard" className="flex items-center gap-2">
        <LogoIcon />
        <span className="font-bold text-sm text-primary">
          {companyName}
        </span>
      </Link>

      {/* Actions Section */}
      <div className="flex items-center gap-2">
        {/* Message Button */}
        <button
          type="button"
          className="p-1.5 rounded-lg hover:bg-neutral-50 transition-colors"
          aria-label="Messages"
        >
          <MessageIcon />
        </button>

        {/* Notification Button */}
        <button
          type="button"
          className="p-1.5 rounded-lg hover:bg-neutral-50 transition-colors relative"
          aria-label="Notifications"
        >
          <NotificationIcon />
        </button>

        {/* User Avatar */}
        <button
          type="button"
          className="w-8 h-8 rounded-full bg-neutral-200 overflow-hidden hover:ring-2 hover:ring-primary/20 transition-all"
          aria-label="User menu"
        >
          {userAvatarUrl ? (
            <img
              src={userAvatarUrl}
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-500 text-xs font-medium">
              U
            </div>
          )}
        </button>
      </div>
    </header>
  );
}
