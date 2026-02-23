import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout"; // Adjust path if needed

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("customers")) || [];
    setCustomers(data);
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.mobile?.includes(search) ||
      c.vehicles?.some(v => v.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Customer List</h1>
          <input
            type="text"
            placeholder="Search by Name, Mobile, or Vehicle..."
            className="border p-2 rounded text-sm w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Mobile</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Vehicles</th>
                <th className="p-3 text-left">Last Visit</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-semibold">{cust.name}</td>
                    <td className="p-3">
                        <a href={`tel:${cust.mobile}`} className="text-blue-600 hover:underline">{cust.mobile}</a>
                    </td>
                    <td className="p-3">
                        <a href={`mailto:${cust.email}`} className="text-blue-600 hover:underline">{cust.email || "-"}</a>
                    </td>
                    <td className="p-3">{cust.vehicles?.join(", ")}</td>
                    <td className="p-3">{cust.lastVisit}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-gray-500">
                    No customers found.
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