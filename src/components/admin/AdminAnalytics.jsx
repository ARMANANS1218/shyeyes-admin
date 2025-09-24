import React from 'react';
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

const AdminAnalytics = () => {
  const { data: allUsers, isLoading: usersLoading } = useGetAllUsersQuery();
  const { data: agentsData, isLoading: agentsLoading } = useGetAllAgentsQuery();

  // Extract data from API responses
  const userList = allUsers?.users || allUsers?.data || [];
  const agentList = agentsData?.data?.agents || agentsData?.agents || [];

  if (usersLoading || agentsLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // User Activity Analysis
  const userActivityData = {
    labels: ['Active Users', 'Inactive Users', 'New This Week'],
    datasets: [{
      data: [
        userList.filter(user => user.status === 'Active' || user.isActive === true).length,
        userList.filter(user => user.status === 'Banned' || user.isActive === false).length,
        userList.filter(user => {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          const userDate = new Date(user.createdAt || user.registrationDate);
          return userDate >= weekAgo;
        }).length
      ],
      backgroundColor: ['#10B981', '#EF4444', '#3B82F6'],
      borderColor: ['#059669', '#DC2626', '#2563EB'],
      borderWidth: 2,
    }]
  };

  // User Engagement Trends (last 10 days)
  const getEngagementTrends = () => {
    const last10Days = [];
    const loginCounts = [];
    
    for (let i = 9; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const logins = userList.filter(user => {
        const lastLogin = new Date(user.lastLogin || user.lastActiveDate || user.createdAt);
        return lastLogin.toISOString().split('T')[0] === dateStr;
      }).length;
      
      last10Days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      loginCounts.push(logins);
    }
    
    return { labels: last10Days, data: loginCounts };
  };

  const engagementTrends = getEngagementTrends();
  const engagementData = {
    labels: engagementTrends.labels,
    datasets: [{
      label: 'Daily User Activity',
      data: engagementTrends.data,
      borderColor: '#8B5CF6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#8B5CF6',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 5,
    }]
  };

  // Agent Performance Overview
  const agentPerformanceData = {
    labels: ['Available', 'Busy', 'Offline'],
    datasets: [{
      data: [
        agentList.filter(agent => agent.status === 'Active').length,
        agentList.filter(agent => agent.status === 'Busy' || agent.status === 'In Session').length,
        agentList.filter(agent => agent.status === 'Banned' || agent.status === 'Offline').length
      ],
      backgroundColor: ['#10B981', '#F59E0B', '#6B7280'],
      borderColor: ['#059669', '#D97706', '#4B5563'],
      borderWidth: 2,
    }]
  };

  // User Demographics by Age Group (estimated from registration patterns)
  const getDemographicsData = () => {
    const now = new Date();
    const recentUsers = userList.filter(user => {
      const registrationDate = new Date(user.createdAt || user.registrationDate);
      const monthsAgo = (now - registrationDate) / (1000 * 60 * 60 * 24 * 30);
      return monthsAgo <= 12;
    }).length;

    const olderUsers = userList.length - recentUsers;

    return {
      labels: ['New Users (< 1 year)', 'Established Users (> 1 year)'],
      datasets: [{
        label: 'User Tenure',
        data: [recentUsers, olderUsers],
        backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(139, 92, 246, 0.8)'],
        borderColor: ['#3B82F6', '#8B5CF6'],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }]
    };
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
          font: { size: 12 }
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

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center">
          <span className="w-2 h-8 bg-gradient-to-b from-blue-600 to-purple-600 mr-3 rounded"></span>
          Admin Analytics
        </h2>
        <p className="text-gray-600 dark:text-gray-300">User and Agent management insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* User Activity Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            User Activity Status
          </h3>
          <div className="h-64">
            <Pie data={userActivityData} options={chartOptions} />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">Total Managed: <span className="font-semibold text-blue-600">{userList.length} users</span></p>
          </div>
        </div>

        {/* Agent Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            Agent Availability
          </h3>
          <div className="h-64">
            <Doughnut data={agentPerformanceData} options={chartOptions} />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">Total Agents: <span className="font-semibold text-green-600">{agentList.length}</span></p>
          </div>
        </div>

        {/* User Engagement Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
            User Engagement (10 Days)
          </h3>
          <div className="h-64">
            <Line data={engagementData} options={{
              ...chartOptions,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { stepSize: 1 },
                  grid: { color: 'rgba(0, 0, 0, 0.1)' }
                },
                x: { grid: { display: false } }
              }
            }} />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">Avg Activity: <span className="font-semibold text-purple-600">
              {Math.round(engagementTrends.data.reduce((a, b) => a + b, 0) / 10)} per day
            </span></p>
          </div>
        </div>

        {/* User Tenure Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <span className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></span>
            User Tenure Distribution
          </h3>
          <div className="h-64">
            <Bar data={getDemographicsData()} options={{
              ...chartOptions,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { stepSize: 1 },
                  grid: { color: 'rgba(0, 0, 0, 0.1)' }
                },
                x: { grid: { display: false } }
              }
            }} />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">Retention Focus: <span className="font-semibold text-indigo-600">Long-term users</span></p>
          </div>
        </div>
      </div>

      {/* Management Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
          <span className="w-4 h-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded mr-3"></span>
          Management Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-800">Active Users</h4>
            <p className="text-2xl font-bold text-blue-600">
              {userList.filter(u => u.status === 'Active' || u.isActive === true).length}
            </p>
            <p className="text-blue-600 text-sm">Currently active</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border-l-4 border-green-500">
            <h4 className="font-semibold text-green-800">Available Agents</h4>
            <p className="text-2xl font-bold text-green-600">
              {agentList.filter(a => a.status === 'Active').length}
            </p>
            <p className="text-green-600 text-sm">Ready to assist</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border-l-4 border-purple-500">
            <h4 className="font-semibold text-purple-800">System Health</h4>
            <p className="text-2xl font-bold text-purple-600">
              {userList.length > 0 && agentList.length > 0 ? 
                Math.round((userList.filter(u => u.status === 'Active' || u.isActive === true).length / 
                          agentList.filter(a => a.status === 'Active').length) * 10) / 10 : 0}
            </p>
            <p className="text-purple-600 text-sm">Users per agent</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;