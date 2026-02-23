import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { generatePDF } from "../utils/generatePDF";

export default function Billing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const invoiceRef = useRef(null);

  const [order, setOrder] = useState(null);
  const [gstPercentage, setGstPercentage] = useState(18);

  useEffect(() => {
    // 1. Check if ID exists
    if (!id) {
      alert("No Invoice ID provided!");
      navigate("/ro-list");
      return;
    }

    // 2. Load Data
    const orders = JSON.parse(localStorage.getItem("repairOrders")) || [];
    // Ensure we compare numbers to numbers
    const foundOrder = orders.find((o) => o.id === parseInt(id));

    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      alert(`Order with ID #${id} not found in storage.`);
      navigate("/ro-list");
    }
  }, [id, navigate]);

  // Calculate Totals
  if (!order) return <div className="p-10 text-center">Loading Invoice...</div>;

  const labourTotal = order.labour?.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0) || 0;
  const partsTotal = order.parts?.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0) || 0;
  const subTotal = labourTotal + partsTotal;
  
  const gstAmount = (subTotal * (gstPercentage / 100)).toFixed(2);
  const grandTotal = (subTotal + parseFloat(gstAmount)).toFixed(2);

  // Print Function
  const handlePrint = () => {
    const printContent = invoiceRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Invoice</title>');
    
    // Add Tailwind CSS via CDN for the print window styles
    printWindow.document.write('<script src="https://cdn.tailwindcss.com"></script>');
    
    printWindow.document.write('<style>body { -webkit-print-color-adjust: exact; }</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write('</body></html>');
    
    printWindow.document.close(); // Necessary for IE >= 10
    printWindow.focus(); // Necessary for IE >= 10

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <Layout>
      <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
        
        {/* Action Bar */}
        <div className="max-w-4xl mx-auto mb-4 flex justify-between items-center flex-wrap gap-2">
          <Link to="/ro-list" className="text-gray-600 hover:text-gray-800 font-medium flex items-center gap-1">
            ← Back to List
          </Link>

          <div className="flex gap-2">
            {/* GST Selector */}
            <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-1">
                <label className="text-xs text-gray-600">GST:</label>
                <select 
                    value={gstPercentage} 
                    onChange={(e) => setGstPercentage(Number(e.target.value))}
                    className="text-sm outline-none bg-transparent"
                >
                    <option value={0}>0%</option>
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18%</option>
                    <option value={28}>28%</option>
                </select>
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-300 flex items-center gap-2"
            >
              🖨️ Print
            </button>

            {/* PDF Button */}
            <button
              onClick={() => generatePDF(invoiceRef.current, `Invoice-${order.roNumber}`)}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700 shadow flex items-center gap-2"
            >
              📄 Download PDF
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div 
          ref={invoiceRef} 
          className="max-w-4xl mx-auto bg-white shadow-xl p-8 border text-sm"
        >
          
          {/* Header */}
          <div className="border-b pb-4 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 tracking-wide">VEHIMA</h1>
                <p className="text-xs text-gray-500 mt-1">Your Trusted Garage Solution</p>
                <p className="text-xs text-gray-400 mt-1">GSTIN: 29ABCDE1234F1Z5</p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold text-indigo-600 uppercase">Tax Invoice</h2>
                <p className="text-gray-700 font-mono text-lg mt-1">{order.roNumber}</p>
                <p className="text-gray-500 text-xs mt-1">Date: {order.dateTime}</p>
              </div>
            </div>
          </div>

          {/* Customer & Vehicle Details */}
          <div className="grid grid-cols-2 gap-8 mb-6 border-b pb-4">
            <div>
              <h3 className="font-bold text-gray-600 text-xs uppercase mb-2 border-b pb-1">Billed To:</h3>
              <p className="font-semibold text-gray-800">{order.customerName || "N/A"}</p>
              <p className="text-gray-600 text-xs">{order.mobile || "N/A"}</p>
            </div>
            <div className="text-right">
              <h3 className="font-bold text-gray-600 text-xs uppercase mb-2 border-b pb-1">Vehicle Details:</h3>
              <p className="text-xs"><span className="font-medium">Reg No:</span> {order.registrationNo}</p>
              <p className="text-xs"><span className="font-medium">KM:</span> {order.kmReading}</p>
            </div>
          </div>

          {/* Labour Table */}
          {labourTotal > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-600 text-xs uppercase mb-2">Labour Charges</h3>
              <table className="w-full border text-xs mb-4">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2 text-left">Description</th>
                    <th className="border p-2 text-center w-16">Hrs</th>
                    <th className="border p-2 text-right w-24">Rate</th>
                    <th className="border p-2 text-right w-24">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {order.labour.map((item, i) => (
                    <tr key={i}>
                      <td className="border p-2">{item.name}</td>
                      <td className="border p-2 text-center">{item.hours}</td>
                      <td className="border p-2 text-right">₹{item.rate}</td>
                      <td className="border p-2 text-right">₹{item.amount}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-semibold">
                    <td colSpan={3} className="border p-2 text-right">Subtotal Labour:</td>
                    <td className="border p-2 text-right">₹{labourTotal.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Parts Table */}
          {partsTotal > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-600 text-xs uppercase mb-2">Parts & Material</h3>
              <table className="w-full border text-xs mb-4">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2 text-left">Part Name</th>
                    <th className="border p-2 text-center w-16">Qty</th>
                    <th className="border p-2 text-right w-24">Price</th>
                    <th className="border p-2 text-right w-24">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.parts.map((item, i) => (
                    <tr key={i}>
                      <td className="border p-2">{item.partName}</td>
                      <td className="border p-2 text-center">{item.qty}</td>
                      <td className="border p-2 text-right">₹{item.price}</td>
                      <td className="border p-2 text-right">₹{item.total}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-semibold">
                    <td colSpan={3} className="border p-2 text-right">Subtotal Parts:</td>
                    <td className="border p-2 text-right">₹{partsTotal.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Grand Total Section */}
          <div className="flex justify-end mb-8">
            <div className="w-64 border bg-gray-50 p-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">₹{subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-gray-600">GST ({gstPercentage}%):</span>
                <span className="font-medium text-green-600">₹{gstAmount}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-bold text-lg text-indigo-800">
                <span>Grand Total:</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="mt-12 border-t pt-6">
            <div className="grid grid-cols-3 gap-8 text-center">
              {/* Customer Sign */}
              <div className="flex flex-col items-center">
                <div className="w-full border-b border-gray-400 mt-8"></div>
                <p className="mt-2 font-semibold text-gray-700 text-xs">Customer Signature</p>
              </div>

              {/* Accountant Sign */}
              <div className="flex flex-col items-center">
                <div className="w-full border-b border-gray-400 mt-8"></div>
                <p className="mt-2 font-semibold text-gray-700 text-xs">Accountant Signature</p>
              </div>

              {/* Manager Sign */}
              <div className="flex flex-col items-center">
                <div className="w-full border-b border-gray-400 mt-8"></div>
                <p className="mt-2 font-semibold text-gray-700 text-xs">Manager Signature</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-10 text-center text-xs text-gray-400">
            <p>Thank you for your business. This is a computer generated invoice.</p>
          </div>

        </div>
      </div>
    </Layout>
  );
}