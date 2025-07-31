import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/api";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const validateName = (name) => /^[A-Za-z\s]{2,}$/.test(name.trim());
  const validateEmail = (email) =>
    /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());
  const validatePassword = (password) =>
    password.length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score++;
    return score >= 5 ? 4 : score;
  };

  const strengthLabels = [
    "Too short",
    "Weak",
    "Medium",
    "Strong",
    "Very strong",
  ];
  const strengthClasses = [
    "bg-gray-200 text-gray-700",
    "bg-red-200 text-red-700",
    "bg-yellow-200 text-yellow-700",
    "bg-blue-200 text-blue-700",
    "bg-green-200 text-green-700",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === "password") {
      setPasswordStrength(getPasswordStrength(value));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!validateName(form.name))
      newErrors.name = "Name must be at least 2 characters.";
    if (!validateEmail(form.email)) newErrors.email = "Invalid email format.";
    if (!validatePassword(form.password))
      newErrors.password =
        "Must be 8+ chars, with upper, lower, digit & special char.";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await API.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      toast.success("Registered successfully!");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.msg || "Something went wrong";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex justify-center items-center px-4 pt-20 pb-10">
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl border border-blue-200 p-8">
        <h2 className="text-3xl font-extrabold text-blue-600 text-center mb-2 tracking-tight">
          Register 🔐
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Create a secure account to get started
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 text-sm">
          {/* Name */}
          <div>
            <label className="font-medium text-blue-700 block mb-1">
              Full Name
            </label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="font-medium text-blue-700 block mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="font-medium text-blue-700 block mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {form.password && (
              <div className="mt-1">
                <span
                  className={`inline-block text-xs px-2 py-1 rounded-full ${strengthClasses[passwordStrength]}`}
                >
                  {strengthLabels[passwordStrength]}
                </span>
              </div>
            )}
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="font-medium text-blue-700 block mb-1">
              Confirm Password
            </label>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-600 mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 mt-2 rounded-lg font-semibold shadow-md transition-all"
          >
            Create Account
          </button>

          {/* Sign-in prompt */}
          <div className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
