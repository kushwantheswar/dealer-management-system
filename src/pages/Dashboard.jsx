import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Added Link for navigation
import Layout from "../components/layout/Layout";

const Dashboard = () => {
  const [summary, setSummary] = useState({
    total_jobs: 0,
    pending_jobs: 0,
    completed_jobs: 0,
    today_revenue: 0,
    total_customers: 0, // New state for customers
  });

  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
    const jobs = JSON.parse(localStorage.getItem("repairOrders")) || [];
    const customers = JSON.parse(localStorage.getItem("customers")) || [];

    const total = jobs.length;
    
    // Updated logic to match "Closed" status used in ROList and ViewRO
    const completed = jobs.filter((j) => j.status === "Closed").length;
    const pending = total - completed;

    // Calculate ACTUAL Revenue from Labour and Parts
    let revenue = 0;
    jobs.forEach((job) => {
      const labourTotal = job.labour?.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      );
      const partsTotal = job.parts?.reduce(
        (sum, item) => sum + Number(item.total || 0),
        0
      );
      revenue += labourTotal + partsTotal;
    });

    setSummary({
      total_jobs: total,
      pending_jobs: pending,
      completed_jobs: completed,
      today_revenue: revenue, // Now shows real total
      total_customers: customers.length,
    });

    // Show latest 5 jobs
    setRecentJobs(jobs.slice(-5).reverse());
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>

      {/* STAT CARDS - Added colors and Customer card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card title="Total Jobs" value={summary.total_jobs} color="bg-blue-500" />
        <Card title="Pending Jobs" value={summary.pending_jobs} color="bg-yellow-500" />
        <Card title="Closed Jobs" value={summary.completed_jobs} color="bg-green-500" />
        <Card title="Total Revenue (₹)" value={summary.today_revenue} color="bg-purple-500" />
        <Card title="Total Customers" value={summary.total_customers} color="bg-indigo-500" />
      </div>

      {/* RECENT JOBS TABLE */}
      <div className="bg-white rounded shadow overflow-hidden">
        <h2 className="text-lg font-semibold p-4 border-b bg-gray-50">
          Recent Job Cards
        </h2>

        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">RO No</th>
              <th className="p-3 text-left">Customer</th> {/* Added Customer Column */}
              <th className="p-3 text-left">Vehicle</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th> {/* Added Action Column */}
            </tr>
          </thead>

          <tbody>
            {recentJobs.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No Job Cards Found. Create one to get started.
                </td>
              </tr>
            ) : (
              recentJobs.map((job) => (
                <tr key={job.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-semibold text-blue-600">{job.roNumber}</td>
                  <td className="p-3">{job.customerName || "-"}</td>
                  <td className="p-3">{job.registrationNo}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        job.status === "Closed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <Link 
                      to={`/view-ro/${job.id}`}
                      className="text-indigo-600 hover:underline text-xs font-medium"
                    >
                      View Details →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

// Updated Card Component with color support
const Card = ({ title, value, color = "bg-gray-800" }) => (
  <div className={`${color} p-5 rounded-lg shadow text-white`}>
    <p className="text-sm opacity-80">{title}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

export default Dashboard;