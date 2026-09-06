import { useState } from "react";

import type { AuthUser, Customer } from "./api/client";

import AppLayout from "./components/layout/AppLayout";

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

function getSavedUser(): AuthUser | null {
const token = localStorage.getItem("token");
const savedUser = localStorage.getItem("user");

if (!token || !savedUser) {
return null;
}

try {
return JSON.parse(savedUser) as AuthUser;
} catch {
localStorage.removeItem("token");
localStorage.removeItem("user");

return null;

}
}

function App() {
const [user, setUser] = useState<AuthUser | null>(
getSavedUser
);

const [page, setPage] =
useState<Page>("dashboard");

const [selectedOrderId, setSelectedOrderId] =
useState<string | null>(null);

const [selectedCustomerId, setSelectedCustomerId] =
useState<string | null>(null);

const [createOrderCustomer, setCreateOrderCustomer] =
useState<Customer | null>(null);

function handleLogin(loggedInUser: AuthUser) {
setUser(loggedInUser);
setPage("dashboard");
}

function handleLogout() {
localStorage.removeItem("token");
localStorage.removeItem("user");
setUser(null);
setPage("dashboard");
setSelectedOrderId(null);
setSelectedCustomerId(null);
setCreateOrderCustomer(null);
}

function navigate(nextPage: Page) {
if (nextPage !== "orders") {
setSelectedOrderId(null);
}

if (nextPage !== "customers") {
  setSelectedCustomerId(null);
}

if (nextPage !== "create-order") {
  setCreateOrderCustomer(null);
}

setPage(nextPage);

}

function handleCreateOrder(customer: Customer) {
setCreateOrderCustomer(customer);
setSelectedOrderId(null);
setSelectedCustomerId(null);
setPage("create-order");
}

if (!user) {
return <Login onLogin={handleLogin} />;
}

return ( <AppLayout
   user={user}
   page={page}
   onNavigate={navigate}
   onLogout={handleLogout}
 >
{page === "dashboard" && (
<Dashboard
user={user}
onNavigate={(nextPage) =>
navigate(nextPage as Page)
}
/>
)}

  {page === "pickup" && <Pickup />}

  {page === "orders" && !selectedOrderId && (
    <Orders
      onOpenOrder={(order) => {
        setSelectedOrderId(order.id);
      }}
    />
  )}

  {page === "orders" && selectedOrderId && (
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

  {page === "customers" && !selectedCustomerId && (
    <Customers
      onOpenCustomer={(customer) => {
        setSelectedCustomerId(customer.id);
      }}
    />
  )}

  {page === "customers" && selectedCustomerId && (
    <CustomerDetail
      customerId={selectedCustomerId}
      onBack={() => {
        setSelectedCustomerId(null);
      }}
      onCreateOrder={handleCreateOrder}
    />
  )}

  {page === "storage" && (
    <div className="ui-empty-state">
      <div className="ui-empty-state-title">
        Storage
      </div>

      <div className="ui-empty-state-description">
        Halaman Storage akan kita bangun pada tahap
        berikutnya.
      </div>
    </div>
  )}
</AppLayout>

);
}

export default App;


// import { useState } from "react";

// import type { AuthUser, Customer } from "./api/client";

// import Dashboard from "./pages/Dashboard";
// import Login from "./pages/Login";
// import Pickup from "./pages/Pickup";
// import Orders from "./pages/Orders";
// import OrderDetail from "./pages/OrderDetail";
// import Customers from "./pages/Customers";
// import CustomerDetail from "./pages/CustomerDetail";
// import CreateOrder from "./pages/CreateOrder";
// import Storage from "./pages/Storage";

// type Page =
//   | "dashboard"
//   | "orders"
//   | "customers"
//   | "pickup"
//   | "storage"
//   | "create-order";

// function App() {
//   const [user, setUser] = useState<AuthUser | null>(() => {
//     const token =
//       localStorage.getItem("token");

//     const savedUser =
//       localStorage.getItem("user");

//     if (!token || !savedUser) {
//       return null;
//     }

//     try {
//       return JSON.parse(savedUser);
//     } catch {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");

//       return null;
//     }
//   });

//   const [page, setPage] = useState<Page>("dashboard");
//   const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
//   const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
//   const [createOrderCustomer, setCreateOrderCustomer] = useState<Customer | null>(null);

//   function handleLogin(
//     loggedInUser: AuthUser
//   ) {
//     setUser(loggedInUser);
//     setPage("dashboard");
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

//   function handleCreateOrder(
//     customer: Customer
//   ) {
//     setCreateOrderCustomer(customer);
//     setSelectedOrderId(null);
//     setSelectedCustomerId(null);
//     setPage("create-order");
//   }

//   return (
//     <div className="app-shell">
//       <header className="app-header">
//         <button
//           type="button"
//           className="app-logo"
//           onClick={() => setPage("dashboard")}
//         >
//           LaundryOS
//         </button>

//         <div className="app-user">
//           <div>
//             <strong>{user.name}</strong>
//             <span>{user.businessName}</span>
//           </div>

//           <button
//             type="button"
//             className="logout-button"
//             onClick={handleLogout}
//           >
//             Logout
//           </button>
//         </div>
//       </header>

//       <nav className="app-nav">
//         <button
//           type="button"
//           className={
//             page === "dashboard"
//               ? "active"
//               : ""
//           }
//           onClick={() => {
//             setSelectedOrderId(null);
//             setSelectedCustomerId(null);
//             setPage("dashboard");
//           }}
//         >
//           🏠
//           <span>Dashboard</span>
//         </button>

//         <button
//           type="button"
//           className={
//             page === "orders"
//               ? "active"
//               : ""
//           }
//           onClick={() => {
//             setSelectedOrderId(null);
//             setPage("orders");
//           }}
//         >
//           📦
//           <span>Orders</span>
//         </button>

//         <button
//           type="button"
//           className={
//             page === "customers"
//               ? "active"
//               : ""
//           }
//           onClick={() => {
//             setSelectedCustomerId(null);
//             setPage("customers");
//           }}
//         >
//           👥
//           <span>Customers</span>
//         </button>

//         <button
//           type="button"
//           className={
//             page === "pickup"
//               ? "active"
//               : ""
//           }
//           onClick={() => {
//             setSelectedOrderId(null);
//             setSelectedCustomerId(null);
//             setPage("pickup");
//           }}
//         >
//           📷
//           <span>Pickup</span>
//         </button>

//         <button
//           type="button"
//           className={
//             page === "storage"
//               ? "active"
//               : ""
//           }
//           onClick={() => {
//             setSelectedOrderId(null);
//             setSelectedCustomerId(null);
//             setPage("storage");
//           }}
//         >
//           🗄️
//           <span>Storage</span>
//         </button>
//       </nav>

//       <div className="app-content">
//         {page === "dashboard" && (
//           <Dashboard
//             user={user}
//             onNavigate={(nextPage) =>
//               setPage(nextPage as Page)
//             }
//           />
//         )}

//         {page === "pickup" && (
//           <Pickup />
//         )}

//         {page === "orders" &&
//           !selectedOrderId && (
//             <Orders
//               onOpenOrder={(order) => {
//                 setSelectedOrderId(
//                   order.id
//                 );
//               }}
//             />
//           )}

//         {page === "orders" &&
//           selectedOrderId && (
//             <OrderDetail
//               orderId={selectedOrderId}
//               onBack={() => {
//                 setSelectedOrderId(null);
//               }}
//             />
//           )}

//         {page === "create-order" &&
//           createOrderCustomer && (
//             <CreateOrder
//               customer={createOrderCustomer}
//               onBack={() => {
//                 setCreateOrderCustomer(null);
//                 setPage("customers");
//               }}
//               onCreated={(order) => {
//                 setCreateOrderCustomer(null);
//                 setSelectedOrderId(order.id);
//                 setPage("orders");
//               }}
//             />
//           )}

//         {page === "customers" &&
//           !selectedCustomerId && (
//             <Customers
//               onOpenCustomer={(customer) => {
//                 setSelectedCustomerId(customer.id);
//               }}
//             />
//           )}

//         {page === "customers" &&
//           selectedCustomerId && (
//             <CustomerDetail
//               customerId={selectedCustomerId}
//               onBack={() => {
//                 setSelectedCustomerId(null);
//               }}
//               onCreateOrder={handleCreateOrder}
//             />
//           )}

//         {page === "storage" && (
//           <Storage />
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;