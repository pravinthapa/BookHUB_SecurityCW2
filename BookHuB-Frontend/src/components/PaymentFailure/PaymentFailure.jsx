import React from "react";
import { Link } from "react-router-dom";
import { FaSadTear, FaRedo, FaShoppingBag } from "react-icons/fa";

const PaymentFailure = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#fef6f6] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-8 text-center border border-red-200">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-red-100">
            <FaSadTear className="text-red-500 text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Oops! Payment Failed
          </h1>
          <p className="text-gray-600 text-base">
            Something went wrong while processing your payment. But don’t worry —
            your delicious fruits are still waiting in your cart!
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <Link
            to="/cart"
            className="flex items-center justify-center gap-2 w-full bg-red-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600 transition duration-300"
          >
            <FaRedo /> Try Payment Again
          </Link>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full border-2 border-gray-800 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
          >
            <FaShoppingBag /> Continue Shopping
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500 leading-relaxed">
          <p>If the issue continues, please contact our Fruitmandu Support Team.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
