import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function closeSidebar() {
    setSidebarOpen(false);
  }

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener(
        "resize",
        handleResize,
      );
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      sidebarOpen && window.innerWidth <= 768
        ? "hidden"
        : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="app-shell">
      <Sidebar
        open={sidebarOpen}
        onNavigate={closeSidebar}
      />

      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          aria-label="Tutup menu"
          onClick={closeSidebar}
        />
      )}

      <div className="app-main">
        <Header
          onMenuClick={() =>
            setSidebarOpen((current) => !current)
          }
          sidebarOpen={sidebarOpen}
        />

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}