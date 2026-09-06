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

// import { useEffect, useMemo, useState } from "react";
// import type { AuthUser, Order } from "../api/client";
// import {
//   getCustomers,
//   getOrders,
//   getServices,
// } from "../api/client";

// interface DashboardProps {
//   user: AuthUser;
//   onNavigate: (page: string) => void;
// }

// type StatusKey = Order["status"];

// const STATUS_META: Record<
//   StatusKey,
//   {
//     label: string;
//     short: string;
//     className: string;
//   }
// > = {
//   RECEIVED: {
//     label: "Diterima",
//     short: "Received",
//     className: "received",
//   },
//   WASHING: {
//     label: "Dicuci",
//     short: "Washing",
//     className: "washing",
//   },
//   DRYING: {
//     label: "Dikeringkan",
//     short: "Drying",
//     className: "drying",
//   },
//   IRONING: {
//     label: "Disetrika",
//     short: "Ironing",
//     className: "ironing",
//   },
//   READY: {
//     label: "Siap Diambil",
//     short: "Ready",
//     className: "ready",
//   },
//   PICKED_UP: {
//     label: "Sudah Diambil",
//     short: "Picked Up",
//     className: "picked",
//   },
//   CANCELLED: {
//     label: "Dibatalkan",
//     short: "Cancelled",
//     className: "cancelled",
//   },
// };

// function toNumber(value: number | string | null | undefined) {
//   return Number(value ?? 0);
// }

// function formatRupiah(value: number) {
//   return new Intl.NumberFormat("id-ID", {
//     style: "currency",
//     currency: "IDR",
//     maximumFractionDigits: 0,
//   }).format(value);
// }

// function formatDate(date: string) {
//   return new Intl.DateTimeFormat("id-ID", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   }).format(new Date(date));
// }

// function formatTime(date: string) {
//   return new Intl.DateTimeFormat("id-ID", {
//     hour: "2-digit",
//     minute: "2-digit",
//   }).format(new Date(date));
// }

// function isSameDay(date: string, target = new Date()) {
//   const value = new Date(date);

//   return (
//     value.getFullYear() === target.getFullYear() &&
//     value.getMonth() === target.getMonth() &&
//     value.getDate() === target.getDate()
//   );
// }

// function isSameMonth(date: string, target = new Date()) {
//   const value = new Date(date);

//   return (
//     value.getFullYear() === target.getFullYear() &&
//     value.getMonth() === target.getMonth()
//   );
// }

// function getGreeting() {
//   const hour = new Date().getHours();

//   if (hour < 11) return "Selamat pagi";
//   if (hour < 15) return "Selamat siang";
//   if (hour < 18) return "Selamat sore";

//   return "Selamat malam";
// }

// export default function Dashboard({
//   user,
//   onNavigate,
// }: DashboardProps) {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [customerCount, setCustomerCount] = useState(0);
//   const [activeServiceCount, setActiveServiceCount] = useState(0);

//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState("");

//   async function loadDashboard(showRefreshing = false) {
//     try {
//       if (showRefreshing) {
//         setRefreshing(true);
//       } else {
//         setLoading(true);
//       }

//       setError("");

//       const [ordersData, customersData, servicesData] =
//         await Promise.all([
//           getOrders(),
//           getCustomers(),
//           getServices(),
//         ]);

//       setOrders(ordersData);
//       setCustomerCount(customersData.length);

//       setActiveServiceCount(
//         servicesData.filter((service) => service.isActive).length
//       );
//     } catch (err) {
//       setError(
//         err instanceof Error
//           ? err.message
//           : "Gagal mengambil data dashboard."
//       );
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }

//   useEffect(() => {
//     loadDashboard();
//   }, []);

//   /*
//    * ============================================================
//    * TODAY
//    * ============================================================
//    */

//   const todayOrders = useMemo(
//     () => orders.filter((order) => isSameDay(order.createdAt)),
//     [orders]
//   );

//   const todayPickedUp = useMemo(
//     () =>
//       orders.filter(
//         (order) =>
//           order.status === "PICKED_UP" &&
//           order.pickedUpAt &&
//           isSameDay(order.pickedUpAt)
//       ),
//     [orders]
//   );

//   const todayRevenue = useMemo(
//     () =>
//       todayOrders
//         .filter((order) => order.status !== "CANCELLED")
//         .reduce((sum, order) => sum + toNumber(order.total), 0),
//     [todayOrders]
//   );

//   const todayPaid = useMemo(
//     () =>
//       todayOrders
//         .filter((order) => order.status !== "CANCELLED")
//         .reduce(
//           (sum, order) => sum + toNumber(order.paidAmount),
//           0
//         ),
//     [todayOrders]
//   );

//   /*
//    * ============================================================
//    * MONTH
//    * ============================================================
//    */

//   const monthOrders = useMemo(
//     () => orders.filter((order) => isSameMonth(order.createdAt)),
//     [orders]
//   );

//   const monthRevenue = useMemo(
//     () =>
//       monthOrders
//         .filter((order) => order.status !== "CANCELLED")
//         .reduce((sum, order) => sum + toNumber(order.total), 0),
//     [monthOrders]
//   );

//   const monthPaid = useMemo(
//     () =>
//       monthOrders
//         .filter((order) => order.status !== "CANCELLED")
//         .reduce(
//           (sum, order) => sum + toNumber(order.paidAmount),
//           0
//         ),
//     [monthOrders]
//   );

//   const monthOutstanding = Math.max(
//     monthRevenue - monthPaid,
//     0
//   );

//   /*
//    * ============================================================
//    * STATUS
//    * ============================================================
//    */

//   const statusCounts = useMemo(() => {
//     const counts: Record<StatusKey, number> = {
//       RECEIVED: 0,
//       WASHING: 0,
//       DRYING: 0,
//       IRONING: 0,
//       READY: 0,
//       PICKED_UP: 0,
//       CANCELLED: 0,
//     };

//     for (const order of orders) {
//       counts[order.status] += 1;
//     }

//     return counts;
//   }, [orders]);

//   const processingCount =
//     statusCounts.WASHING +
//     statusCounts.DRYING +
//     statusCounts.IRONING;

//   /*
//    * ============================================================
//    * PAYMENT
//    * ============================================================
//    */

//   const unpaidOrders = useMemo(
//     () =>
//       orders.filter(
//         (order) =>
//           order.paymentStatus === "UNPAID" ||
//           order.paymentStatus === "PARTIAL"
//       ),
//     [orders]
//   );

//   const outstandingAmount = useMemo(
//     () =>
//       unpaidOrders.reduce(
//         (sum, order) =>
//           sum +
//           Math.max(
//             toNumber(order.total) -
//               toNumber(order.paidAmount),
//             0
//           ),
//         0
//       ),
//     [unpaidOrders]
//   );

//   /*
//    * ============================================================
//    * RECENT ORDERS
//    * ============================================================
//    */

//   const recentOrders = useMemo(
//     () =>
//       [...orders]
//         .sort(
//           (a, b) =>
//             new Date(b.createdAt).getTime() -
//             new Date(a.createdAt).getTime()
//         )
//         .slice(0, 7),
//     [orders]
//   );

//   /*
//    * ============================================================
//    * SERVICE PERFORMANCE
//    * ============================================================
//    */

//   const serviceStats = useMemo(() => {
//     const map = new Map<
//       string,
//       {
//         name: string;
//         quantity: number;
//         revenue: number;
//       }
//     >();

//     for (const order of orders) {
//       if (order.status === "CANCELLED") continue;

//       for (const item of order.items) {
//         const name =
//           item.service?.name ||
//           item.description ||
//           "Layanan";

//         const current = map.get(name) || {
//           name,
//           quantity: 0,
//           revenue: 0,
//         };

//         current.quantity += toNumber(item.quantity);
//         current.revenue += toNumber(item.subtotal);

//         map.set(name, current);
//       }
//     }

//     return [...map.values()]
//       .sort((a, b) => b.revenue - a.revenue)
//       .slice(0, 5);
//   }, [orders]);

//   const maxServiceRevenue =
//     serviceStats[0]?.revenue || 1;

//   /*
//    * ============================================================
//    * 7 DAYS
//    * ============================================================
//    */

//   const weeklyStats = useMemo(() => {
//     const result: Array<{
//       label: string;
//       orders: number;
//       revenue: number;
//     }> = [];

//     const today = new Date();

//     for (let i = 6; i >= 0; i--) {
//       const date = new Date(today);

//       date.setHours(0, 0, 0, 0);
//       date.setDate(today.getDate() - i);

//       const dayOrders = orders.filter((order) =>
//         isSameDay(order.createdAt, date)
//       );

//       const revenue = dayOrders
//         .filter((order) => order.status !== "CANCELLED")
//         .reduce(
//           (sum, order) => sum + toNumber(order.total),
//           0
//         );

//       result.push({
//         label: new Intl.DateTimeFormat("id-ID", {
//           weekday: "short",
//         }).format(date),
//         orders: dayOrders.length,
//         revenue,
//       });
//     }

//     return result;
//   }, [orders]);

//   const maxWeeklyRevenue =
//     Math.max(...weeklyStats.map((day) => day.revenue), 1);

//   /*
//    * ============================================================
//    * RENDER
//    * ============================================================
//    */

//   return (
//     <>
//       <style>{`
//         .laundry-dashboard {
//           width: 100%;
//           max-width: 1500px;
//           margin: 0 auto;
//           padding: 28px;
//           box-sizing: border-box;
//           color: #111827;
//         }

//         .laundry-dashboard * {
//           box-sizing: border-box;
//         }

//         .dashboard-topbar {
//           display: flex;
//           align-items: flex-start;
//           justify-content: space-between;
//           gap: 20px;
//           margin-bottom: 28px;
//         }

//         .dashboard-greeting {
//           margin: 0 0 6px;
//           font-size: 14px;
//           color: #6b7280;
//           font-weight: 600;
//         }

//         .dashboard-title {
//           margin: 0;
//           font-size: 30px;
//           line-height: 1.15;
//           letter-spacing: -0.7px;
//           font-weight: 800;
//         }

//         .dashboard-business {
//           margin: 7px 0 0;
//           color: #6b7280;
//           font-size: 14px;
//         }

//         .dashboard-date {
//           margin-top: 5px;
//           color: #9ca3af;
//           font-size: 12px;
//         }

//         .dashboard-actions {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//         }

//         .dashboard-refresh,
//         .dashboard-primary-action {
//           border: 0;
//           border-radius: 11px;
//           padding: 11px 15px;
//           font: inherit;
//           font-size: 13px;
//           font-weight: 700;
//           cursor: pointer;
//           transition: 0.2s ease;
//         }

//         .dashboard-refresh {
//           background: #f3f4f6;
//           color: #374151;
//         }

//         .dashboard-refresh:hover {
//           background: #e5e7eb;
//         }

//         .dashboard-primary-action {
//           background: #111827;
//           color: white;
//         }

//         .dashboard-primary-action:hover {
//           transform: translateY(-1px);
//           opacity: 0.92;
//         }

//         .dashboard-refresh:disabled {
//           opacity: 0.55;
//           cursor: default;
//         }

//         .dashboard-error {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           gap: 15px;
//           padding: 14px 16px;
//           margin-bottom: 20px;
//           border-radius: 12px;
//           background: #fff1f2;
//           border: 1px solid #fecdd3;
//           color: #be123c;
//           font-size: 13px;
//           font-weight: 600;
//         }

//         .dashboard-loading {
//           padding: 70px 20px;
//           text-align: center;
//           color: #9ca3af;
//           font-size: 14px;
//         }

//         .dashboard-kpis {
//           display: grid;
//           grid-template-columns: repeat(4, minmax(0, 1fr));
//           gap: 14px;
//           margin-bottom: 22px;
//         }

//         .dashboard-kpi {
//           min-width: 0;
//           padding: 20px;
//           border: 1px solid #e5e7eb;
//           border-radius: 16px;
//           background: white;
//           box-shadow: 0 2px 8px rgba(0,0,0,0.025);
//         }

//         .kpi-head {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           gap: 10px;
//           margin-bottom: 17px;
//         }

//         .kpi-label {
//           color: #6b7280;
//           font-size: 13px;
//           font-weight: 650;
//         }

//         .kpi-icon {
//           width: 34px;
//           height: 34px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           border-radius: 10px;
//           background: #f3f4f6;
//           font-size: 16px;
//         }

//         .kpi-value {
//           display: block;
//           min-width: 0;
//           overflow: hidden;
//           text-overflow: ellipsis;
//           white-space: nowrap;
//           font-size: 25px;
//           line-height: 1.1;
//           letter-spacing: -0.5px;
//           font-weight: 800;
//         }

//         .kpi-sub {
//           margin-top: 8px;
//           color: #9ca3af;
//           font-size: 11px;
//         }

//         .dashboard-main-grid {
//           display: grid;
//           grid-template-columns: minmax(0, 1.7fr) minmax(280px, 1fr);
//           gap: 18px;
//           margin-bottom: 18px;
//         }

//         .dashboard-card {
//           min-width: 0;
//           background: white;
//           border: 1px solid #e5e7eb;
//           border-radius: 16px;
//           box-shadow: 0 2px 8px rgba(0,0,0,0.025);
//           overflow: hidden;
//         }

//         .dashboard-card-header {
//           display: flex;
//           align-items: flex-start;
//           justify-content: space-between;
//           gap: 15px;
//           padding: 20px 20px 0;
//         }

//         .dashboard-card-title {
//           margin: 0;
//           font-size: 16px;
//           font-weight: 750;
//           letter-spacing: -0.2px;
//         }

//         .dashboard-card-description {
//           margin: 5px 0 0;
//           color: #9ca3af;
//           font-size: 12px;
//         }

//         .dashboard-card-link {
//           border: 0;
//           background: transparent;
//           color: #6b7280;
//           font: inherit;
//           font-size: 12px;
//           font-weight: 700;
//           cursor: pointer;
//         }

//         .dashboard-card-link:hover {
//           color: #111827;
//         }

//         .chart-summary {
//           display: flex;
//           align-items: flex-end;
//           justify-content: space-between;
//           gap: 15px;
//           padding: 22px 20px 10px;
//         }

//         .chart-total {
//           font-size: 23px;
//           font-weight: 800;
//         }

//         .chart-caption {
//           margin-top: 3px;
//           color: #9ca3af;
//           font-size: 11px;
//         }

//         .weekly-chart {
//           display: flex;
//           align-items: flex-end;
//           gap: 12px;
//           height: 190px;
//           padding: 18px 20px 16px;
//         }

//         .chart-column {
//           flex: 1;
//           min-width: 0;
//           height: 100%;
//           display: flex;
//           flex-direction: column;
//           justify-content: flex-end;
//           align-items: center;
//           gap: 7px;
//         }

//         .chart-value {
//           max-width: 100%;
//           overflow: hidden;
//           text-overflow: ellipsis;
//           white-space: nowrap;
//           color: #9ca3af;
//           font-size: 9px;
//         }

//         .chart-bar-area {
//           width: 100%;
//           height: 125px;
//           display: flex;
//           align-items: flex-end;
//           justify-content: center;
//         }

//         .chart-bar {
//           width: min(38px, 65%);
//           min-height: 4px;
//           border-radius: 7px 7px 3px 3px;
//           background: #111827;
//           transition: height 0.4s ease;
//         }

//         .chart-day {
//           color: #6b7280;
//           font-size: 10px;
//           font-weight: 650;
//         }

//         .status-list {
//           padding: 18px 20px 20px;
//         }

//         .status-row {
//           display: flex;
//           align-items: center;
//           gap: 11px;
//           margin-bottom: 15px;
//         }

//         .status-row:last-child {
//           margin-bottom: 0;
//         }

//         .status-dot {
//           width: 9px;
//           height: 9px;
//           border-radius: 50%;
//           flex: 0 0 auto;
//         }

//         .status-dot.received { background: #9ca3af; }
//         .status-dot.washing { background: #3b82f6; }
//         .status-dot.drying { background: #f59e0b; }
//         .status-dot.ironing { background: #8b5cf6; }
//         .status-dot.ready { background: #10b981; }
//         .status-dot.picked { background: #22c55e; }
//         .status-dot.cancelled { background: #ef4444; }

//         .status-name {
//           flex: 1;
//           min-width: 0;
//           color: #4b5563;
//           font-size: 12px;
//         }

//         .status-count {
//           font-size: 12px;
//           font-weight: 750;
//         }

//         .status-track {
//           width: 70px;
//           height: 5px;
//           overflow: hidden;
//           border-radius: 10px;
//           background: #f3f4f6;
//         }

//         .status-progress {
//           height: 100%;
//           border-radius: inherit;
//           background: #111827;
//         }

//         .dashboard-secondary-grid {
//           display: grid;
//           grid-template-columns: minmax(0, 1.25fr) minmax(280px, 0.75fr);
//           gap: 18px;
//           margin-bottom: 18px;
//         }

//         .financial-panel {
//           padding: 20px;
//         }

//         .financial-main {
//           margin: 18px 0 20px;
//           font-size: 27px;
//           font-weight: 800;
//         }

//         .financial-row {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           gap: 15px;
//           padding: 12px 0;
//           border-top: 1px solid #f3f4f6;
//           font-size: 12px;
//         }

//         .financial-row span {
//           color: #6b7280;
//         }

//         .financial-row strong {
//           font-weight: 750;
//         }

//         .financial-warning {
//           color: #dc2626;
//         }

//         .service-list {
//           padding: 18px 20px 20px;
//         }

//         .service-row {
//           margin-bottom: 17px;
//         }

//         .service-row:last-child {
//           margin-bottom: 0;
//         }

//         .service-top {
//           display: flex;
//           justify-content: space-between;
//           gap: 10px;
//           margin-bottom: 7px;
//         }

//         .service-name {
//           min-width: 0;
//           overflow: hidden;
//           text-overflow: ellipsis;
//           white-space: nowrap;
//           font-size: 12px;
//           font-weight: 700;
//         }

//         .service-revenue {
//           flex: 0 0 auto;
//           color: #6b7280;
//           font-size: 11px;
//         }

//         .service-track {
//           height: 7px;
//           overflow: hidden;
//           border-radius: 10px;
//           background: #f3f4f6;
//         }

//         .service-bar {
//           height: 100%;
//           border-radius: inherit;
//           background: #111827;
//         }

//         .service-meta {
//           margin-top: 5px;
//           color: #9ca3af;
//           font-size: 10px;
//         }

//         .recent-table-wrap {
//           overflow-x: auto;
//         }

//         .recent-table {
//           width: 100%;
//           border-collapse: collapse;
//           min-width: 650px;
//         }

//         .recent-table th {
//           padding: 13px 20px;
//           text-align: left;
//           color: #9ca3af;
//           background: #fafafa;
//           border-top: 1px solid #f3f4f6;
//           border-bottom: 1px solid #f3f4f6;
//           font-size: 10px;
//           font-weight: 750;
//           text-transform: uppercase;
//           letter-spacing: 0.4px;
//         }

//         .recent-table td {
//           padding: 14px 20px;
//           border-bottom: 1px solid #f3f4f6;
//           font-size: 12px;
//         }

//         .recent-table tr:last-child td {
//           border-bottom: 0;
//         }

//         .order-number {
//           font-weight: 750;
//         }

//         .customer-name {
//           font-weight: 650;
//         }

//         .customer-phone {
//           margin-top: 3px;
//           color: #9ca3af;
//           font-size: 10px;
//         }

//         .order-amount {
//           font-weight: 750;
//           white-space: nowrap;
//         }

//         .order-time {
//           color: #9ca3af;
//           font-size: 10px;
//           margin-top: 3px;
//         }

//         .status-badge {
//           display: inline-flex;
//           align-items: center;
//           padding: 5px 8px;
//           border-radius: 7px;
//           font-size: 10px;
//           font-weight: 750;
//           background: #f3f4f6;
//           color: #4b5563;
//         }

//         .status-badge.ready {
//           background: #ecfdf5;
//           color: #047857;
//         }

//         .status-badge.washing,
//         .status-badge.drying {
//           background: #eff6ff;
//           color: #1d4ed8;
//         }

//         .status-badge.ironing {
//           background: #f5f3ff;
//           color: #6d28d9;
//         }

//         .status-badge.received {
//           background: #f3f4f6;
//           color: #4b5563;
//         }

//         .status-badge.picked {
//           background: #f0fdf4;
//           color: #15803d;
//         }

//         .status-badge.cancelled {
//           background: #fef2f2;
//           color: #b91c1c;
//         }

//         .payment-badge {
//           font-size: 10px;
//           font-weight: 700;
//         }

//         .payment-badge.paid {
//           color: #059669;
//         }

//         .payment-badge.partial {
//           color: #d97706;
//         }

//         .payment-badge.unpaid {
//           color: #dc2626;
//         }

//         .dashboard-bottom {
//           display: grid;
//           grid-template-columns: repeat(3, minmax(0, 1fr));
//           gap: 14px;
//         }

//         .mini-card {
//           padding: 18px;
//           border: 1px solid #e5e7eb;
//           border-radius: 15px;
//           background: white;
//         }

//         .mini-label {
//           color: #6b7280;
//           font-size: 11px;
//           font-weight: 650;
//         }

//         .mini-value {
//           margin-top: 8px;
//           font-size: 21px;
//           font-weight: 800;
//         }

//         .mini-description {
//           margin-top: 4px;
//           color: #9ca3af;
//           font-size: 10px;
//         }

//         .empty-state {
//           padding: 35px 20px;
//           text-align: center;
//           color: #9ca3af;
//           font-size: 12px;
//         }

//         @media (max-width: 1100px) {
//           .dashboard-kpis {
//             grid-template-columns: repeat(2, minmax(0, 1fr));
//           }

//           .dashboard-main-grid,
//           .dashboard-secondary-grid {
//             grid-template-columns: 1fr;
//           }
//         }

//         @media (max-width: 700px) {
//           .laundry-dashboard {
//             padding: 18px 14px 30px;
//           }

//           .dashboard-topbar {
//             flex-direction: column;
//             margin-bottom: 20px;
//           }

//           .dashboard-title {
//             font-size: 25px;
//           }

//           .dashboard-actions {
//             width: 100%;
//           }

//           .dashboard-refresh,
//           .dashboard-primary-action {
//             flex: 1;
//           }

//           .dashboard-kpis {
//             gap: 10px;
//           }

//           .dashboard-kpi {
//             padding: 15px;
//           }

//           .kpi-value {
//             font-size: 20px;
//           }

//           .kpi-label {
//             font-size: 11px;
//           }

//           .kpi-icon {
//             width: 30px;
//             height: 30px;
//             font-size: 14px;
//           }

//           .dashboard-bottom {
//             grid-template-columns: 1fr;
//           }

//           .weekly-chart {
//             gap: 6px;
//             padding-left: 12px;
//             padding-right: 12px;
//           }
//         }
//       `}</style>

//       <main className="laundry-dashboard">
//         <header className="dashboard-topbar">
//           <div>
//             <p className="dashboard-greeting">
//               {getGreeting()} 👋
//             </p>

//             <h1 className="dashboard-title">
//               {user.name}
//             </h1>

//             <p className="dashboard-business">
//               {user.businessName}
//             </p>

//             <p className="dashboard-date">
//               {new Intl.DateTimeFormat("id-ID", {
//                 weekday: "long",
//                 day: "numeric",
//                 month: "long",
//                 year: "numeric",
//               }).format(new Date())}
//             </p>
//           </div>

//           <div className="dashboard-actions">
//             <button
//               type="button"
//               className="dashboard-refresh"
//               onClick={() => loadDashboard(true)}
//               disabled={refreshing}
//             >
//               {refreshing ? "Memuat..." : "↻ Refresh"}
//             </button>

//             <button
//               type="button"
//               className="dashboard-primary-action"
//               onClick={() => onNavigate("orders")}
//             >
//               + Order Baru
//             </button>
//           </div>
//         </header>

//         {error && (
//           <div className="dashboard-error">
//             <span>{error}</span>

//             <button
//               type="button"
//               className="dashboard-card-link"
//               onClick={() => loadDashboard()}
//             >
//               Coba lagi
//             </button>
//           </div>
//         )}

//         {loading ? (
//           <div className="dashboard-loading">
//             Memuat data dashboard...
//           </div>
//         ) : (
//           <>
//             {/* ==================================================
//                 KPI
//             ================================================== */}

//             <section className="dashboard-kpis">
//               <article className="dashboard-kpi">
//                 <div className="kpi-head">
//                   <span className="kpi-label">
//                     Order Hari Ini
//                   </span>

//                   <span className="kpi-icon">
//                     📦
//                   </span>
//                 </div>

//                 <strong className="kpi-value">
//                   {todayOrders.length}
//                 </strong>

//                 <div className="kpi-sub">
//                   {todayPickedUp.length} sudah diambil
//                 </div>
//               </article>

//               <article className="dashboard-kpi">
//                 <div className="kpi-head">
//                   <span className="kpi-label">
//                     Sedang Diproses
//                   </span>

//                   <span className="kpi-icon">
//                     🧺
//                   </span>
//                 </div>

//                 <strong className="kpi-value">
//                   {processingCount}
//                 </strong>

//                 <div className="kpi-sub">
//                   Washing · Drying · Ironing
//                 </div>
//               </article>

//               <article className="dashboard-kpi">
//                 <div className="kpi-head">
//                   <span className="kpi-label">
//                     Siap Diambil
//                   </span>

//                   <span className="kpi-icon">
//                     ✓
//                   </span>
//                 </div>

//                 <strong className="kpi-value">
//                   {statusCounts.READY}
//                 </strong>

//                 <div className="kpi-sub">
//                   Menunggu customer
//                 </div>
//               </article>

//               <article className="dashboard-kpi">
//                 <div className="kpi-head">
//                   <span className="kpi-label">
//                     Omzet Hari Ini
//                   </span>

//                   <span className="kpi-icon">
//                     💰
//                   </span>
//                 </div>

//                 <strong className="kpi-value">
//                   {formatRupiah(todayRevenue)}
//                 </strong>

//                 <div className="kpi-sub">
//                   Dibayar {formatRupiah(todayPaid)}
//                 </div>
//               </article>
//             </section>

//             {/* ==================================================
//                 CHART + STATUS
//             ================================================== */}

//             <section className="dashboard-main-grid">
//               <article className="dashboard-card">
//                 <div className="dashboard-card-header">
//                   <div>
//                     <h2 className="dashboard-card-title">
//                       Performa 7 Hari
//                     </h2>

//                     <p className="dashboard-card-description">
//                       Nilai order yang masuk setiap hari.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="chart-summary">
//                   <div>
//                     <div className="chart-total">
//                       {formatRupiah(monthRevenue)}
//                     </div>

//                     <div className="chart-caption">
//                       Total omzet bulan ini
//                     </div>
//                   </div>

//                   <div>
//                     <div className="chart-total">
//                       {monthOrders.length}
//                     </div>

//                     <div className="chart-caption">
//                       Order bulan ini
//                     </div>
//                   </div>
//                 </div>

//                 <div className="weekly-chart">
//                   {weeklyStats.map((day, index) => {
//                     const height =
//                       day.revenue === 0
//                         ? 4
//                         : Math.max(
//                             (day.revenue /
//                               maxWeeklyRevenue) *
//                               100,
//                             8
//                           );

//                     return (
//                       <div
//                         className="chart-column"
//                         key={`${day.label}-${index}`}
//                       >
//                         <span className="chart-value">
//                           {day.revenue > 0
//                             ? formatRupiah(day.revenue)
//                             : "-"}
//                         </span>

//                         <div className="chart-bar-area">
//                           <div
//                             className="chart-bar"
//                             style={{
//                               height: `${height}%`,
//                             }}
//                           />
//                         </div>

//                         <span className="chart-day">
//                           {day.label}
//                         </span>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </article>

//               <article className="dashboard-card">
//                 <div className="dashboard-card-header">
//                   <div>
//                     <h2 className="dashboard-card-title">
//                       Status Order
//                     </h2>

//                     <p className="dashboard-card-description">
//                       Kondisi seluruh order aktif.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="status-list">
//                   {(
//                     [
//                       "RECEIVED",
//                       "WASHING",
//                       "DRYING",
//                       "IRONING",
//                       "READY",
//                       "PICKED_UP",
//                       "CANCELLED",
//                     ] as StatusKey[]
//                   ).map((status) => {
//                     const count = statusCounts[status];

//                     const total =
//                       orders.length || 1;

//                     const width =
//                       Math.min(
//                         (count / total) * 100,
//                         100
//                       );

//                     return (
//                       <div
//                         className="status-row"
//                         key={status}
//                       >
//                         <span
//                           className={`status-dot ${STATUS_META[status].className}`}
//                         />

//                         <span className="status-name">
//                           {STATUS_META[status].label}
//                         </span>

//                         <div className="status-track">
//                           <div
//                             className="status-progress"
//                             style={{
//                               width: `${width}%`,
//                             }}
//                           />
//                         </div>

//                         <strong className="status-count">
//                           {count}
//                         </strong>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </article>
//             </section>

//             {/* ==================================================
//                 FINANCE + SERVICES
//             ================================================== */}

//             <section className="dashboard-secondary-grid">
//               <article className="dashboard-card">
//                 <div className="dashboard-card-header">
//                   <div>
//                     <h2 className="dashboard-card-title">
//                       Ringkasan Keuangan
//                     </h2>

//                     <p className="dashboard-card-description">
//                       Performa transaksi bulan berjalan.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="financial-panel">
//                   <div className="financial-main">
//                     {formatRupiah(monthRevenue)}
//                   </div>

//                   <div className="financial-row">
//                     <span>
//                       Sudah dibayar
//                     </span>

//                     <strong>
//                       {formatRupiah(monthPaid)}
//                     </strong>
//                   </div>

//                   <div className="financial-row">
//                     <span>
//                       Belum dibayar
//                     </span>

//                     <strong className="financial-warning">
//                       {formatRupiah(monthOutstanding)}
//                     </strong>
//                   </div>

//                   <div className="financial-row">
//                     <span>
//                       Total order
//                     </span>

//                     <strong>
//                       {monthOrders.length}
//                     </strong>
//                   </div>
//                 </div>
//               </article>

//               <article className="dashboard-card">
//                 <div className="dashboard-card-header">
//                   <div>
//                     <h2 className="dashboard-card-title">
//                       Layanan Terlaris
//                     </h2>

//                     <p className="dashboard-card-description">
//                       Berdasarkan nilai transaksi.
//                     </p>
//                   </div>
//                 </div>

//                 {serviceStats.length === 0 ? (
//                   <div className="empty-state">
//                     Belum ada data layanan.
//                   </div>
//                 ) : (
//                   <div className="service-list">
//                     {serviceStats.map((service) => (
//                       <div
//                         className="service-row"
//                         key={service.name}
//                       >
//                         <div className="service-top">
//                           <span className="service-name">
//                             {service.name}
//                           </span>

//                           <span className="service-revenue">
//                             {formatRupiah(
//                               service.revenue
//                             )}
//                           </span>
//                         </div>

//                         <div className="service-track">
//                           <div
//                             className="service-bar"
//                             style={{
//                               width: `${
//                                 (service.revenue /
//                                   maxServiceRevenue) *
//                                 100
//                               }%`,
//                             }}
//                           />
//                         </div>

//                         <div className="service-meta">
//                           {service.quantity} unit
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </article>
//             </section>

//             {/* ==================================================
//                 RECENT ORDERS
//             ================================================== */}

//             <section className="dashboard-card">
//               <div className="dashboard-card-header">
//                 <div>
//                   <h2 className="dashboard-card-title">
//                     Order Terbaru
//                   </h2>

//                   <p className="dashboard-card-description">
//                     Aktivitas order terakhir dari database.
//                   </p>
//                 </div>

//                 <button
//                   type="button"
//                   className="dashboard-card-link"
//                   onClick={() => onNavigate("orders")}
//                 >
//                   Lihat semua →
//                 </button>
//               </div>

//               {recentOrders.length === 0 ? (
//                 <div className="empty-state">
//                   Belum ada order.
//                 </div>
//               ) : (
//                 <div className="recent-table-wrap">
//                   <table className="recent-table">
//                     <thead>
//                       <tr>
//                         <th>Order</th>
//                         <th>Customer</th>
//                         <th>Status</th>
//                         <th>Pembayaran</th>
//                         <th>Total</th>
//                         <th>Waktu</th>
//                       </tr>
//                     </thead>

//                     <tbody>
//                       {recentOrders.map((order) => {
//                         const meta =
//                           STATUS_META[order.status];

//                         const paymentClass =
//                           order.paymentStatus === "PAID"
//                             ? "paid"
//                             : order.paymentStatus ===
//                               "PARTIAL"
//                             ? "partial"
//                             : "unpaid";

//                         const paymentLabel =
//                           order.paymentStatus === "PAID"
//                             ? "Lunas"
//                             : order.paymentStatus ===
//                               "PARTIAL"
//                             ? "Sebagian"
//                             : order.paymentStatus ===
//                               "REFUNDED"
//                             ? "Refund"
//                             : "Belum Bayar";

//                         return (
//                           <tr key={order.id}>
//                             <td>
//                               <div className="order-number">
//                                 {order.orderNumber}
//                               </div>
//                             </td>

//                             <td>
//                               <div className="customer-name">
//                                 {order.customer.name}
//                               </div>

//                               <div className="customer-phone">
//                                 {order.customer.phone}
//                               </div>
//                             </td>

//                             <td>
//                               <span
//                                 className={`status-badge ${meta.className}`}
//                               >
//                                 {meta.label}
//                               </span>
//                             </td>

//                             <td>
//                               <span
//                                 className={`payment-badge ${paymentClass}`}
//                               >
//                                 {paymentLabel}
//                               </span>
//                             </td>

//                             <td>
//                               <div className="order-amount">
//                                 {formatRupiah(
//                                   toNumber(order.total)
//                                 )}
//                               </div>
//                             </td>

//                             <td>
//                               <div>
//                                 {formatDate(
//                                   order.createdAt
//                                 )}
//                               </div>

//                               <div className="order-time">
//                                 {formatTime(
//                                   order.createdAt
//                                 )}
//                               </div>
//                             </td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </section>

//             {/* ==================================================
//                 QUICK OVERVIEW
//             ================================================== */}

//             <section
//               className="dashboard-bottom"
//               style={{ marginTop: 18 }}
//             >
//               <button
//                 type="button"
//                 className="mini-card"
//                 onClick={() => onNavigate("customers")}
//                 style={{
//                   textAlign: "left",
//                   cursor: "pointer",
//                   font: "inherit",
//                 }}
//               >
//                 <div className="mini-label">
//                   Total Customer
//                 </div>

//                 <div className="mini-value">
//                   {customerCount}
//                 </div>

//                 <div className="mini-description">
//                   Customer terdaftar di bisnis
//                 </div>
//               </button>

//               <button
//                 type="button"
//                 className="mini-card"
//                 onClick={() => onNavigate("storage")}
//                 style={{
//                   textAlign: "left",
//                   cursor: "pointer",
//                   font: "inherit",
//                 }}
//               >
//                 <div className="mini-label">
//                   Order Belum Lunas
//                 </div>

//                 <div className="mini-value">
//                   {unpaidOrders.length}
//                 </div>

//                 <div className="mini-description">
//                   Piutang {formatRupiah(outstandingAmount)}
//                 </div>
//               </button>

//               <button
//                 type="button"
//                 className="mini-card"
//                 onClick={() => onNavigate("services")}
//                 style={{
//                   textAlign: "left",
//                   cursor: "pointer",
//                   font: "inherit",
//                 }}
//               >
//                 <div className="mini-label">
//                   Layanan Aktif
//                 </div>

//                 <div className="mini-value">
//                   {activeServiceCount}
//                 </div>

//                 <div className="mini-description">
//                   Layanan yang tersedia
//                 </div>
//               </button>
//             </section>
//           </>
//         )}
//       </main>
//     </>
//   );
// }