import { useLocation } from "react-router-dom";

import { useAuth } from "../app/AuthContext";

interface HeaderProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

const titles: Record<string, string> = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/orders": "Orders",
  "/customers": "Customers",
  "/services": "Services",
  "/storage": "Storage",
  "/reports": "Reports",
  "/settings": "Settings",
};

export default function Header({
  onMenuClick,
  sidebarOpen,
}: HeaderProps) {
  const location = useLocation();

  const { user } = useAuth();

  const title =
    titles[location.pathname] || "LaundryOS";

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          type="button"
          className="sidebar-toggle"
          aria-label={
            sidebarOpen
              ? "Tutup menu"
              : "Buka menu"
          }
          aria-expanded={sidebarOpen}
          onClick={onMenuClick}
        >
          <span />
          <span />
          <span />
        </button>

        <div className="header-title">
          <h1>{title}</h1>

          <p>
            Kelola operasional laundry kamu dengan
            mudah.
          </p>
        </div>
      </div>

      <div className="header-user">
        <div className="header-user-avatar">
          {user?.name?.charAt(0).toUpperCase() ?? "U"}
        </div>

        <span className="header-user-name">
          {user?.name ?? "User"}
        </span>

        <span className="header-user-chevron">
          ▾
        </span>
      </div>

    </header>
  );
}