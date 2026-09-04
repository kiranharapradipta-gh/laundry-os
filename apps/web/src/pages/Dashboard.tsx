import type { AuthUser } from "../api/client";

interface DashboardProps {
  user: AuthUser;
  onNavigate: (page: string) => void;
}

export default function Dashboard({
  user,
  onNavigate,
}: DashboardProps) {
  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-greeting">
            Selamat datang 👋
          </p>

          <h1>{user.name}</h1>

          <p className="dashboard-business">
            {user.businessName}
          </p>
        </div>
      </header>

      <section className="dashboard-stats">
        <div className="stat-card">
          <span className="stat-icon">📦</span>

          <div>
            <span className="stat-label">
              Order Hari Ini
            </span>

            <strong>0</strong>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">🧺</span>

          <div>
            <span className="stat-label">
              Sedang Diproses
            </span>

            <strong>0</strong>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">✅</span>

          <div>
            <span className="stat-label">
              Siap Diambil
            </span>

            <strong>0</strong>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">🎉</span>

          <div>
            <span className="stat-label">
              Selesai
            </span>

            <strong>0</strong>
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>Quick Actions</h2>
            <p>Akses fitur yang paling sering digunakan.</p>
          </div>
        </div>

        <div className="quick-actions">
          <button
            type="button"
            className="quick-action pickup"
            onClick={() => onNavigate("pickup")}
          >
            <span className="quick-action-icon">
              📷
            </span>

            <span>
              <strong>Pickup Order</strong>
              <small>
                Scan QR customer
              </small>
            </span>
          </button>

          <button
            type="button"
            className="quick-action"
            onClick={() => onNavigate("orders")}
          >
            <span className="quick-action-icon">
              📦
            </span>

            <span>
              <strong>Orders</strong>
              <small>
                Kelola pesanan
              </small>
            </span>
          </button>

          <button
            type="button"
            className="quick-action"
            onClick={() => onNavigate("customers")}
          >
            <span className="quick-action-icon">
              👥
            </span>

            <span>
              <strong>Customers</strong>
              <small>
                Cari customer
              </small>
            </span>
          </button>

          <button
            type="button"
            className="quick-action"
            onClick={() => onNavigate("storage")}
          >
            <span className="quick-action-icon">
              🗄️
            </span>

            <span>
              <strong>Storage</strong>
              <small>
                Kelola penyimpanan
              </small>
            </span>
          </button>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>Aktivitas Hari Ini</h2>
            <p>
              Aktivitas order terbaru akan muncul di sini.
            </p>
          </div>
        </div>

        <div className="empty-activity">
          <div className="empty-activity-icon">
            📋
          </div>

          <strong>
            Belum ada aktivitas
          </strong>

          <span>
            Aktivitas order hari ini akan ditampilkan di sini.
          </span>
        </div>
      </section>
    </main>
  );
}