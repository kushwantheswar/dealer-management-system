import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { labourList, partsList } from "../data/VehicleData";

export default function CloseRO() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [order, setOrder] = useState(null);
  const [labour, setLabour] = useState([]);
  const [parts, setParts] = useState([]);

  // 1. Search Function
  const handleSearch = (e) => {
    e.preventDefault();
    const allOrders = JSON.parse(localStorage.getItem("repairOrders")) || [];
    // Find by RO Number (e.g., RO-1)
    const found = allOrders.find((o) => o.roNumber.toLowerCase() === searchTerm.toLowerCase());

    if (found) {
      setOrder(found);
      setLabour(found.labour || []);
      setParts(found.parts || []);
    } else {
      alert("Repair Order not found!");
      setOrder(null);
    }
  };

  // 2. Update Local State (Inputs)
  const handleLabourChange = (index, field, value) => {
    const updated = [...labour];
    updated[index][field] = value;
    if (field === "name") {
      const item = labourList.find((i) => i.name === value);
      if (item) updated[index].rate = item.rate;
    }
    updated[index].amount = (parseFloat(updated[index].hours) || 0) * (parseFloat(updated[index].rate) || 0);
    setLabour(updated);
  };

  const handlePartsChange = (index, field, value) => {
    const updated = [...parts];
    updated[index][field] = value;
    if (field === "partName") {
      const item = partsList.find((i) => i.name === value);
      if (item) updated[index].price = item.price;
    }
    updated[index].total = (parseFloat(updated[index].qty) || 0) * (parseFloat(updated[index].price) || 0);
    setParts(updated);
  };

  // 3. Save Changes & Close Job
  const handleCloseJob = () => {
    if (!order) return;
    if (!window.confirm("Are you sure you want to Close this Job Card?")) return;

    const allOrders = JSON.parse(localStorage.getItem("repairOrders")) || [];
    const index = allOrders.findIndex((o) => o.id === order.id);

    if (index !== -1) {
      // Update the order with new labour/parts and status
      allOrders[index] = {
        ...allOrders[index],
        labour: labour,
        parts: parts,
        status: "Closed", // Set Status to Closed
      };

      localStorage.setItem("repairOrders", JSON.stringify(allOrders));
      setOrder(allOrders[index]); // Update local state
      alert("Job Card Closed Successfully!");
    }
  };

  // 4. Proceed to Billing
  const handleGenerateBill = () => {
    navigate(`/billing/${order.id}`);
  };

  // Calculations
  const totalLabour = labour.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalParts = parts.reduce((sum, item) => sum + (item.total || 0), 0);

  return (
    <Layout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Close Repair Order</h1>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6 flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Enter RO Number</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g., RO-101"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700"
          >
            Search
          </button>
        </div>

        {/* Order Details Area */}
        {order && (
          <div className="space-y-6">
            
            {/* Status Bar */}
            <div className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center">
              <div>
                <h2 className="font-bold text-lg text-gray-800">{order.roNumber}</h2>
                <p className="text-sm text-gray-500">{order.registrationNo} | {order.customerName}</p>
              </div>
              <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                order.status === 'Open' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
              }`}>
                {order.status}
              </span>
            </div>

            {/* Editable Tables (Only if Open) */}
            {order.status === "Open" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Labour Table */}
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <h3 className="font-semibold mb-3 text-gray-700">Labour Details</h3>
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-center">Hrs</th>
                        <th className="p-2 text-right">Amt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {labour.map((row, i) => (
                        <tr key={i}>
                          <td className="p-1">
                            <select value={row.name} onChange={(e) => handleLabourChange(i, "name", e.target.value)} className="w-full border rounded p-1 bg-gray-50">
                              <option value="">Select</option>
                              {labourList.map(item => <option key={item.id} value={item.name}>{item.name}</option>)}
                            </select>
                          </td>
                          <td className="p-1">
                            <input type="number" value={row.hours} onChange={(e) => handleLabourChange(i, "hours", e.target.value)} className="w-full border rounded p-1 bg-gray-50 text-center" />
                          </td>
                          <td className="p-1 text-right font-semibold text-green-600">₹{row.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Parts Table */}
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <h3 className="font-semibold mb-3 text-gray-700">Parts Details</h3>
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-2 text-left">Part</th>
                        <th className="p-2 text-center">Qty</th>
                        <th className="p-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parts.map((row, i) => (
                        <tr key={i}>
                          <td className="p-1">
                            <select value={row.partName} onChange={(e) => handlePartsChange(i, "partName", e.target.value)} className="w-full border rounded p-1 bg-gray-50">
                              <option value="">Select</option>
                              {partsList.map(item => <option key={item.id} value={item.name}>{item.name}</option>)}
                            </select>
                          </td>
                          <td className="p-1">
                            <input type="number" value={row.qty} onChange={(e) => handlePartsChange(i, "qty", e.target.value)} className="w-full border rounded p-1 bg-gray-50 text-center" />
                          </td>
                          <td className="p-1 text-right font-semibold text-green-600">₹{row.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Total Summary */}
            <div className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center">
               <div className="text-gray-600">
                 <span className="font-semibold">Total Labour:</span> ₹{totalLabour} | 
                 <span className="font-semibold ml-2">Total Parts:</span> ₹{totalParts}
               </div>
               <div className="text-xl font-bold text-indigo-700">
                 Grand Total: ₹{totalLabour + totalParts}
               </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              {order.status === "Open" && (
                <button
                  onClick={handleCloseJob}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 shadow"
                >
                  Close Job Card
                </button>
              )}

              {order.status === "Closed" && (
                <button
                  onClick={handleGenerateBill}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 shadow"
                >
                  Generate Bill
                </button>
              )}
            </div>

          </div>
        )}
      </div>
    </Layout>
  );
}