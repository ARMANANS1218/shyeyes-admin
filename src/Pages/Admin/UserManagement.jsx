import React, { useState } from "react";
import Swal from "sweetalert2";
import { FaEye, FaEdit, FaBan, FaTrash, FaUnlock } from "react-icons/fa";
import { useGetAllUsersQuery } from "../../redux/services/userApi";
const IMAGEURL = "https://shyeyes-b.onrender.com/uploads";

const UserManagement = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [imageError, setImageError] = useState({});

  // Fetch users from API
  const { data: allUsers, isLoading, error, refetch } = useGetAllUsersQuery();

  // Extract user list from API response
  const userList = allUsers?.data || [];

  console.log("Fetched Users from API:", userList);
  console.log("API Response:", allUsers);
  console.log("First user location structure:", userList[0]?.location);

  // Helper function to format location
  const formatLocation = (location) => {
    if (typeof location === "string") {
      return location;
    }
    if (typeof location === "object" && location !== null) {
      const { city, country } = location;
      if (city && country) {
        return `${city}, ${country}`;
      }
      if (city) return city;
      if (country) return country;
    }
    return "N/A";
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-pink-200 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-pink-600 font-semibold">Loading users...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-pink-200 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-4">
            Failed to load users
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

  // SweetAlert Trigger

  const handleAction = async (action, user) => {
    if (action === "View") {
      const imgUrl =
        user.profile ||
        user.profileImage ||
        user.avatar ||
        (user.profilePic ? `${IMAGEURL}/${user.profilePic}` : "");

      const getInitials = () => {
        const first =
          user.Name?.firstName?.[0] ||
          user.firstName?.[0] ||
          user.name?.split(" ")[0]?.[0] ||
          "U";
        const last =
          user.Name?.lastName?.[0] ||
          user.lastName?.[0] ||
          user.name?.split(" ")[1]?.[0] ||
          "";
        return `${first.toUpperCase()}${last.toUpperCase()}`;
      };

      const userName = user.name || user.username || "User";
      const userEmail = user.email || "N/A";
      const userGender = user.gender || "N/A";
      const userLocation = formatLocation(user.location || user.address);
      const userStatus =
        user.status || (user.isActive ? "Active" : "Inactive") || "Unknown";

      // avatar with error fallback
      const avatarHtml = imgUrl
        ? `<img src="${imgUrl}" alt="${userName}" 
         style="width:80px;height:80px;border-radius:50%;
         margin-bottom:10px;object-fit:cover;" 
         onerror="this.outerHTML='<div style=&quot;width:80px;height:80px;border-radius:50%;background:#ccc;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:24px;margin-bottom:10px;&quot;>${getInitials()}</div>'" />`
        : `<div style="width:80px;height:80px;border-radius:50%;
         background:#ccc;display:flex;align-items:center;
         justify-content:center;font-weight:bold;font-size:24px;
         margin-bottom:10px;">${getInitials()}</div>`;

      Swal.fire({
        title: `${userName}'s Details`,
        html: `
      <div style="display:flex;flex-direction:column;align-items:center;gap:10px;">
        ${avatarHtml}
        <p><b>Email:</b> ${userEmail}</p>
        <p><b>Gender:</b> ${userGender}</p>
        <p><b>Location:</b> ${userLocation}</p>
        <p><b>Status:</b> <span style="color:${
          userStatus === "Active" ? "green" : "red"
        }">${userStatus}</span></p>
      </div>
    `,
        confirmButtonText: "Close",
        width: 400,
      });
    } else if (action === "Edit") {
      const userName = user.name || user.username || "";
      const userEmail = user.email || "";
      const userGender = user.gender || "";
      const userLocation = formatLocation(user.location || user.address);

      const { value: formValues } = await Swal.fire({
        title: `Edit ${userName || "User"}`,
        html: `
        <input id="swal-name" class="swal2-input" placeholder="Name" value="${userName}" />
        <input id="swal-email" class="swal2-input" placeholder="Email" value="${userEmail}" />
        <input id="swal-gender" class="swal2-input" placeholder="Gender" value="${userGender}" />
        <input id="swal-location" class="swal2-input" placeholder="Location" value="${userLocation}" />
      `,
        focusConfirm: false,
        preConfirm: () => {
          return {
            name: document.getElementById("swal-name").value,
            email: document.getElementById("swal-email").value,
            gender: document.getElementById("swal-gender").value,
            location: document.getElementById("swal-location").value,
          };
        },
        confirmButtonText: "Save",
        showCancelButton: true,
      });

      if (formValues) {
        // Note: In a real application, you would make an API call to update the user
        // After successful update, call refetch() to refresh the data
        Swal.fire({
          icon: "success",
          title: "User Updated!",
          text: `${formValues.name}'s info would be updated via API.`,
          timer: 2000,
        }).then(() => {
          refetch(); // Refresh data from API
        });
      }
    } else if (action === "Delete") {
      const confirmDelete = await Swal.fire({
        title: "Are you sure?",
        text: `Do you really want to delete ${user.name}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (confirmDelete.isConfirmed) {
        // Note: In a real application, you would make an API call to delete the user
        // After successful deletion, call refetch() to refresh the data
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: `${user.name} would be deleted via API.`,
          timer: 2000,
        }).then(() => {
          refetch(); // Refresh data from API
        });
      }
    } else if (action === "Block") {
      const confirmBlock = await Swal.fire({
        title: "Block User?",
        text: `Do you want to block ${user.name}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Block",
        cancelButtonText: "Cancel",
      });

      if (confirmBlock.isConfirmed) {
        // Note: In a real application, you would make an API call to block the user
        // After successful blocking, call refetch() to refresh the data
        Swal.fire({
          icon: "success",
          title: "Blocked!",
          text: `${user.name} would be blocked via API.`,
          timer: 2000,
        }).then(() => {
          refetch(); // Refresh data from API
        });
      }
    } else if (action === "Unblock") {
      // Note: In a real application, you would make an API call to unblock the user
      // After successful unblocking, call refetch() to refresh the data
      Swal.fire({
        icon: "success",
        title: "Unblocked!",
        text: `${user.name} would be unblocked via API.`,
        timer: 2000,
      }).then(() => {
        refetch(); // Refresh data from API
      });
    }
  };

  // Filtered users from API data
  const filteredUsers = userList.filter((user) => {
    const userName = (user.name || user.username || "").toLowerCase();
    const userEmail = (user.email || "").toLowerCase();
    const userLocation = formatLocation(
      user.location || user.address
    ).toLowerCase();
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      userName.includes(searchTerm) ||
      userEmail.includes(searchTerm) ||
      userLocation.includes(searchTerm);

    const userStatus = user.status || (user.isActive ? "Active" : "Inactive");
    const matchesStatus =
      statusFilter === "All" ? true : userStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-pink-200 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-pink-600 flex items-end justify-center gap-2">
          👥 Manage Users
          <span className="text-lg  font-bold   text-gray-600">
            ({userList.length} total users)
          </span>
        </h2>
        <div className="flex gap-4">
          {/* Refresh Button */}
          <button
            onClick={() => refetch()}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
          >
            🔄 Refresh
          </button>

          {/* Search */}
          <input
            type="text"
            placeholder="Search users..."
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

      {/* User Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-pink-100 rounded-xl shadow-md mt-5">
          <thead>
            <tr className="text-left bg-pink-300 text-black">
              <th className="p-3">Profile</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Gender</th>
              <th className="p-3">Location</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr
                  key={user.id || user._id || index}
                  className="border-b border-pink-300 hover:bg-pink-50"
                >
                  <td className="p-3">
                    {(() => {
                      const userKey = user.id || user._id || index;
                      const imgUrl =
                        user.profile ||
                        user.profileImage ||
                        user.avatar ||
                        (user.profilePic
                          ? `${IMAGEURL}/${user.profilePic}`
                          : "");

                      const getInitials = () => {
                        const first =
                          user.Name?.firstName?.[0] ||
                          user.firstName?.[0] ||
                          user.name?.split(" ")[0]?.[0] ||
                          "U";
                        const last =
                          user.Name?.lastName?.[0] ||
                          user.lastName?.[0] ||
                          user.name?.split(" ")[1]?.[0] ||
                          "";
                        return `${first.toUpperCase()}${last.toUpperCase()}`;
                      };

                      if (
                        !imgUrl ||
                        imgUrl.trim() === "" ||
                        imageError[userKey]
                      ) {
                        return (
                          <div
                            className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center text-white font-semibold text-lg"
                            style={{ minWidth: "2.5rem" }}
                          >
                            {getInitials()}
                          </div>
                        );
                      }
                      return (
                        <img
                          src={imgUrl}
                          alt={
                            user.Name?.firstName ||
                            user.firstName ||
                            user.username ||
                            "User"
                          }
                          className="w-10 h-10 rounded-full object-cover"
                          onError={() =>
                            setImageError((prev) => ({
                              ...prev,
                              [userKey]: true,
                            }))
                          }
                        />
                      );
                    })()}
                  </td>

                  <td className="p-3">
                    {user.Name.firstName || "N/A"} {user.Name.lastName || "N/A"}
                  </td>
                  <td className="p-3">{user.email || "N/A"}</td>
                  <td className="p-3">{user.gender || "N/A"}</td>
                  <td className="p-3">
                    {formatLocation(user.location || user.address)}
                  </td>
                  <td
                    className={`p-3 font-bold ${
                      user.status === "Active" || user.isActive
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {user.status ||
                      (user.isActive ? "Active" : "Inactive") ||
                      "Unknown"}
                  </td>
                  <td className="p-3 flex gap-2">
                    {/* View */}
                    <button
                      onClick={() => handleAction("View", user)}
                      className="bg-blue-600 text-white p-2 rounded-full"
                    >
                      <FaEye />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => handleAction("Edit", user)}
                      className="bg-green-500 text-white p-2 rounded-full"
                    >
                      <FaEdit />
                    </button>

                    {/* Block / Unblock */}
                    {user.status === "Active" || user.isActive ? (
                      <button
                        onClick={() => handleAction("Block", user)}
                        className="bg-red-500 text-white p-2 rounded-full"
                      >
                        <FaBan />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAction("Unblock", user)}
                        className="bg-green-600 text-white p-2 rounded-full"
                      >
                        <FaUnlock />
                      </button>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => handleAction("Delete", user)}
                      className="bg-pink-400 text-white p-2 rounded-full"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-600">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
