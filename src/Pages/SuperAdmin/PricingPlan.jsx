import { useState } from "react";
import { FaCrown, FaHeart, FaUserFriends, FaStar, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";

export default function PricingPlan() {
  const [plans, setPlans] = useState([
    {
      name: "Free Plan",
      price: "₹0",
      features: ["Basic Chat", "Limited Swipes", "Profile View"],
      icon: <FaUserFriends className="text-yellow-400 text-2xl" />,
      gradientClass:
        "from-pink-300 via-pink-400 to-pink-500 bg-gradient-to-br dark:from-pink-700 dark:via-pink-800 dark:to-pink-900",
    },
    {
      name: "Standard Plan",
      price: "₹499 / month",
      features: ["Unlimited Chat", "Profile Boost", "Priority Support"],
      icon: <FaHeart className="text-yellow-400 text-2xl" />,
      gradientClass:
        "from-amber-300 via-rose-300 to-rose-400 bg-gradient-to-r dark:from-amber-600 dark:via-rose-700 dark:to-rose-800",
    },
    {
      name: "Premium Plan",
      price: "₹999 / month",
      features: ["See Who Liked You", "Video Calls", "Unlimited Swipes"],
      icon: <FaStar className="text-yellow-400 text-2xl" />,
      gradientClass:
        "from-orange-300 via-pink-300 to-fuchsia-400 bg-gradient-to-tr dark:from-orange-700 dark:via-pink-800 dark:to-fuchsia-900",
    },
    {
      name: "VIP Plan",
      price: "₹1999 / month",
      features: ["Verified Badge", "Profile Highlight", "24/7 Support"],
      icon: <FaCrown className="text-yellow-400 text-2xl" />,
      gradientClass:
        "from-indigo-300 via-purple-300 to-pink-300 bg-gradient-to-br dark:from-indigo-700 dark:via-purple-800 dark:to-pink-900",
    },
  ]);

  const handleEditPlan = (index) => {
    const plan = plans[index];

    Swal.fire({
      title: `Edit ${plan.name}`,
      html: `
        <input id="price" class="swal2-input" placeholder="Price" value="${plan.price}" />
        <textarea id="features" class="swal2-textarea" placeholder="Features (comma-separated)">${plan.features.join(
          ", "
        )}</textarea>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const price = document.getElementById("price").value;
        const features = document.getElementById("features").value;

        if (!price || !features) {
          Swal.showValidationMessage("Both fields are required");
          return false;
        }

        return {
          price,
          features: features.split(",").map((f) => f.trim()),
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedPlans = [...plans];
        updatedPlans[index] = {
          ...plan,
          price: result.value.price,
          features: result.value.features,
        };
        setPlans(updatedPlans);

        Swal.fire("Saved!", `${plan.name} updated successfully`, "success");
      }
    });
  };

  const users = [
    { id: 1, name: "Rohit Sharma", plan: "Premium Plan", expiry: "2025-09-30", status: "Active" },
    { id: 2, name: "Ananya Verma", plan: "VIP Plan", expiry: "2025-09-25", status: "Expiring Soon" },
    { id: 3, name: "Amit Patel", plan: "Standard Plan", expiry: "2025-08-15", status: "Expired" },
    { id: 4, name: "Rahul Singh", plan: "Premium Plan", expiry: "2025-08-15", status: "Expiring Soon" },
    { id: 5, name: "Neha Gupta", plan: "Free Plan", expiry: "-", status: "Active" },
  ];

  return (
    <div className="min-h-screen p-10 bg-pink-50 dark:bg-gray-900 transition-colors">
      <h1 className="text-2xl font-bold text-pink-700 dark:text-pink-300 mb-6">💎 Pricing Plans</h1>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative rounded-xl p-4 text-center shadow-lg transform transition-transform hover:-translate-y-1 hover:shadow-2xl text-gray-900 dark:text-gray-100`}
          >
            {/* Gradient background - uses plan.gradientClass */}
            <div
              aria-hidden
              className={`absolute inset-0 rounded-xl opacity-95 ${plan.gradientClass}`}
              style={{ zIndex: -1 }}
            />

            {/* Edit Button */}
            <button
              className="absolute top-3 right-3 text-white/90 hover:text-white"
              onClick={() => handleEditPlan(index)}
              title="Edit Plan"
            >
              <FaEdit />
            </button>

            <div className="flex justify-center mb-3">{plan.icon}</div>
            <h2 className="text-lg font-semibold">{plan.name}</h2>
            <p className="font-bold text-md mt-1">{plan.price}</p>
            <ul className="mt-3 text-sm space-y-1">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center justify-center gap-2">
                  <span className="text-green-600 dark:text-green-400">✅</span>
                  <span className="truncate max-w-[14rem]">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-300 mb-3">📊 Users & Plans</h2>
      <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-xl">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-200">
          <thead
            className="text-sm"
            // table header gradient that adapts in dark mode
            style={{
              background:
                "linear-gradient(90deg, rgba(255,117,140,1) 0%, rgba(255,126,179,1) 100%)",
            }}
          >
            <tr>
              <th className="px-4 py-3 text-white">User ID</th>
              <th className="px-4 py-3 text-white">Name</th>
              <th className="px-4 py-3 text-white">Plan</th>
              <th className="px-4 py-3 text-white">Expiry Date</th>
              <th className="px-4 py-3 text-white">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b last:border-b-0 transition-colors hover:bg-pink-50 dark:hover:bg-gray-700"
              >
                <td className="px-4 py-3">{user.id}</td>
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.plan}</td>
                <td className="px-4 py-3">{user.expiry}</td>
                <td
                  className={`px-4 py-3 font-semibold ${
                    user.status === "Active"
                      ? "text-green-600 dark:text-green-400"
                      : user.status === "Expiring Soon"
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-red-600 dark:text-red-400"
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
