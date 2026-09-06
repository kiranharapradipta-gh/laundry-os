import "../styles/header.css"

import { useLocation } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";

interface HeaderProps {
  onMenuClick: () => void;
}

const titles: Record<string, string> = {
  "/": "Dashboard",
  "/orders": "Orders",
  "/customers": "Customers",
  "/services": "Services",
  "/storage": "Storage",
};

export default function Header({
  onMenuClick,
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
          className="mobile-menu-button"
          aria-label="Buka menu"
          onClick={onMenuClick}
        >
          <span />
          <span />
          <span />
        </button>

        <div>
          <h1>{title}</h1>

          <p>
            Kelola operasional laundry kamu dengan mudah.
          </p>
        </div>
      </div>

      <div className="header-business">
        <div className="business-avatar">
          {user?.businessName
            ?.charAt(0)
            .toUpperCase()}
        </div>

        <div>
          <strong>{user?.businessName}</strong>
          <span>{user?.name}</span>
        </div>
      </div>
    </header>
  );
}

// import { useLocation } from "react-router-dom";
// import { useAuth } from "../auth/AuthContext";

// const titles: Record<string, string> = {
//   "/": "Dashboard",
//   "/orders": "Orders",
//   "/customers": "Customers",
//   "/services": "Services",
//   "/storage": "Storage",
// };

// export default function Header() {
//   const location = useLocation();
//   const { user } = useAuth();

//   const title =
//     titles[location.pathname] || "LaundryOS";

//   return (
//     <header className="app-header">
//       <div>
//         <h1>{title}</h1>
//         <p>
//           Kelola operasional laundry kamu dengan mudah.
//         </p>
//       </div>

//       <div className="header-business">
//         <div className="business-avatar">
//           {user?.businessName?.charAt(0).toUpperCase()}
//         </div>

//         <div>
//           <strong>{user?.businessName}</strong>
//           <span>{user?.name}</span>
//         </div>
//       </div>
//     </header>
//   );
// }