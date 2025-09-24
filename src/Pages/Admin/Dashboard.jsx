import { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import Header from "../../components/admin/Header";
import StatsCards from "../../components/admin/StatsCards";
import AdminAnalytics from "../../components/admin/AdminAnalytics";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Dashboard() {
  const [_sidebarContent, setSidebarContent] = useState("");
  const [showNotif, _setShowNotif] = useState(false);

  useEffect(() => {
    fetch("/sidebar.html")
      .then((res) => {
        if (!res.ok) throw new Error("Sidebar file not found");
        return res.text();
      })
      .then((html) => setSidebarContent(html))
      .catch((err) => {
        console.error(err);
        setSidebarContent(
          '<p class="text-white p-4">Sidebar failed to load.</p>'
        );
      });
  }, []);

  const barData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Logins",
        data: [120, 190, 300, 500, 200, 300, 450],
        backgroundColor: [
          "#ff6b6b",
          "#feca57",
          "#48dbfb",
          "#1dd1a1",
          "#5f27cd",
          "#ff9ff3",
          "#00d2d3",
        ],
      },
    ],
  };

  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Payments",
        data: [1500, 2000, 1800, 2400],
        borderColor: "#ff6b6b",
        backgroundColor: "rgba(255,107,107,0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-x-hidden">
      <Header />
      <StatsCards />
      
      {/* Admin Analytics Dashboard */}
      <AdminAnalytics />

      <div className="flex flex-col text-gray-900 dark:text-gray-100">
        <div className="flex-1 p-6">
          {showNotif && (
            <div
              id="notifPopup"
              className="bg-gray-700 p-4 rounded mb-6 shadow-lg"
            >
              <p>New notifications will appear here!</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Login Activity */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-full overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  Login Activity
                </h3>
              </div>
              <Bar data={barData} options={options} />
            </div>

            {/* Payments Trend */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-full overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                  Payments Trend
                </h3>
              </div>
              <Line data={lineData} options={options} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
