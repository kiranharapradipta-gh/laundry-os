import { useState } from "react";

import type { AuthUser, Customer } from "./api/client";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Pickup from "./pages/Pickup";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Customers from "./pages/Customers";
import CustomerDetail from "./pages/CustomerDetail";
import CreateOrder from "./pages/CreateOrder";

type Page =
  | "dashboard"
  | "orders"
  | "customers"
  | "pickup"
  | "storage"
  | "create-order";

function App() {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const token =
      localStorage.getItem("token");

    const savedUser =
      localStorage.getItem("user");

    if (!token || !savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      return null;
    }
  });

  const [page, setPage] = useState<Page>("dashboard");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [createOrderCustomer, setCreateOrderCustomer] = useState<Customer | null>(null);

  function handleLogin(
    loggedInUser: AuthUser
  ) {
    setUser(loggedInUser);
    setPage("dashboard");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  }

  if (!user) {
    return (
      <Login
        onLogin={handleLogin}
      />
    );
  }

  function handleCreateOrder(
    customer: Customer
  ) {
    setCreateOrderCustomer(customer);
    setSelectedOrderId(null);
    setSelectedCustomerId(null);
    setPage("create-order");
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <button
          type="button"
          className="app-logo"
          onClick={() => setPage("dashboard")}
        >
          LaundryOS
        </button>

        <div className="app-user">
          <div>
            <strong>{user.name}</strong>
            <span>{user.businessName}</span>
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <nav className="app-nav">
        <button
          type="button"
          className={
            page === "dashboard"
              ? "active"
              : ""
          }
          onClick={() => {
            setSelectedOrderId(null);
            setSelectedCustomerId(null);
            setPage("dashboard");
          }}
        >
          🏠
          <span>Dashboard</span>
        </button>

        <button
          type="button"
          className={
            page === "orders"
              ? "active"
              : ""
          }
          onClick={() => {
            setSelectedOrderId(null);
            setPage("orders");
          }}
        >
          📦
          <span>Orders</span>
        </button>

        <button
          type="button"
          className={
            page === "customers"
              ? "active"
              : ""
          }
          onClick={() => {
            setSelectedCustomerId(null);
            setPage("customers");
          }}
        >
          👥
          <span>Customers</span>
        </button>

        <button
          type="button"
          className={
            page === "pickup"
              ? "active"
              : ""
          }
          onClick={() => {
            setSelectedOrderId(null);
            setSelectedCustomerId(null);
            setPage("pickup");
          }}
        >
          📷
          <span>Pickup</span>
        </button>

        <button
          type="button"
          className={
            page === "storage"
              ? "active"
              : ""
          }
          onClick={() => {
            setSelectedOrderId(null);
            setSelectedCustomerId(null);
            setPage("storage");
          }}
        >
          🗄️
          <span>Storage</span>
        </button>
      </nav>

      <div className="app-content">
        {page === "dashboard" && (
          <Dashboard
            user={user}
            onNavigate={(nextPage) =>
              setPage(nextPage as Page)
            }
          />
        )}

        {page === "pickup" && (
          <Pickup />
        )}

        {page === "orders" &&
          !selectedOrderId && (
            <Orders
              onOpenOrder={(order) => {
                setSelectedOrderId(
                  order.id
                );
              }}
            />
          )}

        {page === "orders" &&
          selectedOrderId && (
            <OrderDetail
              orderId={selectedOrderId}
              onBack={() => {
                setSelectedOrderId(null);
              }}
            />
          )}

        {page === "create-order" &&
          createOrderCustomer && (
            <CreateOrder
              customer={createOrderCustomer}
              onBack={() => {
                setCreateOrderCustomer(null);
                setPage("customers");
              }}
              onCreated={(order) => {
                setCreateOrderCustomer(null);
                setSelectedOrderId(order.id);
                setPage("orders");
              }}
            />
          )}

        {page === "customers" &&
          !selectedCustomerId && (
            <Customers
              onOpenCustomer={(customer) => {
                setSelectedCustomerId(customer.id);
              }}
            />
          )}

        {page === "customers" &&
          selectedCustomerId && (
            <CustomerDetail
              customerId={selectedCustomerId}
              onBack={() => {
                setSelectedCustomerId(null);
              }}
              onCreateOrder={handleCreateOrder}
            />
          )}

        {page === "storage" && (
          <div className="placeholder-page">
            <h1>Storage</h1>
            <p>
              Halaman Storage akan kita buat berikutnya.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

// import { useState } from "react";

// import Login from "./pages/Login";
// import Pickup from "./pages/Pickup";

// import type { AuthUser } from "./api/client";

// function App() {
//   const [user, setUser] =
//     useState<AuthUser | null>(() => {
//       const token =
//         localStorage.getItem("token");

//       const savedUser =
//         localStorage.getItem("user");

//       if (!token || !savedUser) {
//         return null;
//       }

//       try {
//         return JSON.parse(savedUser);
//       } catch {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");

//         return null;
//       }
//     });

//   function handleLogin(
//     loggedInUser: AuthUser
//   ) {
//     setUser(loggedInUser);
//   }

//   function handleLogout() {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");

//     setUser(null);
//   }

//   if (!user) {
//     return (
//       <Login
//         onLogin={handleLogin}
//       />
//     );
//   }

//   return (
//     <div>
//       <header
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           padding: "16px",
//         }}
//       >
//         <div>
//           <strong>
//             LaundryOS
//           </strong>

//           <div>
//             {user.name}
//           </div>
//         </div>

//         <button
//           type="button"
//           onClick={handleLogout}
//         >
//           Logout
//         </button>
//       </header>

//       <Pickup />
//     </div>
//   );
// }

// export default App;

// import { useState } from 'react'
// import heroImg from './assets/hero.png'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import './App.css'

// function App() {
  
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <section id="center">
//         <div className="hero">
//           <img src={heroImg} className="base" width="170" height="179" alt="" />
//           <img src={reactLogo} className="framework" alt="React logo" />
//           <img src={viteLogo} className="vite" alt="Vite logo" />
//         </div>
//         <div>
//           <h1>Get started</h1>
//           <p>
//             Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
//           </p>
//         </div>
//         <button
//           type="button"
//           className="counter"
//           onClick={() => setCount((count) => count + 1)}
//         >
//           Count is {count}
//         </button>
//       </section>

//       <div className="ticks"></div>

//       <section id="next-steps">
//         <div id="docs">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#documentation-icon"></use>
//           </svg>
//           <h2>Documentation</h2>
//           <p>Your questions, answered</p>
//           <ul>
//             <li>
//               <a href="https://vite.dev/" target="_blank">
//                 <img className="logo" src={viteLogo} alt="" />
//                 Explore Vite
//               </a>
//             </li>
//             <li>
//               <a href="https://react.dev/" target="_blank">
//                 <img className="button-icon" src={reactLogo} alt="" />
//                 Learn more
//               </a>
//             </li>
//           </ul>
//         </div>
//         <div id="social">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#social-icon"></use>
//           </svg>
//           <h2>Connect with us</h2>
//           <p>Join the Vite community</p>
//           <ul>
//             <li>
//               <a href="https://github.com/vitejs/vite" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#github-icon"></use>
//                 </svg>
//                 GitHub
//               </a>
//             </li>
//             <li>
//               <a href="https://chat.vite.dev/" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#discord-icon"></use>
//                 </svg>
//                 Discord
//               </a>
//             </li>
//             <li>
//               <a href="https://x.com/vite_js" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#x-icon"></use>
//                 </svg>
//                 X.com
//               </a>
//             </li>
//             <li>
//               <a href="https://bsky.app/profile/vite.dev" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#bluesky-icon"></use>
//                 </svg>
//                 Bluesky
//               </a>
//             </li>
//           </ul>
//         </div>
//       </section>

//       <div className="ticks"></div>
//       <section id="spacer"></section>
//     </>
//   )
// }

// export default App