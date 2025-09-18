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
      profile:
        "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      id: 2,
      reportedUser: "John Carter",
      reportedBy: "Sophia",
      reason: "Spamming in group",
      date: "2025-08-04 14:20",
      status: "Pending",
      profile:
        "https://randomuser.me/api/portraits/men/70.jpg",
    },
    {
      id: 3,
      reportedUser: "Emily Rose",
      reportedBy: "David",
      reason: "Offensive language",
      date: "2025-08-05 12:10",
      status: "Pending",
      profile:
        "https://randomuser.me/api/portraits/women/50.jpg",
    },

    {
      id: 4,
      reportedUser: "Mark Thompson",
      reportedBy: "Alicia",
      reason: "Harassment in chat",
      date: "2025-08-03 16:45",
      status: "Pending",
      profile:
        "https://randomuser.me/api/portraits/women/65.jpg",
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

  return (
    <div style={{ padding: "20px", backgroundColor: "#ffe6f0", minHeight: "100vh" }}>

      <h2
  style={{
    color: "#ff3366",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "30px", // 👈 size badha diya
  }}
>
  🚨 User Reports
</h2>


      {/* Search and Filter */}
      <div style={{ display: "flex", justifyContent: "space-between", margin: "15px 0", }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            width: "250px",
          }}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        >
          <option value="date-desc">Filter by Date (Newest)</option>
          <option value="date-asc">Filter by Date (Oldest)</option>
        </select>
      </div>

      {/* Reports List */}
      <div
        style={{
          background: "#fff",
          borderRadius: "10px",
          padding: "15px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        {filteredReports.map((report) => (
          <div
            key={report.id}
            style={{
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid #eee",
              padding: "12px 0",
              backgroundColor: "#fafafa",
            }}
          >
            <img
              src={report.profile}
              alt={report.reportedUser}
              style={{ width: "50px", height: "50px", borderRadius: "50%", marginRight: "15px" }}
            />

            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: "bold" }}>
                Reported: {report.reportedUser} by {report.reportedBy}
              </p>
              <p style={{ margin: 0, color: "#666" }}>Reason: {report.reason}</p>
              <small style={{ color: "#888" }}>{report.date}</small>
            </div>

            {/* Status */}
            <span
              style={{
                background:
                  report.status === "Pending"
                    ? "#ffe0b2"
                    : report.status === "Blocked"
                    ? "#ffcdd2"
                    : "#c8e6c9",
                color:
                  report.status === "Pending"
                    ? "#e65100"
                    : report.status === "Blocked"
                    ? "#c62828"
                    : "#2e7d32",
                padding: "5px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                marginRight: "10px",
              }}
            >
              {report.status}
            </span>

            {/* Buttons */}
            <button
              onClick={() => handleAction("View", report)}
              style={{
                background: "#42a5f5",
                color: "#fff",
                border: "none",
                padding: "6px 12px",
                borderRadius: "5px",
                marginRight: "8px",
                cursor: "pointer",
              }}
            >
              View
            </button>
            <button
              onClick={() => handleAction("Block", report)}
              style={{
                background: "#ff9800",
                color: "#fff",
                border: "none",
                padding: "6px 12px",
                borderRadius: "5px",
                marginRight: "8px",
                cursor: "pointer",
              }}
            >
              Block
            </button>
            <button
              onClick={() => handleAction("Delete", report)}
              style={{
                background: "#e53935",
                color: "#fff",
                border: "none",
                padding: "6px 12px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserReports;