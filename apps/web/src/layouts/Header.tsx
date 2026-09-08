import { useLocation } from "react-router-dom";
import { useAuth } from "../app/AuthContext";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/orders": "Orders",
  "/customers": "Customers",
  "/services": "Services",
  "/reports": "Reports",
  "/settings": "Settings",
};

export function Header() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const title =
    titles[location.pathname] ?? "LaundryOS";

  return (
    <header className="app-header">
      <div className="header-title">
        <h1>{title}</h1>
      </div>

      <div className="header-user">
        <div className="header-user-info">
          <strong>
            {user?.name ?? "User"}
          </strong>

          <span>
            {user?.role === "OWNER"
              ? "Owner"
              : "Employee"}
          </span>
        </div>

        <button
          type="button"
          className="header-logout"
          onClick={logout}
        >
          Keluar
        </button>
      </div>
    </header>
  );
}