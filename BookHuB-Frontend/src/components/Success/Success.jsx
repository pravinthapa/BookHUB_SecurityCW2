import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-xl border border-blue-200 rounded-3xl p-8 max-w-lg w-full text-center">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center shadow-inner animate-bounce">
            <CheckCircle className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-blue-700 mt-4">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-700 mt-2">
            Your Books are on the way!
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mt-4 text-left text-sm text-gray-700 shadow-sm">
          <h2 className="text-md font-semibold mb-2 text-blue-800">Next Steps:</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>You’ll receive a confirmation email with your order summary.</li>
            <li>Our delivery team will contact you shortly.</li>
            <li>Expected delivery: within 2–3 working days.</li>
          </ul>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-full font-semibold transition duration-300 shadow"
          >
            Continue Shopping 
          </button>
          <button
            onClick={() => navigate("/myorder")}
            className="border-2 border-blue-600 text-blue-700 hover:bg-green-50 py-3 px-6 rounded-full font-semibold transition duration-300"
          >
            View My Orders 
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-6 italic">
          You’ll be redirected to the homepage in 5 seconds...
        </p>
      </div>
    </div>
  );
};

export default Success;
