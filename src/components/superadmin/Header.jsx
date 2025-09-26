import { useState, useEffect, useRef } from "react";
import { FaBell, FaSearch, FaChevronDown, FaExpand, FaCompress } from "react-icons/fa";
import ThemeToggle from "../ThemeToggle";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/slice/authSlice.js";


export default function Header() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get user role from Redux
  const role = useSelector((state) => state.auth.user?.role);

  const [profilePic, setProfilePic] = useState(
    "https://i.pravatar.cc/150?img=3"
  ); // default

  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const toggleNotification = () => {
    setNotifOpen(!notifOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 📤 Handle profile change
  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newPic = URL.createObjectURL(file);
      setProfilePic(newPic);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("auth");
    navigate("/");
  };

  // Fullscreen handlers
  const requestFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
      // state will be synced by the fullscreenchange listener
    } catch (err) {
      // optional: show user-friendly message or ignore
      console.warn("Fullscreen toggle failed:", err);
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", onFsChange);
    // set initial state
    setIsFullscreen(!!document.fullscreenElement);

    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Capitalize role display
  const displayRole = role
    ? role.charAt(0).toUpperCase() + role.slice(1)
    : "User";

  return (
    <header className="flex items-center justify-between bg-[#fdf3f5] dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-xl font-bold text-pink-600 dark:text-indigo-300 mt-2">
          Welcome, {displayRole}
        </h2>
      
      </div>

      {/* (Optional) center area (search or other) */}
      {/* <div className="flex-1 px-4">
        <div className="flex items-center bg-white rounded-full shadow px-3 py-2 max-w-md mx-auto">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full outline-none text-sm text-gray-700"
          />
        </div>
      </div> */}

      {/* Notification + Profile Section */}
      <div className="flex items-center space-x-3 relative" ref={dropdownRef}>
        {/* Theme toggle (icon-only) */}
        <ThemeToggle />

        {/* Fullscreen toggle */}
        <button
          onClick={requestFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          className="p-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-200"
        >
          {isFullscreen ? <FaCompress size={16} /> : <FaExpand size={16} />}
        </button>

        {/* 🔔 Notification */}
        <div
          onClick={toggleNotification}
          className="cursor-pointer relative p-2 hover:bg-pink-200 dark:hover:bg-gray-700 rounded-full"
        >
          <FaBell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow-lg p-2 z-20">
              <ul>
                <li className="text-sm p-2 hover:bg-gray-100 cursor-pointer">
                  📩 You have a new message
                </li>
                <li className="text-sm p-2 hover:bg-gray-100 cursor-pointer">
                  👤 New user registered
                </li>
                <li className="text-sm p-2 hover:bg-gray-100 cursor-pointer">
                  💰 Payment received
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* 👤 Profile */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 bg-white dark:bg-gray-700 px-3 py-2 rounded-full hover:bg-pink-100 dark:hover:bg-gray-600 transition text-sm"
          >
            <img
              src={profilePic}
              alt={displayRole}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-gray-700 dark:text-gray-200 font-medium">{displayRole}</span>
            <FaChevronDown className="text-gray-600 dark:text-gray-300 text-xs" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow-lg z-20">
              <ul className="text-sm text-gray-700 dark:text-gray-200">
                <li>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => alert("Edit Profile")}
                  >
                    ✏️ Edit Profile
                  </button>
                </li>
                <li>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => fileInputRef.current.click()}
                  >
                    🖼️ Change Profile
                  </button>
                  {/* Hidden file input */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleProfileChange}
                    className="hidden"
                  />
                </li>
                <li>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
                    onClick={handleLogout}
                  >
                    🚪 Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
