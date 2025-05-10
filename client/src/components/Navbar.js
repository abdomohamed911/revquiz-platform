import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="navbar flex items-center justify-between px-4 py-2 bg-white border-b border-blue-200">
      <div className="flex items-center gap-2">
        <img
          src="/aiu-logo.png"
          alt="AIU Logo"
          className="navbar-logo cursor-pointer h-10"
          onClick={() => navigate("/")}
        />
        <span
          className="navbar-title clickable text-xl font-bold text-blue-700 cursor-pointer"
          onClick={() => navigate("/")}
        >
          ReviQuiz
        </span>
      </div>
      <div className="flex items-center gap-4">
        {!token ? (
          <>
            <button
              className="px-4 py-2 text-white bg-blue-600 rounded  font-medium"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="px-4 py-2 text-white bg-blue-600 rounded  font-medium"
              onClick={() => navigate("/signup")}
            >
              Signup
            </button>
          </>
        ) : (
          <>
            <button
              className="px-4 py-2 text-white bg-blue-600 rounded font-medium "
              onClick={() => navigate("/profile")}
            >
              Profile
            </button>
            <button
              className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded  font-medium"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
