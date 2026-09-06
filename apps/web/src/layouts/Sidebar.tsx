import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

const navigation = [
  {
    label: "Dashboard",
    path: "/",
    icon: "⌂",
  },
  {
    label: "Orders",
    path: "/orders",
    icon: "▣",
  },
  {
    label: "Customers",
    path: "/customers",
    icon: "♙",
  },
  {
    label: "Services",
    path: "/services",
    icon: "◈",
  },
  {
    label: "Storage",
    path: "/storage",
    icon: "▤",
  },
];

export default function Sidebar({
  // open = false,
  onClose,
}: SidebarProps) {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">
          L
        </div>

        <div>
          <strong>LaundryOS</strong>
          <span>Management</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-label">
          MENU
        </span>

        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            onClick={onClose}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">
              {item.icon}
            </span>

            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="user-info">
            <strong>{user?.name}</strong>
            <span>{user?.role}</span>
          </div>
        </div>

        <button
          className="logout-button"
          onClick={logout}
          type="button"
        >
          <span>↪</span>
          Keluar
        </button>
      </div>
    </aside>
  );
}