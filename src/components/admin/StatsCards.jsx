// src/components/StatCards.jsx
export default function StatCards() {
  const cards = [
    {
      title: "Total Users",
      value: "2000",
      gradient: "bg-gradient-to-br from-pink-300 via-pink-400 to-pink-500",
    },
    {
      title: "Active Users",
      value: "1500",
      gradient: "bg-gradient-to-t from-purple-400 via-purple-300 to-pink-200",
    },
    {
      title: "Total Payments",
      value: "23.56K",
      gradient: "bg-gradient-to-r from-pink-300 via-pink-400 to-pink-500",
    },
    {
      title: "Gender Ratio",
      value: "60/40",
      gradient: "bg-gradient-to-r from-pink-400 via-pink-300 to-pink-200",
    },
    {
      title: "Today login",
      value: "200",
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
