import React, { useState } from "react";
import { useForgotPasswordMutation } from "../../redux/api/authApi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleForgot = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword(email).unwrap();
      setMessage(res.message || "Password reset link sent.");
    } catch (err) {
      setMessage("Error sending reset link.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleForgot}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-2 border rounded-md mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-pink-600 text-white py-2 rounded-md"
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
        {message && <p className="mt-2 text-sm">{message}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;
