import { useGetAllUsersQuery } from "../../redux/services/userApi";
import { useGetAllAgentsQuery } from "../../redux/services/agentApi";
import { useGetAllAdminsBySuperAdminQuery } from "../../redux/services/adminApi";

// src/components/superadmin/StatsCards.jsx
export default function StatsCards() {
  const { data: allUsers, isLoading: usersLoading } = useGetAllUsersQuery(
    undefined,
    {
      pollingInterval: 30000, // Poll every 30 seconds
      refetchOnFocus: true, // Refetch when window gains focus
      refetchOnReconnect: true, // Refetch when connection is restored
    }
  );
  const { data: agentsData, isLoading: agentsLoading } = useGetAllAgentsQuery(
    { limit: 1000 }, // Set high limit to get all agents for stats
    {
      pollingInterval: 30000, // Poll every 30 seconds
      refetchOnFocus: true, // Refetch when window gains focus
      refetchOnReconnect: true, // Refetch when connection is restored
    }
  );
  const { data: adminsData, isLoading: adminsLoading } = useGetAllAdminsBySuperAdminQuery(
    { limit: 1000 }, // Set high limit to get all admins for stats
    {
      pollingInterval: 30000, // Poll every 30 seconds
      refetchOnFocus: true, // Refetch when window gains focus
      refetchOnReconnect: true, // Refetch when connection is restored
    }
  );

  // Extract data from API responses
  const userList = allUsers?.users || allUsers?.data || [];
  const agentList = agentsData?.data?.agents || agentsData?.agents || [];
  
  // Extract admin data with proper error handling
  const adminList = Array.isArray(adminsData?.admins) ? adminsData.admins 
    : Array.isArray(adminsData?.data?.admins) ? adminsData.data.admins
    : Array.isArray(adminsData?.data) ? adminsData.data
    : [];

  // Extract total counts from pagination metadata when available
  const totalUsersCount = allUsers?.total || allUsers?.pagination?.total || userList.length;
  const totalAgentsCount = agentsData?.data?.pagination?.totalAgents || agentsData?.pagination?.totalAgents || agentsData?.total || agentList.length;
  const totalAdminsCount = adminsData?.data?.pagination?.totalAdmins || adminsData?.pagination?.totalAdmins || adminsData?.total || adminList.length;

  console.log('StatsCards Total Counts Debug:', {
    totalUsersCount,
    totalAgentsCount,  
    totalAdminsCount,
    userListLength: userList.length,
    agentListLength: agentList.length,
    adminListLength: adminList.length
  });

  // Calculate user metrics from real API data
  const totalUsers = totalUsersCount;
  const activeUsers = userList.filter(user => 
    user.status === 'Active' || user.isActive === true
  ).length;
  const bannedUsers = userList.filter(user => 
    user.status === 'Banned' || user.isActive === false
  ).length;
  
  // Calculate agent metrics
  const totalAgents = totalAgentsCount;
  const activeAgents = agentList.filter(agent => agent.status === 'Active').length;
  const bannedAgents = agentList.filter(agent => agent.status === 'Banned').length;
  
  // Calculate admin metrics from real API data with improved logic
  const totalAdmins = totalAdminsCount;
  const activeAdmins = Array.isArray(adminList) ? adminList.filter(admin => {
    // An admin is active if not explicitly banned
    const isBannedExplicitly = admin.status === 'Banned' || admin.isBanned === true || admin.isActive === false;
    return !isBannedExplicitly && (admin.status === 'Active' || admin.isActive === true || admin.isBanned === false || admin.isBanned == null);
  }).length : 0;
  const bannedAdmins = Array.isArray(adminList) ? adminList.filter(admin => {
    // An admin is banned if explicitly marked as banned
    return admin.status === 'Banned' || admin.isBanned === true || admin.isActive === false;
  }).length : 0;

  // Debug logging for admin status (you can remove this later)
  console.log('StatsCards Admin Debug:', {
    totalAdmins,
    activeAdmins,
    bannedAdmins,
    sum: activeAdmins + bannedAdmins,
    shouldEqual: totalAdmins
  });

  // Calculate gender ratio from user data
  const calculateGenderRatio = () => {
    const maleCount = userList.filter(user => 
      user.gender?.toLowerCase() === 'male' || 
      user.gender?.toLowerCase() === 'm'
    ).length;
    
    const femaleCount = userList.filter(user => 
      user.gender?.toLowerCase() === 'female' || 
      user.gender?.toLowerCase() === 'f'
    ).length;
    
    const totalWithGender = maleCount + femaleCount;
    if (totalWithGender === 0) return "0/0";
    
    const maleRatio = Math.round((maleCount / totalWithGender) * 100);
    const femaleRatio = Math.round((femaleCount / totalWithGender) * 100);
    
    return `${maleRatio}/${femaleRatio}`;
  };

  // Calculate total payments (placeholder - would need payments API)
  const calculateTotalPayments = () => {
    // Placeholder calculation - in reality would need payments API
    // For now, assuming each active user contributes some amount
    const estimatedPayments = activeUsers * 25; // Example calculation
    return estimatedPayments.toLocaleString();
  };

  // Calculate today's login count
  const calculateTodayLogins = () => {
    const today = new Date().toDateString();
    const todayLogins = userList.filter(user => {
      // Check various possible date fields for last login
      const lastLogin = user.lastLogin || user.lastActiveDate || user.loginDate || user.createdAt;
      if (!lastLogin) return false;
      
      const loginDate = new Date(lastLogin).toDateString();
      return loginDate === today;
    }).length;
    
    return todayLogins.toString();
  };

  // Loading state
  if (usersLoading || agentsLoading || adminsLoading) {
    return (
      <div className="p-4 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div key={index} className="card p-4 rounded-lg bg-gray-200 shadow-md">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-8 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // User Stats Cards
  const userCards = [
    {
      title: "Total Users",
      value: totalUsers.toString(),
      gradient: "bg-gradient-to-r from-pink-500 via-pink-600 to-pink-800",
    },
    {
      title: "Active Users",
      value: activeUsers.toString(),
      gradient: "bg-gradient-to-r from-pink-500 via-pink-400 to-pink-600",
    },
    {
      title: "Banned Users",
      value: bannedUsers.toString(),
      gradient: "bg-gradient-to-r from-pink-500 via-pink-600 to-pink-800",
    },
    {
      title: "Gender Ratio",
      value: calculateGenderRatio(),
      gradient: "bg-gradient-to-r from-pink-500 via-pink-400 to-pink-600",
    },
    {
      title: "Total Payments",
      value: calculateTotalPayments(),
      gradient: "bg-gradient-to-r from-pink-500 via-pink-600 to-pink-800",
    },
    {
      title: "Today Login",
      value: calculateTodayLogins(),
      gradient: "bg-gradient-to-r from-pink-500 via-pink-400 to-pink-600",
    },
  ];

  // Agent Stats Cards
  const agentCards = [
    {
      title: "Total Agents",
      value: totalAgents.toString(),
      gradient: "bg-gradient-to-r from-pink-500 via-pink-600 to-pink-800",
    },
    {
      title: "Active Agents",
      value: activeAgents.toString(),
      gradient: "bg-gradient-to-r from-pink-500 via-pink-400 to-pink-600",
    },
    {
      title: "Banned Agents",
      value: bannedAgents.toString(),
      gradient: "bg-gradient-to-r from-pink-500 via-pink-600 to-pink-800",
    },
    // {
    //   title: "Agent Growth",
    //   value: "0", // Placeholder - no growth tracking API
    //   gradient: "bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800",
    // },
  ];

  // Admin Stats Cards  
  const adminCards = [
    {
      title: "Total Admins",
      value: totalAdmins.toString(),
      gradient: "bg-gradient-to-r from-pink-500 via-pink-400 to-pink-600",
    },
    {
      title: "Active Admins",
      value: activeAdmins.toString(),
      gradient: "bg-gradient-to-r from-pink-500 via-pink-600 to-pink-800",
    },
    {
      title: "Banned Admins",
      value: bannedAdmins.toString(),
      gradient: "bg-gradient-to-r from-pink-500 via-pink-400 to-pink-600",
    },
    // {
    //   title: "System Health",
    //   value: "OK", // Static placeholder
    //   gradient: "bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-200",
    // },
  ];

  return (
    <div className="p-4 space-y-8">
      {/* User Stats Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="w-1 h-8 bg-blue-500 mr-3 rounded"></span>
          User Stats
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {userCards.map((card, index) => (
            <div
              key={index}
              className={`card p-4 rounded-lg text-white shadow-md hover:shadow-lg transition-shadow ${card.gradient}`}
            >
              <h4 className="text-lg font-semibold">{card.title}</h4>
              <p className="text-2xl font-bold mt-2">{card.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Stats Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="w-1 h-8 bg-orange-500 mr-3 rounded"></span>
          Agent Stats
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {agentCards.map((card, index) => (
            <div
              key={index}
              className={`card p-4 rounded-lg text-white shadow-md hover:shadow-lg transition-shadow ${card.gradient}`}
            >
              <h4 className="text-lg font-semibold">{card.title}</h4>
              <p className="text-2xl font-bold mt-2">{card.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Stats Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="w-1 h-8 bg-gray-500 mr-3 rounded"></span>
          Admin Stats
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminCards.map((card, index) => (
            <div
              key={index}
              className={`card p-4 rounded-lg text-white shadow-md hover:shadow-lg transition-shadow ${card.gradient}`}
            >
              <h4 className="text-lg font-semibold">{card.title}</h4>
              <p className="text-2xl font-bold mt-2">{card.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
