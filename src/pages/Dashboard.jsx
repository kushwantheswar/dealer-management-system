import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";

const Dashboard = () => {
  const [summary, setSummary] = useState({
    total_jobs: 0,
    pending_jobs: 0,
    completed_jobs: 0,
    today_revenue: 0,
  });

  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
const jobs = JSON.parse(localStorage.getItem("repairOrders")) || [];

    const total = jobs.length;
    const completed = jobs.filter(
      (j) => j.status === "Completed"
    ).length;
    const pending = total - completed;

    setSummary({
      total_jobs: total,
      pending_jobs: pending,
      completed_jobs: completed,
      today_revenue: total * 1500, // dummy revenue logic
    });

    // Show latest 5 jobs
    setRecentJobs(jobs.slice(-5).reverse());
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card title="Total Jobs" value={summary.total_jobs} />
        <Card title="Pending Jobs" value={summary.pending_jobs} />
        <Card title="Completed Jobs" value={summary.completed_jobs} />
        <Card title="Revenue (₹)" value={summary.today_revenue} />
      </div>

      {/* RECENT JOBS TABLE */}
      <div className="bg-white rounded shadow">
        <h2 className="text-lg font-semibold p-4 border-b">
          Recent Job Cards
        </h2>

        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">RO No</th>
              <th className="p-3 text-left">Vehicle</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {recentJobs.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-4 text-center">
                  No Job Cards Found
                </td>
              </tr>
            ) : (
              recentJobs.map((job) => (
                <tr key={job.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{job.roNumber}</td>
                  <td className="p-3">{job.registrationNo}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        job.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {job.status}
                    </span>
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

const Card = ({ title, value }) => (
  <div className="bg-white p-5 rounded shadow hover:shadow-md transition">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

export default Dashboard;
