import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Services from "./pages/Services";
import Storage from "./pages/Storage";
import AppLayout from "./layouts/AppLayout";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={<Login />}
          />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route
                path="/"
                element={<Dashboard />}
              />

              <Route
                path="/orders"
                element={<Orders />}
              />

              <Route
                path="/customers"
                element={<Customers />}
              />

              <Route
                path="/services"
                element={<Services />}
              />

              <Route
                path="/storage"
                element={<Storage />}
              />
            </Route>
          </Route>

          <Route
            path="*"
            element={<Login />}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}