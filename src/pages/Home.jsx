import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";

const Home = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);

  // 1. Load Real Data from LocalStorage
  useEffect(() => {
    const loadData = () => {
      // Load Repair Orders
      const roData = JSON.parse(localStorage.getItem("repairOrders")) || [];
      // Sort by newest first
      roData.sort((a, b) => b.id - a.id);
      setOrders(roData);

      // Load Customers
      const custData = JSON.parse(localStorage.getItem("customers")) || [];
      setCustomers(custData);
    };

    loadData();

    // Optional: Update data if storage changes (e.g. opening a new tab)
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  // 2. Calculate Stats dynamically
  const activeJobs = orders.filter((o) => o.status === "Open").length;
  const completedJobs = orders.filter((o) => o.status === "Closed").length;
  
  // Calculate Revenue (Sum of Closed Orders)
  const calculateTotal = (order) => {
    const lab = order.labour?.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const pts = order.parts?.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
    return (lab || 0) + (pts || 0);
  };

  const totalRevenue = orders
    .filter((o) => o.status === "Closed")
    .reduce((sum, order) => sum + calculateTotal(order), 0);

  const stats = [
    { title: "Total Customers", value: customers.length, icon: "👥", color: "bg-blue-500" },
    { title: "Active Job Cards", value: activeJobs, icon: "🔧", color: "bg-green-500" },
    { title: "Revenue (Closed)", value: `₹${totalRevenue}`, icon: "💰", color: "bg-yellow-500" },
    { title: "Completed Jobs", value: completedJobs, icon: "✅", color: "bg-indigo-500" },
  ];

  // Helper for Status Badge
  const getStatusClasses = (status) => {
    switch (status) {
      case "Closed": return "bg-green-100 text-green-700";
      case "Open": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Layout>
      <div className="p-4 md:p-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">Workshop Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back! Here is today's overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition flex justify-between items-center"
            >
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-full bg-opacity-20 ${stat.color} flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Table Section - Shows REAL recent orders */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Recent Job Cards</h2>
              <Link to="/ro-list" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                  <tr>
                    <th className="px-6 py-3">RO Number</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Total</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {/* Limit to first 4 orders for dashboard view */}
                  {orders.length > 0 ? (
                    orders.slice(0, 4).map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-indigo-600 font-medium">
                          <Link to={`/view-ro/${order.id}`}>{order.roNumber}</Link>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <div className="font-medium">{order.customerName}</div>
                          <div className="text-xs text-gray-400">{order.registrationNo}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                           ₹{calculateTotal(order)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClasses(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center p-10 text-gray-400">
                        No Job Cards created yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              
              <Link to="/repair-order" className="block">
                <button className="w-full text-left flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 transition-colors group">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-200 transition-colors text-lg">
                    +
                  </span>
                  <span className="font-medium text-sm">New Job Card</span>
                </button>
              </Link>

              <Link to="/close-ro" className="block">
                <button className="w-full text-left flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 transition-colors group">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-200 transition-colors text-lg">
                    🔍
                  </span>
                  <span className="font-medium text-sm">Search Vehicle</span>
                </button>
              </Link>

              <Link to="/ro-list" className="block">
                <button className="w-full text-left flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 transition-colors group">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-200 transition-colors text-lg">
                    📄
                  </span>
                  <span className="font-medium text-sm">Generate Invoice</span>
                </button>
              </Link>

            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Home;