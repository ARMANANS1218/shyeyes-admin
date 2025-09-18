import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/image.png";
import logo from "../../assets/logo/logo.png";

const Logout = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  useEffect(() => {
    setIsLoggedIn(false);
  }, [setIsLoggedIn]);
  const handleLogout = () => {
    navigate("/");
  };
  return (
    <div
      className="w-full h-screen flex items-center justify-center bg-center bg-no-repeat bg-cover"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-pink-200 bg-opacity-90 p-8 rounded-xl shadow-lg w-full max-w-sm text-center">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="w-40" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          You are logged out.
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          Thank you for using the Admin Panel. Please login again to continue.
        </p>

        <button
          onClick={handleLogout}
          className="w-full bg-pink-600 text-white font-bold py-2 rounded-md hover:bg-pink-500 transition"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default Logout;
