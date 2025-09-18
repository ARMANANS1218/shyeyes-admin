import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation, useForgotPasswordMutation } from "../../redux/services/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/slice/authSlice";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [email, setEmail] = useState("");

  const [login] = useLoginMutation();
  const [forgotPassword] = useForgotPasswordMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ username, password }).unwrap();
      dispatch(setCredentials(res));
      // role ke hisaab se redirect
      if (res.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (res.user.role === "superadmin") {
        navigate("/superadmin/dashboard");
      } else if (res.user.role === "agent") {
        navigate("/agent/dashboard");
      } else {
        setError("Unauthorized role");
      }
    } catch (err) {
      setError(err?.data?.message || "Login failed");
    }
  };

  const handleForgotPassword = async () => {
    try {
      await forgotPassword(email).unwrap();
      alert("Password reset link sent!");
      setShowForgot(false);
    } catch (err) {
      setError(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-sm">
        {!showForgot ? (
          <>
            <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                className="w-full px-4 py-2 border rounded"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="submit"
                className="w-full bg-pink-600 text-white py-2 rounded"
              >
                Login
              </button>
            </form>
            <p
              className="text-sm text-blue-600 mt-3 cursor-pointer text-center"
              onClick={() => setShowForgot(true)}
            >
              Forgot Password?
            </p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4 text-center">Forgot Password</h2>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleForgotPassword}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Send Reset Link
            </button>
            <p
              className="text-sm text-gray-600 mt-3 cursor-pointer text-center"
              onClick={() => setShowForgot(false)}
            >
              Back to Login
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
