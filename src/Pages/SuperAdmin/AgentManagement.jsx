import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { 
  FaEye, 
  FaEdit, 
  FaBan, 
  FaTrash, 
  FaUnlock, 
  FaUserPlus, 
  FaSearch, 
  FaTimes 
} from "react-icons/fa";
import { 
  useGetAllAgentsQuery, 
  useBanAgentMutation, 
  useUnbanAgentMutation, 
  useDeleteAgentMutation,
  useUpdateAgentMutation,
  useCreateAgentMutation
} from "../../redux/services/agentApi";

const IMAGEURL = "https://shyeyes-b.onrender.com/uploads";

const AgentManagement = () => {
  useDocumentTitle("Agent Management"); // This will set the title as "Agent Management - SuperAdmin Dashboard | ShyEyes"
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [imageError, setImageError] = useState({});
  const [itemsPerPage] = useState(10);

  // Debounce search input (similar to AdminManagement)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Reset to first page when search changes
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [search]);

  // Keyboard shortcut for search focus (similar to AdminManagement)
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

  // Pagination parameters - updated to use debounced search
  const limit = 10;

  // API hooks - updated to use debouncedSearch like AdminManagement
  const { data: agentsData, isLoading, error, refetch } = useGetAllAgentsQuery({
    page: currentPage,
    limit,
    search: debouncedSearch || undefined,
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

  // Helper function to handle search input change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    // Page reset will be handled by useEffect when debouncedSearch changes
  };

  // Helper function to handle filter change
  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Helper function to handle department filter change
  const handleDepartmentFilterChange = (e) => {
    setDepartmentFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Helper function to clear search
  const handleClearSearch = () => {
    setSearch("");
    setDebouncedSearch("");
    setCurrentPage(1);
  };

  // Helper function to handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Helper function to handle image errors
  const handleImageError = (agentKey) => {
    setImageError((prev) => ({ ...prev, [agentKey]: true }));
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-pink-200 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-pink-600 font-semibold">Loading agents...</p>
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
            Failed to load agents: {error?.data?.message || error?.message || 'Unknown error'}
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

  // Handle view agent - Updated to match AdminManagement style
  const handleViewAgent = (agent) => {
    const statusColor = agent.status === 'Active' ? '#10B981' : 
                       agent.status === 'Banned' ? '#EF4444' : '#6B7280';
    
    Swal.fire({
      title: `<div style="color: #ec4899;">👤 Agent Details</div>`,
      html: `
        <div style="text-align: left; padding: 20px;">
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h3 style="margin: 0 0 10px 0; color: #374151;">Personal Information</h3>
            <p><strong>Name:</strong> ${agent.name || 'N/A'}</p>
            <p><strong>Email:</strong> ${agent.email || 'N/A'}</p>
            <p><strong>Role:</strong> <span style="background: #e0e7ff; color: #3730a3; padding: 2px 8px; border-radius: 4px;">${agent.role || 'Agent'}</span></p>
            <p><strong>Department:</strong> <span style="background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 4px;">${agent.department || 'N/A'}</span></p>
          </div>
          
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h3 style="margin: 0 0 10px 0; color: #374151;">System Information</h3>
            <p><strong>Status:</strong> <span style="background: ${statusColor}20; color: ${statusColor}; padding: 2px 8px; border-radius: 4px;">${agent.status || 'Inactive'}</span></p>
            <p><strong>Phone:</strong> ${agent.phone || 'N/A'}</p>
            <p><strong>Address:</strong> ${agent.address || 'N/A'}</p>
          </div>
          
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px;">
            <h3 style="margin: 0 0 10px 0; color: #374151;">Account Details</h3>
            <p><strong>Created:</strong> ${agent.createdAt ? new Date(agent.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : 'N/A'}</p>
            <p><strong>Last Updated:</strong> ${agent.updatedAt ? new Date(agent.updatedAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : 'N/A'}</p>
            <p><strong>Agent ID:</strong> <code style="background: #e5e7eb; padding: 2px 4px; border-radius: 3px; font-size: 12px;">${agent._id || 'N/A'}</code></p>
          </div>
        </div>
      `,
      confirmButtonText: "Close",
      confirmButtonColor: "#ec4899",
      width: 600,
      showCloseButton: true
    });
  };

  // Handle edit agent
  const handleEditAgent = async (agent) => {
    const { value: formValues } = await Swal.fire({
      title: `Edit ${agent.name}`,
      html: `
        <input id="swal-name" class="swal2-input" placeholder="Name" value="${agent.name}" />
        <input id="swal-email" class="swal2-input" placeholder="Email" value="${agent.email}" />
        <select id="swal-role" class="swal2-input" style="display: flex;">
          <option value="Admin" ${agent.role === 'Admin' ? 'selected' : ''}>Admin</option>
          <option value="Agent" ${agent.role === 'Agent' ? 'selected' : ''}>Agent</option>
        </select>
        <input id="swal-department" class="swal2-input" placeholder="Department" value="${agent.department || ''}" />
      `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          name: document.getElementById("swal-name").value,
          email: document.getElementById("swal-email").value,
          role: document.getElementById("swal-role").value,
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
        <select id="swal-role" class="swal2-input" style="display: flex;">
          <option value="">Select Role</option>
          <option value="Admin">Admin</option>
          <option value="Agent">Agent</option>
        </select>
        <input id="swal-department" class="swal2-input" placeholder="Department (optional)" />
      `,
      focusConfirm: false,
      preConfirm: () => {
        const name = document.getElementById("swal-name").value;
        const email = document.getElementById("swal-email").value;
        const password = document.getElementById("swal-password").value;
        const role = document.getElementById("swal-role").value;
        const department = document.getElementById("swal-department").value;

        if (!name || !email || !password || !role) {
          Swal.showValidationMessage('Please fill all required fields');
          return false;
        }

        return { name, email, password, role, department };
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
    <div className="min-h-screen bg-pink-100 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-pink-600 flex items-end justify-center gap-2">
              👥 Manage Agents
              <span className="text-lg font-bold text-gray-600">
                ({totalAgents} total agents)
              </span>
            </h2>
            {debouncedSearch && (
              <p className="text-sm text-gray-600 mt-1">
                Search results for: "<span className="font-medium">{debouncedSearch}</span>"
                {statusFilter !== "All" && (
                  <span> • Status: <span className="font-medium">{statusFilter}</span></span>
                )}
                {departmentFilter !== "All" && (
                  <span> • Department: <span className="font-medium">{departmentFilter}</span></span>
                )}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end">
          <div className="flex gap-4">
            {/* Add Agent */}
            <button
              onClick={handleCreateAgent}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
            >
              <FaUserPlus /> Add Agent
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

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={handleFilterChange}
              className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Banned">Banned</option>
            </select>

            {/* Department Filter */}
            <select
              value={departmentFilter}
              onChange={handleDepartmentFilterChange}
              className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="All">All Departments</option>
              <option value="Support">Support</option>
              <option value="Sales">Sales</option>
              <option value="Technical">Technical</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
        </div>
      </div>

      {/* Agent Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-pink-50 rounded-xl shadow-md mt-5 min-h-[500px]">
          <thead>
            <tr className="text-left bg-pink-300 text-black">
              <th className="p-3">Profile</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Department</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="min-h-[400px]">
            {agentList.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-8 text-gray-500">
                  {debouncedSearch ? (
                    <div>
                      <p className="text-lg mb-2">No agents found for "{debouncedSearch}"</p>
                      <p className="text-sm">Try adjusting your search terms or clear the search to see all agents.</p>
                      <button
                        onClick={handleClearSearch}
                        className="mt-3 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                      >
                        Clear Search
                      </button>
                    </div>
                  ) : statusFilter !== "All" || departmentFilter !== "All" ? (
                    <div>
                      <p className="text-lg mb-2">No agents found for current filters</p>
                      <p className="text-sm">Try adjusting your filters.</p>
                    </div>
                  ) : (
                    <p className="text-lg">No agents found</p>
                  )}
                </td>
              </tr>
            ) : (
              agentList.map((agent, index) => (
                <tr key={agent._id || index} className="border-b border-pink-200 hover:bg-pink-100 h-16">
                  <td className="p-3 align-middle">
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
                            className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center text-white font-semibold text-sm"
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
                  <td className="p-3 font-medium align-middle">{agent.name || "N/A"}</td>
                  <td className="p-3 align-middle">{agent.email || "N/A"}</td>
                  <td className="p-3 align-middle">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
                      {agent.role || "Agent"}
                    </span>
                  </td>
                  <td className="p-3 align-middle">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                      {agent.department || "N/A"}
                    </span>
                  </td>
                  <td className="p-3 align-middle">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      agent.status === "Active"
                        ? "bg-green-100 text-green-800" 
                        : agent.status === "Banned"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {agent.status || "Inactive"}
                    </span>
                  </td>
                  <td className="p-3 align-middle">
                    {agent.createdAt ? new Date(agent.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="p-3 align-middle">
                    <div className="flex gap-2">
                      {/* View */}
                      <button
                        onClick={() => handleViewAgent(agent)}
                        className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      
                      {/* Edit */}
                      <button
                        onClick={() => handleEditAgent(agent)}
                        className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
                        title="Edit Agent"
                      >
                        <FaEdit />
                      </button>
                      
                      {/* Ban/Unban */}
                      {agent.status === "Active" ? (
                        <button
                          onClick={() => handleToggleBan(agent)}
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                          title="Ban Agent"
                        >
                          <FaBan />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleBan(agent)}
                          className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors"
                          title="Unban Agent"
                        >
                          <FaUnlock />
                        </button>
                      )}
                      
                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteAgent(agent)}
                        className="bg-pink-400 text-white p-2 rounded-full hover:bg-pink-500 transition-colors"
                        title="Delete Agent"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              )).concat(
                // Add empty rows to maintain consistent table height
                Array.from({ length: Math.max(0, itemsPerPage - agentList.length) }, (_, index) => (
                  <tr key={`empty-${index}`} className="border-b border-pink-200 h-16">
                    <td className="p-3 align-middle">&nbsp;</td>
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
        {totalPages > 1 ? (
          <div className="w-full flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalAgents)} of{" "}
              {totalAgents} agents
            </div>
            
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg ${
                  currentPage > 1
                    ? "bg-pink-600 text-white hover:bg-pink-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  const isCurrentPage = pageNumber === currentPage;
                  
                  const showPage = 
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    Math.abs(pageNumber - currentPage) <= 1;

                  if (!showPage) {
                    if (pageNumber === 2 && currentPage > 4) {
                      return <span key={pageNumber} className="px-2 py-2 text-gray-400">...</span>;
                    }
                    if (pageNumber === totalPages - 1 && currentPage < totalPages - 3) {
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
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-lg ${
                  currentPage < totalPages
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
              Showing all {totalAgents} agents
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentManagement;
