import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/agent/Sidebar";
import useDocumentTitle from "../hooks/useDocumentTitle";

// Agent Pages ---> Here all routes for agent will come
import Dashboard from "../Pages/Agent/Dashboard";
import ChatMonitor from "../Pages/Agent/ChatMonitor";
import UserManagement from "../Pages/Agent/UserManagement";
// Import Admin pages for missing agent functionality
import PricingPlan from "../Pages/Admin/PricingPlan";
import Report from "../Pages/Admin/Report";
import Payments from "../Pages/Admin/Transections";

export default function AgentRoutes() {
  useDocumentTitle(); // This will set the title as "Agent Dashboard | ShyEyes"

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
          {/* Agar sirf /agent aaya to Dashboard dikhana */}
          <Route path="" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
}
