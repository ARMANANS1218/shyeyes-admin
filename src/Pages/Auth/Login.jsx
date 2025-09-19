// Pages/Auth/Login.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useLoginMutation } from "../../redux/services/authApi";
import { setCredentials } from "../../redux/slice/authSlice";

import bgImage from "../../assets/image.png";
import logo from "../../assets/logo/Logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password }).unwrap();
      console.log("LOGIN RESPONSE:", response);

      // Save user + token in redux
      dispatch(setCredentials(response));

      // Normalize role
      const role = response?.user?.role?.toLowerCase();

      // Redirect based on role
      if (role === "superadmin") {
        navigate("/superadmin/dashboard");
      } else if (role === "admin" || role === "agent") {
        navigate("/admin/dashboard");
      } else {
        setError("Unauthorized role");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password");
    }
  };

  return (
    <div
      className="w-full h-screen flex items-center justify-center bg-center bg-no-repeat bg-cover"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-pink-200 bg-opacity-90 p-8 rounded-xl shadow-lg w-full max-w-sm">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="w-40" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Welcome back.
        </h2>
        <p className="text-gray-600 text-sm mb-6 text-center">
          Log in to access your Admin Panel. Let's get things done.
        </p>

        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-pink-400"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-pink-600 text-white font-bold py-2 rounded-md hover:bg-pink-500 transition"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

        <Link
          to="/changepassword"
          className="block text-center text-red-600 font-semibold text-sm mt-4 hover:underline"
        >
          Forgot password?
        </Link>
      </div>
    </div>
  );
};

export default Login;
