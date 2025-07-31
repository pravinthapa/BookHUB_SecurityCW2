import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/api";
import toast from "react-hot-toast";
import { UserContext } from "../../context/UserContext";
import ReCAPTCHA from "react-google-recaptcha";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFARequired, setTwoFARequired] = useState(false);
  const [twoFACode, setTwoFACode] = useState("");
  const [pendingUser, setPendingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!recaptchaToken) {
      toast.error("Please verify you are human");
      setLoading(false);
      return;
    }
    try {
      const res = await axios.post("/auth/login", {
        email,
        password,
        token: recaptchaToken,
      });

      if (res.data.twoFactorRequired) {
        setTwoFARequired(true);
        setPendingUser({ email, password, userId: res.data.userId });
        toast("Enter your 2FA code to continue.");
        setLoading(false);
        return;
      }

      if (res.data.user) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        toast.success("Login successful!");
        navigate(res.data.user.isAdmin ? "/admin" : "/");
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (err) {
      if (err.response?.data?.twoFactorRequired) {
        setTwoFARequired(true);
        setPendingUser({ email, password, userId: err.response.data.userId });
        toast("Enter your 2FA code to continue.");
      } else {
        toast.error(err.response?.data?.msg || "Login failed");
      }
    }
    setLoading(false);
  };

  const handle2FASubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/auth/login", {
        email: pendingUser.email,
        password: pendingUser.password,
        twoFactorCode: twoFACode,
      });

      setUser(res.data.user);
      toast.success("Login successful!");
      navigate(res.data.user.isAdmin ? "/admin" : "/");
    } catch (err) {
      toast.error(err.response?.data?.msg || "2FA failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 px-4 pt-24 pb-12">
      <div className="w-full max-w-lg p-8 rounded-2xl shadow-2xl backdrop-blur-lg bg-white/90 border border-blue-200">
        <h2 className="text-3xl font-extrabold text-blue-600 text-center mb-4 tracking-tight">
          BookHuB
        </h2>
        <p className="text-center text-gray-600 mb-8 text-sm">
          Sign in to continue your journey
        </p>

        {twoFARequired ? (
          <form onSubmit={handle2FASubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">
                2FA Code
              </label>
              <input
                type="text"
                placeholder="Enter 2FA code"
                value={twoFACode}
                onChange={(e) => setTwoFACode(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                disabled={loading}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:brightness-110 text-white py-2 rounded-lg font-semibold transition-all"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
            <div className="text-sm text-center text-gray-500">
              <button
                type="button"
                className="underline text-blue-600 hover:text-blue-800"
                onClick={() => {
                  setTwoFARequired(false);
                  setTwoFACode("");
                  setPendingUser(null);
                }}
                disabled={loading}
              >
                Cancel and return to login
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                disabled={loading}
                required
              />
            </div>

            <div className="flex justify-between items-center text-sm">
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={setRecaptchaToken}
              />
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition-all"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="text-sm text-center text-gray-600">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-medium hover:underline"
              >
                Sign up
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
