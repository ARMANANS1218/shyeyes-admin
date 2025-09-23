import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slice/authSlice";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Swal from "sweetalert2";
import {
  FaEye,
  FaEdit,
  FaBan,
  FaTrash,
  FaUnlock,
  FaUserPlus,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { 
  useGetAllAdminsBySuperAdminQuery,
  useUpdateAdminMutation,
  useBanAdminMutation,
  useUnbanAdminMutation,
  useDeleteAdminMutation,
  useCreateAdminMutation 
} from "../../redux/services/adminApi";
const IMAGEURL = "https://shyeyes-b.onrender.com/uploads";

const AdminManagement = () => {
  useDocumentTitle("Admin Management"); // This will set the title as "Admin Management - SuperAdmin Dashboard | ShyEyes"
  
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Reset to first page when search changes
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [search]);

  // Keyboard shortcut for search focus
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]');
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch admins using SuperAdmin endpoint with pagination and search
  const { data: allAdmins, isLoading, error, refetch } = useGetAllAdminsBySuperAdminQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch,
    status: statusFilter
  });

  // Mutation hooks
  const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();
  const [updateAdmin, { isLoading: isUpdating }] = useUpdateAdminMutation();
  const [banAdmin, { isLoading: isBanning }] = useBanAdminMutation();
  const [unbanAdmin, { isLoading: isUnbanning }] = useUnbanAdminMutation();
  const [deleteAdmin, { isLoading: isDeleting }] = useDeleteAdminMutation();

  // Extract admin list from API response
  const adminList = allAdmins?.data?.admins || [];
  const pagination = allAdmins?.data?.pagination || {};

  // Debug: Log the API response
  console.log("API Response:", allAdmins);
  console.log("Admin List:", adminList);
  console.log("Pagination:", pagination);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    // Page reset will be handled by useEffect when debouncedSearch changes
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Clear search
  const handleClearSearch = () => {
    setSearch("");
    setCurrentPage(1);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-pink-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-pink-600 font-semibold">Loading admins...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-pink-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-4">
            Failed to load admins: {error?.data?.message || error?.message || 'Unknown error'}
          </p>
          <button
            onClick={() => refetch()}
            className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // For server-side pagination, we use all admins returned by the API
  // Client-side filtering will be replaced with API-side filtering in the future
  const filteredAdmins = adminList;

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

  // Helper function to handle view admin
  const handleViewAdmin = (admin) => {
    const statusColor = admin.status === 'Active' ? '#10B981' : 
                       admin.status === 'Banned' ? '#EF4444' : '#6B7280';
    
    Swal.fire({
      title: `<div style="color: #ec4899;">👤 Admin Details</div>`,
      html: `
        <div style="text-align: left; padding: 20px;">
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h3 style="margin: 0 0 10px 0; color: #374151;">Personal Information</h3>
            <p><strong>Name:</strong> ${admin.name || 'N/A'}</p>
            <p><strong>Email:</strong> ${admin.email || 'N/A'}</p>
            <p><strong>Role:</strong> <span style="background: #e0e7ff; color: #3730a3; padding: 2px 8px; border-radius: 4px;">Admin</span></p>
          </div>
          
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h3 style="margin: 0 0 10px 0; color: #374151;">System Information</h3>
            <p><strong>Status:</strong> <span style="background: ${statusColor}20; color: ${statusColor}; padding: 2px 8px; border-radius: 4px;">${admin.status || 'Inactive'}</span></p>
          </div>
          
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px;">
            <h3 style="margin: 0 0 10px 0; color: #374151;">Account Details</h3>
            <p><strong>Created:</strong> ${admin.createdAt ? new Date(admin.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : 'N/A'}</p>
            <p><strong>Last Updated:</strong> ${admin.updatedAt ? new Date(admin.updatedAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : 'N/A'}</p>
            <p><strong>Admin ID:</strong> <code style="background: #e5e7eb; padding: 2px 4px; border-radius: 3px; font-size: 12px;">${admin._id || 'N/A'}</code></p>
          </div>
        </div>
      `,
      confirmButtonText: "Close",
      confirmButtonColor: "#ec4899",
      width: 600,
      showCloseButton: true
    });
  };

  // Helper function to handle edit admin
  const handleEditAdmin = async (admin) => {
    const { value: formValues } = await Swal.fire({
      title: `<div style="color: #ec4899;">✏️ Edit Admin - ${admin.name}</div>`,
      html: `
        <div style="text-align: left;">
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Name</label>
            <input id="edit-name" class="swal2-input" value="${admin.name || ''}" placeholder="Full Name" style="margin: 0; width: 100%;" />
          </div>
          
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Email</label>
            <input id="edit-email" class="swal2-input" value="${admin.email || ''}" placeholder="Email Address" style="margin: 0; width: 100%;" />
          </div>

          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Role</label>
            <input id="edit-role" class="swal2-input" value="admin" readonly style="margin: 0; width: 100%; background-color: #f3f4f6; cursor: not-allowed;" />
          </div>
        </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const name = document.getElementById('edit-name').value;
        const email = document.getElementById('edit-email').value;
        // Note: privileges and tasks are shown for reference but not sent to backend yet
        
        if (!name || !email) {
          Swal.showValidationMessage('Name and Email are required');
          return false;
        }

        // Currently only name and email are supported by the backend
        // TODO: Add support for privileges and assignedTasks in backend
        
        return {
          name: name.trim(),
          email: email.trim()
          // Note: privileges and assignedTasks are not sent to backend as it doesn't support them yet
          // role is always "admin" and handled by backend
        };
      },
      confirmButtonText: isUpdating ? "Updating..." : "Update Admin",
      confirmButtonColor: "#ec4899",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      width: 500,
      allowOutsideClick: !isUpdating,
      allowEscapeKey: !isUpdating
    });

    if (formValues) {
      try {
        const response = await updateAdmin({
          adminId: admin._id,
          adminData: formValues
        }).unwrap();

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: response?.message || `${formValues.name} has been updated successfully.`,
          timer: 2000,
          confirmButtonColor: "#ec4899"
        });

        refetch(); // Refresh the admin list
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Update Failed!",
          text: err?.data?.message || err?.error || "Something went wrong while updating admin.",
          confirmButtonColor: "#ef4444"
        });
      }
    }
  };

  // Helper function to handle ban/unban admin
  const handleToggleBan = async (admin) => {
    const isActive = admin.status === "Active";
    const isBanned = admin.status === "Banned";
    
    let action, actionText, confirmColor, successTitle;
    
    if (isActive) {
      action = "ban";
      actionText = "ban";
      confirmColor = "#ef4444";
      successTitle = "Admin Banned!";
    } else if (isBanned) {
      action = "unban";
      actionText = "unban";
      confirmColor = "#10b981";
      successTitle = "Admin Unbanned!";
    } else {
      // For inactive users, we'll activate them
      action = "unban";
      actionText = "activate";
      confirmColor = "#10b981";
      successTitle = "Admin Activated!";
    }

    const result = await Swal.fire({
      title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Admin`,
      html: `
        <div style="text-align: center;">
          <p style="margin-bottom: 15px;">Are you sure you want to <strong>${actionText}</strong> this admin?</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="margin: 5px 0;"><strong>Name:</strong> ${admin.name}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${admin.email}</p>
            <p style="margin: 5px 0;"><strong>Current Status:</strong> <span style="color: ${isActive ? '#10b981' : isBanned ? '#ef4444' : '#6b7280'};">${admin.status}</span></p>
          </div>
          ${action === 'ban' ? `
            <div style="margin: 15px 0;">
              <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #374151;">Reason for banning:</label>
              <input id="ban-reason" type="text" placeholder="Enter reason for banning..." 
                     value="Policy violation - banned by super admin"
                     style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px;" />
            </div>
          ` : ''}
          <p style="color: #6b7280; font-size: 14px;">This action ${actionText === 'ban' ? 'will revoke' : 'will restore'} the admin's access to the system.</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionText}!`,
      confirmButtonColor: confirmColor,
      cancelButtonText: "Cancel",
      reverseButtons: true,
      allowOutsideClick: !isBanning && !isUnbanning,
      preConfirm: () => {
        if (action === 'ban') {
          const reason = document.getElementById('ban-reason')?.value?.trim();
          if (!reason) {
            Swal.showValidationMessage('Please provide a reason for banning');
            return false;
          }
          return { reason };
        }
        return true;
      }
    });

    if (result.isConfirmed) {
      try {
        let response;
        if (action === "ban") {
          const reason = result.value?.reason || "Policy violation - banned by super admin";
          response = await banAdmin({ 
            adminId: admin._id, 
            reason: reason
          }).unwrap();
        } else {
          response = await unbanAdmin(admin._id).unwrap();
        }

        Swal.fire({
          icon: "success",
          title: successTitle,
          html: `
            <p>${response?.message || `${admin.name} has been ${actionText}ned successfully.`}</p>
            <p style="color: #6b7280; font-size: 14px; margin-top: 10px;">The admin list will be refreshed automatically.</p>
            ${action === "ban" && admin._id === currentUser?._id ? 
              '<p style="color: #ef4444; font-weight: bold; margin-top: 15px;">⚠️ You have banned yourself! You will be logged out shortly.</p>' : 
              ''}
          `,
          timer: action === "ban" && admin._id === currentUser?._id ? 2000 : 3000,
          confirmButtonColor: "#ec4899"
        });

        // If the current user banned themselves, log them out
        if (action === "ban" && admin._id === currentUser?._id) {
          setTimeout(() => {
            dispatch(logout());
            localStorage.removeItem("auth");
            window.location.href = "/login";
          }, 2000);
        }

        refetch(); // Refresh the admin list
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Failed!`,
          text: err?.data?.message || err?.error || `Something went wrong while trying to ${actionText} the admin.`,
          confirmButtonColor: "#ef4444"
        });
      }
    }
  };

  // Helper function to handle delete admin
  const handleDeleteAdmin = async (admin) => {
    const result = await Swal.fire({
      title: `<div style="color: #ef4444;">⚠️ Delete Admin</div>`,
      html: `
        <div style="text-align: center;">
          <p style="margin-bottom: 15px; color: #ef4444; font-weight: bold;">This action cannot be undone!</p>
          <p style="margin-bottom: 15px;">Are you sure you want to permanently delete this admin?</p>
          
          <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Name:</strong> ${admin.name}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${admin.email}</p>
            <p style="margin: 5px 0;"><strong>Role:</strong> ${admin.role}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> ${admin.status}</p>
          </div>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 6px; margin: 15px 0;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              <strong>Warning:</strong> All data associated with this admin will be permanently removed from the system.
            </p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">To confirm deletion, please type the admin's name below:</p>
          <input id="delete-confirm" placeholder="Enter admin name to confirm" style="margin-top: 10px; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; width: 100%;" />
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: isDeleting ? "Deleting..." : "Yes, Delete Forever!",
      confirmButtonColor: "#ef4444",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      allowOutsideClick: !isDeleting,
      allowEscapeKey: !isDeleting,
      preConfirm: () => {
        const confirmation = document.getElementById('delete-confirm').value;
        if (confirmation !== admin.name) {
          Swal.showValidationMessage('Please enter the exact admin name to confirm deletion');
          return false;
        }
        return true;
      }
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteAdmin(admin._id).unwrap();

        Swal.fire({
          icon: "success",
          title: "Admin Deleted!",
          html: `
            <p>${response?.message || `${admin.name} has been permanently deleted.`}</p>
            <p style="color: #6b7280; font-size: 14px; margin-top: 10px;">The admin list will be refreshed automatically.</p>
          `,
          timer: 3000,
          confirmButtonColor: "#ec4899"
        });

        refetch(); // Refresh the admin list
        
        // Reset to first page if current page becomes empty
        if (adminList.length === 1 && currentPage > 1) {
          setCurrentPage(1);
        }
      } catch (err) {
        const errorMessage = err?.data?.message || err?.error || "Something went wrong while trying to delete the admin.";
        
        // Handle specific "already deleted" case
        if (errorMessage.includes("already deleted")) {
          Swal.fire({
            icon: "info",
            title: "Admin Already Deleted",
            html: `
              <p>This admin has already been deleted from the system.</p>
              <p style="color: #6b7280; font-size: 14px; margin-top: 10px;">The admin list will be refreshed to reflect current data.</p>
            `,
            confirmButtonColor: "#ec4899"
          });
          refetch(); // Refresh to update the list
        } else {
          Swal.fire({
            icon: "error",
            title: "Delete Failed!",
            text: errorMessage,
            confirmButtonColor: "#ef4444"
          });
        }
      }
    }
  };





  return (
    <div className="min-h-screen bg-pink-100 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-pink-600 flex items-end justify-center gap-2">
              🛠 Manage Admins
              <span className="text-lg font-bold text-gray-600">
                ({pagination.totalAdmins || adminList.length} total admins)
              </span>
            </h2>
            {debouncedSearch && (
              <p className="text-sm text-gray-600 mt-1">
                Search results for: "<span className="font-medium">{debouncedSearch}</span>"
                {statusFilter !== "All" && (
                  <span> • Status: <span className="font-medium">{statusFilter}</span></span>
                )}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end">
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

          {/* Enhanced Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email... (Ctrl+K)"
              value={search}
              onChange={handleSearchChange}
              className="pl-10 pr-10 py-2 w-64 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            {search && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <FaTimes className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
            {debouncedSearch !== search && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-600"></div>
              </div>
            )}
          </div>

          {/* Filter */}
          <select
            value={statusFilter}
            onChange={handleFilterChange}
            className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Banned">Banned</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        </div>
      </div>

      {/* Admin Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-pink-50 rounded-xl shadow-md mt-5 min-h-[500px]">
          <thead>
            <tr className="text-left bg-pink-300 text-black">
              <th className="p-3">Profile</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="min-h-[400px]">
            {filteredAdmins.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-8 text-gray-500">
                  {debouncedSearch ? (
                    <div>
                      <p className="text-lg mb-2">No admins found for "{debouncedSearch}"</p>
                      <p className="text-sm">Try adjusting your search terms or clear the search to see all admins.</p>
                      <button
                        onClick={handleClearSearch}
                        className="mt-3 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                      >
                        Clear Search
                      </button>
                    </div>
                  ) : statusFilter !== "All" ? (
                    <div>
                      <p className="text-lg mb-2">No {statusFilter.toLowerCase()} admins found</p>
                      <p className="text-sm">Try selecting a different status filter.</p>
                    </div>
                  ) : (
                    <p className="text-lg">No admins found</p>
                  )}
                </td>
              </tr>
            ) : (
              filteredAdmins.map((admin) => (
                <tr key={admin._id || admin.id} className="border-b border-pink-200 hover:bg-pink-100 h-16">
                  <td className="p-3 align-middle">
                    <img
                      src={admin.profilePicture ? `${IMAGEURL}/${admin.profilePicture}` : "https://via.placeholder.com/40x40/ec4899/ffffff?text=A"}
                      alt={admin.name || "Admin"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="p-3 font-medium align-middle">{admin.name || "N/A"}</td>
                  <td className="p-3 align-middle">{admin.email || "N/A"}</td>
                  <td className="p-3 align-middle">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
                      {admin.role || "Admin"}
                    </span>
                  </td>
                  <td className="p-3 align-middle">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      admin.status === "Active"
                        ? "bg-green-100 text-green-800" 
                        : admin.status === "Banned"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {admin.status || "Inactive"}
                    </span>
                  </td>
                  <td className="p-3 align-middle">
                    {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="p-3 align-middle">
                    <div className="flex gap-2">
                      {/* View */}
                      <button
                        onClick={() => handleViewAdmin(admin)}
                        className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      
                      {/* Edit */}
                      <button
                        onClick={() => handleEditAdmin(admin)}
                        className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
                        title="Edit Admin"
                      >
                        <FaEdit />
                      </button>
                      
                      {/* Ban/Unban */}
                      {admin.status === "Active" ? (
                        <button
                          onClick={() => handleToggleBan(admin)}
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                          title="Ban Admin"
                        >
                          <FaBan />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleBan(admin)}
                          className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors"
                          title="Unban Admin"
                        >
                          <FaUnlock />
                        </button>
                      )}
                      
                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteAdmin(admin)}
                        className="bg-pink-400 text-white p-2 rounded-full hover:bg-pink-500 transition-colors"
                        title="Delete Admin"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              )).concat(
                // Add empty rows to maintain consistent table height
                Array.from({ length: Math.max(0, itemsPerPage - filteredAdmins.length) }, (_, index) => (
                  <tr key={`empty-${index}`} className="border-b border-pink-200 h-16">
                    <td className="p-3 align-middle">&nbsp;</td>
                    <td className="p-3 align-middle">&nbsp;</td>
                    <td className="p-3 align-middle">&nbsp;</td>
                    <td className="p-3 align-middle">&nbsp;</td>
                    <td className="p-3 align-middle">&nbsp;</td>
                    <td className="p-3 align-middle">&nbsp;</td>
                    <td className="p-3 align-middle">&nbsp;</td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 min-h-[60px] flex items-center">
        {pagination.totalPages > 1 ? (
          <div className="w-full flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, pagination.totalAdmins)} of{" "}
              {pagination.totalAdmins} admins
            </div>
            
            <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.hasPrev}
              className={`px-3 py-2 rounded-lg ${
                pagination.hasPrev
                  ? "bg-pink-600 text-white hover:bg-pink-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex gap-1">
              {[...Array(pagination.totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                const isCurrentPage = pageNumber === currentPage;
                
               
                const showPage = 
                  pageNumber === 1 ||
                  pageNumber === pagination.totalPages ||
                  Math.abs(pageNumber - currentPage) <= 1;

                if (!showPage) {
                 
                  if (pageNumber === 2 && currentPage > 4) {
                    return <span key={pageNumber} className="px-2 py-2 text-gray-400">...</span>;
                  }
                  if (pageNumber === pagination.totalPages - 1 && currentPage < pagination.totalPages - 3) {
                    return <span key={pageNumber} className="px-2 py-2 text-gray-400">...</span>;
                  }
                  return null;
                }

                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-3 py-2 rounded-lg ${
                      isCurrentPage
                        ? "bg-pink-600 text-white"
                        : "bg-white text-pink-600 border border-pink-300 hover:bg-pink-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.hasNext}
              className={`px-3 py-2 rounded-lg ${
                pagination.hasNext
                  ? "bg-pink-600 text-white hover:bg-pink-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        </div>
        ) : (
          <div className="w-full flex justify-center">
            <div className="text-sm text-gray-600">
              Showing all {pagination.totalAdmins || adminList.length} admins
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManagement;
