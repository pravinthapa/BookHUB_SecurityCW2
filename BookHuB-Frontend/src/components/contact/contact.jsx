import React, { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "../../api/api";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaGlobe,
} from "react-icons/fa";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/contact", {
        name: form.name,
        email: form.email,
        message: form.message,
      });
      toast.success("Thank you! We'll get back to you shortly.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      const msg =
        err.response?.data?.msg || "Failed to send message. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-blue-50 to-white py-20 px-4 sm:px-6 lg:px-24">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-blue-900"> Contact Us</h1>
        <p className="text-gray-600 mt-3 text-lg">
          Reach out for support, feedback or inquiries.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-20">
        <div className="bg-white rounded-xl shadow-md p-8 border border-blue-100 space-y-6">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">
            Get In Touch
          </h2>
          <div className="space-y-4 text-gray-700">
            <div className="flex items-start gap-4">
              <FaMapMarkerAlt className="text-blue-600 mt-1" />
              <div>
                <h4 className="font-bold">Address</h4>
                <p>Kathmandu, Nepal</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FaPhoneAlt className="text-blue-600 mt-1" />
              <div>
                <h4 className="font-bold">Phone</h4>
                <p>+977 9744337622</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FaEnvelope className="text-blue-600 mt-1" />
              <div>
                <h4 className="font-bold">Email</h4>
                <p>prabin@gmail.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FaGlobe className="text-blue-600 mt-1" />
              <div>
                <h4 className="font-bold">Website</h4>
                <p>www.bookhub.com</p>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-md border border-blue-100 space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full px-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="w-full px-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full px-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows="4"
            placeholder="Your Message"
            required
            className="w-full px-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-md transition-all duration-300"
          >
            {loading ? "Sending..." : "Submit Message"}
          </button>
        </form>
      </div>

      <div className="rounded-xl overflow-hidden shadow-lg border border-blue-100">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.8098721310366!2d85.35553837534103!3d27.692567376192988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1bb297270d3f%3A0x7bce0075d98f7859!2sDot%20Trade!5e0!3m2!1sen!2snp!4v1719828582076!5m2!1sen!2snp"
          width="100%"
          height="400"
          allowFullScreen
          loading="lazy"
          title="New Baneshwor Map"
          className="border-0 w-full"
        ></iframe>
      </div>
    </div>
  );
}
