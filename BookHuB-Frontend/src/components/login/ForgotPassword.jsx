import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "../../api/api";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/auth/forgot-password", { email });
      toast.success("Password reset link sent! Check your email.");
      navigate("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.msg || "Failed to send reset link. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f8f3] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-green-100">
        <h2 className="text-2xl font-bold text-blue-400 mb-4 text-center">Forgot Password</h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your email and we'll send you a reset link.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-blue-500 mb-1">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-semibold transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-800 hover:bg-blue-500"
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <p className="text-[11px] text-center text-gray-400 mt-2">
            We'll never share your email with anyone else.
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
