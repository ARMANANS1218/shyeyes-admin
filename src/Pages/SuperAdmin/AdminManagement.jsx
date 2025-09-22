import React, { useState } from "react";
import Swal from "sweetalert2";
import {
  FaEye,
  FaEdit,
  FaBan,
  FaTrash,
  FaUnlock,
  FaUserPlus,
} from "react-icons/fa";
import { useGetAllAdminsQuery } from "../../redux/services/adminApi"; // <-- replace with your API hook
import { useCreateAdminMutation } from "../../redux/services/adminApi"; // <-- replace with your API hook
const IMAGEURL = "https://shyeyes-b.onrender.com/uploads";

const AdminManagement = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Fetch admins
  const { data: allAdmins, isLoading, error, refetch } = useGetAllAdminsQuery();

  // Create admin
  const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();

  // Extract admin list from API response
  // const adminList = allAdmins?.admins || [];

  // Helper function to format location
  const formatLocation = (location) => {
    if (typeof location === "string") return location;
    if (typeof location === "object" && location !== null) {
      const { city, country } = location;
      if (city && country) return `${city}, ${country}`;
      if (city) return city;
      if (country) return country;
    }
    return "N/A";
  };

  const handleAddAdmin = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Add New Admin",
      html: `
      <input id="swal-name" class="swal2-input" placeholder="Full Name" />
      <input id="swal-email" class="swal2-input" placeholder="Email" />
      <input id="swal-password" type="password" class="swal2-input" placeholder="Password" />
    `,
      focusConfirm: false,
      preConfirm: () => ({
        name: document.getElementById("swal-name").value,
        email: document.getElementById("swal-email").value,
        password: document.getElementById("swal-password").value,
      }),
      confirmButtonText: "Add Admin",
      showCancelButton: true,
    });

    console.log("formValues: ", formValues);

    if (formValues) {
      try {
        Swal.fire({
          title: "Adding admin...",
          didOpen: () => {
            Swal.showLoading(); // Show loading spinner
          },
          allowOutsideClick: false,
          allowEscapeKey: false,
        });

        const response = await createAdmin(formValues).unwrap();

        Swal.close(); // Close the loading

        Swal.fire({
          icon: "success",
          title: "Success!",
          text:
            response?.message ||
            `${formValues.name} has been added successfully.`,
          timer: 2000,
        }).then(() => {
          refetch();
        });
      } catch (err) {
        Swal.close(); // Close the loading
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text:
            err?.data?.message ||
            err?.error ||
            "Something went wrong while adding admin.",
        });
      }
    }
  };

  // // Loading state
  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen bg-pink-100 p-6 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
  //         <p className="text-pink-600 font-semibold">Loading admins...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // Error state
  // if (error) {
  //   return (
  //     <div className="min-h-screen bg-pink-100 p-6 flex items-center justify-center">
  //       <div className="text-center">
  //         <p className="text-red-600 font-semibold mb-4">
  //           Failed to load admins
  //         </p>
  //         <button
  //           onClick={() => refetch()}
  //           className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
  //         >
  //           Retry
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  // Filtered admins
  // const filteredAdmins = adminList.filter((admin) => {
  //   const adminName = (admin.name || "").toLowerCase();
  //   const adminEmail = (admin.email || "").toLowerCase();
  //   const searchTerm = search.toLowerCase();

  //   const matchesSearch =
  //     adminName.includes(searchTerm) || adminEmail.includes(searchTerm);

  //   const adminStatus =
  //     admin.status || (admin.isActive ? "Active" : "Inactive");
  //   const matchesStatus =
  //     statusFilter === "All" ? true : adminStatus === statusFilter;

  //   return matchesSearch && matchesStatus;
  // });

  return (
    <div className="min-h-screen bg-pink-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-pink-600 flex items-end justify-center gap-2">
          🛠 Manage Admins
          <span className="text-lg font-bold text-gray-600">
            {/* ({adminList.length} total admins) */}
          </span>
        </h2>
        <div className="flex gap-4">
          {/* Add Admin */}
          <button
            onClick={handleAddAdmin}
            disabled={isCreating}
            className={`bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 ${
              isCreating ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isCreating ? (
              "Adding..."
            ) : (
              <>
                <FaUserPlus /> Add Admin
              </>
            )}
          </button>

          {/* Refresh */}
          <button
            onClick={() => refetch()}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
          >
            🔄 Refresh
          </button>

          {/* Search */}
          <input
            type="text"
            placeholder="Search admins..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />

          {/* Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Admin Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-pink-50 rounded-xl shadow-md mt-5">
          <thead>
            <tr className="text-left bg-pink-300 text-black">
              <th className="p-3">Profile</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
};

export default AdminManagement;
