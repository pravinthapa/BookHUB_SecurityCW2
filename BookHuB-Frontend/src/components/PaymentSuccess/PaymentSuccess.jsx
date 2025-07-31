import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { useEffect } from "react";
import { useCart } from "../../context/CartContext";

const PaymentSuccess = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    console.log("Removing cart from localStorage");
    clearCart();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-100 via-white to-green-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8 text-center border border-blue-200">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center shadow-sm animate-bounce">
            <FaCheckCircle className="text-blue-600 text-5xl" />
          </div>
          <h1 className="text-3xl font-bold text-blue-700 mt-4">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 mt-2 text-base">
            Thank you for choosing{" "}
            <span className="font-semibold text-blue-800">BookHub</span>
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-6">
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-full font-semibold transition duration-300 shadow"
          >
            Continue Shopping
          </Link>
          <Link
            to="/my-orders"
            className="border-2 border-blue-600 text-blue-700 hover:bg-green-50 py-3 px-6 rounded-full font-semibold transition duration-300"
          >
            View My Orders
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>You’ll receive an email confirmation shortly.</p>
          <p>If you need help, our friendly team is ready to assist!</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
