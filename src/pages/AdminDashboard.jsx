import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout"; 

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const roData = JSON.parse(localStorage.getItem("repairOrders")) || [];
      const custData = JSON.parse(localStorage.getItem("customers")) || [];
      roData.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
      setOrders(roData);
      setCustomers(custData);
    } catch (error) {
      console.error("Error loading data", error);
    }
  }, []);

  // Safe calculations with defaults
  const totalRevenue = orders.reduce((sum, order) => {
    const labourTotal = order.labour?.reduce((s, i) => s + Number(i.amount || 0), 0) || 0;
    const partsTotal = order.parts?.reduce((s, i) => s + Number(i.total || 0), 0) || 0;
    return sum + labourTotal + partsTotal;
  }, 0);

  const totalGst = totalRevenue * 0.18; 
  const openJobs = orders.filter(o => o.status === "Open").length;
  const closedJobs = orders.filter(o => o.status === "Closed").length;

  const handleResetData = () => {
    if(window.confirm("ARE YOU SURE? This will delete all data.")) {
      localStorage.removeItem("repairOrders");
      localStorage.removeItem("customers");
      window.location.reload();
    }
  };

  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Control Panel</h1>
            <p className="text-sm text-gray-500">Overview of all operations</p>
          </div>
          <button 
            onClick={handleResetData}
            className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 shadow"
          >
            Reset All Data
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-green-500 p-4 rounded-lg shadow text-white flex justify-between items-center">
            <div>
              <p className="text-sm opacity-80">Total Revenue</p>
              <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString('en-IN')}</p>
            </div>
            <span className="text-3xl opacity-50">💰</span>
          </div>
          
          <div className="bg-blue-500 p-4 rounded-lg shadow text-white flex justify-between items-center">
            <div>
              <p className="text-sm opacity-80">Total Customers</p>
              <p className="text-2xl font-bold">{customers.length}</p>
            </div>
            <span className="text-3xl opacity-50">👥</span>
          </div>

          <div className="bg-yellow-500 p-4 rounded-lg shadow text-white flex justify-between items-center">
            <div>
              <p className="text-sm opacity-80">Open Jobs</p>
              <p className="text-2xl font-bold">{openJobs}</p>
            </div>
            <span className="text-3xl opacity-50">🛠️</span>
          </div>

          <div className="bg-indigo-500 p-4 rounded-lg shadow text-white flex justify-between items-center">
            <div>
              <p className="text-sm opacity-80">Closed Jobs</p>
              <p className="text-2xl font-bold">{closedJobs}</p>
            </div>
            <span className="text-3xl opacity-50">✅</span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <div className="p-4 border-b bg-gray-800 text-white flex justify-between">
            <h3 className="font-bold">Recent Job Cards</h3>
            <span className="text-xs bg-white text-gray-800 px-2 py-1 rounded">{orders.length} Total</span>
          </div>
          
          <table className="w-full text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">RO No.</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Vehicle</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? orders.slice(0, 10).map((job) => (
                <tr key={job.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-bold text-blue-600">{job.roNumber}</td>
                  <td className="p-3">{job.customerName || "-"}</td>
                  <td className="p-3">{job.registrationNo}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-white text-xs ${job.status === 'Closed' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button 
                      onClick={() => navigate(`/view-ro/${job.id}`)}
                      className="text-blue-500 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="text-center p-10 text-gray-400">
                    No Job Cards Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}