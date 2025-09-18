import { Routes, Route, Navigate } from "react-router-dom";
import SuperSidebar from "../components/superadmin/Sidebar";

// SuperAdmin Pages
import Dashboard from "../Pages/SuperAdmin/Dashboard";
import ChatMonitor from "../Pages/SuperAdmin/ChatMonitor";
import PricingPlan from "../Pages/SuperAdmin/PricingPlan";
import Reports from "../Pages/SuperAdmin/Reports";
import Transactions from "../Pages/SuperAdmin/Transection";
import AdminManagement from "../Pages/SuperAdmin/AdminManagement";

export default function SuperAdminRoutes({ isSuperAdmin }) {
  if (!isSuperAdmin) return <Navigate to="/superadminlogin" />;

  return (
    <div className="flex h-screen">
      <SuperSidebar />
      <div className="flex-1 bg-gray-100">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="chatmonitor" element={<ChatMonitor />} />
          <Route path="pricingplan" element={<PricingPlan />} />
          <Route path="reports" element={<Reports />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="adminmanagement" element={<AdminManagement />} />
        </Routes>
      </div>
    </div>
  );
}
