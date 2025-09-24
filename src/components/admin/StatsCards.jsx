import { useGetAllUsersQuery } from "../../redux/services/userApi";
import { useGetAllAgentsQuery } from "../../redux/services/agentApi";

// src/components/admin/StatsCards.jsx
export default function StatsCards() {
  const { data: allUsers, isLoading: usersLoading, error: _usersError } = useGetAllUsersQuery();
  const { data: agentsData, isLoading: agentsLoading, error: _agentsError } = useGetAllAgentsQuery();

  // Extract data from API responses
  const userList = allUsers?.users || allUsers?.data || [];
  const agentList = agentsData?.data?.agents || agentsData?.agents || [];

  // Calculate user metrics from real API data
  const totalUsers = userList.length;
  const activeUsers = userList.filter(user => 
    user.status === 'Active' || user.isActive === true
  ).length;
  const bannedUsers = userList.filter(user => 
    user.status === 'Banned' || user.isActive === false
  ).length;
  
  // Calculate agent metrics
  const totalAgents = agentList.length;
  const activeAgents = agentList.filter(agent => agent.status === 'Active').length;
  const bannedAgents = agentList.filter(agent => agent.status === 'Banned').length;
  
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
  if (usersLoading || agentsLoading) {
    return (
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4">
        <div className="animate-pulse">
          {[1, 2, 3, 4, 5].map((index) => (
            <div key={index} className="card p-4 rounded-lg bg-gray-200 shadow-md">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-8 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // User Stats Cards
  const userCards = [
    {
      title: "Total Users",
      value: totalUsers.toString(),
      gradient: "bg-gradient-to-br from-pink-500 via-pink-600 to-pink-800",
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
      title: "Total Payments",
      value: calculateTotalPayments(),
      gradient: "bg-gradient-to-r from-pink-500 via-pink-600 to-pink-800",
    },
    {
      title: "Gender Ratio",
      value: calculateGenderRatio(),
      gradient: "bg-gradient-to-r from-pink-500 via-pink-400 to-pink-600",
    },
    {
      title: "Today Login",
      value: calculateTodayLogins(),
      gradient: "bg-gradient-to-r from-pink-500 via-pink-600 to-pink-800",
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
  ];

  return (
    <div className="p-4 space-y-8 bg-transparent text-gray-900 dark:text-gray-100">
      {/* User Stats Section */}
      <div>
  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
          <span className="w-1 h-8 bg-pink-500 mr-3 rounded"></span>
          User Stats
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
          <span className="w-1 h-8 bg-blue-500 mr-3 rounded"></span>
          Agent Stats
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
    </div>
  );
}
