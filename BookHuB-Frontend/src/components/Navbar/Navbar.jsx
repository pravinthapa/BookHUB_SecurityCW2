import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaUserCircle,
  FaChevronDown,
  FaShoppingCart,
  FaClipboardList,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { UserContext } from "../../context/UserContext";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
  const { user, logout, loading } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const [navbarSearch, setNavbarSearch] = useState("");
  const { cartItems } = useCart();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDropdownClick = (path) => {
    setDropdownOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  const handleNavbarSearch = (e) => {
    e.preventDefault();
    if (navbarSearch.trim()) {
      navigate(
        `/allproducts?search=${encodeURIComponent(navbarSearch.trim())}`
      );
    } else {
      navigate("/allproducts");
    }
  };

  if (loading) return null;

  return (
    <header className="w-full shadow-md sticky top-0 z-50 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight text-blue-600"
        >
          BOOK<span className="text-indigo-700">HUB</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex gap-8 text-gray-700 font-medium text-sm">
          <Link to="/" className="hover:text-indigo-800 transition">
            HOME
          </Link>
          <Link to="/allproducts" className="hover:text-indigo-800 transition">
            SHOP
          </Link>
          <Link to="/about" className="hover:text-indigo-800 transition">
            ABOUT
          </Link>
          <Link to="/contact" className="hover:text-indigo-800 transition">
            CONTACT
          </Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          {user && (
            <Link
              to="/cart"
              className="flex items-center gap-1 text-gray-700 hover:text-indigo-800 transition"
            >
              <FaShoppingCart size={20} />
              <span>[{cartItems?.length ?? 0}]</span>{" "}
              {/* Replace 0 with actual cart count logic */}
            </Link>
          )}

          {/* User Menu */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <div
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1 text-gray-700 cursor-pointer text-sm"
              >
                <FaUserCircle size={20} />
                <span>{user.name}</span>
                <FaChevronDown size={12} />
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-blue-100 rounded-md shadow-lg z-50">
                  <button
                    onClick={() => handleDropdownClick("/profile")}
                    className="w-full flex justify-between items-center px-4 py-2 hover:bg-blue-50"
                  >
                    Profile <FaUserCircle size={14} />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex justify-between items-center px-4 py-2 hover:bg-blue-50"
                  >
                    Logout <FaSignOutAlt size={14} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden lg:flex gap-3">
              <Link
                to="/login"
                className="text-sm px-4 py-2 border border-blue-500 text-blue-600 rounded-full hover:bg-blue-500 hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-sm px-4 py-2 border border-purple-500 text-purple-600 rounded-full hover:bg-purple-500 hover:text-white transition"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Toggle */}
          <button
            className="lg:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-6 pb-4 text-sm font-medium text-gray-700 space-y-3">
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>
            HOME
          </Link>
          <Link to="/allproducts" onClick={() => setMobileMenuOpen(false)}>
            SHOP
          </Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
            ABOUT
          </Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
            CONTACT
          </Link>
          {!user && (
            <>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                Sign In
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
