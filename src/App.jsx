import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Pages
import Login from "./Pages/Auth/Login";
import AdminRoutes from "./routes/AdminRoutes";
import SuperAdminRoutes from "./routes/SuperAdminRoutes";
// import AgentRoutes from "./routes/AgentRoutes";

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Admin Protected Routes */}
        <Route
          path="/admin/*"
          element={
            ["admin", "agent"].includes(user?.role?.toLowerCase())
              ? <AdminRoutes />
              : <Navigate to="/" replace />
          }
        />

        <Route
          path="/superadmin/*"
          element={
            user?.role?.toLowerCase() === "superadmin"
              ? <SuperAdminRoutes />
              : <Navigate to="/" replace />
          }
        />


      </Routes>

    </Router>
  );
}

export default App;
