import type { ReactNode } from "react";
import {
Camera,
LayoutDashboard,
LogOut,
Package,
Users,
Warehouse,
} from "lucide-react";

import type { AuthUser } from "../../api/client";

type Page =
| "dashboard"
| "orders"
| "customers"
| "pickup"
| "storage"
| "create-order";

interface AppLayoutProps {
user: AuthUser;
page: Page;
children: ReactNode;
onNavigate: (page: Page) => void;
onLogout: () => void;
}

const navigation = [
{
id: "dashboard",
label: "Dashboard",
icon: LayoutDashboard,
},
{
id: "orders",
label: "Orders",
icon: Package,
},
{
id: "customers",
label: "Customers",
icon: Users,
},
{
id: "pickup",
label: "Pickup",
icon: Camera,
},
{
id: "storage",
label: "Storage",
icon: Warehouse,
},
] as const;

function getInitials(name: string) {
return name
.trim()
.split(/\s+/)
.slice(0, 2)
.map((part) => part[0]?.toUpperCase() ?? "")
.join("");
}

export default function AppLayout({
user,
page,
children,
onNavigate,
onLogout,
}: AppLayoutProps) {
function navigate(nextPage: Page) {
onNavigate(nextPage);
}

return ( <div className="app-shell"> <aside className="app-sidebar">
<button
type="button"
className="app-brand"
onClick={() => navigate("dashboard")}
aria-label="Go to dashboard"
> <span className="app-brand-mark">L</span> <span className="app-brand-name">LaundryOS</span> </button>

    <nav className="app-sidebar-nav" aria-label="Main navigation">
      {navigation.map((item) => {
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            type="button"
            className={`app-sidebar-link ${
              page === item.id ? "active" : ""
            }`}
            onClick={() => navigate(item.id)}
          >
            <Icon size={18} strokeWidth={2} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>

    <div className="app-sidebar-footer">
      <div className="app-user-card">
        <div className="app-user-avatar">
          {getInitials(user.name)}
        </div>

        <div className="app-user-info">
          <span className="app-user-name">
            {user.name}
          </span>

          <span className="app-user-business">
            {user.businessName}
          </span>
        </div>

        <button
          type="button"
          className="app-logout"
          onClick={onLogout}
          aria-label="Logout"
          title="Logout"
        >
          <LogOut size={17} />
        </button>
      </div>
    </div>
  </aside>

  <main className="app-main">
    <header className="app-mobile-header">
      <div className="app-mobile-brand">
        <span className="app-brand-mark">L</span>
        <span>LaundryOS</span>
      </div>

      <div className="app-mobile-user">
        {getInitials(user.name)}
      </div>
    </header>

    <div className="app-content">
      {children}
    </div>
  </main>

  <nav className="app-mobile-nav" aria-label="Mobile navigation">
    {navigation.map((item) => {
      const Icon = item.icon;

      return (
        <button
          key={item.id}
          type="button"
          className={`app-mobile-nav-link ${
            page === item.id ? "active" : ""
          }`}
          onClick={() => navigate(item.id)}
        >
          <Icon size={19} strokeWidth={2} />
          <span>{item.label}</span>
        </button>
      );
    })}
  </nav>
</div>

);
}
