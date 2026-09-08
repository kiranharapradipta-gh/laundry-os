import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

AuthProvider
import { ProtectedRoute } from "../auth/ProtectedRoute";

import AppLayout from "../layouts/AppLayout";

import { Login } from "../pages/Login";

import { Dashboard } from "../pages/dashboard/Dashboard";
import { Orders } from "../pages/orders/Orders";
import { Customers } from "../pages/customers/Customers";
import { Services } from "../pages/services/Services";
import { Reports } from "../pages/reports/Reports";
import { Settings } from "../pages/settings/Settings";
import { AuthProvider } from "./AuthContext";
import { OrderDetail } from "../pages/orders/OrderDetail";
import { CreateOrder } from "../pages/orders/CreateOrder";
import { CreateCustomer } from "../pages/customers/CreateCustomer";
import { CustomerDetail } from "../pages/customers/CustomerDetail";
import { CustomerEdit } from "../pages/customers/CustomerEdit";
import { CreateService } from "../pages/services/CreateService";
import { ServiceEdit } from "../pages/services/ServiceEdit";

export function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/orders/new"
              element={<CreateOrder />}
            />

            <Route
              path="/orders/:id"
              element={<OrderDetail />}
            />

            <Route
              path="/orders"
              element={<Orders />}
            />

            <Route
              path="/customers/new"
              element={<CreateCustomer />}
            />

            <Route
              path="/customers/:id/edit"
              element={<CustomerEdit />}
            />

            <Route
              path="/customers/:id"
              element={<CustomerDetail />}
            />

            <Route
              path="/customers"
              element={<Customers />}
            />

            <Route
              path="/services/new"
              element={<CreateService />}
            />

            <Route
              path="/services/:id/edit"
              element={<ServiceEdit />}
            />

            <Route
              path="/services"
              element={<Services />}
            />

            <Route
              path="/reports"
              element={<Reports />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />
          </Route>
        </Route>

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />
      </Routes>
    </AuthProvider>
  );
}