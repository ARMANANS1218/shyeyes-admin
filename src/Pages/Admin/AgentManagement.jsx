import React, { useState } from "react";
import Swal from "sweetalert2";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { FaEye, FaEdit, FaBan, FaTrash, FaUnlock, FaPlus } from "react-icons/fa";
import { 
  useGetAllAgentsQuery, 
  useBanAgentMutation, 
  useUnbanAgentMutation, 
  useDeleteAgentMutation,
  useUpdateAgentMutation,
  useCreateAgentMutation
} from "../../redux/services/agentApi";

const IMAGEURL = "https://shyeyes-b.onrender.com/uploads";

// Department options for dropdowns
const DEPARTMENT_OPTIONS = [
  "Sales",
  "Marketing", 
  "Support",
  "Technical"
];

const AgentManagement = () => {
  useDocumentTitle("Agent Management"); // This will set the title as "Agent Management - Admin Dashboard | ShyEyes"
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [imageError, setImageError] = useState({});

  // Pagination parameters
  const limit = 10;

  // API hooks
  const { data: agentsData, isLoading, error, refetch } = useGetAllAgentsQuery({
    page: currentPage,
    limit,
    search: search || undefined,
    status: statusFilter !== "All" ? statusFilter : undefined,
    department: departmentFilter !== "All" ? departmentFilter : undefined,
  });

  const [banAgent] = useBanAgentMutation();
  const [unbanAgent] = useUnbanAgentMutation();
  const [deleteAgent] = useDeleteAgentMutation();
  const [updateAgent] = useUpdateAgentMutation();
  const [createAgent] = useCreateAgentMutation();

  // Extract agent list from API response
  const agentList = agentsData?.data?.agents || agentsData?.agents || [];
  const totalPages = agentsData?.data?.pagination?.totalPages || agentsData?.totalPages || agentsData?.pagination?.totalPages || 1;
  const totalAgents = agentsData?.data?.pagination?.totalAgents || agentsData?.totalAgents || agentsData?.total || agentsData?.pagination?.total || 0;

  console.log("Fetched Agents from API:", agentList);
  console.log("Full API Response:", agentsData);
  console.log("API Error:", error);

  // Helper function to handle image errors
  const handleImageError = (agentKey) => {
    setImageError((prev) => ({ ...prev, [agentKey]: true }));
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-pink-50 dark:bg-gray-900 p-6 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 dark:border-pink-400 mx-auto mb-4"></div>
          <p className="text-pink-600 dark:text-pink-300 font-semibold">Loading agents...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-pink-50 dark:bg-gray-900 p-6 flex items-center justify-center transition-colors">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 font-semibold mb-4">
            Failed to load agents: {error?.data?.message || error?.message || 'Unknown error'}
          </p>
          <button
            onClick={() => refetch()}
            className="bg-pink-600 dark:bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-700 dark:hover:bg-pink-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Handle view agent
  const handleViewAgent = (agent) => {
    const profileImage = agent.profilePic 
      ? `${IMAGEURL}/${agent.profilePic}` 
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name)}&background=ec4899&color=fff`;

    Swal.fire({
      title: `${agent.name}'s Details`,
      html: `
        <div style="display:flex;flex-direction:column;align-items:center;gap:10px;">
          <img src="${profileImage}" alt="${agent.name}" style="width:80px;height:80px;border-radius:50%;margin-bottom:10px;object-fit:cover;" />
          <p><b>Name:</b> ${agent.name}</p>
          <p><b>Email:</b> ${agent.email}</p>
          <p><b>Role:</b> ${agent.role}</p>
          <p><b>Department:</b> ${agent.department || 'N/A'}</p>
          <p><b>Status:</b> <span style="color:${agent.status === 'Active' ? 'green' : 'red'}">${agent.status}</span></p>
          <p><b>Created:</b> ${agent.createdAt ? new Date(agent.createdAt).toLocaleDateString() : 'N/A'}</p>
          <p><b>Updated:</b> ${agent.updatedAt ? new Date(agent.updatedAt).toLocaleDateString() : 'N/A'}</p>
        </div>
      `,
      confirmButtonText: "Close",
      width: 400,
    });
  };

  // Handle edit agent
  const handleEditAgent = async (agent) => {
    const { value: formValues } = await Swal.fire({
      title: `Edit ${agent.name}`,
      html: `
        <input id="swal-name" class="swal2-input" placeholder="Name" value="${agent.name}" />
        <input id="swal-email" class="swal2-input" placeholder="Email" value="${agent.email}" />
        <select id="swal-department" class="swal2-input" style="display: flex; text-align: center;">
          <option value="">Select Department</option>
          ${DEPARTMENT_OPTIONS.map(dept => 
            `<option value="${dept}" ${agent.department === dept ? 'selected' : ''}>${dept}</option>`
          ).join('')}
        </select>
      `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          name: document.getElementById("swal-name").value,
          email: document.getElementById("swal-email").value,
          department: document.getElementById("swal-department").value,
        };
      },
      confirmButtonText: "Save",
      showCancelButton: true,
    });

    if (formValues) {
      try {
        await updateAgent({ 
          agentId: agent._id, 
          agentData: formValues 
        }).unwrap();
        
        Swal.fire({
          icon: "success",
          title: "Agent Updated!",
          text: `${formValues.name}'s information has been updated.`,
          timer: 2000,
        });
        refetch();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error?.data?.message || "Failed to update agent",
        });
      }
    }
  };

  // Handle toggle ban/unban
  const handleToggleBan = async (agent) => {
    const isBanned = agent.status === 'Banned';
    const action = isBanned ? 'unban' : 'ban';
    
    const confirmAction = await Swal.fire({
      title: `${isBanned ? 'Unban' : 'Ban'} Agent?`,
      text: `Do you want to ${action} ${agent.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
      cancelButtonText: "Cancel",
    });

    if (confirmAction.isConfirmed) {
      try {
        if (isBanned) {
          await unbanAgent(agent._id).unwrap();
        } else {
          await banAgent({ 
            agentId: agent._id, 
            reason: "Policy violation - banned by admin" 
          }).unwrap();
        }
        
        Swal.fire({
          icon: "success",
          title: `${isBanned ? 'Unbanned' : 'Banned'}!`,
          text: `${agent.name} has been ${isBanned ? 'unbanned' : 'banned'}.`,
          timer: 2000,
        });
        refetch();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error?.data?.message || `Failed to ${action} agent`,
        });
      }
    }
  };

  // Handle delete agent
  const handleDeleteAgent = async (agent) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: `Do you really want to delete ${agent.name}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
    });

    if (confirmDelete.isConfirmed) {
      try {
        await deleteAgent(agent._id).unwrap();
        
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: `${agent.name} has been deleted.`,
          timer: 2000,
        });
        refetch();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error?.data?.message || "Failed to delete agent",
        });
      }
    }
  };

  // Handle create agent
  const handleCreateAgent = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Create New Agent',
      html: `
        <input id="swal-name" class="swal2-input" placeholder="Full Name" />
        <input id="swal-email" class="swal2-input" placeholder="Email" type="email" />
        <input id="swal-password" class="swal2-input" placeholder="Password" type="password" />
        <select id="swal-department" class="swal2-input" style="display: flex; text-align: center;">
          <option value="">Select Department</option>
          ${DEPARTMENT_OPTIONS.map(dept => `<option value="${dept}">${dept}</option>`).join('')}
        </select>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const name = document.getElementById("swal-name").value;
        const email = document.getElementById("swal-email").value;
        const password = document.getElementById("swal-password").value;
        const department = document.getElementById("swal-department").value;

        if (!name || !email || !password || !department) {
          Swal.showValidationMessage('Please fill all required fields');
          return false;
        }

        return { name, email, password, department };
      },
      confirmButtonText: "Create",
      showCancelButton: true,
    });

    if (formValues) {
      try {
        await createAgent(formValues).unwrap();
        
        Swal.fire({
          icon: "success",
          title: "Agent Created!",
          text: `${formValues.name} has been created successfully.`,
          timer: 2000,
        });
        refetch();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error?.data?.message || "Failed to create agent",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 dark:bg-gray-900 p-6 transition-colors">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-pink-600 dark:text-pink-300 flex items-end justify-center gap-2">
          👥 Manage Agents
          <span className="text-lg font-bold text-gray-600 dark:text-gray-300">
            ({totalAgents} total agents)
          </span>
        </h2>
        <div className="flex gap-4">
          {/* Create Agent Button */}
          <button
            onClick={handleCreateAgent}
            className="bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <FaPlus /> Create Agent
          </button>

          {/* Refresh Button */}
          <button
            onClick={() => refetch()}
            className="bg-pink-600 dark:bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-700 dark:hover:bg-pink-600 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        {/* Search */}
        <input
          type="text"
          placeholder="Search agents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500 flex-1"
        />

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Banned">Banned</option>
          <option value="Inactive">Inactive</option>
        </select>

        {/* Department Filter */}
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="All">All Departments</option>
          {DEPARTMENT_OPTIONS.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {/* Agent Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <thead>
            <tr className="text-left bg-pink-300 dark:bg-pink-800 text-black dark:text-white">
              <th className="p-3">Profile</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Department</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {agentList.length > 0 ? (
              agentList.map((agent, index) => (
                <tr
                  key={agent._id || index}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-pink-50 dark:hover:bg-gray-700"
                >
                  <td className="p-3">
                    {(() => {
                      const agentKey = agent._id || index;
                      const imgUrl = agent.profilePic ? `${IMAGEURL}/${agent.profilePic}` : "";

                      const getInitials = () => {
                        const nameParts = agent.name?.split(" ") || ["Agent"];
                        const first = nameParts[0]?.[0] || "A";
                        const last = nameParts[1]?.[0] || "";
                        return `${first.toUpperCase()}${last.toUpperCase()}`;
                      };

                      if (!imgUrl || imgUrl.trim() === "" || imageError[agentKey]) {
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
                          alt={agent.name}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={() => handleImageError(agentKey)}
                        />
                      );
                    })()}
                  </td>

                  <td className="p-3 text-gray-900 dark:text-gray-100">{agent.name || "N/A"}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">{agent.email || "N/A"}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">{agent.role || "N/A"}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">{agent.department || "N/A"}</td>
                  <td
                    className={`p-3 font-bold ${
                      agent.status === "Active"
                        ? "text-green-600 dark:text-green-400"
                        : agent.status === "Banned" 
                        ? "text-red-600 dark:text-red-400"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {agent.status || "Unknown"}
                  </td>
                  <td className="p-3 flex gap-2">
                    {/* View */}
                    <button
                      onClick={() => handleViewAgent(agent)}
                      className="bg-blue-600 dark:bg-blue-500 text-white p-2 rounded-full hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                      title="View Details"
                    >
                      <FaEye />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => handleEditAgent(agent)}
                      className="bg-green-500 dark:bg-green-400 text-white p-2 rounded-full hover:bg-green-600 dark:hover:bg-green-500 transition-colors"
                      title="Edit Agent"
                    >
                      <FaEdit />
                    </button>

                    {/* Ban / Unban */}
                    {agent.status === "Banned" ? (
                      <button
                        onClick={() => handleToggleBan(agent)}
                        className="bg-green-600 dark:bg-green-500 text-white p-2 rounded-full hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
                        title="Unban Agent"
                      >
                        <FaUnlock />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggleBan(agent)}
                        className="bg-red-500 dark:bg-red-600 text-white p-2 rounded-full hover:bg-red-600 dark:hover:bg-red-500 transition-colors"
                        title="Ban Agent"
                      >
                        <FaBan />
                      </button>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteAgent(agent)}
                      className="bg-pink-400 dark:bg-pink-600 text-white p-2 rounded-full hover:bg-pink-500 dark:hover:bg-pink-500 transition-colors"
                      title="Delete Agent"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-600 dark:text-gray-300">
                  No agents found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-pink-600 dark:bg-pink-500 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-pink-700 dark:hover:bg-pink-600 transition-colors"
          >
            Previous
          </button>
          
          <span className="px-4 py-2 text-pink-600 dark:text-pink-300 font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-pink-600 dark:bg-pink-500 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-pink-700 dark:hover:bg-pink-600 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AgentManagement;
