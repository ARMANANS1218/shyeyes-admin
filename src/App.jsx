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
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route
          path="/admin/*"
          element={user?.role === "admin" ? <AdminRoutes /> : <Navigate to="/login" />}
        />
        <Route
          path="/superadmin/*"
          element={user?.role === "superadmin" ? <SuperAdminRoutes /> : <Navigate to="/login" />}
        />
        {/* <Route
          path="/agent/*"
          element={user?.role === "agent" ? <AgentRoutes /> : <Navigate to="/login" />}
        /> */}
      </Routes>
    </Router>
  );
}

export default App;
