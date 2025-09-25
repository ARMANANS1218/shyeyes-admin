import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import useDocumentTitle from "../hooks/useDocumentTitle";

// Admin Pages
import Dashboard from "../Pages/Admin/Dashboard";
import ChatMonitor from "../Pages/Admin/ChatMonitor";
import PricingPlan from "../Pages/Admin/PricingPlan";
import Report from "../Pages/Admin/Report";
import Payments from "../Pages/Admin/Transactions";
import UserManagement from "../Pages/Admin/UserManagement";
import AgentManagement from "../Pages/Admin/AgentManagement";

export default function AdminRoutes() {
  useDocumentTitle(); // This will set the title as "Admin Dashboard | ShyEyes"

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1  ">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="chatmonitor" element={<ChatMonitor />} />
          <Route path="pricingplan" element={<PricingPlan />} />
          <Route path="report" element={<Report />} />
          <Route path="payment" element={<Payments />} />
          <Route path="usermanagement" element={<UserManagement />} />
          <Route path="agentmanagement" element={<AgentManagement />} />
          {/* Agar sirf /admin aaya to Dashboard dikhana */}
          <Route path="" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
}
