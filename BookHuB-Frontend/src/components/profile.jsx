import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/api";
import API, { addEmail, removeEmail } from "../api/api";
import toast from "react-hot-toast";
import { FaUserCircle, FaLock } from "react-icons/fa";

export default function Profile() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    dob: "", // ✅ Added DOB
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [twoFA, setTwoFA] = useState({ enabled: false });
  const [qr, setQr] = useState("");
  const [twoFASecret, setTwoFASecret] = useState("");
  const [twoFACode, setTwoFACode] = useState("");
  const [twoFASetup, setTwoFASetup] = useState(false);
  const [twoFALoading, setTwoFALoading] = useState(false);
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [id, setId] = useState("");

  useEffect(() => {
    getProfile()
      .then((data) => {
        setForm({
          name: data.name || "",
          phone: data.phone || "",
          email: data.email || "",
          address: data.address || "",
          dob: data.dob || "", // ✅ Load DOB
        });
        setId(data._id);
        setEmails(data.emails || []);
        setTwoFA({ enabled: !!data.twoFactorEnabled });
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.message || "Failed to load profile");
        setLoading(false);
      });
  }, [twoFALoading]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form); // ✅ Includes DOB
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmNewPassword } = passwords;
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setSavingPassword(true);
    try {
      await updateProfile({
        password: newPassword,
        currentPassword,
      });
      toast.success("Password changed successfully");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  // 2FA: Start setup (get QR)
  const handleEnable2FA = async () => {
    setTwoFALoading(true);
    try {
      const res = await API.patch(`/users/${id}/enable-2fa`);
      toast.success("2FA enabled");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to start 2FA setup");
    } finally {
      setTwoFALoading(false);
    }
  };

  // 2FA: Confirm setup
  const handleConfirm2FA = async (e) => {
    e.preventDefault();
    setTwoFALoading(true);
    try {
      await API.post("/users/2fa/confirm", { code: twoFACode });
      toast.success("2FA enabled successfully");
      setTwoFA({ enabled: true });
      setTwoFASetup(false);
      setQr("");
      setTwoFASecret("");
      setTwoFACode("");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to enable 2FA");
    } finally {
      setTwoFALoading(false);
    }
  };

  // 2FA: Disable
  const handleDisable2FA = async () => {
    setTwoFALoading(true);
    try {
      await API.patch(`/users/${id}/disable-2fa`);
      toast.success("2FA disabled");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to disable 2FA");
    } finally {
      setTwoFALoading(false);
    }
  };

  // Add a new email
  const handleAddEmail = async (e) => {
    e.preventDefault();
    setEmailLoading(true);
    try {
      await addEmail(newEmail);
      toast.success("Verification email sent");
      setEmails((prev) => [...prev, { address: newEmail, verified: false }]);
      setNewEmail("");
    } catch (err) {
      toast.error(err.message || "Failed to add email");
    } finally {
      setEmailLoading(false);
    }
  };

  // Remove an email
  const handleRemoveEmail = async (address) => {
    setEmailLoading(true);
    try {
      await removeEmail(address);
      setEmails((prev) => prev.filter((e) => e.address !== address));
      toast.success("Email removed");
    } catch (err) {
      toast.error(err.message || "Failed to remove email");
    } finally {
      setEmailLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-lg text-blue-700">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-10 flex justify-center items-start">
      <div className="w-full max-w-3xl bg-white border border-blue-200 rounded-2xl p-8 shadow-lg space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">
            BookHuB Account
          </h1>
          <p className="text-sm text-gray-600">
            Manage your profile, security & emails
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-blue-700 mb-4 flex items-center gap-2">
            📬 Email Accounts
          </h3>
          <ul className="mb-4 space-y-2">
            {emails.map((e) => (
              <li
                key={e.address}
                className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200"
              >
                <span className="font-mono text-gray-700">{e.address}</span>
                {e.verified ? (
                  <span className="text-blue-600 text-sm font-medium">
                    ✔ Verified
                  </span>
                ) : (
                  <span className="text-yellow-600 text-sm font-medium">
                    ⏳ Pending
                  </span>
                )}
                {e.address !== form.email && (
                  <button
                    className="ml-auto text-red-600 text-sm underline hover:text-red-700 transition"
                    onClick={() => handleRemoveEmail(e.address)}
                    disabled={emailLoading}
                  >
                    Remove
                  </button>
                )}
                {e.address === form.email && (
                  <span className="text-sm text-blue-600 font-medium ml-auto">
                    (Primary)
                  </span>
                )}
              </li>
            ))}
          </ul>
          <form onSubmit={handleAddEmail} className="flex gap-2 items-center">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Add new email address"
              className="flex-1 border border-blue-300 px-4 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              required
              disabled={emailLoading}
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              disabled={emailLoading}
            >
              {emailLoading ? "Adding..." : "Add Email"}
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            {" "}
            You can log in from any verified email address.
          </p>
        </div>

        {/* Profile Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">👤</span>
            <h2 className="text-2xl font-semibold text-blue-700">My Profile</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                disabled={saving}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                disabled={saving}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                disabled={saving}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                disabled={saving}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                disabled={saving}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition shadow-md"
            disabled={saving}
          >
            {saving ? "Saving..." : "Update Profile"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <hr className="flex-1 border-t border-blue-300" />
          <span className="text-2xl"></span>
          <hr className="flex-1 border-t border-blue-300" />
        </div>

        {/* Change Password Section */}
        <form onSubmit={handleChangePassword} className="space-y-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-4 flex items-center gap-2">
            Change Password
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                disabled={savingPassword}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                disabled={savingPassword}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmNewPassword"
                value={passwords.confirmNewPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                disabled={savingPassword}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition shadow-md"
            disabled={savingPassword}
          >
            {savingPassword ? "Changing..." : "Update Password"}
          </button>
        </form>

        {/* 2FA Section */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-blue-700 mb-4 flex items-center gap-2">
            🔐 Two-Factor Authentication (2FA)
          </h3>

          {twoFA?.enabled ? (
            <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-blue-700 font-semibold flex items-center gap-2">
                2FA is enabled on your account for enhanced security.
              </div>
              <button
                onClick={handleDisable2FA}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition shadow-md"
                disabled={twoFALoading}
              >
                {twoFALoading ? "Disabling..." : "Disable 2FA"}
              </button>
            </div>
          ) : (
            <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-gray-700">
                <span className="font-semibold">2FA is currently disabled</span>{" "}
                on your account.
                <br />
                <span className="text-sm text-gray-600">
                  Enable two-factor authentication for enhanced security.
                </span>
              </div>
              <button
                onClick={handleEnable2FA}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition shadow-md"
                disabled={twoFALoading}
              >
                {twoFALoading ? "Loading..." : "Enable 2FA"}
              </button>
            </div>
          )}
        </div>
        {/* <div className="mt-12">
          <h3 className="text-xl font-semibold text-blue-700 mb-4 flex items-center gap-2">
            🔐 Two-Factor Authentication (2FA)
          </h3>
          {twoFA.enabled ? (
            <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-blue-700 font-semibold flex items-center gap-2">
                 2FA is enabled on your account for enhanced security.
              </div>
              <button
                onClick={handleDisable2FA}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition shadow-md"
                disabled={twoFALoading}
              >
                {twoFALoading ? "Disabling..." : "Disable 2FA"}
              </button>
            </div>
          ) : twoFASetup ? (
            <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <form onSubmit={handleConfirm2FA} className="space-y-4">
                <div className="text-center">
                  <div className="mb-4 text-gray-700">Scan this QR code with your authenticator app:</div>
                  {qr && <img src={qr} alt="2FA QR Code" className="mx-auto w-48 h-48 border-2 border-blue-300 rounded-lg" />}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Enter verification code from your app</label>
                  <input
                    type="text"
                    value={twoFACode}
                    onChange={e => setTwoFACode(e.target.value)}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-center tracking-widest"
                    placeholder="000000"
                    required
                    disabled={twoFALoading}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition shadow-md"
                    disabled={twoFALoading}
                  >
                    {twoFALoading ? "Enabling..." : "Confirm & Enable 2FA"}
                  </button>
                  <button
                    type="button"
                    className="px-4 py-3 text-gray-600 hover:text-gray-800 underline font-medium transition"
                    onClick={() => { setTwoFASetup(false); setQr(""); setTwoFASecret(""); setTwoFACode(""); }}
                    disabled={twoFALoading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-gray-700">
                <span className="font-semibold">2FA is currently disabled</span> on your account. 
                <br />
                <span className="text-sm text-gray-600">Enable two-factor authentication for enhanced security.</span>
              </div>
              <button
                onClick={handleEnable2FA}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition shadow-md"
                disabled={twoFALoading}
              >
                {twoFALoading ? "Loading..." : "Enable 2FA"}
              </button>
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
}
