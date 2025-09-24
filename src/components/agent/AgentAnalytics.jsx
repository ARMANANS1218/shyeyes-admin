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

const AgentAnalytics = () => {
  const { data: allUsers, isLoading: usersLoading } = useGetAllUsersQuery();

  // Extract data from API responses
  const userList = allUsers?.users || allUsers?.data || [];

  if (usersLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // User Interaction Analysis
  const userInteractionData = {
    labels: ['Active Conversations', 'Pending Requests', 'Resolved Issues'],
    datasets: [{
      data: [
        Math.round(userList.length * 0.15), // Simulated active conversations
        Math.round(userList.length * 0.08), // Simulated pending requests
        Math.round(userList.length * 0.77)  // Simulated resolved issues
      ],
      backgroundColor: ['#10B981', '#F59E0B', '#3B82F6'],
      borderColor: ['#059669', '#D97706', '#2563EB'],
      borderWidth: 2,
    }]
  };

  // Performance Metrics (simulated based on user base)
  const getPerformanceMetrics = () => {
    const last7Days = [];
    const responseTimes = [];
    const interactions = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Simulated performance metrics
      const dayInteractions = Math.floor(Math.random() * 20) + 10;
      const responseTime = Math.floor(Math.random() * 5) + 2;
      
      last7Days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
      responseTimes.push(responseTime);
      interactions.push(dayInteractions);
    }
    
    return { labels: last7Days, responseTimes, interactions };
  };

  const performanceData = getPerformanceMetrics();
  
  const responseTimeData = {
    labels: performanceData.labels,
    datasets: [{
      label: 'Avg Response Time (min)',
      data: performanceData.responseTimes,
      borderColor: '#8B5CF6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
    }]
  };

  const interactionData = {
    labels: performanceData.labels,
    datasets: [{
      label: 'Daily Interactions',
      data: performanceData.interactions,
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderColor: '#3B82F6',
      borderWidth: 2,
      borderRadius: 4,
    }]
  };

  // User Satisfaction Simulation
  const satisfactionData = {
    labels: ['Excellent', 'Good', 'Average', 'Needs Improvement'],
    datasets: [{
      data: [45, 30, 20, 5], // Simulated satisfaction percentages
      backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'],
      borderColor: ['#059669', '#2563EB', '#D97706', '#DC2626'],
      borderWidth: 2,
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
          <span className="w-2 h-8 bg-gradient-to-b from-green-600 to-blue-600 mr-3 rounded"></span>
          Agent Performance Analytics
        </h2>
        <p className="text-gray-600 dark:text-gray-300">Your performance metrics and user interaction insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Interaction Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            Current User Interactions
          </h3>
          <div className="h-64">
            <Pie data={userInteractionData} options={chartOptions} />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">Total Users: <span className="font-semibold text-blue-600">{userList.length}</span></p>
          </div>
        </div>

        {/* User Satisfaction */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            User Satisfaction Ratings
          </h3>
          <div className="h-64">
            <Doughnut data={satisfactionData} options={chartOptions} />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Avg Rating: <span className="font-semibold text-green-600">4.2/5.0</span></p>
          </div>
        </div>

        {/* Response Time Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
            Response Time Trends
          </h3>
          <div className="h-64">
            <Line data={responseTimeData} options={{
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
            <p className="text-sm text-gray-600">Avg Response: <span className="font-semibold text-purple-600">
              {Math.round(performanceData.responseTimes.reduce((a, b) => a + b, 0) / 7)} minutes
            </span></p>
          </div>
        </div>

        {/* Daily Interactions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <span className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></span>
            Daily Interaction Volume
          </h3>
          <div className="h-64">
            <Bar data={interactionData} options={{
              ...chartOptions,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { stepSize: 5 },
                  grid: { color: 'rgba(0, 0, 0, 0.1)' }
                },
                x: { grid: { display: false } }
              }
            }} />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Avg Daily: <span className="font-semibold text-indigo-600">
              {Math.round(performanceData.interactions.reduce((a, b) => a + b, 0) / 7)} interactions
            </span></p>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
          <span className="w-4 h-4 bg-gradient-to-r from-green-600 to-blue-600 rounded mr-3"></span>
          Performance Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border-l-4 border-green-500">
            <h4 className="font-semibold text-green-800">Active Sessions</h4>
            <p className="text-2xl font-bold text-green-600">
              {Math.round(userList.length * 0.15)}
            </p>
            <p className="text-green-600 text-sm">Currently helping</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-800">Resolved Today</h4>
            <p className="text-2xl font-bold text-blue-600">
              {performanceData.interactions[6]}
            </p>
            <p className="text-blue-600 text-sm">Issues resolved</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border-l-4 border-purple-500">
            <h4 className="font-semibold text-purple-800">Avg Response</h4>
            <p className="text-2xl font-bold text-purple-600">
              {Math.round(performanceData.responseTimes.reduce((a, b) => a + b, 0) / 7)}m
            </p>
            <p className="text-purple-600 text-sm">Response time</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg border-l-4 border-indigo-500">
            <h4 className="font-semibold text-indigo-800">Satisfaction</h4>
            <p className="text-2xl font-bold text-indigo-600">4.2★</p>
            <p className="text-indigo-600 text-sm">User rating</p>
          </div>
        </div>
      </div>

      {/* Weekly Goals */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg p-6 border border-blue-200">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
          <span className="w-4 h-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded mr-3"></span>
          This Week's Goals
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {performanceData.interactions.reduce((a, b) => a + b, 0)}
            </div>
            <p className="text-gray-600 text-sm">Total Interactions</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">75% of weekly goal</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">4.2</div>
            <p className="text-gray-600 text-sm">Satisfaction Score</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-green-600 h-2 rounded-full" style={{width: '84%'}}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Above target (4.0)</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {Math.round(performanceData.responseTimes.reduce((a, b) => a + b, 0) / 7)}
            </div>
            <p className="text-gray-600 text-sm">Avg Response (min)</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{width: '90%'}}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Excellent performance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentAnalytics;