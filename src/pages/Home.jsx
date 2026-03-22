import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";

export default function Home() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);

  // 1. Load Data from LocalStorage
  useEffect(() => {
    try {
      const roData = JSON.parse(localStorage.getItem("repairOrders")) || [];
      roData.sort((a, b) => b.id - a.id); // Sort newest first
      setOrders(roData);

      const custData = JSON.parse(localStorage.getItem("customers")) || [];
      setCustomers(custData);
    } catch (error) {
      console.error("Error loading data", error);
    }
  }, []);

  // 2. Calculate Stats
  const activeJobs = orders.filter((o) => o.status === "Open").length;
  const completedJobs = orders.filter((o) => o.status === "Closed").length;

  // Calculate Revenue Safely
  const calculateTotal = (order) => {
    if (!order) return 0;
    const lab = order.labour?.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0) || 0;
    const pts = order.parts?.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0) || 0;
    return lab + pts;
  };

  const totalRevenue = orders
    .filter((o) => o.status === "Closed")
    .reduce((sum, order) => sum + calculateTotal(order), 0);

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen font-sans">
        
        {/* ================= HERO SECTION ================= */}
        <div className="relative bg-linear-to-r from-indigo-600 to-purple-600 p-8 md:p-12 rounded-b-3xl shadow-lg overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-10 -mb-10"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-white">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Welcome to <span className="text-yellow-300">Vehima</span>
              </h1>
              <p className="text-indigo-100 mt-2 text-sm md:text-base">
                Workshop Management & Billing System
              </p>
            </div>
            
            <Link 
              to="/repair-order" 
              className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transform transition duration-300 flex items-center gap-2 text-sm"
            >
              <span className="text-xl">+</span> New Job Card
            </Link>
          </div>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 -mt-12 relative z-20">
            
            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase">Customers</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">{customers.length}</h3>
                </div>
                <span className="text-2xl p-2 bg-blue-50 rounded-lg">👥</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase">Active Jobs</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">{activeJobs}</h3>
                </div>
                <span className="text-2xl p-2 bg-yellow-50 rounded-lg">🔧</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase">Completed</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">{completedJobs}</h3>
                </div>
                <span className="text-2xl p-2 bg-green-50 rounded-lg">✅</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase">Revenue</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">₹{totalRevenue}</h3>
                </div>
                <span className="text-2xl p-2 bg-indigo-50 rounded-lg">💰</span>
              </div>
            </div>

          </div>

          {/* Quick Actions & Recent Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Quick Actions Card */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Quick Actions</h3>
              <div className="space-y-3">
                
                <Link to="/repair-order" className="flex items-center gap-4 p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition group">
                  <span className="text-2xl">📝</span>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">New Job Card</p>
                    <p className="text-xs text-gray-500">Create a new repair order</p>
                  </div>
                </Link>

                <Link to="/close-ro" className="flex items-center gap-4 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition group">
                  <span className="text-2xl">🔍</span>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Search Vehicle</p>
                    <p className="text-xs text-gray-500">Find active jobs</p>
                  </div>
                </Link>

                <Link to="/ro-list" className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition group">
                  <span className="text-2xl">📄</span>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">View All Jobs</p>
                    <p className="text-xs text-gray-500">List & Manage Job Cards</p>
                  </div>
                </Link>
                
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
                <Link to="/ro-list" className="text-xs text-indigo-600 font-semibold hover:underline">View All</Link>
              </div>
              
              {orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="pb-3 font-semibold">RO No.</th>
                        <th className="pb-3 font-semibold">Customer</th>
                        <th className="pb-3 font-semibold">Total</th>
                        <th className="pb-3 font-semibold text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="py-3 font-bold text-indigo-600">{order.roNumber}</td>
                          <td className="py-3">
                            <div className="font-medium text-gray-800">{order.customerName || "N/A"}</div>
                            <div className="text-xs text-gray-400">{order.registrationNo}</div>
                          </td>
                          <td className="py-3 font-medium text-gray-700">₹{calculateTotal(order)}</td>
                          <td className="py-3 text-right">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              order.status === 'Open' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-400 border-2 border-dashed rounded-lg mt-4">
                  <p className="mb-2">No job cards found</p>
                  <Link to="/repair-order" className="text-indigo-600 font-medium text-sm hover:underline">
                    Create your first Job Card
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}