import { NavLink } from "react-router-dom";

const navigation = [
  {
    label: "Dashboard",
    path: "/dashboard",
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
    label: "Reports",
    path: "/reports",
    icon: "▥",
  },
  {
    label: "Settings",
    path: "/settings",
    icon: "⚙",
  },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">L</div>

        <div>
          <strong>LaundryOS</strong>
          <span>Management</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-label">MENU</span>

        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-item${isActive ? " active" : ""}`
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="avatar">K</div>

          <div className="sidebar-user-info">
            <strong>Admin</strong>
            <span>Administrator</span>
          </div>
        </div>
      </div>
    </aside>
  );
}