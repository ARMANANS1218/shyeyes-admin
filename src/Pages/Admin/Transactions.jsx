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
    Paid: "bg-green-500 dark:bg-green-400",
    Failed: "bg-red-500 dark:bg-red-400",
    Pending: "bg-yellow-500 dark:bg-yellow-400",
    Refunded: "bg-gray-500 dark:bg-gray-400",
  };

  const filteredPayments = payments.filter(
    (p) =>
      p.user.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" || p.status === filter)
  );

  return (
    <div className="p-6 min-h-screen bg-pink-100 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-pink-600 dark:text-pink-300">
          <FaCreditCard /> <span>Payments Overview</span>
        </h2>

        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow"
            title="Export"
            onClick={() => {
              // placeholder for export logic
              const csv = [
                ["User", "Plan", "Amount", "Method", "Date", "Status"],
                ...payments.map(p => [p.user, p.plan, p.amount, p.method, p.date, p.status]),
              ].map(r => r.join(",")).join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `payments_${new Date().toISOString().slice(0,10)}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <FaFileExport /> Export
          </button>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="text-white p-4 rounded-xl shadow relative overflow-hidden"
             style={{ background: "linear-gradient(90deg,#2dd4bf,#06b6d4)" }}>
          <h3 className="text-sm font-medium">Total Revenue</h3>
          <p className="text-2xl font-bold">$10,250</p>
        </div>

        <div className="text-white p-4 rounded-xl shadow relative overflow-hidden"
             style={{ background: "linear-gradient(90deg,#f472b6,#7c3aed)" }}>
          <h3 className="text-sm font-medium">Monthly Income</h3>
          <p className="text-2xl font-bold">$2,100</p>
        </div>

        <div className="text-white p-4 rounded-xl shadow relative overflow-hidden"
             style={{ background: "linear-gradient(90deg,#fb923c,#fb7185)" }}>
          <h3 className="text-sm font-medium">Active Plans</h3>
          <p className="text-2xl font-bold">120</p>
        </div>

        <div className="text-white p-4 rounded-xl shadow relative overflow-hidden"
             style={{ background: "linear-gradient(90deg,#a78bfa,#60a5fa)" }}>
          <h3 className="text-sm font-medium">Refunds</h3>
          <p className="text-2xl font-bold">$320</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by user..."
          className="w-full md:flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Paid">Paid</option>
          <option value="Failed">Failed</option>
          <option value="Pending">Pending</option>
          <option value="Refunded">Refunded</option>
        </select>

        <button
          className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg shadow"
          onClick={() => {
            // simple client-side quick export
            const filtered = filteredPayments;
            const csv = [
              ["User", "Plan", "Amount", "Method", "Date", "Status"],
              ...filtered.map(p => [p.user, p.plan, p.amount, p.method, p.date, p.status]),
            ].map(r => r.join(",")).join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `payments_filtered_${new Date().toISOString().slice(0,10)}.csv`;
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          <FaFileExport /> Export
        </button>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-pink-50 dark:bg-gray-700">
            <tr>
              <th className="text-left p-3 text-sm dark:text-gray-100">User</th>
              <th className="text-left p-3 text-sm dark:text-gray-100">Plan</th>
              <th className="text-left p-3 text-sm dark:text-gray-100">Amount</th>
              <th className="text-left p-3 text-sm dark:text-gray-100">Method</th>
              <th className="text-left p-3 text-sm dark:text-gray-100">Date</th>
              <th className="text-left p-3 text-sm dark:text-gray-100">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((p) => (
              <tr key={p.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-pink-50 dark:hover:bg-gray-700">
                <td className="p-3 text-gray-800 dark:text-gray-100">{p.user}</td>
                <td className="p-3 text-gray-700 dark:text-gray-300">{p.plan}</td>
                <td className="p-3 text-gray-700 dark:text-gray-300">{p.amount}</td>
                <td className="p-3 text-gray-700 dark:text-gray-300">{p.method}</td>
                <td className="p-3 text-gray-700 dark:text-gray-300">{p.date}</td>
                <td className="p-3">
                  <span className={`${statusColors[p.status]} text-white px-3 py-1 rounded-full text-sm`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}

            {filteredPayments.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-600 dark:text-gray-300">
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;
