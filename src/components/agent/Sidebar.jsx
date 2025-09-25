import { useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slice/authSlice.js";
import {
  FaHome,
  FaChartLine,
  FaCreditCard,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import {
  MdPeople,
  MdForum,
  MdOutlinePriceChange,
} from "react-icons/md";
import ShyEyesLogo from "../../assets/logo/logo.png";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("auth");
    navigate("/");
  };

  return (
    <>
      {/* Hamburger Button for small screens */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <button
          onClick={toggleSidebar}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="text-gray-900 dark:text-gray-100 text-2xl bg-gray-200 dark:bg-gray-700 p-2 rounded-md shadow-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar Overlay on small screens */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? "block" : "hidden"
        } lg:hidden`}
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar Container */}
      <div
        className={`fixed top-0 left-0 min-h-screen w-64 p-5 shadow-lg transform transition-transform duration-300 z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:block
          rounded-tr-2xl rounded-br-2xl text-gray-900 dark:text-gray-100
          bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        `}
      >
        {/* Logo */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-8 mx-4 border border-gray-200 dark:border-gray-600">
          <Link to="/agent/dashboard" onClick={() => setIsOpen(false)}>
            <img
              src={ShyEyesLogo}
              alt="ShyEyes Logo"
              className="w-full object-contain dark:brightness-90"
            />
          </Link>
        </div>

        {/* Menu */}
        <ul className="space-y-2">
          {/* Dashboard */}
          <li>
            <NavLink
              to="/agent/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-3 bg-blue-600 dark:bg-blue-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  : "flex items-center gap-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              }
              onClick={() => setIsOpen(false)}
            >
              <FaHome />
              Dashboard
            </NavLink>
          </li>

          {/* User Management */}
          <li>
            <NavLink
              to="/agent/usermanagement"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-3 bg-blue-600 dark:bg-blue-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  : "flex items-center gap-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              }
              onClick={() => setIsOpen(false)}
            >
              <MdPeople className="text-cyan-500" />
              User Management
            </NavLink>
          </li>

          {/* Chats Monitoring */}
          <li>
            <NavLink
              to="/agent/chatmonitor"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-3 bg-blue-600 dark:bg-blue-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  : "flex items-center gap-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              }
              onClick={() => setIsOpen(false)}
            >
              <MdForum className="text-purple-500" />
              Chats Monitoring
            </NavLink>
          </li>

          {/* Reports */}
          <li>
            <NavLink
              to="/agent/report"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-3 bg-blue-600 dark:bg-blue-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  : "flex items-center gap-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              }
              onClick={() => setIsOpen(false)}
            >
              <FaChartLine className="text-green-500" />
              Reports
            </NavLink>
          </li>

          {/* Payments */}
          <li>
            <NavLink
              to="/agent/payment"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-3 bg-blue-600 dark:bg-blue-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  : "flex items-center gap-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              }
              onClick={() => setIsOpen(false)}
            >
              <FaCreditCard className="text-yellow-500" />
              Transactions
            </NavLink>
          </li>

          {/* Pricing Plan */}
          <li>
            <NavLink
              to="/agent/pricingplan"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-3 bg-blue-600 dark:bg-blue-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  : "flex items-center gap-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              }
              onClick={() => setIsOpen(false)}
            >
              <MdOutlinePriceChange className="text-blue-500 text-xl" />
              Pricing Plan
            </NavLink>
          </li>

          {/* Logout */}
          <li>
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-3 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors w-full text-left"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}
