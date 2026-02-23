import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ITEMS_PER_PAGE = 5;

const JobCardList = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [editingJob, setEditingJob] = useState(null);

  useEffect(() => {
    const data =
      JSON.parse(localStorage.getItem("repairOrders")) || [];
    setJobs(data);
    setFilteredJobs(data);
  }, []);

  useEffect(() => {
    let data = [...jobs];

    if (search) {
      data = data.filter(
        (job) =>
          job.registrationNo?.toLowerCase().includes(search.toLowerCase()) ||
          job.customerName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter) {
      data = data.filter((job) => job.status === statusFilter);
    }

    setFilteredJobs(data);
    setCurrentPage(1);
  }, [search, statusFilter, jobs]);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this job?")) return;

    const updated = jobs.filter((job) => job.id !== id);
    localStorage.setItem("repairOrders", JSON.stringify(updated));
    setJobs(updated);
  };

  const handleUpdate = () => {
    const updated = jobs.map((job) =>
      job.id === editingJob.id ? editingJob : job
    );

    localStorage.setItem("repairOrders", JSON.stringify(updated));
    setJobs(updated);
    setEditingJob(null);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(jobs);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "JobCards");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(fileData, "JobCards.xlsx");
  };

  const totalPages = Math.ceil(
    filteredJobs.length / ITEMS_PER_PAGE
  );

  const paginatedData = filteredJobs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">
        Job Card List
      </h1>

      {/* SEARCH + FILTER + EXPORT */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search vehicle or customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Status</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <button
          onClick={exportToExcel}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Export Excel
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white p-6 rounded shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">RO</th>
              <th className="p-3 text-left">Vehicle</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((job) => (
              <tr key={job.id} className="border-t">
                <td className="p-3">{job.roNumber}</td>
                <td className="p-3">{job.registrationNo}</td>
                <td className="p-3">{job.customerName}</td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      job.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : job.status === "In Progress"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {job.status}
                  </span>
                </td>

                <td className="p-3 space-x-2">
                  <button
                    onClick={() => setEditingJob(job)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(job.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {editingJob && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="font-bold mb-4">
              Edit Job Card
            </h2>

            <input
              name="registrationNo"
              value={editingJob.registrationNo}
              onChange={(e) =>
                setEditingJob({
                  ...editingJob,
                  registrationNo: e.target.value,
                })
              }
              className="border w-full mb-3 p-2 rounded"
            />

            <input
              name="customerName"
              value={editingJob.customerName}
              onChange={(e) =>
                setEditingJob({
                  ...editingJob,
                  customerName: e.target.value,
                })
              }
              className="border w-full mb-3 p-2 rounded"
            />

            <select
              name="status"
              value={editingJob.status}
              onChange={(e) =>
                setEditingJob({
                  ...editingJob,
                  status: e.target.value,
                })
              }
              className="border w-full mb-4 p-2 rounded"
            >
              <option>Open</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingJob(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default JobCardList;
