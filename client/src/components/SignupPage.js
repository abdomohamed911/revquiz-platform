import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../lib/axios";

function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If redirected to signup, save intended path
    if (location.state?.redirectTo) {
      sessionStorage.setItem("redirectTo", location.state.redirectTo);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/auth/signup", { email, password });
      const token = res.data.data.token;
      localStorage.setItem("token", token);
      // Check for redirect path in sessionStorage
      const redirectTo =
        sessionStorage.getItem("redirectTo") ||
        location.state?.redirectTo ||
        "/";
      sessionStorage.removeItem("redirectTo");
      navigate(redirectTo);
    } catch (err) {
      if (err.response?.status === 422) {
        setError("Invalid email or password.");
        return;
      } else {
        setError(
          err.response?.data?.message || "Signup failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md bg-white border border-blue-200 rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="signup-email"
              className="block text-sm font-medium text-blue-700 mb-1"
            >
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-blue-900"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label
              htmlFor="signup-password"
              className="block text-sm font-medium text-blue-700 mb-1"
            >
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-blue-900"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
          {error && (
            <div className="text-blue-700 bg-blue-100 border border-blue-200 rounded p-2 text-center text-sm mt-2">
              {error}
            </div>
          )}
        </form>
        <div className="mt-6 text-center">
          <span className="text-blue-700">Already have an account?</span>{" "}
          <button
            className=" hover:underline font-medium"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
