import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";

// Admin Pages
import Dashboard from "../Pages/Admin/Dashboard";
import ChatMonitor from "../Pages/Admin/ChatMonitor";
import PricingPlan from "../Pages/Admin/PricingPlan";
import Report from "../Pages/Admin/Report";
import Payments from "../Pages/Admin/Transections";
import UserManagement from "../Pages/Admin/UserManagement";

export default function AdminRoutes() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="chatmonitor" element={<ChatMonitor />} />
          <Route path="pricingplan" element={<PricingPlan />} />
          <Route path="report" element={<Report />} />
          <Route path="payment" element={<Payments />} />
          <Route path="usermanagement" element={<UserManagement />} />
          {/* Agar sirf /admin aaya to Dashboard dikhana */}
          <Route path="" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
}
