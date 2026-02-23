import { useState } from "react";
import Layout from "../components/layout/Layout";
import { useLocation } from "react-router-dom";


const JobCards = () => {
  const [activeTab, setActiveTab] = useState("complaints");

 const [form, setForm] = useState({
  registrationNo: "",
  chassisNo: "",
  engineNo: "",
  kmReading: "",
  complaint: "",
  status: "Open",
  labourCost: "",
  partsCost: "",
});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    if (!form.registrationNo || !form.complaint) {
      alert("Registration No and Complaint are required.");
      return;
    }

    const existing = JSON.parse(localStorage.getItem("jobCards")) || [];

    const totalCost =
  Number(form.labourCost || 0) +
  Number(form.partsCost || 0);

const newJob = {
  id: Date.now(),
  roNumber: `RO-${existing.length + 1}`,
  ...form,
  totalCost,
  createdAt: new Date().toISOString(),
};

const location = useLocation();

useEffect(() => {
  if (location.state) {
    setForm(location.state);
  }
}, [location.state]);



    const updated = [...existing, newJob];

    localStorage.setItem("jobCards", JSON.stringify(updated));

    alert("Job Card Saved Successfully!");

    setForm({
      registrationNo: "",
      chassisNo: "",
      engineNo: "",
      kmReading: "",
      complaint: "",
      status: "Open",
    });
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">
        Repair Order / Job Card
      </h1>

      {/* VEHICLE DETAILS */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="font-semibold mb-4">Vehicle Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <input
            name="registrationNo"
            value={form.registrationNo}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            placeholder="Registration No"
          />

          <input
            name="chassisNo"
            value={form.chassisNo}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            placeholder="Chassis No"
          />

          <input
            name="engineNo"
            value={form.engineNo}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            placeholder="Engine No"
          />

          <input
            name="kmReading"
            value={form.kmReading}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            placeholder="KM Reading"
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          >
            <option value="Open">Open</option>
            <option value="Completed">Completed</option>
          </select>

        </div>
      </div>

      {/* TABS */}
      <div className="bg-white rounded shadow">
        <div className="flex border-b">
          <Tab label="Complaints" active={activeTab} setActive={setActiveTab} />
          <Tab label="Labour" active={activeTab} setActive={setActiveTab} />
          <Tab label="Parts" active={activeTab} setActive={setActiveTab} />
        </div>

        <div className="p-6">
          {activeTab === "complaints" && (
            <textarea
              name="complaint"
              value={form.complaint}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full h-24"
              placeholder="Describe customer complaint..."
            />
          )}

          {activeTab === "labour" && (
  <div className="space-y-3">
    <input
      name="labourCost"
      value={form.labourCost}
      onChange={handleChange}
      type="number"
      className="border rounded px-3 py-2 w-full"
      placeholder="Labour Cost"
    />
  </div>
)}

{activeTab === "labour" && (
  <div className="space-y-3">
    <input
      name="labourCost"
      value={form.labourCost}
      onChange={handleChange}
      type="number"
      className="border rounded px-3 py-2 w-full"
      placeholder="Labour Cost"
    />
  </div>
)}

{activeTab === "parts" && (
  <div className="space-y-3">
    <input
      name="partsCost"
      value={form.partsCost}
      onChange={handleChange}
      type="number"
      className="border rounded px-3 py-2 w-full"
      placeholder="Parts Cost"
    />
  </div>
)}

        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-end mt-6 gap-4">
        <button
          onClick={() =>
            setForm({
              registrationNo: "",
              chassisNo: "",
              engineNo: "",
              kmReading: "",
              complaint: "",
              status: "Open",
            })
          }
          className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
        >
          Cancel
        </button>

        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Save Job Card
        </button>
      </div>
    </Layout>
  );
};

const Tab = ({ label, active, setActive }) => {
  const value = label.toLowerCase();
  const isActive = active === value;

  return (
    <button
      onClick={() => setActive(value)}
      className={`px-6 py-3 text-sm font-medium ${
        isActive
          ? "border-b-2 border-blue-600 text-blue-600"
          : "text-gray-600 hover:text-blue-600"
      }`}
    >
      {label}
    </button>
  );
};

export default JobCards;
