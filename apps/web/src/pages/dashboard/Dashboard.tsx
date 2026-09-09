import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../app/AuthContext";
import { getOrders } from "../../services/api/orders";
import type { Order, OrderStatus } from "../../types/order";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 11) return "Selamat pagi";
  if (hour < 15) return "Selamat siang";
  if (hour < 18) return "Selamat sore";

  return "Selamat malam";
}

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "?"
  );
}

function getStatusLabel(status: OrderStatus) {
  const labels: Record<OrderStatus, string> = {
    RECEIVED: "Diterima",
    WASHING: "Dicuci",
    DRYING: "Dikeringkan",
    IRONING: "Disetrika",
    READY: "Siap diambil",
    PICKED_UP: "Selesai",
    CANCELLED: "Dibatalkan",
  };

  return labels[status];
}

function getStatusClass(status: OrderStatus) {
  const classes: Record<OrderStatus, string> = {
    RECEIVED: "status-new",
    WASHING: "status-process",
    DRYING: "status-process",
    IRONING: "status-process",
    READY: "status-ready",
    PICKED_UP: "status-done",
    CANCELLED: "status-cancelled",
  };

  return classes[status];
}

function formatOrderTime(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function Dashboard() {
  const { user } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const displayName = user?.name?.trim() || "User";

  const today = useMemo(
    () =>
      new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date()),
    [],
  );

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const result = await getOrders({
          page: 1,
          limit: 10,
        });

        if (!mounted) return;

        setOrders(result.data);
      } catch (err) {
        if (!mounted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Gagal mengambil data dashboard",
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const todayOrders = useMemo(() => {
    const now = new Date();

    return orders.filter((order) => {
      const date = new Date(order.createdAt);

      return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate()
      );
    });
  }, [orders]);

  const statusStats = useMemo(() => {
    return {
      received: orders.filter((order) => order.status === "RECEIVED").length,

      processing: orders.filter((order) =>
        ["WASHING", "DRYING", "IRONING"].includes(order.status),
      ).length,

      ready: orders.filter((order) => order.status === "READY").length,

      completed: orders.filter((order) => order.status === "PICKED_UP").length,
    };
  }, [orders]);

  const todayRevenue = useMemo(() => {
    return todayOrders
      .filter((order) => order.status !== "CANCELLED")
      .reduce((total, order) => total + Number(order.total || 0), 0);
  }, [todayOrders]);

  const recentOrders = useMemo(() => {
    return orders.slice(0, 5);
  }, [orders]);

  const revenueProgress = Math.min(
    100,
    Math.round((todayRevenue / 1500000) * 100),
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <section className="dashboard-hero">
          <div>
            <span className="dashboard-eyebrow">OVERVIEW</span>

            <h1>
              {getGreeting()}, {displayName.split(" ")[0]} <span>👋</span>
            </h1>

            <p>Pantau aktivitas laundry kamu dalam satu tempat.</p>
          </div>

          <div className="dashboard-date">
            <span className="dashboard-date-icon">◷</span>
            <span>{today}</span>
          </div>
        </section>

        {error && (
          <div className="dashboard-error">
            <strong>Gagal memuat dashboard</strong>
            <span>{error}</span>
          </div>
        )}

        <section className="dashboard-revenue-card">
          <div className="revenue-card-top">
            <div>
              <span className="dashboard-card-label">
                Pendapatan hari ini
              </span>

              <div className="revenue-value">
                {loading ? "Memuat..." : formatCurrency(todayRevenue)}
              </div>

              <div className="revenue-change">
                <span>Data real-time</span>
                <small> dari order PostgreSQL</small>
              </div>
            </div>

            <div className="revenue-icon">Rp</div>
          </div>

          <div className="revenue-divider" />

          <div className="revenue-footer">
            <span>Target harian</span>
            <strong>Rp 1.500.000</strong>
          </div>

          <div className="revenue-progress">
            <span style={{ width: `${revenueProgress}%` }} />
          </div>
        </section>

        <section className="dashboard-stats">
          <article className="stat-card">
            <div className="stat-icon stat-icon-orders">▣</div>

            <div className="stat-content">
              <span>Order hari ini</span>

              <strong>
                {loading ? "—" : todayOrders.length}
              </strong>

              <div className="stat-meta">
                <b>Real-time</b>
                <small>hari ini</small>
              </div>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-icon stat-icon-process">◌</div>

            <div className="stat-content">
              <span>Sedang diproses</span>

              <strong>
                {loading ? "—" : statusStats.processing}
              </strong>

              <div className="stat-meta">
                <b>Washing + drying</b>
                <small>+ ironing</small>
              </div>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-icon stat-icon-ready">✓</div>

            <div className="stat-content">
              <span>Siap diambil</span>

              <strong>
                {loading ? "—" : statusStats.ready}
              </strong>

              <div className="stat-meta">
                <b>READY</b>
                <small>menunggu customer</small>
              </div>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-icon stat-icon-done">✓</div>

            <div className="stat-content">
              <span>Selesai</span>

              <strong>
                {loading ? "—" : statusStats.completed}
              </strong>

              <div className="stat-meta">
                <b>PICKED UP</b>
                <small>order selesai</small>
              </div>
            </div>
          </article>
        </section>

        <section className="dashboard-grid">
          <article className="dashboard-card revenue-chart-card">
            <div className="dashboard-card-header">
              <div>
                <span className="dashboard-card-label">OPERASIONAL</span>
                <h2>Ringkasan order</h2>
              </div>
            </div>

            <div className="status-overview">
              <div className="status-total">
                <strong>
                  {loading ? "—" : orders.length}
                </strong>

                <span>Order dimuat</span>
              </div>

              <div className="status-list">
                <div className="status-row">
                  <span>
                    <i className="status-dot status-new" />
                    Diterima
                  </span>

                  <strong>{statusStats.received}</strong>
                </div>

                <div className="status-row">
                  <span>
                    <i className="status-dot status-process" />
                    Diproses
                  </span>

                  <strong>{statusStats.processing}</strong>
                </div>

                <div className="status-row">
                  <span>
                    <i className="status-dot status-ready" />
                    Siap diambil
                  </span>

                  <strong>{statusStats.ready}</strong>
                </div>

                <div className="status-row">
                  <span>
                    <i className="status-dot status-done" />
                    Selesai
                  </span>

                  <strong>{statusStats.completed}</strong>
                </div>
              </div>
            </div>
          </article>

          {/* <article className="dashboard-card status-card">
            <div className="dashboard-card-header">
              <div>
                <span className="dashboard-card-label">INFO</span>
                <h2>Data dashboard</h2>
              </div>
            </div>

            <div className="dashboard-info-list">
              <div>
                <span>Sumber data</span>
                <strong>PostgreSQL</strong>
              </div>

              <div>
                <span>Order terbaru</span>
                <strong>{orders.length}</strong>
              </div>

              <div>
                <span>Status aktif</span>
                <strong>
                  {statusStats.processing + statusStats.ready}
                </strong>
              </div>
            </div>
          </article> */}
        </section>

        <section className="dashboard-card recent-orders-card">
          <div className="dashboard-card-header recent-orders-header">
            <div>
              <span className="dashboard-card-label">
                AKTIVITAS TERBARU
              </span>

              <h2>Order terbaru</h2>
            </div>

            <a href="/orders" className="view-all-link">
              Lihat semua <span>→</span>
            </a>
          </div>

          {loading ? (
            <div className="dashboard-loading">
              Memuat order terbaru...
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="dashboard-loading">
              Belum ada order.
            </div>
          ) : (
            <div className="orders-list">
              {recentOrders.map((order) => {
                const customerName =
                  order.customer?.name?.trim() || "Customer";

                const serviceName =
                  order.items?.[0]?.service?.name ||
                  order.items?.[0]?.description ||
                  "Laundry";

                return (
                  <div className="dashboard-order" key={order.id}>
                    <div className="order-avatar">
                      {getInitials(customerName)}
                    </div>

                    <div className="order-main">
                      <div className="order-name-row">
                        <strong>{customerName}</strong>

                        <span>
                          {formatOrderTime(order.createdAt)}
                        </span>
                      </div>

                      <div className="order-detail">
                        <span>{order.orderNumber}</span>
                        <i>•</i>
                        <span>{serviceName}</span>
                      </div>
                    </div>

                    <div className="order-right">
                      <strong>
                        {formatCurrency(Number(order.total || 0))}
                      </strong>

                      <span
                        className={`order-status ${getStatusClass(
                          order.status,
                        )}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="quick-actions">
          <a
            href="/orders/new"
            className="quick-action quick-action-primary"
          >
            <span className="quick-action-icon">+</span>

            <span>
              <strong>Order baru</strong>
              <small>Buat transaksi baru</small>
            </span>

            <b>→</b>
          </a>

          <a href="/customers/new" className="quick-action">
            <span className="quick-action-icon">♙</span>

            <span>
              <strong>Tambah customer</strong>
              <small>Daftarkan customer baru</small>
            </span>

            <b>→</b>
          </a>
        </section>
      </div>
    </div>
  );
}

// import { useMemo } from "react";
// import { useAuth } from "../../app/AuthContext";

// type OrderStatus = "BARU" | "DIPROSES" | "SIAP" | "SELESAI";

// interface DashboardOrder {
//   id: string;
//   customer: string;
//   service: string;
//   total: number;
//   status: OrderStatus;
//   time: string;
// }

// const orders: DashboardOrder[] = [
//   {
//     id: "ORD-1048",
//     customer: "Budi Santoso",
//     service: "Cuci Kering",
//     total: 45000,
//     status: "SELESAI",
//     time: "08:42",
//   },
//   {
//     id: "ORD-1047",
//     customer: "Siti Rahma",
//     service: "Laundry Kiloan",
//     total: 35000,
//     status: "DIPROSES",
//     time: "08:25",
//   },
//   {
//     id: "ORD-1046",
//     customer: "Andi Pratama",
//     service: "Express",
//     total: 70000,
//     status: "SIAP",
//     time: "07:58",
//   },
//   {
//     id: "ORD-1045",
//     customer: "Dewi Lestari",
//     service: "Cuci + Setrika",
//     total: 55000,
//     status: "BARU",
//     time: "07:31",
//   },
//   {
//     id: "ORD-1044",
//     customer: "Rizky Maulana",
//     service: "Laundry Kiloan",
//     total: 42000,
//     status: "SELESAI",
//     time: "07:12",
//   },
// ];

// const revenueData = [
//   { day: "Sen", value: 420000 },
//   { day: "Sel", value: 580000 },
//   { day: "Rab", value: 510000 },
//   { day: "Kam", value: 720000 },
//   { day: "Jum", value: 650000 },
//   { day: "Sab", value: 890000 },
//   { day: "Min", value: 760000 },
// ];

// function formatCurrency(value: number) {
//   return new Intl.NumberFormat("id-ID", {
//     style: "currency",
//     currency: "IDR",
//     maximumFractionDigits: 0,
//   }).format(value);
// }

// function getGreeting() {
//   const hour = new Date().getHours();

//   if (hour < 11) return "Selamat pagi";
//   if (hour < 15) return "Selamat siang";
//   if (hour < 18) return "Selamat sore";

//   return "Selamat malam";
// }

// function getInitials(name: string) {
//   return name
//     .trim()
//     .split(/\s+/)
//     .slice(0, 2)
//     .map((word) => word[0])
//     .join("")
//     .toUpperCase();
// }

// function statusLabel(status: OrderStatus) {
//   const labels: Record<OrderStatus, string> = {
//     BARU: "Baru",
//     DIPROSES: "Diproses",
//     SIAP: "Siap diambil",
//     SELESAI: "Selesai",
//   };

//   return labels[status];
// }

// export function Dashboard() {
//   const { user } = useAuth();

//   const displayName = user?.name?.trim() || "User";

//   const today = useMemo(() => {
//     return new Intl.DateTimeFormat("id-ID", {
//       weekday: "long",
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//     }).format(new Date());
//   }, []);

//   const maxRevenue = Math.max(...revenueData.map((item) => item.value));

//   const orderStats = [
//     {
//       label: "Order hari ini",
//       value: "24",
//       change: "+12.5%",
//       description: "dibanding kemarin",
//       icon: "orders",
//     },
//     {
//       label: "Sedang diproses",
//       value: "8",
//       change: "4",
//       description: "perlu perhatian",
//       icon: "process",
//     },
//     {
//       label: "Siap diambil",
//       value: "5",
//       change: "Hari ini",
//       description: "menunggu customer",
//       icon: "ready",
//     },
//     {
//       label: "Selesai",
//       value: "11",
//       change: "+8.2%",
//       description: "dibanding kemarin",
//       icon: "done",
//     },
//   ];

//   return (
//     <div className="dashboard-page">
//       <div className="dashboard-container">
//         {/* Hero */}
//         <section className="dashboard-hero">
//           <div>
//             <span className="dashboard-eyebrow">OVERVIEW</span>

//             <h1>
//               {getGreeting()}, {displayName.split(" ")[0]} <span>👋</span>
//             </h1>

//             <p>
//               Pantau aktivitas laundry kamu dalam satu tempat.
//             </p>
//           </div>

//           <div className="dashboard-date">
//             <span className="dashboard-date-icon">◷</span>
//             <span>{today}</span>
//           </div>
//         </section>

//         {/* Revenue highlight */}
//         <section className="dashboard-revenue-card">
//           <div className="revenue-card-top">
//             <div>
//               <span className="dashboard-card-label">
//                 Pendapatan hari ini
//               </span>

//               <div className="revenue-value">
//                 {formatCurrency(1250000)}
//               </div>

//               <div className="revenue-change">
//                 <span>↗ 12.5%</span>
//                 <small> dibanding kemarin</small>
//               </div>
//             </div>

//             <div className="revenue-icon">
//               Rp
//             </div>
//           </div>

//           <div className="revenue-divider" />

//           <div className="revenue-footer">
//             <span>Target harian</span>
//             <strong>Rp 1.500.000</strong>
//           </div>

//           <div className="revenue-progress">
//             <span style={{ width: "83%" }} />
//           </div>
//         </section>

//         {/* KPI */}
//         <section className="dashboard-stats">
//           {orderStats.map((stat) => (
//             <article className="stat-card" key={stat.label}>
//               <div className={`stat-icon stat-icon-${stat.icon}`}>
//                 {stat.icon === "orders" && "▣"}
//                 {stat.icon === "process" && "◌"}
//                 {stat.icon === "ready" && "✓"}
//                 {stat.icon === "done" && "✓"}
//               </div>

//               <div className="stat-content">
//                 <span>{stat.label}</span>
//                 <strong>{stat.value}</strong>

//                 <div className="stat-meta">
//                   <b>{stat.change}</b>
//                   <small>{stat.description}</small>
//                 </div>
//               </div>
//             </article>
//           ))}
//         </section>

//         {/* Analytics */}
//         <section className="dashboard-grid">
//           <article className="dashboard-card revenue-chart-card">
//             <div className="dashboard-card-header">
//               <div>
//                 <span className="dashboard-card-label">
//                   PERFORMA
//                 </span>
//                 <h2>Pendapatan 7 hari</h2>
//               </div>

//               <button type="button" className="period-button">
//                 7 hari
//                 <span>⌄</span>
//               </button>
//             </div>

//             <div className="chart-wrapper">
//               <div className="chart-values">
//                 <span>1jt</span>
//                 <span>750k</span>
//                 <span>500k</span>
//                 <span>250k</span>
//                 <span>0</span>
//               </div>

//               <div className="chart">
//                 <div className="chart-grid-lines">
//                   <span />
//                   <span />
//                   <span />
//                   <span />
//                   <span />
//                 </div>

//                 <div className="chart-bars">
//                   {revenueData.map((item) => {
//                     const height = Math.max(
//                       10,
//                       (item.value / maxRevenue) * 100,
//                     );

//                     return (
//                       <div className="chart-bar-column" key={item.day}>
//                         <div className="chart-bar-value">
//                           {item.value >= 1000000
//                             ? `${(item.value / 1000000).toFixed(1)}jt`
//                             : `${Math.round(item.value / 1000)}k`}
//                         </div>

//                         <div className="chart-bar-track">
//                           <div
//                             className="chart-bar"
//                             style={{ height: `${height}%` }}
//                           />
//                         </div>

//                         <span>{item.day}</span>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>
//           </article>

//           {/* Status */}
//           <article className="dashboard-card status-card">
//             <div className="dashboard-card-header">
//               <div>
//                 <span className="dashboard-card-label">
//                   OPERASIONAL
//                 </span>
//                 <h2>Status order</h2>
//               </div>
//             </div>

//             <div className="status-overview">
//               <div className="status-total">
//                 <strong>24</strong>
//                 <span>Total order</span>
//               </div>

//               <div className="status-list">
//                 <div className="status-row">
//                   <span>
//                     <i className="status-dot status-new" />
//                     Baru
//                   </span>
//                   <strong>4</strong>
//                 </div>

//                 <div className="status-row">
//                   <span>
//                     <i className="status-dot status-process" />
//                     Diproses
//                   </span>
//                   <strong>8</strong>
//                 </div>

//                 <div className="status-row">
//                   <span>
//                     <i className="status-dot status-ready" />
//                     Siap diambil
//                   </span>
//                   <strong>5</strong>
//                 </div>

//                 <div className="status-row">
//                   <span>
//                     <i className="status-dot status-done" />
//                     Selesai
//                   </span>
//                   <strong>7</strong>
//                 </div>
//               </div>
//             </div>
//           </article>
//         </section>

//         {/* Recent Orders */}
//         <section className="dashboard-card recent-orders-card">
//           <div className="dashboard-card-header recent-orders-header">
//             <div>
//               <span className="dashboard-card-label">
//                 AKTIVITAS TERBARU
//               </span>
//               <h2>Order terbaru</h2>
//             </div>

//             <a href="/orders" className="view-all-link">
//               Lihat semua
//               <span>→</span>
//             </a>
//           </div>

//           <div className="orders-list">
//             {orders.map((order) => (
//               <div className="dashboard-order" key={order.id}>
//                 <div className="order-avatar">
//                   {getInitials(order.customer)}
//                 </div>

//                 <div className="order-main">
//                   <div className="order-name-row">
//                     <strong>{order.customer}</strong>
//                     <span>{order.time}</span>
//                   </div>

//                   <div className="order-detail">
//                     <span>{order.id}</span>
//                     <i>•</i>
//                     <span>{order.service}</span>
//                   </div>
//                 </div>

//                 <div className="order-right">
//                   <strong>{formatCurrency(order.total)}</strong>

//                   <span
//                     className={`order-status status-${order.status.toLowerCase()}`}
//                   >
//                     {statusLabel(order.status)}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Quick Actions */}
//         <section className="quick-actions">
//           <a href="/orders" className="quick-action quick-action-primary">
//             <span className="quick-action-icon">+</span>
//             <span>
//               <strong>Order baru</strong>
//               <small>Buat transaksi baru</small>
//             </span>
//             <b>→</b>
//           </a>

//           <a href="/customers" className="quick-action">
//             <span className="quick-action-icon">♙</span>
//             <span>
//               <strong>Tambah customer</strong>
//               <small>Daftarkan customer baru</small>
//             </span>
//             <b>→</b>
//           </a>
//         </section>
//       </div>
//     </div>
//   );
// }