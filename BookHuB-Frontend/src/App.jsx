import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/home/home";
import About from "./components/about/about";
import Contact from "./components/contact/contact";
import MyOrder from "./components/myorder/myorder";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Cart from "./components/cart/cart";
import AllProducts from "./components/allproducts/allproducts"; 
import Profile from "./components/profile";
import AdminDashboard from "./components/admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/ProtectedRoutes/AdminRoute";
import ProductDetails from "./components/productdetails/productdetails";
import Success from "./components/Success/Success";
import PaymentSuccess from "./components/PaymentSuccess/PaymentSuccess";
import PaymentFailure from "./components/PaymentFailure/PaymentFailure";
import ForgotPassword from "./components/login/ForgotPassword";
import ResetPassword from "./components/login/ResetPassword";
import VerifyEmail from "./components/verify/VerifyEmail";

import { Toaster } from "react-hot-toast";
import Login from "./components/login/login";
import Register from "./components/register/register";

const App = () => {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MyOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route path="/allproducts" element={<AllProducts />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route path="/success" element={<Success />} />
        <Route path="/paymentsuccess" element={<PaymentSuccess />} />
        <Route path="/paymentfailure" element={<PaymentFailure />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
              404 - Page Not Found
            </div>
          }
        />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>

      <Footer />
    </Router>
  );
};

export default App;
