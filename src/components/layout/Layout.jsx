import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Footer from "./Footer";

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 1. State to store user info (Defaults to Admin if not found)
  const [user, setUser] = useState({ name: "Admin", role: "Administrator" });

  // 2. Load user info on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 3. Logout Logic
  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("user"); // Clear user data on logout
    navigate("/"); 
  };

  // Helper for active links
  const isActive = (path) => location.pathname === path;

  // Get first letter of name for Avatar
  const userInitial = user.name.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      
      <div className="flex flex-1">
        
        {/* ========== SIDEBAR ========== */}
        <aside className="w-64 bg-slate-900 text-white p-4 hidden md:flex flex-col fixed h-full z-40">
          
          {/* Logo */}
          <div className="text-2xl font-bold mb-10 border-b border-slate-700 pb-4 text-center">
            <Link to="/" className="text-indigo-400">VEHIMA</Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-2">
            
            <Link 
              to="/" 
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${isActive("/") ? "bg-indigo-600 shadow-lg" : "hover:bg-slate-800 text-gray-300"}`}
            >
              <span>🏠</span> Dashboard
            </Link>

            <Link 
              to="/repair-order" 
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${isActive("/repair-order") ? "bg-indigo-600 shadow-lg" : "hover:bg-slate-800 text-gray-300"}`}
            >
              <span>📝</span> New Job Card
            </Link>

            <Link 
              to="/ro-list" 
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${isActive("/ro-list") ? "bg-indigo-600 shadow-lg" : "hover:bg-slate-800 text-gray-300"}`}
            >
              <span>📂</span> Job Cards
            </Link>

            <Link 
              to="/customers" 
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${isActive("/customers") ? "bg-indigo-600 shadow-lg" : "hover:bg-slate-800 text-gray-300"}`}
            >
              <span>👥</span> Customers
            </Link>

            {/* RESTORED: Billing Link from old code */}
            <Link 
              to="/billing" 
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${isActive("/billing") ? "bg-indigo-600 shadow-lg" : "hover:bg-slate-800 text-gray-300"}`}
            >
              <span>💰</span> Billing
            </Link>

            <Link 
              to="/close-ro" 
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${isActive("/close-ro") ? "bg-indigo-600 shadow-lg" : "hover:bg-slate-800 text-gray-300"}`}
            >
              <span>🔍</span> Close RO
            </Link>

          </nav>

          {/* User & Logout Section at Bottom */}
          <div className="border-t border-slate-700 pt-4 mt-4">
            
            {/* Clickable User Profile Area */}
            <Link 
              to="/profile" 
              className="flex items-center gap-3 mb-4 p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer group"
            >
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-lg font-bold group-hover:bg-indigo-500 transition-colors">
                {userInitial}
              </div>
              <div>
                <p className="font-semibold text-sm text-white">{user.name}</p>
                <p className="text-xs text-gray-400">{user.role}</p>
              </div>
            </Link>

            <Link to="/admin" className="hover:text-blue-600 font-semibold">
              Admin Panel
             </Link>


            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors font-medium text-sm"
            >
              <span>🚪</span> Logout
            </button>
          </div>

        </aside>

        {/* Main Content Area */}
        <main className="flex-1 md:ml-64">
          {children}
        </main>
      </div>

      {/* Footer */}
      <div className="md:ml-64 bg-gray-900">
        <Footer />
      </div>
      
    </div>
  );
}