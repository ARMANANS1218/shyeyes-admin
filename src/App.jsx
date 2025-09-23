import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import useDocumentTitle from "./hooks/useDocumentTitle";

// Pages
import Login from "./Pages/Auth/Login";
import AdminRoutes from "./Routes/AdminRoutes";
import SuperAdminRoutes from "./Routes/SuperAdminRoutes";
import AgentRoutes from "./Routes/AgentRoutes";

function App() {
  const { user } = useSelector((state) => state.auth);
  
  // This will update the title whenever the auth state changes
  useDocumentTitle();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Agent Protected Routes */}
        <Route
          path="/agent/*"
          element={
            user?.role?.toLowerCase() === "agent" ? (
              <AgentRoutes />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin/*"
          element={
            user?.role?.toLowerCase() === "admin" ? (
              <AdminRoutes />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* SuperAdmin Protected Routes */}
        <Route
          path="/superadmin/*"
          element={
            user?.role?.toLowerCase() === "superadmin" ? (
              <SuperAdminRoutes />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
