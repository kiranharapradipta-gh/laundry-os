import "../styles/layout.css"

import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function closeSidebar() {
    setSidebarOpen(false);
  }

  return (
    <div className="app-shell">

      {sidebarOpen && (
        <>
          <button
          type="button"
          className="sidebar-overlay"
          aria-label="Tutup menu"
          onClick={() => setSidebarOpen(!setSidebarOpen)}
          />
          <Sidebar
            open={sidebarOpen}
            onClose={closeSidebar}
          />
        </>
      )}

      <div className="app-main">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// import "../styles/layout.css"

// import { Outlet } from "react-router-dom";
// import Sidebar from "./Sidebar";
// import Header from "./Header";

// export default function AppLayout() {
//   return (
//     <div className="app-shell">
//       <Sidebar />

//       <div className="app-main">
//         <Header />

//         <main className="app-content">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }