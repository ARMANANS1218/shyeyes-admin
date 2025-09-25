// src/pages/agent/Dashboard.jsx
import { useState, useEffect, useRef } from "react";
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
import Header from "../../components/agent/Header";
import StatsCards from "../../components/agent/StatsCards";
import AgentAnalytics from "../../components/agent/AgentAnalytics";
import useDocumentTitle from "../../hooks/useDocumentTitle";

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
  useDocumentTitle("Dashboard"); // This will set the title as "Dashboard - Agent Dashboard | ShyEyes"

  // store chart data in state so we can update colors on theme change
  const [barData, setBarData] = useState(null);
  const [lineData, setLineData] = useState(null);
  const mountedRef = useRef(false);

  const defaultBarValues = [120, 190, 300, 500, 200, 300, 450];
  const defaultLineValues = [1500, 2000, 1800, 2400];

  // options that will adapt text color based on CSS variables
  const [chartOptions, setChartOptions] = useState({
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--text-muted')?.trim() || '#374151',
        }
      },
      title: { display: false }
    },
    scales: {
      x: { ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-muted')?.trim() || '#374151' } },
      y: { ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-muted')?.trim() || '#374151' }, beginAtZero: true }
    }
  });

  // function to (re)build datasets using CSS variables
  function applyThemeColors() {
    const styles = getComputedStyle(document.documentElement);

    const chartText = styles.getPropertyValue('--text-muted')?.trim() || '#374151';
    const chartPrimary = styles.getPropertyValue('--chart-primary')?.trim() || '#ff6b6b';
    const chartAccent = styles.getPropertyValue('--chart-accent')?.trim() || '#1dd1a1';
    const chartBar1 = styles.getPropertyValue('--chart-bar-1')?.trim() || '#ff6b6b';
    const chartBar2 = styles.getPropertyValue('--chart-bar-2')?.trim() || '#feca57';
    const chartBar3 = styles.getPropertyValue('--chart-bar-3')?.trim() || '#48dbfb';
    const chartBg = styles.getPropertyValue('--chart-bg')?.trim() || (document.documentElement.classList.contains('dark') ? '#0b1220' : '#ffffff');

    // Bar data
    setBarData({
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Logins",
          data: defaultBarValues,
          backgroundColor: [chartBar1, chartBar2, chartBar3, chartAccent, chartPrimary, chartBar1, chartBar2],
          borderColor: 'transparent',
        },
      ],
    });

    // Line data
    setLineData({
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
        {
          label: "Payments",
          data: defaultLineValues,
          borderColor: chartPrimary,
          backgroundColor: `${chartPrimary}33`, // 20% alpha hex fallback by appending 33
          fill: true,
          tension: 0.4,
          pointBackgroundColor: chartPrimary,
        },
      ],
    });

    // update options text color
    setChartOptions(opts => ({
      ...opts,
      plugins: {
        ...(opts.plugins || {}),
        legend: {
          labels: { color: chartText }
        }
      },
      scales: {
        x: { ticks: { color: chartText } },
        y: { ticks: { color: chartText }, beginAtZero: true }
      }
    }));

    // update container backgrounds (if needed elsewhere) — not necessary here but left for clarity
    // document body/chart containers already use tailwind dark: classes
  }

  useEffect(() => {
    // Run once on mount to build initial data
    applyThemeColors();
    mountedRef.current = true;

    // Observe <html> class changes to react to theme toggles (adds/removes 'dark')
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === 'class') {
          applyThemeColors();
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // while building initial state
  if (!barData || !lineData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-x-hidden">
        <Header />
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-64 bg-white dark:bg-gray-800 rounded-lg shadow"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-x-hidden">
      <Header />
      <StatsCards />
      
      {/* Agent Analytics Dashboard */}
      <AgentAnalytics />

      <div className="flex flex-col text-black dark:text-gray-100">
        <div className="flex-1 p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Login Activity */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-full overflow-hidden transition-colors">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center text-gray-800 dark:text-gray-100">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  Login Activity
                </h3>
              </div>
              <Bar data={barData} options={chartOptions} />
            </div>

            {/* Payments Trend */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-full overflow-hidden transition-colors">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center text-gray-800 dark:text-gray-100">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  Payments Trend
                </h3>
              </div>
              <Line data={lineData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
