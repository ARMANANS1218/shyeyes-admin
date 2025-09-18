import { FaCrown, FaHeart, FaUserFriends, FaStar } from "react-icons/fa";

export default function PricingPlan() {
  const plans = [
    {
      name: "Free Plan",
      price: "₹0",
      features: ["Basic Chat", "Limited Swipes", "Profile View"],
      icon: <FaUserFriends className="text-yellow-400 text-2xl" />,
    },
    {
      name: "Standard Plan",
      price: "₹499 / month",
      features: ["Unlimited Chat", "Profile Boost", "Priority Support"],
      icon: <FaHeart className="text-yellow-400 text-2xl" />,
    },
    {
      name: "Premium Plan",
      price: "₹999 / month",
      features: ["See Who Liked You", "Video Calls", "Unlimited Swipes"],
      icon: <FaStar className="text-yellow-400 text-2xl" />,
    },
    {
      name: "VIP Plan",
      price: "₹1999 / month",
      features: ["Verified Badge", "Profile Highlight", "24/7 Support"],
      icon: <FaCrown className="text-yellow-400 text-2xl" />,
    },
  ];

  // 🌈 Updated Gradient Colors to match the uploaded image
  const getGradient = (planName) => {
    switch (planName) {
      case "Free Plan":
      return "linear-gradient(120deg, #f093fb 0%, #f5576c 100%)";
     case "Standard Plan":
  return "linear-gradient(to right, #f78ca0 0%, #f9748f 19%, #fd868c 60%, #fe9a8b 100%), linear-gradient(to top, #9795f0 0%, #fbc8d4 100%)";
 
   case "Premium Plan":
  return "linear-gradient(to right, #f77062, #fe5196), linear-gradient(60deg, #96deda 0%, #50c9c3 100%)";


       case "VIP Plan":
      return "linear-gradient(to top, #9795f0 0%, #fbc8d4 100%)";
    default:
      return "linear-gradient(to right, #ccc, #eee)";
  }
  };

  const users = [
    { id: 1, name: "Rohit Sharma", plan: "Premium Plan", expiry: "2025-09-30", status: "Active" },
    { id: 2, name: "Ananya Verma", plan: "VIP Plan", expiry: "2025-09-25", status: "Expiring Soon" },
  
    { id: 3, name: "Amit Patel", plan: "Standard Plan", expiry: "2025-08-15", status: "Expired" },
    { id: 4, name: "Rahul Singh", plan: "Premium Plan", expiry: "2025-08-15", status: "Expiring Soon" },
    
    { id: 5, name: "Neha Gupta", plan: "Free Plan", expiry: "-", status: "Active" },
  ];

  return (
    <div className="p-10 bg-pink-100">
      <h1 className="text-2xl font-bold text-pink-700 mb-4">💎 Pricing Plans</h1>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="text-white shadow-lg rounded-xl p-2 text-center hover:shadow-2xl transition-transform hover:-translate-y-1"
            style={{ backgroundImage: getGradient(plan.name) }}
          >
            <div className="flex justify-center mb-2">{plan.icon}</div>
            <h2 className="text-lg font-semibold">{plan.name}</h2>
            <p className="font-bold text-md mt-1">{plan.price}</p>
            <ul className="mt-2 text-xs space-y-1">
              {plan.features.map((f, i) => (
                <li key={i}>✅ {f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <h2 className="text-xl font-semibold text-blue-600 mb-3">📊 Users & Plans</h2>
      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        <table className="w-full text-sm text-left text-gray-600">
          <thead
  className="text-white text-sm"
  style={{
    backgroundImage: "linear-gradient(to right, #ff758c 0%, #ff7eb3 100%)",
  }}
>

            <tr>
              <th className="px-4 py-2">User ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Plan</th>
              <th className="px-4 py-2">Expiry Date</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-pink-100 transition">
                <td className="px-4 py-2">{user.id}</td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.plan}</td>
                <td className="px-4 py-2">{user.expiry}</td>
                <td
                  className={`px-4 py-2 font-semibold ${
                    user.status === "Active"
                      ? "text-green-500"
                      : user.status === "Expiring Soon"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {user.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
