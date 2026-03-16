import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [expandedCustomerId, setExpandedCustomerId] = useState(null); // Innovation: Track expanded row
  const [allOrders, setAllOrders] = useState([]); // Store all ROs to calculate history

  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("customers")) || [];
    const orders = JSON.parse(localStorage.getItem("repairOrders")) || [];
    
    // Sort by most recent visit
    data.sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit));
    
    setCustomers(data);
    setAllOrders(orders);
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.mobile?.includes(search) ||
      c.vehicles?.some(v => v.toLowerCase().includes(search.toLowerCase()))
  );

  // Innovation: Function to get history for a specific customer
  const getCustomerHistory = (mobile) => {
    return allOrders.filter(order => order.mobile === mobile);
  };

  // Innovation: Calculate total spent by customer
  const calculateTotalSpent = (orders) => {
    return orders.reduce((total, order) => {
      const labourSum = order.labour?.reduce((sum, l) => sum + Number(l.amount || 0), 0);
      const partsSum = order.parts?.reduce((sum, p) => sum + Number(p.total || 0), 0);
      return total + labourSum + partsSum;
    }, 0);
  };

  const toggleExpand = (id) => {
    setExpandedCustomerId(expandedCustomerId === id ? null : id);
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Customer Directory</h1>
          <input
            type="text"
            placeholder="Search by Name, Mobile, or Vehicle..."
            className="border p-2 rounded text-sm w-72 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3 text-left w-8"></th> {/* Expand Icon Col */}
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Mobile</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Vehicles</th>
                <th className="p-3 text-left">Last Visit</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((cust) => {
                  const isExpanded = expandedCustomerId === cust.id;
                  const history = getCustomerHistory(cust.mobile);
                  const totalSpent = calculateTotalSpent(history);

                  return (
                    <>
                      {/* Main Row */}
                      <tr 
                        key={cust.id} 
                        className="border-b hover:bg-blue-50 cursor-pointer transition"
                        onClick={() => toggleExpand(cust.id)}
                      >
                        <td className="p-3 text-gray-400">
                           {isExpanded ? "▼" : "▶"}
                        </td>
                        <td className="p-3 font-semibold text-gray-800">{cust.name}</td>
                        <td className="p-3">
                            <a href={`tel:${cust.mobile}`} className="text-blue-600 hover:underline" onClick={(e) => e.stopPropagation()}>
                              {cust.mobile}
                            </a>
                        </td>
                        <td className="p-3 text-gray-600">
                            <a href={`mailto:${cust.email}`} className="hover:underline" onClick={(e) => e.stopPropagation()}>
                              {cust.email || "-"}
                            </a>
                        </td>
                        <td className="p-3 text-gray-700">{cust.vehicles?.join(", ")}</td>
                        <td className="p-3">
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                            {cust.lastVisit}
                          </span>
                        </td>
                        <td className="p-3" onClick={(e) => e.stopPropagation()}>
                           <button 
                             onClick={() => navigate(`/repair-order`)} // Ideally pass customer ID to pre-fill form
                             className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                           >
                             + New RO
                           </button>
                        </td>
                      </tr>

                      {/* Innovation: Expanded History View */}
                      {isExpanded && (
                        <tr className="bg-gray-50 border-b">
                          <td colSpan="7" className="p-4">
                            <div className="mb-3 flex justify-between items-center">
                               <h3 className="font-bold text-gray-700">Service History ({history.length} jobs)</h3>
                               <p className="text-sm font-bold text-green-700">
                                  Total Spent: ₹{totalSpent.toLocaleString('en-IN')}
                               </p>
                            </div>
                            
                            {history.length > 0 ? (
                              <table className="w-full text-xs border bg-white">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="p-2 border text-left">RO Number</th>
                                    <th className="p-2 border text-left">Vehicle</th>
                                    <th className="p-2 border text-left">Status</th>
                                    <th className="p-2 border text-right">Amount</th>
                                    <th className="p-2 border text-center">View</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {history.map(job => (
                                    <tr key={job.id}>
                                      <td className="p-2 border">{job.roNumber}</td>
                                      <td className="p-2 border">{job.registrationNo}</td>
                                      <td className="p-2 border">
                                        <span className={`px-2 py-0.5 rounded text-white text-xs ${job.status === 'Closed' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                                          {job.status}
                                        </span>
                                      </td>
                                      <td className="p-2 border text-right">
                                        ₹{(
                                          (job.labour?.reduce((s, i) => s + Number(i.amount || 0), 0)) +
                                          (job.parts?.reduce((s, i) => s + Number(i.total || 0), 0))
                                        ).toLocaleString('en-IN')}
                                      </td>
                                      <td className="p-2 border text-center">
                                        <button 
                                          onClick={() => navigate(`/view-ro/${job.id}`)}
                                          className="text-blue-600 hover:underline"
                                        >
                                          Open
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              <p className="text-gray-400 text-xs italic">No past service history found.</p>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-10 text-gray-500">
                    No customers found. Add customers by creating a Repair Order.
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