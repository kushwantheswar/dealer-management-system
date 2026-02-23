import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/layout/Layout";

export default function ROList() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All"); // All, Open, Closed
  const navigate = useNavigate();

  // 1. Load Orders
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("repairOrders")) || [];
    // Sort by newest first
    data.sort((a, b) => b.id - a.id);
    setOrders(data);
  }, []);

  // 2. Delete Handler
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this RO?");
    if (!confirmDelete) return;

    const filtered = orders.filter((o) => o.id !== id);
    setOrders(filtered);
    localStorage.setItem("repairOrders", JSON.stringify(filtered));
  };

  // 3. Filtering Logic
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = activeFilter === "All" || order.status === activeFilter;

    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch = 
      order.roNumber?.toLowerCase().includes(lowerSearch) ||
      order.customerName?.toLowerCase().includes(lowerSearch) ||
      order.registrationNo?.toLowerCase().includes(lowerSearch);

    return matchesStatus && matchesSearch;
  });

  // Helper for Status Badge
  const StatusBadge = ({ status }) => {
    const classes = 
      status === 'Open' 
        ? 'bg-yellow-100 text-yellow-700 border-yellow-200' 
        : 'bg-green-100 text-green-700 border-green-200';
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${classes}`}>
        {status}
      </span>
    );
  };

  return (
    <Layout>
      <div className="p-4 md:p-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Job Cards</h1>
            <p className="text-sm text-gray-500">Manage your active and closed repair orders</p>
          </div>
          <Link 
            to="/repair-order" 
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700 shadow-sm flex items-center gap-2"
          >
            <span>+</span> New Job Card
          </Link>
        </div>

        {/* Filters & Search Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Status Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {["All", "Open", "Closed"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    activeFilter === filter 
                      ? "bg-white shadow-sm text-indigo-600" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search RO / Customer / Vehicle..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 text-left font-semibold text-gray-600">RO Number</th>
                  <th className="p-4 text-left font-semibold text-gray-600">Customer</th>
                  <th className="p-4 text-left font-semibold text-gray-600">Vehicle</th>
                  <th className="p-4 text-left font-semibold text-gray-600">Date</th>
                  <th className="p-4 text-left font-semibold text-gray-600">Status</th>
                  <th className="p-4 text-center font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <span className="font-bold text-indigo-600">{order.roNumber}</span>
                      </td>
                      <td className="p-4 text-gray-700">{order.customerName || "-"}</td>
                      <td className="p-4 text-gray-700">{order.registrationNo}</td>
                      <td className="p-4 text-gray-500">{order.dateTime}</td>
                      <td className="p-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center items-center gap-2">
                          
                          {/* View Button (Primary Action for Open Jobs) */}
                          <button
                            onClick={() => navigate(`/view-ro/${order.id}`)}
                            className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors"
                            title="View Details / Close Job"
                          >
                            👁️
                          </button>

                          {/* Generate Bill Button (Only for Closed Jobs) */}
                          {order.status === "Closed" && (
                            <button
                              onClick={() => navigate(`/billing/${order.id}`)}
                              className="p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 transition-colors font-medium"
                              title="Generate Bill"
                            >
                              💰
                            </button>
                          )}

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            🗑️
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center p-10">
                      <div className="flex flex-col items-center">
                        <span className="text-4xl mb-2">📭</span>
                        <p className="text-gray-500 font-medium">No Job Cards Found</p>
                        <p className="text-gray-400 text-xs mt-1">
                          {searchTerm ? "Try a different search term" : "Click 'New Job Card' to create one"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Layout>
  );
}