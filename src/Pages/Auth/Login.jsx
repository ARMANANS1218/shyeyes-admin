// src/Pages/Auth/Login.jsx
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useLoginMutation } from "../../redux/services/authApi";
import { setCredentials } from "../../redux/slice/authSlice";
import useDocumentTitle from "../../hooks/useDocumentTitle";

// roleAuthApi hooks (your file: src/redux/services/roleAuthApi.js)
import {
  useForgotPasswordMutation,
  useVerifyPassOtpMutation,
  useResetPasswordMutation,
} from "../../redux/services/roleAuthApi";

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

  // Forgot password modal states & step (email -> otp -> reset)
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStatus, setForgotStatus] = useState(null); // {type, msg}
  const [step, setStep] = useState("email"); // "email" | "otp" | "reset"

  // OTP & new password fields
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Loading states
  const [forgotLoading, setForgotLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  // Role-auth RTK hooks
  const [forgotPasswordMutation] = useForgotPasswordMutation();
  const [verifyPassOtpMutation] = useVerifyPassOtpMutation();
  const [resetPasswordMutation] = useResetPasswordMutation();

  // Ensure initial theme is applied when this page mounts
  useEffect(() => {
    try {
      const initial = getInitialTheme();
      applyTheme(initial);
    } catch (err) {
      // ignore if theme helpers missing
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
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

  // Step 1: send OTP
  const handleForgotSubmit = async (e) => {
    e && e.preventDefault();
    setForgotStatus(null);

    if (!forgotEmail || !forgotEmail.includes("@")) {
      setForgotStatus({ type: "error", msg: "Please enter a valid email." });
      return;
    }

    setForgotLoading(true);
    try {
      const res = await forgotPasswordMutation({ email: forgotEmail.trim() }).unwrap();
      // success shape: { success: true, message: "OTP sent ..." }
      setForgotStatus({ type: "success", msg: res?.message || "OTP sent. Check your email." });
      setStep("otp");
    } catch (err) {
      console.error("Forgot submit error:", err);
      const msg = err?.data?.message || err?.error || "Failed to send OTP";
      setForgotStatus({ type: "error", msg });
    } finally {
      setForgotLoading(false);
    }
  };

  // Step 2: verify OTP
  const handleVerifyOtp = async (e) => {
    e && e.preventDefault();
    setForgotStatus(null);

    if (!otp || otp.trim().length === 0) {
      setForgotStatus({ type: "error", msg: "Please enter the OTP." });
      return;
    }

    setVerifyLoading(true);
    try {
      const res = await verifyPassOtpMutation({ email: forgotEmail.trim(), otp: otp.trim() }).unwrap();
      setForgotStatus({ type: "success", msg: res?.message || "OTP verified successfully" });
      setStep("reset");
    } catch (err) {
      console.error("Verify OTP error:", err);
      const msg = err?.data?.message || err?.error || "Invalid OTP";
      setForgotStatus({ type: "error", msg });
    } finally {
      setVerifyLoading(false);
    }
  };

  // Step 3: reset password
  const handleResetPassword = async (e) => {
    e && e.preventDefault();
    setForgotStatus(null);

    if (!newPassword || !confirmPassword) {
      setForgotStatus({ type: "error", msg: "Please enter both password fields." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setForgotStatus({ type: "error", msg: "Passwords do not match." });
      return;
    }

    setResetLoading(true);
    try {
      const res = await resetPasswordMutation({
        email: forgotEmail.trim(),
        newPassword,
        confirmPassword,
      }).unwrap();

      setForgotStatus({ type: "success", msg: res?.message || "Password changed successfully." });

      // clear local fields and auto-close modal after a short delay
      setTimeout(() => {
        setShowForgot(false);
        setStep("email");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setForgotEmail("");
      }, 1300);
    } catch (err) {
      console.error("Reset password error:", err);
      const msg = err?.data?.message || err?.error || "Password reset failed";
      setForgotStatus({ type: "error", msg });
    } finally {
      setResetLoading(false);
    }
  };

  // Reset modal state when opening/closing
  useEffect(() => {
    if (!showForgot) {
      setStep("email");
      setForgotStatus(null);
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      // keep forgotEmail maybe if you want; currently cleared on successful reset
    }
  }, [showForgot]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 relative">
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
                  {/* Open in-page modal instead of immediate navigation */}
                  <button
                    type="button"
                    onClick={() => { setShowForgot(true); setForgotEmail(email || ""); }}
                    className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    Forgot password?
                  </button>
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

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowForgot(false)} />

          <div className="relative max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Forgot your password?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Follow the steps: request OTP → verify OTP → reset password.
            </p>

            {/* Step: Enter Email */}
            {step === "email" && (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <label className="block">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Email</span>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                    placeholder="you@company.com"
                  />
                </label>

                <div className="flex gap-2">
                  <button type="submit" disabled={forgotLoading} className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60">
                    {forgotLoading ? "Sending..." : "Send OTP"}
                  </button>
                  <button type="button" onClick={() => setShowForgot(false)} className="px-4 py-2 rounded-md border bg-transparent">
                    Cancel
                  </button>
                </div>

                {forgotStatus && (
                  <p className={`text-sm ${forgotStatus.type === "error" ? "text-red-600" : "text-green-600"}`}>
                    {forgotStatus.msg}
                  </p>
                )}
              </form>
            )}

            {/* Step: Enter OTP */}
            {step === "otp" && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <label className="block">
                  <span className="text-sm text-gray-600 dark:text-gray-300">OTP</span>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                    placeholder="Enter the 6-digit OTP"
                  />
                </label>

                <div className="flex gap-2">
                  <button type="submit" disabled={verifyLoading} className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60">
                    {verifyLoading ? "Verifying..." : "Verify OTP"}
                  </button>
                  <button type="button" onClick={() => { setStep("email"); setForgotStatus(null); }} className="px-4 py-2 rounded-md border bg-transparent">
                    Back
                  </button>
                </div>

                {forgotStatus && (
                  <p className={`text-sm ${forgotStatus.type === "error" ? "text-red-600" : "text-green-600"}`}>
                    {forgotStatus.msg}
                  </p>
                )}
              </form>
            )}

            {/* Step: Reset Password */}
            {step === "reset" && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <label className="block">
                  <span className="text-sm text-gray-600 dark:text-gray-300">New Password</span>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                    placeholder="New password"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Confirm Password</span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                    placeholder="Confirm password"
                  />
                </label>

                <div className="flex gap-2">
                  <button type="submit" disabled={resetLoading} className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60">
                    {resetLoading ? "Resetting..." : "Reset Password"}
                  </button>
                  <button type="button" onClick={() => { setStep("email"); setForgotStatus(null); }} className="px-4 py-2 rounded-md border bg-transparent">
                    Back
                  </button>
                </div>

                {forgotStatus && (
                  <p className={`text-sm ${forgotStatus.type === "error" ? "text-red-600" : "text-green-600"}`}>
                    {forgotStatus.msg}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
