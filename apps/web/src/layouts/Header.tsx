import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../app/AuthContext";

interface HeaderProps {
  onMenuClick?: () => void;
  sidebarOpen?: boolean;
}

export default function Header({
  onMenuClick,
  sidebarOpen = false,
}: HeaderProps) {
  const { user, logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const displayName = user?.name?.trim() || "User";
  const roleLabel = user?.role === "OWNER" ? "Owner" : "Employee";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  function handleLogout() {
    setIsMenuOpen(false);
    logout();
  }

  return (
    <header className="app-header">
      <button
        type="button"
        className="header-menu-button"
        onClick={onMenuClick}
        aria-label={sidebarOpen ? "Tutup menu" : "Buka menu"}
        aria-expanded={sidebarOpen}
      >
        {sidebarOpen ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 6l12 12M18 6 6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>
      <div className="header-spacer" />

      <div className="header-user" ref={menuRef}>
        <button
          type="button"
          className={`header-user-trigger ${
            isMenuOpen ? "is-open" : ""
          }`}
          onClick={() => setIsMenuOpen((current) => !current)}
          aria-expanded={isMenuOpen}
          aria-haspopup="menu"
        >
          <span className="header-user-avatar">{initials}</span>

          <span className="header-user-info">
            <span className="header-user-name">{displayName}</span>
            <span className="header-user-role">{roleLabel}</span>
          </span>

          <svg
            className="header-user-chevron"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="m6 9 6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isMenuOpen && (
          <div className="header-user-menu" role="menu">
            <div className="header-user-menu-profile">
              <span className="header-user-menu-avatar">
                {initials}
              </span>

              <div>
                <strong>{displayName}</strong>
                <span>{user?.phone || user?.email || roleLabel}</span>
              </div>
            </div>

            <div className="header-user-menu-divider" />

            <Link
              to="/settings"
              className="header-user-menu-item"
              role="menuitem"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="header-user-menu-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="m19.4 15 .1.1a2 2 0 0 1-2.8 2.8l-.1-.1a2 2 0 0 0-3.4 1.4v.2a2 2 0 0 1-4 0v-.2a2 2 0 0 0-3.4-1.4l-.1.1A2 2 0 0 1 3 15.1l.1-.1a2 2 0 0 0-1.4-3.4h-.2a2 2 0 0 1 0-4h.2a2 2 0 0 0 1.4-3.4L3 4.1A2 2 0 0 1 5.8 1.3l.1.1a2 2 0 0 0 3.4-1.4v-.2a2 2 0 0 1 4 0V0a2 2 0 0 0 3.4 1.4l.1-.1A2 2 0 0 1 19.6 4l-.1.1a2 2 0 0 0 1.4 3.4h.2a2 2 0 0 1 0 4h-.2a2 2 0 0 0-1.5 3.5Z"
                    transform="scale(.85) translate(2.1 2.1)"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>
              </span>

              <span>
                <strong>Pengaturan</strong>
                <small>Kelola akun & laundry</small>
              </span>
            </Link>

            <button
              type="button"
              className="header-user-menu-item header-user-menu-logout"
              role="menuitem"
              onClick={handleLogout}
            >
              <span className="header-user-menu-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M14 8l4 4-4 4M8 12h10"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              <span>
                <strong>Keluar</strong>
                <small>Keluar dari akun</small>
              </span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}