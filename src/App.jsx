import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import JobCards from "./pages/JobCards";
import JobCardList from "./pages/JobCardList";
import Customers from "./pages/Customers";
import Billing from "./pages/Billing";
import Home from "./pages/Home";
import RepairOrder from "./pages/RepairOrder";
import PrivateRoute from "./components/auth/PrivateRoute";
import ViewRO from "./pages/ViewRO"; // ✅ IMPORTANT (match file name exactly)
import ROList from "./pages/ROList";
import CloseRO from "./pages/CloseRO";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* --- Protected Routes --- */}
        
        {/* Main Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        {/* Job Cards & Work - Consolidated to ROList */}
        <Route
          path="/ro-list"
          element={
            <PrivateRoute>
              <ROList />
            </PrivateRoute>
          }
        />
        
        {/* This acts as the main Job Card list now */}
        <Route
          path="/job-list"
          element={
            <PrivateRoute>
              <ROList />
            </PrivateRoute>
          }
        />

        <Route
          path="/repair-order"
          element={
            <PrivateRoute>
              <RepairOrder />
            </PrivateRoute>
          }
        />

        <Route
          path="/view-ro/:id"
          element={
            <PrivateRoute>
              <ViewRO />
            </PrivateRoute>
          }
        />

        {/* FIXED: Added Missing Route for Close RO */}
        <Route
          path="/close-ro"
          element={
            <PrivateRoute>
              <CloseRO />
            </PrivateRoute>
          }
        />

        {/* Customers */}
        <Route
          path="/customers"
          element={
            <PrivateRoute>
              <Customers />
            </PrivateRoute>
          }
        />

        {/* FIXED: Added Missing Route for Billing (List View) */}
        <Route
          path="/billing"
          element={
            <PrivateRoute>
              <Billing />
            </PrivateRoute>
          }
        />

        {/* Billing - With ID */}
         <Route
          path="/billing/:id"
          element={
            <PrivateRoute>
              <Billing />
            </PrivateRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* --- Fallback / Redirect --- */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;