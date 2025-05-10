import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/auth/login", { email, password });
      const token = res.data.data.token;
      localStorage.setItem("token", token);
      navigate("/"); // Redirect to home or dashboard
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md bg-white border border-blue-200 rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="block text-sm font-medium text-blue-700 mb-1"
            >
              Email
            </label>
            <input
              id="login-email"
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
              htmlFor="login-password"
              className="block text-sm font-medium text-blue-700 mb-1"
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-blue-900"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {error && (
            <div className="text-blue-700 bg-blue-100 border border-blue-200 rounded p-2 text-center text-sm mt-2">
              {error}
            </div>
          )}
        </form>
        <div className="mt-6 text-center">
          <span className="text-blue-700">Don't have an account?</span>
          <button
            className=" hover:underline font-medium"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
