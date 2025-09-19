import { useState, useEffect, useRef } from "react";
import { FaBell, FaSearch, FaChevronDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/slice/authSlice.js"

export default function Header() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  // Capitalize role  display
  const displayRole = role
    ? role.charAt(0).toUpperCase() + role.slice(1)
    : "User";

  return (
    <header className="flex items-center justify-between bg-[#fdf3f5] p-4 rounded-lg shadow mb-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-xl font-bold text-pink-600 mt-2">
          Welcome, {displayRole}
        </h2>
        <p className="text-sm text-gray-600 ml-2 -mt-1">
          Here's what's happening in your account
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex items-center bg-white rounded-full shadow px-3 py-2 w-1/3">
        <FaSearch className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full outline-none text-sm text-gray-700"
        />
      </div>

      {/* Notification + Profile Section */}
      <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
        {/* 🔔 Notification */}
        <div
          onClick={toggleNotification}
          className="cursor-pointer relative p-2 hover:bg-pink-200 rounded-full"
        >
          <FaBell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow-lg p-2 z-20">
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
            className="flex items-center space-x-2 bg-white px-3 py-2 rounded-full hover:bg-pink-100 transition text-sm"
          >
            <img
              src={profilePic}
              alt={displayRole}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-gray-700 font-medium">{displayRole}</span>
            <FaChevronDown className="text-gray-600 text-xs" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-20">
              <ul className="text-sm text-gray-700">
                <li>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => alert("Edit Profile")}
                  >
                    ✏️ Edit Profile
                  </button>
                </li>
                <li>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
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
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
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
