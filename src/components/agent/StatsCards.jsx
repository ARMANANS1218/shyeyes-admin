import { useGetAgentDashboardStatsQuery } from "../../redux/services/agentApi";
import { useGetAllUsersQuery } from "../../redux/services/userApi";


export default function StatsCards() {
  const { data: _statsData, isLoading: agentStatsLoading, error: _agentStatsError } = useGetAgentDashboardStatsQuery();
  const { data: allUsers, isLoading: usersLoading, error: _usersError } = useGetAllUsersQuery();
  
  // Extract user data from API response
  const userList = allUsers?.users || allUsers?.data || [];

  // Calculate user metrics from real API data
  const totalUsers = userList.length;
  const activeUsers = userList.filter(user => 
    user.status === 'Active' || user.isActive === true
  ).length;
  const bannedUsers = userList.filter(user => 
    user.status === 'Banned' || user.isActive === false
  ).length;
  
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
  if (agentStatsLoading || usersLoading) {
    return (
      <div className="p-4 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((index) => (
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
  
  // Agent Performance Cards (existing functionality)
  // const agentCards = [
  //   {
  //     title: "Assigned Users",
  //     value: statsData?.data?.assignedUsers?.toString() || "0",
  //     gradient: "bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800",
  //   },
  //   {
  //     title: "Active Chats", 
  //     value: statsData?.data?.activeChats?.toString() || "0",
  //     gradient: "bg-gradient-to-t from-slate-600 via-slate-700 to-slate-800",
  //   },
  //   {
  //     title: "Completed Sessions",
  //     value: statsData?.data?.completedSessions?.toString() || "0",
  //     gradient: "bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800",
  //   },
  //   {
  //     title: "Response Rate",
  //     value: `${statsData?.data?.responseRate || 0}%`,
  //     gradient: "bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800",
  //   },
  //   {
  //     title: "Today's Sessions",
  //     value: statsData?.data?.todaySessions?.toString() || "0",
  //     gradient: "bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800",
  //   },
  // ];

  // User Stats Cards (new functionality)
  const userCards = [
    {
      title: "Total Users",
      value: totalUsers.toString(),
      gradient: "bg-gradient-to-r from-pink-500 via-pink-600 to-pink-800",
    },
    {
      title: "Active Users",
      value: activeUsers.toString(),
      gradient: "bg-gradient-to-t from-slate-600 via-slate-700 to-slate-800",
    },
    {
      title: "Banned Users",
      value: bannedUsers.toString(),
      gradient: "bg-gradient-to-r from-pink-500 via-pink-600 to-pink-800",
    },
    {
      title: "Gender Ratio",
      value: calculateGenderRatio(),
      gradient: "bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800",
    },
    {
      title: "Today Login",
      value: calculateTodayLogins(),
      gradient: "bg-gradient-to-r from-pink-500 via-pink-600 to-pink-800",
    },
  ];

  return (
    <div className="p-4 space-y-8 bg-transparent text-gray-900 dark:text-gray-100">
      {/* Agent Performance Section */}
      {/* <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="w-1 h-8 bg-pink-500 mr-3 rounded"></span>
          Agent Performance
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
      </div> */}

      {/* User Stats Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
          <span className="w-1 h-8 bg-blue-500 mr-3 rounded"></span>
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
    </div>
  );
}
