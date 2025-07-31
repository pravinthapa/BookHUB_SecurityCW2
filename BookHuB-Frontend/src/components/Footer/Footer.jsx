import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blue-400 via-blue-400 to-blue-600 text-white px-6 sm:px-10 lg:px-16 pt-16 pb-10">
      <div className="max-w-7xl mx-auto backdrop-blur-sm bg-white/10 rounded-3xl p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="space-y-5">
          <p>BOOKHUB</p>
          <p className="text-sm text-white leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum
            consequuntur consequatur obcaecati commodi qui? Iusto aperiam,
            voluptatem dolore, enim adipisci amet et fugiat harum fuga doloribus
            sed in quisquam impedit!
          </p>
          <div className="flex gap-5 mt-5 text-2xl text-white">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-indigo-300 transition"
            >
              <FaInstagram />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-indigo-300 transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-indigo-300 transition"
            >
              <FaTwitter />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-indigo-300 transition"
            >
              <FaYoutube />
            </a>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <h3 className="uppercase text-white text-xs font-semibold mb-3 tracking-wide">
            Shop
          </h3>
          <Link
            to="/allproducts"
            className="block hover:text-indigo-200 transition"
          >
            All Products
          </Link>
          <Link to="/" className="block hover:text-indigo-200 transition">
            Home
          </Link>
          <Link to="/cart" className="block hover:text-indigo-200 transition">
            Cart
          </Link>
        </div>

        <div className="space-y-3 text-sm">
          <h3 className="uppercase text-white text-xs font-semibold mb-3 tracking-wide">
            Company
          </h3>
          <Link to="/about" className="block hover:text-indigo-200 transition">
            About Us
          </Link>
          <Link
            to="/contact"
            className="block hover:text-indigo-200 transition"
          >
            Contact
          </Link>
          <Link to="/faq" className="block hover:text-indigo-200 transition">
            FAQs
          </Link>
        </div>

        <div className="space-y-5">
          <h3 className="uppercase text-white text-xs font-semibold tracking-wide">
            Join Our Bookhub
          </h3>
          <p className="text-xl font-bold text-white/80">
            The BookHub - Books, World of books, Where to buy books, Where to
            read about books, Library Catalogs, Online books, Online Book Clubs,
            Find a Book
          </p>
          {/* <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 rounded-lg w-full sm:w-auto bg-white/90 text-gray-900 border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold transition"
            >
              Sign Me Up
            </button>
          </form> */}
        </div>
      </div>

      {/* Bottom Bar */}
      {/* <div className="max-w-7xl mx-auto mt-14 pt-8 border-t border-indigo-500 text-center text-xs text-indigo-200 space-y-2">
        <div>© 2025 BOOKHUB. All Rights Reserved.</div>
        <div className="flex justify-center gap-6 flex-wrap">
          <Link
            to="/privacy-policy"
            className="hover:underline hover:text-indigo-300 transition"
          >
            Privacy Policy
          </Link>
          <Link
            to="/cookie-settings"
            className="hover:underline hover:text-indigo-300 transition"
          >
            Cookie Settings
          </Link>
          <Link
            to="/terms"
            className="hover:underline hover:text-indigo-300 transition"
          >
            Terms of Use
          </Link>
        </div>
      </div> */}
    </footer>
  );
}
