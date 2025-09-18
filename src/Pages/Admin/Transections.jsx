import React, { useState } from "react";
import { FaFileExport, FaCreditCard } from "react-icons/fa";

const Payments = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const payments = [
    { id: 1, user: "Ashley Brooke", plan: "Premium", amount: "$29.99", method: "Stripe", date: "Aug 1, 2025", status: "Paid" },
    { id: 2, user: "Jason Roy", plan: "Basic", amount: "$9.99", method: "PayPal", date: "Jul 30, 2025", status: "Failed" },
    { id: 3, user: "Mark Logan", plan: "Standard", amount: "$14.99", method: "Stripe", date: "Jul 25, 2025", status: "Pending" },
    { id: 4, user: "Sophia Hill", plan: "Premium", amount: "$29.99", method: "Credit Card", date: "Jul 22, 2025", status: "Paid" },
    { id: 5, user: "Elena Miles", plan: "Basic", amount: "$9.99", method: "PayPal", date: "Jul 20, 2025", status: "Refunded" },
  ];

  const statusColors = {
    Paid: "bg-green-500",
    Failed: "bg-red-500",
    Pending: "bg-yellow-500",
    Refunded: "bg-gray-500",
  };

  const filteredPayments = payments.filter(
    (p) =>
      p.user.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" || p.status === filter)
  );

  return (
    <div className="p-6 bg-pink-100 min-h-screen">
      {/* Header */}
      <h2
        className="text-2xl md:text-3xl font-bold flex items-center gap-2 mb-6"
        style={{ color: "#ff3366" }}
      >
        <FaCreditCard /> Payments Overview
      </h2>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-teal-400 to-teal-500 text-white p-4 rounded-xl shadow">
          <h3>Total Revenue</h3>
          <p className="text-2xl font-bold">$10,250</p>
        </div>
        <div className="bg-gradient-to-r from-pink-400 to-purple-400 text-white p-4 rounded-xl shadow">
          <h3>Monthly Income</h3>
          <p className="text-2xl font-bold">$2,100</p>
        </div>
        <div className="bg-gradient-to-r from-orange-300 to-pink-400 text-white p-4 rounded-xl shadow">
          <h3>Active Plans</h3>
          <p className="text-2xl font-bold">120</p>
        </div>
        <div className="bg-gradient-to-r from-purple-300 to-blue-300 text-white p-4 rounded-xl shadow">
          <h3>Refunds</h3>
          <p className="text-2xl font-bold">$320</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by user..."
          className="border rounded px-4 py-2 flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border rounded px-4 py-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Paid">Paid</option>
          <option value="Failed">Failed</option>
          <option value="Pending">Pending</option>
          <option value="Refunded">Refunded</option>
        </select>
        <button className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow">
          <FaFileExport /> Export
        </button>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-pink-50">
            <tr>
              <th className="text-left p-3">User</th>
              <th className="text-left p-3">Plan</th>
              <th className="text-left p-3">Amount</th>
              <th className="text-left p-3">Method</th>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="p-3">{p.user}</td>
                <td className="p-3">{p.plan}</td>
                <td className="p-3">{p.amount}</td>
                <td className="p-3">{p.method}</td>
                <td className="p-3">{p.date}</td>
                <td className="p-3">
                  <span
                    className={`${statusColors[p.status]} text-white px-3 py-1 rounded-full text-sm`}
                  >
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;
