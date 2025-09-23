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
import AgentCards from "../../components/agent/AgentCards";
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
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Header />
      <AgentCards />

      <div className="flex flex-col text-black">
        <div className="flex-1 p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Login Activity */}
            <div className="p-4 rounded shadow-lg max-w-full overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Login Activity</h3>
              </div>
              <Bar data={barData} options={options} />
            </div>

            {/* Payments Trend */}
            <div className="p-4 rounded shadow-lg max-w-full overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Payments Trend</h3>
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
