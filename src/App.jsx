// 1. ADDED 'Navigate' to the import list
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
import ViewRO from "./pages/ViewRo";
import ROList from "./pages/ROList";
import CloseRO from "./pages/CloseRO";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* --- Protected Routes (Wrapped in PrivateRoute) --- */}
        
        {/* Main Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        {/* Job Cards & Work */}
        <Route
          path="/job-cards"
          element={
            <PrivateRoute>
              <JobCards />
            </PrivateRoute>
          }
        />
        
        {/* Changed path to match your Layout link '/job-list' */}
        <Route
          path="/job-list"
          element={
            <PrivateRoute>
              <JobCardList />
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
          path="/ro-list"
          element={
            <PrivateRoute>
              <ROList />
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

        {/* Customers */}
        <Route
          path="/customers"
          element={
            <PrivateRoute>
              <Customers />
            </PrivateRoute>
          }
        />

        {/* Billing */}
        <Route
          path="/billing"
          element={
            <PrivateRoute>
              <Billing />
            </PrivateRoute>
          }
        />
        <Route
          path="/billing/:id"
          element={
            <PrivateRoute>
              <Billing />
            </PrivateRoute>
          }
        />
        <Route
           path="/close-ro"
           element={
           <PrivateRoute>
           <CloseRO />
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