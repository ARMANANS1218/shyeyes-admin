import { useGetAgentDashboardStatsQuery } from "../../redux/services/agentApi";

// src/components/agent/AgentCards.jsx
export default function AgentCards() {
  const { data: statsData, isLoading, error } = useGetAgentDashboardStatsQuery();
  
  // Default cards structure for fallback
  const defaultCards = [
    {
      title: "Assigned Users",
      value: "0",
      gradient: "bg-gradient-to-br from-pink-300 via-pink-400 to-pink-500",
    },
    {
      title: "Active Chats",
      value: "0", 
      gradient: "bg-gradient-to-t from-purple-400 via-purple-300 to-pink-200",
    },
    {
      title: "Completed Sessions",
      value: "0",
      gradient: "bg-gradient-to-r from-pink-300 via-pink-400 to-pink-500",
    },
    {
      title: "Response Rate",
      value: "0%",
      gradient: "bg-gradient-to-r from-pink-400 via-pink-300 to-pink-200",
    },
    {
      title: "Today's Sessions",
      value: "0",
      gradient: "bg-gradient-to-br from-purple-200 via-pink-200 to-pink-300",
    },
  ];

  // Use API data if available, otherwise use defaults
  const cards = isLoading || error ? defaultCards : [
    {
      title: "Assigned Users",
      value: statsData?.data?.assignedUsers?.toString() || "0",
      gradient: "bg-gradient-to-br from-pink-300 via-pink-400 to-pink-500",
    },
    {
      title: "Active Chats", 
      value: statsData?.data?.activeChats?.toString() || "0",
      gradient: "bg-gradient-to-t from-purple-400 via-purple-300 to-pink-200",
    },
    {
      title: "Completed Sessions",
      value: statsData?.data?.completedSessions?.toString() || "0",
      gradient: "bg-gradient-to-r from-pink-300 via-pink-400 to-pink-500",
    },
    {
      title: "Response Rate",
      value: `${statsData?.data?.responseRate || 0}%`,
      gradient: "bg-gradient-to-r from-pink-400 via-pink-300 to-pink-200",
    },
    {
      title: "Today's Sessions",
      value: statsData?.data?.todaySessions?.toString() || "0",
      gradient: "bg-gradient-to-br from-purple-200 via-pink-200 to-pink-300",
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`card p-4 rounded-lg text-white shadow-md ${card.gradient}`}
        >
          <h4 className="text-lg font-semibold">{card.title}</h4>
          <p className="text-2xl font-bold mt-2">{card.value}</p>
        </div>
      ))}
    </section>
  );
}
