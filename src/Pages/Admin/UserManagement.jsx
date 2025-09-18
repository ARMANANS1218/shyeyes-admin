import React, { useState } from "react";
import Swal from "sweetalert2";
import { FaEye, FaEdit, FaBan, FaTrash, FaUnlock } from "react-icons/fa";

const initialUsers = [
  {
    id: 1,
    name: "Jombie",
    email: "jombie@example.com",
    gender: "Female",
    location: "USA",
    status: "Active",
    profile: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: 2,
    name: "Gaurav",
    email: "gaurav1234@gmail.com",
    gender: "Male",
    location: "Russia",
    status: "Inactive",
    profile: "https://i.pravatar.cc/40?img=2",
  },
  {
    id: 3,
    name: "Ronaldo",
    email: "ronaldo1234@gmail.com",
    gender: "Female",
    location: "France",
    status: "Inactive",
    profile: "https://i.pravatar.cc/40?img=3",
  },
  {
    id: 4,
    name: "Vold",
    email: "vold1234@gmail.com",
    gender: "Male",
    location: "Russia",
    status: "Active",
    profile: "https://i.pravatar.cc/40?img=4",
  },
  {
    id: 5,
    name: "Ram",
    email: "ram776234@gmail.com",
    gender: "Male",
    location: "France",
    status: "Inactive",
    profile: "https://i.pravatar.cc/40?img=3",
  },
];

const UserManagement = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [users] = useState(initialUsers);

  // SweetAlert Trigger
 
 

const handleAction = async (action, user) => {
  if (action === "View") {
    Swal.fire({
      title: `${user.name}'s Details`,
      html: `
        <div style="display:flex;flex-direction:column;align-items:center;gap:10px;">
          <img src="${user.profile}" alt="${user.name}" style="width:80px;height:80px;border-radius:50%;margin-bottom:10px;" />
          <p><b>Email:</b> ${user.email}</p>
          <p><b>Gender:</b> ${user.gender}</p>
          <p><b>Location:</b> ${user.location}</p>
          <p><b>Status:</b> <span style="color:${user.status === "Active" ? "green" : "red"}">${user.status}</span></p>
        </div>
      `,
      confirmButtonText: "Close",
      width: 400,
    });
  }

  else if (action === "Edit") {
    const { value: formValues } = await Swal.fire({
      title: `Edit ${user.name}`,
      html: `
        <input id="swal-name" class="swal2-input" placeholder="Name" value="${user.name}" />
        <input id="swal-email" class="swal2-input" placeholder="Email" value="${user.email}" />
        <input id="swal-gender" class="swal2-input" placeholder="Gender" value="${user.gender}" />
        <input id="swal-location" class="swal2-input" placeholder="Location" value="${user.location}" />
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
      const updatedUsers = users.map((u) =>
        u.id === user.id ? { ...u, ...formValues } : u
      );
      setUsers(updatedUsers);

      Swal.fire({
        icon: "success",
        title: "User Updated!",
        text: `${formValues.name}'s info has been updated.`,
      });
    }
  }

  else if (action === "Delete") {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: `Do you really want to delete ${user.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirmDelete.isConfirmed) {
      const updatedUsers = users.filter((u) => u.id !== user.id);
      setUsers(updatedUsers);

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: `${user.name} has been removed.`,
      });
    }
  }

  else if (action === "Block") {
    const confirmBlock = await Swal.fire({
      title: "Block User?",
      text: `Do you want to block ${user.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Block",
      cancelButtonText: "Cancel",
    });

    if (confirmBlock.isConfirmed) {
      const updatedUsers = users.map((u) =>
        u.id === user.id ? { ...u, status: "Inactive" } : u
      );
      setUsers(updatedUsers);

      Swal.fire({
        icon: "success",
        title: "Blocked!",
        text: `${user.name} has been blocked.`,
      });
    }
  }

  else if (action === "Unblock") {
    const updatedUsers = users.map((u) =>
      u.id === user.id ? { ...u, status: "Active" } : u
    );
    setUsers(updatedUsers);

    Swal.fire({
      icon: "success",
      title: "Unblocked!",
      text: `${user.name} is now Active.`,
    });
  }
};




  // Filtered users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ? true : user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-pink-200 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-pink-600 flex items-center gap-2">
          👥 Manage Users
        </h2>
        <div className="flex gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 rounded-lg border border-gray-300 focus:outline-none"
          />

          {/* Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 rounded-lg border border-gray-300"
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
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="border-b border-pink-300 hover:bg-pink-50"
              >
                <td className="p-3">
                  <img
                    src={user.profile}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.gender}</td>
                <td className="p-3">{user.location}</td>
                <td
                  className={`p-3 font-bold ${
                    user.status === "Active" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {user.status}
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
                  {user.status === "Active" ? (
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
            ))}

            {filteredUsers.length === 0 && (
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