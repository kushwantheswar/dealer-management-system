import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { generatePDF } from "../utils/generatePDF";

export default function ViewRo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const reportTemplateRef = useRef(null);

  const [order, setOrder] = useState(null);

  // 1. Load Order Data
  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem("repairOrders")) || [];
    const foundOrder = existing.find((o) => o.id === parseInt(id));

    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      alert("Repair Order not found!");
      navigate(-1);
    }
  }, [id, navigate]);

  // 2. Function to Toggle Job Card Status
  const handleToggleStatus = (newStatus) => {
    const confirmChange = window.confirm(`Are you sure you want to mark this as ${newStatus}?`);
    if (!confirmChange) return;

    const existing = JSON.parse(localStorage.getItem("repairOrders")) || [];
    const index = existing.findIndex((o) => o.id === parseInt(id));

    if (index !== -1) {
      existing[index].status = newStatus;
      localStorage.setItem("repairOrders", JSON.stringify(existing));
      setOrder({ ...order, status: newStatus });
      alert(`Job Card marked as ${newStatus}!`);
    }
  };

  // 3. Calculation Logic
  const totalLabour = order?.labour?.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0) || 0;
  const totalParts = order?.parts?.reduce((sum, item) => sum + parseFloat(item.total || 0), 0) || 0;
  const grandTotal = totalLabour + totalParts;

  if (!order) return <div className="p-10 text-center text-gray-500">Loading Order Details...</div>;

  return (
    <div className="bg-gray-100 min-h-screen py-6 px-4">
      
      {/* Top Action Bar */}
      <div className="max-w-4xl mx-auto mb-4 flex justify-between items-center flex-wrap gap-3 bg-white p-3 rounded-lg shadow-sm border">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium text-sm"
        >
          ← Back to List
        </button>

        <div className="flex gap-2 flex-wrap">
            {/* PDF Button */}
            <button
              onClick={() => generatePDF(reportTemplateRef.current, `RO-${order.roNumber}`)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 shadow-sm flex items-center gap-2"
            >
              📄 Download PDF
            </button>

            {/* Dynamic Status Buttons */}
            {order.status === "Open" && (
              <button
                onClick={() => handleToggleStatus("Closed")}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 shadow-sm flex items-center gap-2"
              >
                🔒 Close Job Card
              </button>
            )}

            {order.status === "Closed" && (
              <>
                <button
                  onClick={() => navigate(`/billing/${order.id}`)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 shadow-sm flex items-center gap-2"
                >
                  💰 Generate Bill
                </button>
                <button
                  onClick={() => handleToggleStatus("Open")}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 flex items-center gap-2"
                >
                  🔓 Re-Open
                </button>
              </>
            )}
        </div>
      </div>

      {/* PDF Content Area - Clean Document Style */}
      <div 
        ref={reportTemplateRef} 
        className="max-w-4xl mx-auto bg-white shadow-xl border-t-4 border-indigo-600 text-sm"
      >
        {/* Document Header */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">VEHIMA</h1>
              <p className="text-xs text-gray-500">Dealer Management System</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-indigo-600">REPAIR ORDER</h2>
              <p className="text-gray-700 font-mono text-lg">{order.roNumber}</p>
              <span className={`mt-1 inline-block px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Open' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                {order.status}
              </span>
            </div>
          </div>
        </div>

        {/* Main Details Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b">
            {/* Vehicle Details */}
            <div className="space-y-2">
                <h3 className="font-bold text-gray-600 text-xs uppercase tracking-wider mb-2">Vehicle Information</h3>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="text-gray-500">Reg No:</div><div className="font-semibold text-gray-800">{order.registrationNo}</div>
                    <div className="text-gray-500">Chassis:</div><div className="font-semibold text-gray-800">{order.chassisNo}</div>
                    <div className="text-gray-500">Engine:</div><div className="font-semibold text-gray-800">{order.engineNo}</div>
                    <div className="text-gray-500">KM Reading:</div><div className="font-semibold text-gray-800">{order.kmReading}</div>
                </div>
            </div>

            {/* Service Details */}
            <div className="space-y-2">
                <h3 className="font-bold text-gray-600 text-xs uppercase tracking-wider mb-2">Service Information</h3>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="text-gray-500">Date:</div><div className="font-semibold text-gray-800">{order.dateTime}</div>
                    <div className="text-gray-500">Service Type:</div><div className="font-semibold text-gray-800">{order.serviceType}</div>
                    <div className="text-gray-500">Advisor:</div><div className="font-semibold text-gray-800">{order.advisor}</div>
                    <div className="text-gray-500">Payment:</div><div className="font-semibold text-gray-800">{order.paymentMode}</div>
                </div>
            </div>
        </div>

        {/* Sections for Data */}
        <div className="p-6 space-y-6">
            
            {/* Demanded Repair */}
            {order.demandedRepair && order.demandedRepair.length > 0 && (
            <div>
                <h3 className="font-bold text-gray-600 text-xs uppercase tracking-wider mb-2">Customer Complaints & Observations</h3>
                <table className="w-full border text-sm">
                <thead>
                    <tr className="bg-gray-100 text-left">
                    <th className="border p-2 w-1/3">Complaint</th>
                    <th className="border p-2 w-1/3">Observation</th>
                    <th className="border p-2 w-1/3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {order.demandedRepair.map((r, i) => (
                    <tr key={i}>
                        <td className="border p-2">{r.complaint}</td>
                        <td className="border p-2">{r.observation}</td>
                        <td className="border p-2">{r.action}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            )}

            {/* Labour Details */}
            {order.labour && order.labour.length > 0 && (
            <div>
                <h3 className="font-bold text-gray-600 text-xs uppercase tracking-wider mb-2">Labour Charges</h3>
                <table className="w-full border text-sm">
                <thead>
                    <tr className="bg-gray-100 text-left">
                    <th className="border p-2">Description</th>
                    <th className="border p-2 w-20 text-center">Hrs</th>
                    <th className="border p-2 w-24 text-right">Rate</th>
                    <th className="border p-2 w-24 text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {order.labour.map((r, i) => (
                    <tr key={i}>
                        <td className="border p-2">{r.name}</td>
                        <td className="border p-2 text-center">{r.hours}</td>
                        <td className="border p-2 text-right">₹{r.rate}</td>
                        <td className="border p-2 text-right font-medium">₹{r.amount}</td>
                    </tr>
                    ))}
                    <tr className="bg-gray-50 font-semibold">
                        <td colSpan="3" className="p-2 text-right border">Subtotal Labour:</td>
                        <td className="p-2 text-right border text-indigo-600">₹{totalLabour.toFixed(2)}</td>
                    </tr>
                </tbody>
                </table>
            </div>
            )}

            {/* Parts Details */}
            {order.parts && order.parts.length > 0 && (
            <div>
                <h3 className="font-bold text-gray-600 text-xs uppercase tracking-wider mb-2">Parts & Material</h3>
                <table className="w-full border text-sm">
                <thead>
                    <tr className="bg-gray-100 text-left">
                    <th className="border p-2">Part Name</th>
                    <th className="border p-2 w-16 text-center">Qty</th>
                    <th className="border p-2 w-24 text-right">Price</th>
                    <th className="border p-2 w-24 text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {order.parts.map((r, i) => (
                    <tr key={i}>
                        <td className="border p-2">{r.partName}</td>
                        <td className="border p-2 text-center">{r.qty}</td>
                        <td className="border p-2 text-right">₹{r.price}</td>
                        <td className="border p-2 text-right font-medium">₹{r.total}</td>
                    </tr>
                    ))}
                    <tr className="bg-gray-50 font-semibold">
                        <td colSpan="3" className="p-2 text-right border">Subtotal Parts:</td>
                        <td className="p-2 text-right border text-indigo-600">₹{totalParts.toFixed(2)}</td>
                    </tr>
                </tbody>
                </table>
            </div>
            )}

            {/* Grand Total */}
            <div className="border-t pt-4 mt-4 flex justify-end">
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 w-64">
                    <div className="flex justify-between mb-1">
                        <span className="text-gray-600">Labour Total:</span>
                        <span className="font-medium">₹{totalLabour.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Parts Total:</span>
                        <span className="font-medium">₹{totalParts.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-indigo-300 pt-2 text-lg font-bold text-indigo-800">
                        <span>Grand Total:</span>
                        <span>₹{grandTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>

        </div>
        
        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t text-center text-xs text-gray-400">
            Thank you for your business. This is a computer generated document.
        </div>
      </div>
    </div>
  );
}