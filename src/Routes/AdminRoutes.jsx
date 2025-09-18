import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";

// Admin Pages
import Dashboard from "../Pages/Admin/Dashboard";
import ChatMonitor from "../Pages/Admin/ChatMonitor";
import PricingPlan from "../Pages/Admin/PricingPlan";
import Report from "../Pages/Admin/Report";
import Transactions from "../Pages/Admin/Transections";
import UserManagement from "../Pages/Admin/UserManagement";

export default function AdminRoutes({ isAdmin, setIsAdmin }) {
  if (!isAdmin) return <Navigate to="/login" />;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="chatmonitor" element={<ChatMonitor />} />
          <Route path="pricingplan" element={<PricingPlan />} />
          <Route path="report" element={<Report />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="usermanagement" element={<UserManagement />} />
        </Routes>
      </div>
    </div>
  );
}
