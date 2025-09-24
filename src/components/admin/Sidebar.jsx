import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slice/authSlice.js";
import {
  FaHome,
  FaUsers,
  FaComments,
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
  MdSupportAgent,
  MdRealEstateAgent,
} from "react-icons/md";
import { Link } from "react-router-dom";
import ShyEyesLogo from "../../assets/logo/logo.png"

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
          className="text-white text-2xl bg-pink-500 p-2 rounded-md shadow-lg hover:bg-pink-600 transition-colors"
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
        className={`fixed top-0 left-0 min-h-screen bg-gradient-to-br from-pink-400 to-pink-600 text-white w-64 p-5 shadow-lg transform transition-transform duration-300 z-50
        ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:block rounded-tr-2xl rounded-br-2xl`}
      >
        {/* Logo */}
        <div className="bg-white rounded-lg p-4 mb-8 mx-4">
          <img
            src={ShyEyesLogo}
            alt="ShyEyes Logo"
            className="w-full"
          />
        </div>

        {/* Menu */}
        <ul className="space-y-2">
          {/* Dashboard */}
          <li>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-3 bg-[#e60082] px-4 py-3 rounded-2xl font-semibold hover:bg-pink-600 transition-colors"
                  : "flex items-center gap-3 bg-[#eb6db4cf] px-4 py-3 rounded-2xl hover:bg-pink-400 transition-colors"
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
              to="/admin/usermanagement"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-3 bg-[#e60082] px-4 py-3 rounded-2xl font-semibold hover:bg-pink-600 transition-colors"
                  : "flex items-center gap-3 bg-[#eb6db4cf] px-4 py-3 rounded-2xl hover:bg-pink-400 transition-colors"
              }
              onClick={() => setIsOpen(false)}
            >
              <MdPeople className="text-cyan-400" />
              User Management
            </NavLink>
          </li>

          {/* User Management */}
          <li>
            <NavLink
              to="/admin/agentmanagement"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-3 bg-[#e60082] px-4 py-3 rounded-2xl font-semibold hover:bg-pink-600 transition-colors"
                  : "flex items-center gap-3 bg-[#eb6db4cf] px-4 py-3 rounded-2xl hover:bg-pink-400 transition-colors"
              }
              onClick={() => setIsOpen(false)}
            >
              <MdRealEstateAgent className="text-cyan-400" />
              Agent Management
            </NavLink>
          </li>

          {/* Chats Monitoring */}
          <li>
            <NavLink
              to="/admin/chatmonitor"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-3 bg-[#e60082] px-4 py-3 rounded-2xl font-semibold hover:bg-pink-600 transition-colors"
                  : "flex items-center gap-3 bg-[#eb6db4cf] px-4 py-3 rounded-2xl hover:bg-pink-400 transition-colors"
              }
              onClick={() => setIsOpen(false)}
            >
              <MdForum className="text-purple-400" />
              Chats Monitoring
            </NavLink>
          </li>

          {/* Reports */}
          <li>
            <NavLink
              to="/admin/report"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-3 bg-[#e60082] px-4 py-3 rounded-2xl font-semibold hover:bg-pink-600 transition-colors"
                  : "flex items-center gap-3 bg-[#eb6db4cf] px-4 py-3 rounded-2xl hover:bg-pink-400 transition-colors"
              }
              onClick={() => setIsOpen(false)}
            >
              <FaChartLine className="text-green-400" />
              Reports
            </NavLink>
          </li>

          {/* Payments */}
          <li>
            <NavLink
              to="/admin/payment"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-3 bg-[#e60082] px-4 py-3 rounded-2xl font-semibold hover:bg-pink-600 transition-colors"
                  : "flex items-center gap-3 bg-[#eb6db4cf] px-4 py-3 rounded-2xl hover:bg-pink-400 transition-colors"
              }
              onClick={() => setIsOpen(false)}
            >
              <FaCreditCard className="text-yellow-400" />
              Transections
            </NavLink>
          </li>

          {/* Pricing Plan */}
          <li>
            <NavLink
              to="/admin/pricingplan"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-3 bg-[#e60082] px-4 py-3 rounded-2xl font-semibold hover:bg-pink-600 transition-colors"
                  : "flex items-center gap-3 bg-[#eb6db4cf] px-4 py-3 rounded-2xl hover:bg-pink-400 transition-colors"
              }
              onClick={() => setIsOpen(false)}
            >
              <MdOutlinePriceChange className="text-blue-400 text-xl" />
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
              className="flex items-center gap-3 bg-[#eb6db4cf] px-4 py-3 rounded-2xl hover:bg-pink-400 transition-colors w-full text-left"
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
