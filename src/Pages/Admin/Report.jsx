import React, { useState } from "react";
import Swal from "sweetalert2";

const UserReports = () => {
  const [reports, setReports] = useState([
    {
      id: 1,
      reportedUser: "Mark Thompson",
      reportedBy: "Alicia",
      reason: "Harassment in chat",
      date: "2025-08-03 16:45",
      status: "Pending",
      profile: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      id: 2,
      reportedUser: "John Carter",
      reportedBy: "Sophia",
      reason: "Spamming in group",
      date: "2025-08-04 14:20",
      status: "Pending",
      profile: "https://randomuser.me/api/portraits/men/70.jpg",
    },
    {
      id: 3,
      reportedUser: "Emily Rose",
      reportedBy: "David",
      reason: "Offensive language",
      date: "2025-08-05 12:10",
      status: "Pending",
      profile: "https://randomuser.me/api/portraits/women/50.jpg",
    },
    {
      id: 4,
      reportedUser: "Mark Thompson",
      reportedBy: "Alicia",
      reason: "Harassment in chat",
      date: "2025-08-03 16:45",
      status: "Pending",
      profile: "https://randomuser.me/api/portraits/women/65.jpg",
    },
  ]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("date-desc");

  // Handle actions
  const handleAction = (action, report) => {
    if (action === "View") {
      Swal.fire({
        title: `Report Details`,
        html: `
          <div style="text-align:left;">
            <p><b>Reported User:</b> ${report.reportedUser}</p>
            <p><b>Reported By:</b> ${report.reportedBy}</p>
            <p><b>Reason:</b> ${report.reason}</p>
            <p><b>Date:</b> ${report.date}</p>
            <p><b>Status:</b> ${report.status}</p>
          </div>
        `,
        confirmButtonText: "Close",
      });
    } else if (action === "Block") {
      Swal.fire({
        title: "Block User?",
        text: `Do you want to block ${report.reportedUser}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Block",
      }).then((result) => {
        if (result.isConfirmed) {
          const updated = reports.map((r) =>
            r.id === report.id ? { ...r, status: "Blocked" } : r
          );
          setReports(updated);
          Swal.fire("Blocked!", `${report.reportedUser} is blocked.`, "success");
        }
      });
    } else if (action === "Delete") {
      Swal.fire({
        title: "Delete Report?",
        text: `Do you want to delete this report on ${report.reportedUser}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Delete",
      }).then((result) => {
        if (result.isConfirmed) {
          const updated = reports.filter((r) => r.id !== report.id);
          setReports(updated);
          Swal.fire("Deleted!", "The report has been removed.", "success");
        }
      });
    }
  };

  // Filtered + searched reports
  const filteredReports = reports
    .filter((r) =>
      r.reportedUser.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      filter === "date-desc"
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date)
    );

  // Helper: status pill classes (light + dark)
  const statusClasses = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "Blocked":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "Resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div className="p-6 min-h-screen bg-pink-50 dark:bg-gray-900 transition-colors">
      <div className="mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-pink-600 dark:text-pink-300 flex items-center gap-2">
          🚨 User Reports
        </h2>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-64 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="date-desc">Filter by Date (Newest)</option>
          <option value="date-asc">Filter by Date (Oldest)</option>
        </select>
      </div>

      {/* Reports List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="flex items-center gap-4 py-3 border-b last:border-b-0 border-gray-100 dark:border-gray-700"
          >
            <img
              src={report.profile}
              alt={report.reportedUser}
              className="w-12 h-12 rounded-full object-cover"
            />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                Reported: {report.reportedUser} <span className="text-gray-500 dark:text-gray-400">by {report.reportedBy}</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 truncate">Reason: {report.reason}</p>
              <small className="text-xs text-gray-500 dark:text-gray-400">{report.date}</small>
            </div>

            {/* Status */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${statusClasses(report.status)}`}
            >
              {report.status}
            </span>

            {/* Buttons */}
            <div className="flex items-center gap-2 ml-2">
              <button
                onClick={() => handleAction("View", report)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
              >
                View
              </button>

              <button
                onClick={() => handleAction("Block", report)}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-sm transition-colors"
              >
                Block
              </button>

              <button
                onClick={() => handleAction("Delete", report)}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {filteredReports.length === 0 && (
          <div className="py-8 text-center text-gray-600 dark:text-gray-300">
            No reports found.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReports;
