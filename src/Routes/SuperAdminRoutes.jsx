import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/superadmin/Sidebar";

// SuperAdmin Pages
import Dashboard from "../Pages/SuperAdmin/Dashboard";
import AdminManagement from "../Pages/SuperAdmin/AdminManagement";
import ChatMonitor from "../Pages/SuperAdmin/ChatMonitor";
import PricingPlan from "../Pages/SuperAdmin/PricingPlan";
import Reports from "../Pages/SuperAdmin/Reports";
import Transection from "../Pages/SuperAdmin/Transection";

export default function SuperAdminRoutes() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="adminmanagement" element={<AdminManagement />} />
          <Route path="chatmonitor" element={<ChatMonitor />} />
          <Route path="pricingplan" element={<PricingPlan />} />
          <Route path="reports" element={<Reports />} />
          <Route path="transection" element={<Transection />} />
          {/* Default route */}
          <Route path="" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
}
