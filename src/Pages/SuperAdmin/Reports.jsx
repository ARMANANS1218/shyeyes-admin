// src/Pages/SuperAdmin/Reports.jsx
import React, { useState } from "react";
import Swal from "sweetalert2";

const UserReports = () => {
  const [reports, setReports] = useState([
    { id: 1, reportedUser: "Mark Thompson", reportedBy: "Alicia", reason: "Harassment in chat", date: "2025-08-03 16:45", status: "Pending", profile: "https://randomuser.me/api/portraits/women/65.jpg" },
    { id: 2, reportedUser: "John Carter", reportedBy: "Sophia", reason: "Spamming in group", date: "2025-08-04 14:20", status: "Pending", profile: "https://randomuser.me/api/portraits/men/70.jpg" },
    { id: 3, reportedUser: "Emily Rose", reportedBy: "David", reason: "Offensive language", date: "2025-08-05 12:10", status: "Pending", profile: "https://randomuser.me/api/portraits/women/50.jpg" },
    { id: 4, reportedUser: "Mark Thompson", reportedBy: "Alicia", reason: "Harassment in chat", date: "2025-08-03 16:45", status: "Pending", profile: "https://randomuser.me/api/portraits/women/65.jpg" },
  ]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("date-desc");

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
    } else if (action === "Edit") {
      Swal.fire({
        title: `Edit Report on ${report.reportedUser}`,
        html: `
          <textarea id="reason" class="swal2-textarea" placeholder="Reason">${report.reason}</textarea>
          <select id="status" class="swal2-select" style="margin-top:10px; width:100%; padding:8px;">
            <option value="Pending" ${report.status === "Pending" ? "selected" : ""}>Pending</option>
            <option value="Blocked" ${report.status === "Blocked" ? "selected" : ""}>Blocked</option>
            <option value="Resolved" ${report.status === "Resolved" ? "selected" : ""}>Resolved</option>
          </select>
        `,
        focusConfirm: false,
        preConfirm: () => {
          const reason = document.getElementById("reason").value.trim();
          const status = document.getElementById("status").value;
          if (!reason) {
            Swal.showValidationMessage("Reason cannot be empty");
            return false;
          }
          return { reason, status };
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const updated = reports.map((r) =>
            r.id === report.id
              ? { ...r, reason: result.value.reason, status: result.value.status }
              : r
          );
          setReports(updated);
          Swal.fire("Saved!", "Report updated successfully.", "success");
        }
      });
    }
  };

  const filteredReports = reports
    .filter((r) => r.reportedUser.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      filter === "date-desc" ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date)
    );

  return (
    <div className="p-6 bg-pink-50 dark:bg-gray-900 min-h-screen transition-colors">
      <h2 className="text-2xl font-bold text-pink-600 dark:text-pink-300 mb-4">🚨 User Reports</h2>

      <div className="flex justify-between mb-4 gap-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
        >
          <option value="date-desc">Filter by Date (Newest)</option>
          <option value="date-asc">Filter by Date (Oldest)</option>
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        {filteredReports.map((report) => (
          <div key={report.id} className="flex items-center gap-4 border-b last:border-b-0 py-3">
            <img src={report.profile} alt={report.reportedUser} className="w-12 h-12 rounded-full object-cover" />
            <div className="flex-1">
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                Reported: {report.reportedUser} <span className="text-sm text-gray-500">by {report.reportedBy}</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Reason: {report.reason}</div>
              <div className="text-xs text-gray-400 dark:text-gray-400">{report.date}</div>
            </div>

            <div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                report.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                report.status === "Blocked" ? "bg-red-100 text-red-800" :
                "bg-green-100 text-green-800"
              }`}>
                {report.status}
              </span>
            </div>

            <div className="flex gap-2">
              <button onClick={() => handleAction("View", report)} className="px-3 py-1 bg-blue-600 text-white rounded">View</button>
              <button onClick={() => handleAction("Edit", report)} className="px-3 py-1 bg-indigo-600 text-white rounded">Edit</button>
              <button onClick={() => handleAction("Block", report)} className="px-3 py-1 bg-orange-500 text-white rounded">Block</button>
              <button onClick={() => handleAction("Delete", report)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserReports;
