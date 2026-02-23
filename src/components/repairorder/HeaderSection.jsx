import { useEffect, useState } from "react";

const HeaderSection = () => {
  const [roNumber, setRoNumber] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [status, setStatus] = useState("Open");

  /* -------- Generate RO Number -------- */
  useEffect(() => {
    const randomRO = "RO-" + Math.floor(1000 + Math.random() * 9000);
    setRoNumber(randomRO);
  }, []);

  /* -------- Live Date & Time -------- */
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setDateTime(
        now.toLocaleDateString() + " " + now.toLocaleTimeString()
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">

      {/* Top Row */}
      <div className="flex flex-col md:flex-row justify-between items-center border-b pb-4 mb-4">

        {/* Company Section */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-600 text-white flex items-center justify-center rounded-xl text-xl font-bold shadow">
            DMS
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Dealer Management System
            </h1>
            <p className="text-sm text-gray-500">
              Service Repair Order
            </p>
          </div>
        </div>

        {/* RO Info */}
        <div className="text-right mt-4 md:mt-0">
          <p className="text-sm text-gray-500">RO Number</p>
          <p className="text-lg font-semibold text-blue-600">
            {roNumber}
          </p>

          <p className="text-sm text-gray-500 mt-2">
            {dateTime}
          </p>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">

        {/* Status */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">
            Status:
          </label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* User + Actions */}
        <div className="flex items-center gap-4">

          <div className="text-sm text-gray-600">
            Logged in as: <span className="font-semibold">Admin</span>
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition">
            Save
          </button>

          <button className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg shadow transition">
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;
