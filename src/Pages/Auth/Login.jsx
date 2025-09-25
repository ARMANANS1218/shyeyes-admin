// Pages/Auth/Login.jsx
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useLoginMutation } from "../../redux/services/authApi";
import { setCredentials } from "../../redux/slice/authSlice";
import useDocumentTitle from "../../hooks/useDocumentTitle";

import bgImage from "../../assets/loginbg.jpg";
import logo from "../../assets/logo/logo.png";
import { FaEnvelope, FaLock, FaRegEye, FaRegEyeSlash } from "react-icons/fa";

// Theme helpers & toggle
import ThemeToggle from "../../components/ThemeToggle";
import { applyTheme, getInitialTheme } from "../../theme/theme";

const Login = () => {
  useDocumentTitle("Login"); // sets title: "Login | ShyEyes"

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  // Ensure initial theme is applied when this page mounts
  useEffect(() => {
    try {
      const initial = getInitialTheme();
      applyTheme(initial);
    } catch (err) {
      // swallow - theme file might not exist in your project structure
      // console.warn("Theme apply failed", err);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password }).unwrap();
      // Save user + token in redux
      dispatch(setCredentials(response));
      // Persist to localStorage
      localStorage.setItem("auth", JSON.stringify(response));
      // Normalize role & redirect
      const responseRole = response?.user?.role?.toLowerCase();
      if (responseRole === "superadmin") {
        navigate("/superadmin/dashboard");
      } else if (responseRole === "admin") {
        navigate("/admin/dashboard");
      } else if (responseRole === "agent") {
        navigate("/agent/dashboard");
      } else {
        setError("Unauthorized role");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      {/* Theme toggle (top-right) */}
              <div className="absolute top-4 right-4">
                <ThemeToggle />
              </div>
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 h-[80vh]">
            {/* LEFT: image only on md+ */}
            <div
              className="hidden md:block md:col-span-7 bg-cover bg-center"
              style={{
                backgroundImage: `url(${bgImage})`,
              }}
              aria-hidden="true"
            />

            {/* RIGHT: all content */}
            <div className="col-span-1 md:col-span-5 p-8 md:p-12 flex flex-col justify-center relative">
              

              {/* Logo & heading */}
              <div className="mb-6">
                <img src={logo} alt="ShyEyes Logo" className="w-28 mb-4" />
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                  Welcome Back
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Sign in to access your admin dashboard
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-5" aria-label="Login form">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaEnvelope />
                    </span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="username"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-base text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaLock />
                    </span>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-11 pr-12 py-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-base text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 focus:outline-none"
                    >
                      {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Link to="/changepassword" className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
                    Forgot password?
                  </Link>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Need an account? talk to admin</span>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 text-base font-semibold rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition disabled:opacity-60"
                  >
                    {isLoading ? "Logging in..." : "Sign in"}
                  </button>
                </div>

                {error && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>}
              </form>

              {/* Footer links */}
              <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                <p>
                  By signing in you agree to our{" "}
                  <Link to="/terms" className="text-indigo-600 hover:underline dark:text-indigo-400">Terms</Link>{" "}
                  &{" "}
                  <Link to="/privacy" className="text-indigo-600 hover:underline dark:text-indigo-400">Privacy</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
};

export default Login;
