import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* 1. Brand Section */}
          <div className="transform transition duration-500 hover:scale-105">
            <h2 className="text-2xl font-extrabold text-white tracking-wide mb-4">
              VEHIMA<span className="text-indigo-400">.</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted partner for complete garage management, billing, and vehicle service tracking.
            </p>
            <div className="flex gap-4 mt-4">
              <span className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-indigo-600 hover:text-white transition duration-300 cursor-pointer shadow-lg">
                f
              </span>
              <span className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-indigo-600 hover:text-white transition duration-300 cursor-pointer shadow-lg">
                in
              </span>
            </div>
          </div>

          {/* 2. Quick Links Section */}
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 backdrop-blur-sm transform transition duration-500 hover:scale-105 shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-indigo-300">Quick Links</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <Link to="/dashboard" className="hover:text-white hover:pl-2 transition-all duration-300 flex items-center gap-2">
                  <span className="text-indigo-500">›</span> Dashboard
                </Link>
              </li>
              <li>
                <Link to="/repair-order" className="hover:text-white hover:pl-2 transition-all duration-300 flex items-center gap-2">
                  <span className="text-indigo-500">›</span> Create Job Card
                </Link>
              </li>
              <li>
                <Link to="/ro-list" className="hover:text-white hover:pl-2 transition-all duration-300 flex items-center gap-2">
                  <span className="text-indigo-500">›</span> All Repair Orders
                </Link>
              </li>
              <li>
                <Link to="/close-ro" className="hover:text-white hover:pl-2 transition-all duration-300 flex items-center gap-2">
                  <span className="text-indigo-500">›</span> Close RO
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Features Section */}
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 backdrop-blur-sm transform transition duration-500 hover:scale-105 shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-indigo-300">Features</h3>
            <ul className="space-y-3 text-sm">
              
              <li>
                <Link to="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span> 
                  Real-time Dashboard
                </Link>
              </li>

              <li>
                <Link to="/billing" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span> 
                  PDF Invoice Gen
                </Link>
              </li>

              <li>
                <Link to="/customers" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span> 
                  Customer History
                </Link>
              </li>

              <li>
                <Link to="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span> 
                  Admin Panel
                </Link>
              </li>

            </ul>
          </div>

          {/* 4. Contact Info Section */}
          <div className="bg-linear-to-br from-indigo-900/80 to-purple-900/80 p-6 rounded-xl border border-indigo-700 backdrop-blur-sm transform transition duration-500 hover:-translate-y-2 shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-white">Contact Us</h3>
            <div className="space-y-3 text-gray-300 text-sm">
              <p className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">📍</span>
                <span>123 Garage Street, Automotive City, IN 560001</span>
              </p>
              <p className="flex items-center gap-3">
                <span className="text-indigo-400">📞</span>
                <span>+91 98765 43210</span>
              </p>
              <p className="flex items-center gap-3">
                <span className="text-indigo-400">✉️</span>
                <span>support@vehima.com</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs">
          <p>© {new Date().getFullYear()} Vehima Garage Management. All rights reserved.</p>
          <p>Designed with <span className="text-red-500 animate-pulse">♥</span> for Modern Workshops</p>
        </div>
      </div>

    </footer>
  );
}