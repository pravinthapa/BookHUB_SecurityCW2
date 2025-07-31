import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { verifyEmail } from "../../api/api";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const doVerify = async () => {
      try {
        await verifyEmail(token);
        setStatus("success");
        setMessage("Your email has been verified! You can now log in with this email.");
      } catch (err) {
        setStatus("error");
        setMessage(err.message || "Verification failed. The link may have expired.");
      }
    };
    doVerify();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 to-emerald-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white border border-green-200 shadow-xl rounded-3xl p-10 max-w-lg w-full text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-6">Email Verification 🍇</h2>

        {status === "verifying" && (
          <div className="text-gray-600 text-base animate-pulse">
            Verifying your email...
          </div>
        )}

        {status === "success" && (
          <>
            <div className="text-green-600 text-lg font-medium mb-4">
              {message}
            </div>
            <Link
              to="/login"
              className="inline-block mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-full transition"
            >
              Go to Login 
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-red-600 text-lg font-medium mb-4">
              {message}
            </div>
            <Link
              to="/profile"
              className="inline-block mt-2 border-2 border-red-500 text-red-600 hover:bg-red-50 font-semibold py-2 px-6 rounded-full transition"
            >
              Go to Profile 
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
