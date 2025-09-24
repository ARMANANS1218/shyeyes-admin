import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from 'chart.js';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import { useGetAllUsersQuery } from "../../redux/services/userApi";
import { useGetAllAgentsQuery } from "../../redux/services/agentApi";
import { useGetAllAdminsBySuperAdminQuery } from "../../redux/services/adminApi";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

const AnalyticsDashboard = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const { data: allUsers, isLoading: usersLoading, refetch: refetchUsers } = useGetAllUsersQuery(
    undefined,
    {
      pollingInterval: 30000, // Poll every 30 seconds
      refetchOnFocus: true, // Refetch when window gains focus
      refetchOnReconnect: true, // Refetch when connection is restored
    }
  );
  const { data: agentsData, isLoading: agentsLoading, refetch: refetchAgents } = useGetAllAgentsQuery(
    { limit: 1000 }, // Set high limit to get all agents for analytics
    {
      pollingInterval: 30000, // Poll every 30 seconds
      refetchOnFocus: true, // Refetch when window gains focus
      refetchOnReconnect: true, // Refetch when connection is restored
    }
  );
  const { data: adminsData, isLoading: adminsLoading, refetch: refetchAdmins } = useGetAllAdminsBySuperAdminQuery(
    { limit: 1000 }, // Set high limit to get all admins for analytics
    {
      pollingInterval: 30000, // Poll every 30 seconds
      refetchOnFocus: true, // Refetch when window gains focus
      refetchOnReconnect: true, // Refetch when connection is restored
    }
  );

  // Function to manually refresh all data
  const refreshAllData = () => {
    refetchUsers();
    refetchAgents();
    refetchAdmins();
    setLastUpdated(new Date());
  };

  // Update last updated time when data changes
  useEffect(() => {
    if (allUsers || agentsData || adminsData) {
      setLastUpdated(new Date());
    }
  }, [allUsers, agentsData, adminsData]);

  // Extract data from API responses
  const userList = allUsers?.users || allUsers?.data || [];
  const agentList = agentsData?.data?.agents || agentsData?.agents || [];
  const adminList = Array.isArray(adminsData?.admins) ? adminsData.admins 
    : Array.isArray(adminsData?.data?.admins) ? adminsData.data.admins
    : Array.isArray(adminsData?.data) ? adminsData.data
    : [];

  // Extract total counts from pagination metadata when available
  const totalUsersCount = allUsers?.total || allUsers?.pagination?.total || userList.length;
  const totalAgentsCount = agentsData?.data?.pagination?.totalAgents || agentsData?.pagination?.totalAgents || agentsData?.total || agentList.length;
  const totalAdminsCount = adminsData?.data?.pagination?.totalAdmins || adminsData?.pagination?.totalAdmins || adminsData?.total || adminList.length;

  console.log('Analytics Total Counts Debug:', {
    totalUsersCount,
    totalAgentsCount,  
    totalAdminsCount,
    userListLength: userList.length,
    agentListLength: agentList.length,
    adminListLength: adminList.length
  });

  if (usersLoading || agentsLoading || adminsLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // User Status Distribution
  const userStatusData = {
    labels: ['Active Users', 'Banned Users'],
    datasets: [{
      data: [
        userList.filter(user => user.status === 'Active' || user.isActive === true).length,
        userList.filter(user => user.status === 'Banned' || user.isActive === false).length
      ],
      backgroundColor: ['#10B981', '#EF4444'],
      borderColor: ['#059669', '#DC2626'],
      borderWidth: 2,
    }]
  };

  // Gender Distribution
  const genderData = {
    labels: ['Male', 'Female', 'Other/Unknown'],
    datasets: [{
      data: [
        userList.filter(user => 
          user.gender?.toLowerCase() === 'male' || user.gender?.toLowerCase() === 'm'
        ).length,
        userList.filter(user => 
          user.gender?.toLowerCase() === 'female' || user.gender?.toLowerCase() === 'f'
        ).length,
        userList.filter(user => 
          !user.gender || (!['male', 'm', 'female', 'f'].includes(user.gender?.toLowerCase()))
        ).length
      ],
      backgroundColor: ['#3B82F6', '#EC4899', '#6B7280'],
      borderColor: ['#2563EB', '#DB2777', '#4B5563'],
      borderWidth: 2,
    }]
  };

  // Agent Status Distribution
  const agentStatusData = {
    labels: ['Active Agents', 'Banned Agents'],
    datasets: [{
      data: [
        agentList.filter(agent => agent.status === 'Active').length,
        agentList.filter(agent => agent.status === 'Banned').length
      ],
      backgroundColor: ['#8B5CF6', '#F59E0B'],
      borderColor: ['#7C3AED', '#D97706'],
      borderWidth: 2,
    }]
  };

  // Admin Status Distribution
  const getAdminStatusCounts = () => {
    const activeAdmins = adminList.filter(admin => {
      // An admin is active if not explicitly banned
      const isBannedExplicitly = admin.status === 'Banned' || admin.isBanned === true || admin.isActive === false;
      return !isBannedExplicitly && (admin.status === 'Active' || admin.isActive === true || admin.isBanned === false || admin.isBanned == null);
    });
    
    const bannedAdmins = adminList.filter(admin => {
      // An admin is banned if explicitly marked as banned
      return admin.status === 'Banned' || admin.isBanned === true || admin.isActive === false;
    });

    // Debug logging - you can remove this later
    console.log('Admin Status Debug:', {
      totalAdmins: adminList.length,
      activeCount: activeAdmins.length,
      bannedCount: bannedAdmins.length,
      sum: activeAdmins.length + bannedAdmins.length,
      adminList: adminList.map(admin => ({
        id: admin._id || admin.id,
        status: admin.status,
        isActive: admin.isActive,
        isBanned: admin.isBanned
      }))
    });

    return {
      active: activeAdmins.length,
      banned: bannedAdmins.length
    };
  };

  const adminStatusCounts = getAdminStatusCounts();
  
  const adminStatusData = {
    labels: ['Active Admins', 'Banned Admins'],
    datasets: [{
      data: [adminStatusCounts.active, adminStatusCounts.banned],
      backgroundColor: ['#06B6D4', '#EF4444'],
      borderColor: ['#0891B2', '#DC2626'],
      borderWidth: 2,
    }]
  };

  // Registration Trends (last 7 days)
  const getRegistrationTrends = () => {
    const last7Days = [];
    const counts = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const registrations = userList.filter(user => {
        const userDate = new Date(user.createdAt || user.registrationDate || user.joinDate);
        return userDate.toISOString().split('T')[0] === dateStr;
      }).length;
      
      last7Days.push(date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
      counts.push(registrations);
    }
    
    return { labels: last7Days, data: counts };
  };

  const trendData = getRegistrationTrends();
  const registrationTrendData = {
    labels: trendData.labels,
    datasets: [{
      label: 'New User Registrations',
      data: trendData.data,
      borderColor: '#8B5CF6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#8B5CF6',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 6,
    }]
  };

  // Overall Platform Stats
  const platformStatsData = {
    labels: ['Users', 'Agents', 'Admins'],
    datasets: [{
      label: 'Total Count',
      data: [totalUsersCount, totalAgentsCount, totalAdminsCount],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(6, 182, 212, 0.8)'
      ],
      borderColor: [
        '#3B82F6',
        '#8B5CF6',
        '#06B6D4'
      ],
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
      }
    }
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    }
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
  <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
              <span className="w-2 h-10 bg-gradient-to-b from-purple-600 to-pink-600 mr-4 rounded"></span>
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">Comprehensive insights and data visualization</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={refreshAllData}
              className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2"
              title="Refresh all data"
            >
              🔄 Refresh Data
            </button>
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* Platform Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Status Distribution */}
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            User Status Distribution
          </h3>
          <div className="h-64">
            <Doughnut data={userStatusData} options={chartOptions} />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Total Users: <span className="font-semibold text-blue-600">{totalUsersCount}</span></p>
          </div>
        </div>

        {/* Gender Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <span className="w-3 h-3 bg-pink-500 rounded-full mr-2"></span>
            Gender Distribution
          </h3>
          <div className="h-64">
            <Pie data={genderData} options={chartOptions} />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Diversity Index: <span className="font-semibold text-purple-600">Active Monitoring</span></p>
          </div>
        </div>

        {/* Platform Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            Platform Overview
          </h3>
          <div className="h-64">
            <Bar data={platformStatsData} options={barChartOptions} />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Total Entities: <span className="font-semibold text-indigo-600">{totalUsersCount + totalAgentsCount + totalAdminsCount}</span></p>
          </div>
        </div>

        {/* Agent Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
            Agent Status
          </h3>
          <div className="h-64">
            <Doughnut data={agentStatusData} options={chartOptions} />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Active Rate: <span className="font-semibold text-purple-600">
              {agentList.length > 0 ? Math.round((agentList.filter(a => a.status === 'Active').length / agentList.length) * 100) : 0}%
            </span></p>
          </div>
        </div>

        {/* Admin Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <span className="w-3 h-3 bg-cyan-500 rounded-full mr-2"></span>
            Admin Status
          </h3>
          <div className="h-64">
            <Doughnut data={adminStatusData} options={chartOptions} />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">Active Rate: <span className="font-semibold text-cyan-600">
              {adminList.length > 0 ? Math.round((adminList.filter(a => 
                a.status === 'Active' || a.isActive === true || !a.isBanned
              ).length / adminList.length) * 100) : 0}%
            </span></p>
          </div>
        </div>
      </div>

      {/* Registration Trends - Half Width */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Registration Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <span className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></span>
            Registration Trends (7 Days)
          </h3>
          <div className="h-64">
            <Line data={registrationTrendData} options={{
              ...chartOptions,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                  },
                  grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                  }
                },
                x: {
                  grid: {
                    display: false,
                  }
                }
              }
            }} />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Avg/Day: <span className="font-semibold text-indigo-600">
              {Math.round(trendData.data.reduce((a, b) => a + b, 0) / 7)}
            </span></p>
          </div>
        </div>
        
        {/* Placeholder for future chart or empty space */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
            Payment Trends (Coming Soon)
          </h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Payment analytics will be available here</p>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Integration: <span className="font-semibold text-orange-600">Pending</span></p>
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
            <span className="w-4 h-4 bg-transparent rounded mr-3"></span>
          Key Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-blue-800">User Engagement</h4>
            <p className="text-blue-600 text-sm mt-1">
              {userList.length > 0 ? Math.round((userList.filter(u => u.status === 'Active' || u.isActive === true).length / userList.length) * 100) : 0}% active users
            </p>
          </div>
            <div className="p-4 rounded-lg bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-purple-800">Agent Performance</h4>
            <p className="text-purple-600 text-sm mt-1">
              {agentList.length > 0 ? Math.round((agentList.filter(a => a.status === 'Active').length / agentList.length) * 100) : 0}% agents active
            </p>
          </div>
            <div className="p-4 rounded-lg bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-green-800">Platform Growth</h4>
            <p className="text-green-600 text-sm mt-1">
              {trendData.data.reduce((a, b) => a + b, 0)} new users this week
            </p>
          </div>
            <div className="p-4 rounded-lg bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-cyan-800">System Health</h4>
            <p className="text-cyan-600 text-sm mt-1">
              {Math.round(((userList.length + agentList.length + adminList.length) / 3) * 10) / 10} avg per role
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;