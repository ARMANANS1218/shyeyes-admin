import React, { useState } from "react";
import { FaFileExport, FaCreditCard, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";

const Transactions = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [cards, setCards] = useState({
    revenue: 10250,
    monthlyIncome: 2100,
    activePlans: 120,
    refunds: 320,
  });

  const [paymentData, setPaymentData] = useState([
    { id: 1, user: "Ashley Brooke", plan: "Premium", amount: "$29.99", method: "Stripe", date: "Aug 1, 2025", status: "Paid" },
    { id: 2, user: "Jason Roy", plan: "Basic", amount: "$9.99", method: "PayPal", date: "Jul 30, 2025", status: "Failed" },
    { id: 3, user: "Mark Logan", plan: "Standard", amount: "$14.99", method: "Stripe", date: "Jul 25, 2025", status: "Pending" },
    { id: 4, user: "Sophia Hill", plan: "Premium", amount: "$29.99", method: "Credit Card", date: "Jul 22, 2025", status: "Paid" },
    { id: 5, user: "Elena Miles", plan: "Basic", amount: "$9.99", method: "PayPal", date: "Jul 20, 2025", status: "Refunded" },
  ]);

  const statusColors = {
    Paid: "bg-green-500",
    Failed: "bg-red-500",
    Pending: "bg-yellow-500",
    Refunded: "bg-gray-500",
  };

  const filteredPayments = paymentData.filter(
    (p) =>
      p.user.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" || p.status === filter)
  );

  // Edit payment
  const handleEdit = (payment) => {
    Swal.fire({
      title: "Edit Payment",
      html: `
        <input id="swal-user" class="swal2-input" placeholder="User" value="${payment.user}">
        <input id="swal-plan" class="swal2-input" placeholder="Plan" value="${payment.plan}">
        <input id="swal-amount" class="swal2-input" placeholder="Amount" value="${payment.amount}">
        <input id="swal-method" class="swal2-input" placeholder="Method" value="${payment.method}">
        <input id="swal-date" class="swal2-input" placeholder="Date" value="${payment.date}">
        <select id="swal-status" class="swal2-input">
          <option value="Paid" ${payment.status === "Paid" ? "selected" : ""}>Paid</option>
          <option value="Failed" ${payment.status === "Failed" ? "selected" : ""}>Failed</option>
          <option value="Pending" ${payment.status === "Pending" ? "selected" : ""}>Pending</option>
          <option value="Refunded" ${payment.status === "Refunded" ? "selected" : ""}>Refunded</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Update",
      preConfirm: () => {
        const updated = {
          user: document.getElementById("swal-user").value,
          plan: document.getElementById("swal-plan").value,
          amount: document.getElementById("swal-amount").value,
          method: document.getElementById("swal-method").value,
          date: document.getElementById("swal-date").value,
          status: document.getElementById("swal-status").value,
        };

        if (!updated.user || !updated.plan || !updated.amount || !updated.method || !updated.date) {
          Swal.showValidationMessage("All fields are required");
          return false;
        }

        return updated;
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        setPaymentData((prev) =>
          prev.map((p) =>
            p.id === payment.id ? { ...p, ...result.value } : p
          )
        );
        Swal.fire("Success!", "Payment updated successfully.", "success");
      }
    });
  };

  // Edit summary cards
  const handleCardEdit = (key, title, currentValue) => {
    Swal.fire({
      title: `Edit ${title}`,
      input: "number",
      inputValue: currentValue,
      inputAttributes: { min: 0 },
      showCancelButton: true,
      confirmButtonText: "Update",
      preConfirm: (value) => {
        if (!value || isNaN(value)) {
          Swal.showValidationMessage("Please enter a valid number");
          return false;
        }
        return value;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setCards((prev) => ({ ...prev, [key]: result.value }));
        Swal.fire("Updated!", `${title} has been updated.`, "success");
      }
    });
  };

  return (
    <div className="p-6 bg-pink-100 dark:bg-gray-900 min-h-screen transition-colors">
      <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2 mb-6 text-pink-600 dark:text-pink-400">
        <FaCreditCard /> Transactions Overview
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Revenue */}
        <div className="bg-gradient-to-r from-teal-400 to-teal-500 text-white p-4 rounded-xl shadow relative">
          <button
            className="absolute top-2 right-2 text-white hover:text-gray-200"
            onClick={() => handleCardEdit("revenue", "Total Revenue", cards.revenue)}
          >
            <FaEdit />
          </button>
          <h3>Total Revenue</h3>
          <p className="text-2xl font-bold">${cards.revenue}</p>
        </div>

        {/* Monthly Income */}
        <div className="bg-gradient-to-r from-pink-400 to-purple-400 text-white p-4 rounded-xl shadow relative">
          <button
            className="absolute top-2 right-2 text-white hover:text-gray-200"
            onClick={() => handleCardEdit("monthlyIncome", "Monthly Income", cards.monthlyIncome)}
          >
            <FaEdit />
          </button>
          <h3>Monthly Income</h3>
          <p className="text-2xl font-bold">${cards.monthlyIncome}</p>
        </div>

        {/* Active Plans */}
        <div className="bg-gradient-to-r from-orange-300 to-pink-400 text-white p-4 rounded-xl shadow relative">
          <button
            className="absolute top-2 right-2 text-white hover:text-gray-200"
            onClick={() => handleCardEdit("activePlans", "Active Plans", cards.activePlans)}
          >
            <FaEdit />
          </button>
          <h3>Active Plans</h3>
          <p className="text-2xl font-bold">{cards.activePlans}</p>
        </div>

        {/* Refunds */}
        <div className="bg-gradient-to-r from-purple-300 to-blue-300 text-white p-4 rounded-xl shadow relative">
          <button
            className="absolute top-2 right-2 text-white hover:text-gray-200"
            onClick={() => handleCardEdit("refunds", "Refunds", cards.refunds)}
          >
            <FaEdit />
          </button>
          <h3>Refunds</h3>
          <p className="text-2xl font-bold">${cards.refunds}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by user..."
          className="border rounded px-4 py-2 flex-1 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border rounded px-4 py-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Paid">Paid</option>
          <option value="Failed">Failed</option>
          <option value="Pending">Pending</option>
          <option value="Refunded">Refunded</option>
        </select>
        <button className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700">
          <FaFileExport /> Export
        </button>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead
            className="text-white"
            style={{
              backgroundImage: "linear-gradient(-225deg, #B6CEE8 0%, #F578DC 100%)",
            }}
          >
            <tr>
              <th className="text-left p-3">User</th>
              <th className="text-left p-3">Plan</th>
              <th className="text-left p-3">Amount</th>
              <th className="text-left p-3">Method</th>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((p) => (
              <tr key={p.id} className="border-b dark:border-gray-700 hover:bg-pink-50 dark:hover:bg-gray-700">
                <td className="p-3 dark:text-gray-200">{p.user}</td>
                <td className="p-3 dark:text-gray-200">{p.plan}</td>
                <td className="p-3 dark:text-gray-200">{p.amount}</td>
                <td className="p-3 dark:text-gray-200">{p.method}</td>
                <td className="p-3 dark:text-gray-200">{p.date}</td>
                <td className="p-3">
                  <span
                    className={`${statusColors[p.status]} text-white px-3 py-1 rounded-full text-sm`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    className="text-pink-600 hover:text-pink-800 dark:text-pink-400 dark:hover:text-pink-300"
                    onClick={() => handleEdit(p)}
                    title="Edit Payment"
                  >
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
